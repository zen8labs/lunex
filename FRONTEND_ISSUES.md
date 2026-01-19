# Các vấn đề & Rủi ro Frontend nghiêm trọng

Sau khi rà soát mã nguồn Frontend (`src/`), tôi đã phân tích thấy một số vấn đề cần được cải thiện để đảm bảo hiệu năng và trải nghiệm người dùng mượt mà.

## 1. Hiệu năng Re-rendering (Flow Editor)

### Vấn đề

Trong `src/ui/molecules/flow/FlowEditor.tsx`:

- **Update Loop**: Hàm `handleNodeUpdate` thực hiện deep update bằng cách map qua _toàn bộ_ danh sách nodes (`nds.map(...)`).
- **Property Panel Input**: Khi người dùng gõ text vào Property Panel (ví dụ đổi Label), mỗi phím bấm (keystroke) sẽ kích hoạt `handleNodeUpdate` -> update state `nodes` -> re-render toàn bộ `FlowCanvas`.

### Rủi ro

- **Lag khi gõ phím**: Với các sơ đồ lớn (hàng trăm nodes), việc re-render toàn bộ canvas 60 lần/giây khi gõ phím sẽ gây giật lag rõ rệt.
- **UI Freeze**: Tương tác kéo thả hoặc chỉnh sửa sẽ bị chậm phản hồi.

### Giải pháp

- **Debounce**: Áp dụng debounce cho các input trong `PropertyPanel` để chỉ update state sau khi người dùng ngừng gõ (e.g. 300ms).
- **Direct Mutation (Advanced)**: Sử dụng API cập nhật node trực tiếp của `xyflow` (updateNodeData) thay vì replace toàn bộ array nodes, giúp tránh re-render các node không liên quan.

## 2. Global State Management & App Bootstrap

### Vấn đề

File `App.tsx` đang đóng vai trò "God Component":

- Chứa logic Theme Switching phức tạp.
- Khởi tạo hàng loạt hooks: `useNotificationListener`, `useKeyboardShortcuts`, `useChatStreaming`, `useAutoUpdate`, `useMenuEvents`.
- Fetching `loadAppSettings`.

### Rủi ro

- **Re-render Thừa**: Bất kỳ hook nào trong số này trigger update (ví dụ progress download update), `App` component sẽ re-render, kéo theo re-render toàn bộ cây ứng dụng bên dưới (`MainLayout`, etc.).
- **Khó bảo trì**: Logic khởi tạo trộn lẫn với logic UI.

### Giải pháp

- **Context Providers**: Tách các logic này ra thành các Provider riêng biệt: `<ThemeProvider>`, `<UpdateProvider>`, `<ShortcutProvider>`.
- Đặt các provider này bao quanh `AppContent` để tránh re-render cây DOM chính không cần thiết.

## 3. Streaming Data Synchronization

### Vấn đề

Hệ thống Chat sử dụng song song hai luồng dữ liệu:

1.  **RTK Query**: Fetch danh sách tin nhắn từ DB.
2.  **Streaming (`useChatStreaming`)**: Nhận từng token từ Backend qua Event và bắn vào Redux Store.

### Rủi ro

- **Race Condition**: Nếu người dùng reload danh sách tin nhắn đúng lúc stream đang chạy, có thể xảy ra xung đột dữ liệu (tin nhắn bị duplicate hoặc mất nội dung đang stream).
- **State Tearing**: UI có thể hiển thị trạng thái không nhất quán giữa `messages` từ API và `streaming content`.

### Giải pháp

- Cần có cơ chế "Lock" hoặc "Merge Strategy" rõ ràng trong Redux reducer khi xử lý streaming events. Đảm bảo streaming update chỉ áp dụng cho đúng message ID đang active.

## 4. Drag & Drop Logic (Group Nodes)

### Vấn đề

Logic tính toán vị trí khi thả node trong `onNodeDragStop` (`FlowEditor.tsx` lines 312-384) khá thủ công:

- Dùng vòng lặp `nodes.find` để detect va chạm (collision detection).
- Tính toán tọa độ tuyệt đối (absolute position) dựa trên giả định chỉ có 1 cấp cha con.

### Rủi ro

- **Nested Groups**: Nếu sau này hỗ trợ Group lồng Group, logic này sẽ tính sai tọa độ, khiến node bị "nhảy" vị trí bất thường.
- **Performance**: O(N) tìm kiếm trên mỗi lần thả chuột có thể chấp nhận được với số lượng node nhỏ, nhưng sẽ chậm nếu graph rất lớn.

### Giải pháp

- Sử dụng thư viện va chạm chuyên dụng hoặc API `getIntersectingNodes` của `xyflow`.
- Refactor logic tọa độ đệ quy để hỗ trợ nested groups chuẩn xác.

---

## Khuyến nghị ưu tiên (Action Plan)

1.  **CAO**: Refactor `FlowEditor` property update, thêm **Debounce** cho input nhập liệu. Điều này cải thiện cảm giác "mượt" ngay lập tức.
2.  **TRUNG BÌNH**: Tách `App.tsx` thành các Providers nhỏ gọn.
3.  **TRUNG BÌNH**: Review kỹ logic `Redux` reducer phần Chat Streaming để đảm bảo data consistency.
