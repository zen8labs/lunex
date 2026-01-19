# Kiến trúc Frontend Nexo

Frontend của Nexo được xây dựng như một Single Page Application (SPA) hiện đại chạy trong môi trường Tauri, sử dụng **React** và hệ sinh thái **Redux Toolkit**.

## 1. Công nghệ Lõi (Tech Stack)

- **Core**: React 18, TypeScript, Vite.
- **State Management**: Redux Toolkit (để quản lý global state) & RTK Query (để data fetching/caching).
- **Routing**: Không sử dụng React Router (hoặc sử dụng rất ít) do tính chất Desktop App dạng cửa sổ đơn, chuyển đổi view dựa trên State.
- **Styling**: Tailwind CSS kết hợp với Radix UI cho các component không đầu (headless) và `shadcn/ui` style.
- **Flow Engine**: `@xyflow/react` (trước đây là React Flow) để xây dựng tính năng chỉnh sửa Flow.
- **Internationalization**: `i18next` cho đa ngôn ngữ.

## 2. Cấu trúc Source Code (`src/`)

Source code được tổ chức theo mô hình **Feature-Sliced Design** (biến thể nhẹ):

- **`app/`**: Cấu hình toàn cục của ứng dụng.
  - `store.ts`: Redux Store setup, middleware (Sentry, Logging).
  - `api/baseApi.ts`: Thiết lập RTK Query base query bọc lấy `invokeCommand` của Tauri. Đây là cầu nối chính giữa Frontend và Backend.
- **`features/`**: Modules chức năng chính.
  - `chat/`: Logic chat, message list, input handling.
  - `workspace/`: Quản lý workspace, settings.
  - `ui/`: Global UI logic (Theme, Dialogs).
  - Mỗi feature thường chứa: `ui/` (components), `state/` (slice), `hooks/`.
- **`ui/`**: Các thành phần giao diện tái sử dụng (Atomic Design).
  - `atoms/`: Button, Input, Icon...
  - `molecules/`: Flow Editor blocks, specific components.
  - `organisms/`: Các khối UI lớn.
- **`lib/`**: Utilities functions, wrappers (logger, tauri helpers).

## 3. Quản lý State & Data Flow

### 3.1. Server State (RTK Query)

Nexo sử dụng **RTK Query** (`baseApi`) để đồng bộ dữ liệu với Backend (Rust).

- **Pattern**: Frontend không gọi `invoke()` trực tiếp trong component. Thay vào đó, API endpoints được định nghĩa trong các `api slices` (ví dụ `chatApi`).
- **Lợi ích**: Tự động caching, deduplication request, và quản lý trạng thái loading/error chuẩn.

### 3.2. Client State (Redux Slices)

Dành cho trạng thái UI thuần túy hoặc dữ liệu cần biến đổi phức tạp:

- `uiSlice`: Theme, Sidebar visibility.
- `chatInputSlice`: Trạng thái của khung soạn thảo tin nhắn.

### 3.3. Real-time / Streaming

- Hook global (`useChatStreaming`) lắng nghe Tauri Events từ Rust (khi LLM trả token).
- Dữ liệu được dispatch trực tiếp vào Redux store để cập nhật UI tức thì mà không cần refetch API.

## 4. Hệ thống Flow Editor (`ui/molecules/flow`)

Đây là một mini-app bên trong Nexo, tích hợp `xyflow`:

- **Architecture**:
  - **Wrapper**: `FlowEditor` cung cấp Context.
  - **Inner**: `FlowEditorInner` quản lý `nodes` và `edges` state cục bộ (local state), chỉ sync ra ngoài qua callback `onChange`.
- **Interaction**:
  - **Palette**: Kéo thả hoặc double-click để thêm node.
  - **Property Panel**: Chỉnh sửa thuộc tính node đang chọn (dynamic form dựa trên node type).
  - **Canvas**: Khu vực vẽ chính.
- **Custom Node System**: Hỗ trợ Group Node (lồng ghép) và các node nghiệp vụ (Database, Algorithm).

## 5. Entry Point Flow

1.  `main.tsx`: Khởi tạo React Root, Sentry, i18n.
2.  `App.tsx`:
    - Setup Redux Provider.
    - Khởi tạo các Global Listeners: Shortcuts, Notification, Auto-update.
    - Quản lý Theme logic (Dark/Light mode).
    - Render `MainLayout`.

## 6. Đánh giá Kiến trúc

### Điểm mạnh

- **Separation of Concerns**: Tách biệt rõ giữa UI (React) và Data Fetching (RTK Query).
- **Scalability**: Cấu trúc `features/` giúp dễ dàng thêm tính năng mới mà không làm phình to `App.tsx` hay `components/` folder.
- **Performance**: Sử dụng RTK Query giúp giảm thiểu việc call backend dư thừa.

### Điểm cần lưu ý

- `App.tsx` đang gánh quá nhiều trách nhiệm "Global Setup" (Theme, Update, Shortcuts). Nên tách thành các Providers riêng lẻ.
- Việc mix giữa Local State (trong FlowEditor) và Global State cần cẩn trọng để tránh conflicts khi save/load.
