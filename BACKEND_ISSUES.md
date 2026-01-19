# Các vấn đề & Rủi ro Backend nghiêm trọng

Sau khi rà soát mã nguồn (đặc biệt là `features/chat/service.rs` và `db/connection.rs`), tôi đã phát hiện các vấn đề nghiêm trọng ảnh hưởng trực tiếp đến **Hiệu năng (Performance)** và **Tính đúng đắn (Correctness/Stability)** của ứng dụng.

## 1. Blocking I/O trong Async Runtime (Nguy hiểm cao)

### Vấn đề

Backend sử dụng **Synchronous I/O** (Blocking) trực tiếp bên trong các hàm `async` hoặc luồng thực thi của Tokio.

- **File System**: Các hàm `std::fs::write`, `std::fs::read` được dùng trực tiếp trong `ChatService::save_file_to_disk` và `load_file_content`.
- **Database**: Các hàm `rusqlite` (vốn là sync) được gọi trực tiếp mà không wrap trong `task::spawn_blocking`.

### Tại sao lại nguy hiểm?

Node.js hay Rust/Tokio đều dựa trên mô hình _cooperative multitasking_. Nếu một tác vụ chiếm dụng thread (block) để ghi file hoặc query DB (có thể mất 10-100ms), thread đó sẽ **không thể** xử lý các tác vụ khác (như nhận request từ UI, heartbeat, xử lý stream LLM).

### Hậu quả

- **UI Lag/Freeze**: Khi user upload file ảnh lớn hoặc query lịch sử chat dài, backend sẽ "đứng hình" tạm thời.
- **Starvation**: Nếu có nhiều request đồng thời, các worker threads của Tokio sẽ bị tắc nghẽn, làm chậm toàn bộ ứng dụng.

### Giải pháp

- Chuyển sang dùng `tokio::fs` cho thao tác file.
- Chuyển DB operations sang chạy trong `tokio::task::spawn_blocking` hoặc sử dụng connection pooling hỗ trợ async (vi dụ: `deadpool-sqlite`).

---

## 2. Quản lý kết nối Database (SQLite) kém hiệu quả & Rủi ro SQLITE_BUSY

### Vấn đề

File `src-tauri/src/db/connection.rs` cho thấy mỗi lần cần truy cập DB, ứng dụng lại mở một kết nối mới (`Connection::open`).

- **Không có Connection Pool**: Kết nối không được tái sử dụng.
- **Concurrent Writes**: SQLite chỉ cho phép **một** writer tại một thời điểm.

### Hậu quả

- **Lỗi `SQLITE_BUSY`**: Nếu Agent đang cập nhật trạng thái (`update_metadata`) đồng thời lúc User gửi tin nhắn (`save_message`), một trong hai sẽ bị lỗi do file DB đang bị khóa.
- **Hiệu năng thấp**: Chi phí mở/đóng file DB liên tục là rất lớn (overhead).

### Giải pháp

- Sử dụng **R2D2** hoặc **Deadpool** để quản lý bể kết nối.
- Thiết lập `PRAGMA busy_timeout` để tự động retry khi DB bận.
- Cấu hình WAL Mode (`PRAGMA journal_mode=WAL`) để tăng khả năng concurrency (cho phép 1 writer + nhiều readers).

---

## 3. Quản lý trạng thái & Race Conditions (Agent System)

### Vấn đề

Trong `ChatService::send_message`, logic xử lý Agent (Specialist Session) đang thực hiện việc spawn một background task (`tokio::spawn`) tách biệt để chạy Agent.

```rust
// features/chat/service.rs
tokio::spawn(async move { ... })
```

### Rủi ro

- **Uncontrolled Concurrency**: Không có cơ chế giới hạn số lượng agent chạy ngầm. User có thể spam tin nhắn và tạo ra hàng chục agent chạy song song, ngốn hết tài nguyên máy (CPU/RAM).
- **Zombie Tasks**: Nếu người dùng thoát chat hoặc tắt app, các background task này có thể không được dọn dẹp đúng cách (dù Rust có drop khi main exit, nhưng logic nghiệp vụ có thể bị dở dang).
- **Data Integrity**: Việc cập nhật trạng thái Agent (`update_metadata`) hoàn toàn không đồng bộ với luồng chính, dễ dẫn đến UI hiển thị sai trạng thái nếu user refresh nhanh.

### Giải pháp

- Sử dụng `JoinHandle` để quản lý vòng đời của task.
- Thêm Semaphore hoặc Queue để giới hạn số lượng Agent active đồng thời.

---

## 4. Hardcoded & Magic Strings

### Vấn đề

Logic xác định file type trong `save_file_to_disk` đang hardcode extension thủ công (lines 89-106).

- Nếu user upload một file lạ (ví dụ `.ts`, `.rs`), nó sẽ fallback về `bin` hoặc `application/octet-stream` không chính xác.

### Giải pháp

- Sử dụng thư viện chuyên dụng như `infer` hoặc `mime_guess` để detect file type chuẩn xác hơn.

---

## Khuyến nghị ưu tiên (Action Plan)

1.  **GẤP**: Refactor `db/connection.rs` để sử dụng Singleton Connection hoặc Pooling (như `r2d2_sqlite`) + Bật WAL Mode.
2.  **GẤP**: Wrap toàn bộ các gọi `repository.*` bên trong `task::spawn_blocking` để giải phóng Event Loop.
3.  **CAO**: Refactor File I/O sang `tokio::fs`.
