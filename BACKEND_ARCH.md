# Kiến trúc Backend Nexo

Backend của Nexo được xây dựng theo mô hình **Modular Monolith** bằng ngôn ngữ **Rust**, vận hành trên nền tảng **Tauri v2**. Thiết kế ưu tiên sự an toàn (type safety), hiệu năng (performance), và khả năng mở rộng thông qua các module độc lập.

## 1. Tổng quan Kiến trúc

- **Entry Point**: `lib.rs` là nơi khởi tạo toàn bộ ứng dụng, bao gồm các plugins (fs, dialog, log), setup Sentry, khởi tạo các Services và đăng ký Commands.
- **Dependency Injection**: Các Service được khởi tạo một lần khi startup và inject vào `AppState` để tái sử dụng toàn cục.
- **Async Runtime**: Sử dụng `Tokio` cho các tác vụ bất đồng bộ (I/O, LLM streaming, External processes).

## 2. Phân lớp (Layered Architecture)

Hầu hết các features đều tuân thủ cấu trúc 3 lớp:

1.  **Commands (API Gateway)**
    - **Vai trò**: Giao tiếp với Frontend.
    - **Nhiệm vụ**: Nhận request từ UI, parse/validate input, và gọi xuống Service tương ứng.
    - **Vị trí**: `features/<name>/commands.rs`.

2.  **Services (Business Logic)**
    - **Vai trò**: Xử lý nghiệp vụ cốt lõi.
    - **Nhiệm vụ**: Điều phối luồng dữ liệu, gọi Repository, quản lý transaction, và tương tác với các hệ thống ngoài (LLM, MCP, FileSystem).
    - **Vị trí**: `features/<name>/service.rs`.

3.  **Repository (Data Access)**
    - **Vai trò**: Tương tác với cơ sở dữ liệu.
    - **Nhiệm vụ**: Thực thi các câu SQL (SQLite), mapping dữ liệu từ Row sang Struct models.
    - **Vị trí**: `features/<name>/repository.rs`.

## 3. Chi tiết Luồng hoạt động (Feature Flows)

### 3.1. Chat & Messaging (`features/chat`)

Đây là feature phức tạp nhất, đóng vai trò trung tâm xử lý tương tác người dùng.

- **Luồng Gửi tin nhắn (`send_message`)**:
  1.  **Pre-processing**: Lưu file đính kèm (base64) xuống disk -> lấy path.
  2.  **Routing**:
      - Nếu tin nhắn bắt đầu bằng `@Agent`, hệ thống tự động tạo một **Specialist Session** và spawn một background task để chạy Agent đó.
      - Nếu không, query context (Lịch sử chat + Workspace settings) để chuẩn bị gọi LLM.
  3.  **Execution**:
      - Gọi `LLMService` để gửi request tới Provider (OpenAI, Anthropic, Local...).
      - Hỗ trợ **Streaming response** về UI thông qua `AppHandle::emit`.
  4.  **Post-processing**: Ghi nhận Token Usage, cập nhật tin nhắn vào DB.

### 3.2. Agent System (`features/agent`)

Hệ thống quản lý các AI Agents độc lập, chạy trong môi trường cô lập.

- **Cài đặt (`install`)**:
  - Hỗ trợ cài từ **Local Zip** hoặc **Git Repository**.
  - **Isolation**: Sử dụng công cụ `uv` để tạo một **Virtual Environment (.venv)** riêng biệt cho _mỗi_ agent tại thời điểm cài đặt. Điều này đảm bảo không xung đột dependency giữa các agents.
- **Thực thi (`get_agent_client`)**:
  - Khi cần chạy agent, hệ thống tìm đường dẫn python trong `.venv` của agent đó.
  - Spawn một process con chạy file entrypoint (thường là `tools/main.py`).
  - Kết nối giao tiếp qua chuẩn **MCP (Model Context Protocol)** bằng `stdio`.

### 3.3. Runtime Engine (`features/runtime`)

Quản lý các môi trường thực thi code (Python/Node.js) để phục vụ cho tính năng Code Interpreter hoặc chạy Tool cục bộ.

- **Python Runtime**:
  - Tự động detect Python system hoặc cài đặt phiên bản Python riêng biệt vào `AppLocalData/python-runtimes` bằng `uv`.
  - Cung cấp khả năng `execute_script`: Tạo file `.py` tạm và chạy lệnh `python <file>` trong môi trường đã setup.
- **Cơ chế Sidecar**: Backend bundle sẵn binary `uv` (cho các OS/Arch khác nhau) để đảm bảo việc quản lý môi trường Python luôn hoạt động ổn định trên mọi máy người dùng.

### 3.4. Tools & MCP (`features/tool`)

Cầu nối giữa LLM và các công cụ thực thi (Database connector, File tools, API clients).

- **Discovery**:
  - Tool được định nghĩa trong các **MCP Servers**.
  - Hệ thống cache danh sách tools vào cột `tools_json` trong database để tránh phải gọi quá nhiều request `list_tools` tới MCP Server.
- **Execution**:
  - Frontend hoặc LLM yêu cầu gọi tool -> `ToolService::execute_tool`.
  - Service xác định tool thuộc connection nào -> Spawn/Reuse MCP Client -> Gửi JSON-RPC request -> Trả kết quả về.

### 3.5. Workspace (`features/workspace`)

Đơn vị tổ chức dữ liệu logic của người dùng.

- **Settings Aggregation**: Mỗi workspace có bộ setting riêng (Default Model, Tools được kích hoạt, System Prompt). Khi thực hiện bất kỳ tác vụ Chat/LLM nào, hệ thống luôn lấy settings của workspace hiện tại làm context base.

## 4. Cơ sở dữ liệu (Database)

- **Công nghệ**: SQLite.
- **Quản lý**: Sử dụng `rusqlite` và tự viết hệ thống Migrations thủ công (`db/migrations.rs`).
- **Trạng thái**: Hiện tại đang quản lý connection dạng "Mở từng lần" (Open-on-demand), chưa có pooling.

## 5. Tổng kết Kiến trúc

Kiến trúc backend Nexo thể hiện sự đầu tư kỹ lưỡng vào việc **phân tách mối quan tâm (Seperation of Concerns)**. Việc sử dụng Rust + Tauri + MCP tạo ra một nền tảng rất mạnh mẽ cho các ứng dụng Agentic AI:

- **Mô-đun hóa**: Dễ dàng thêm feature mới mà không phá vỡ cấu trúc cũ.
- **Cô lập môi trường**: Cách sử dụng `uv` để quản lý Virtual Env cho từng agent là một điểm sáng, giải quyết triệt để vấn đề "Dependency Hell" thường gặp ở các app Python.
- **Extensibility**: Giao thức MCP cho phép mở rộng khả năng của app gần như vô hạn thông qua các server tools bên ngoài.
