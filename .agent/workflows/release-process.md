---
description: Comprehensive guide for releasing Nexo with auto-updates via GitHub Releases
---

# Quy trình Release và Auto-Update

Tài liệu này mô tả quy trình release ứng dụng Nexo và cách tính năng tự động cập nhật hoạt động.

## 1. Thiết lập ban đầu (Chỉ làm một lần)

Để tính năng auto-update hoạt động, bạn cần cấu hình chữ ký số (signing keys) và GitHub Secrets.

### A. Generate Signing Keys (Đã thực hiện)

Bạn đã tạo key pair mới. Key public đã được tự động cập nhật vào `src-tauri/tauri.conf.json`.
Key private được lưu tại `.tauri/key` trong thư mục dự án.

### B. Cấu hình GitHub Secrets

Truy cập vào Repository Settings > Secrets and variables > Actions. Thêm các secret sau:

1.  **`TAURI_SIGNING_PRIVATE_KEY`**: Nội dung của private key (chuỗi base64).
    - _Lưu ý_: File `.tauri/key` chứa private key quan trọng. Không push file này lên git public.
    - Để lấy private key: chạy lệnh `cat .tauri/key` trong terminal.
2.  **`TAURI_SIGNING_PRIVATE_KEY_PASSWORD`**: Password bạn đã đặt khi generate key (nếu có).

## 2. Quy trình Release

Khi bạn muốn tung ra phiên bản mới (ví dụ: `v0.1.1`):

1.  **Cập nhật Version**:
    - Chạy `yarn version --new-version 0.1.1` (hoặc thủ công trong `package.json`).
    - Cập nhật version trong `src-tauri/tauri.conf.json`.
    - Cập nhật version trong `src-tauri/Cargo.toml`.

2.  **Commit & Push**:

    ```bash
    git add .
    git commit -m "chore(release): v0.1.1"
    git push
    ```

3.  **Tạo Tag**:
    GitHub Action được cấu hình để chạy khi có tag mới được push.

    ```bash
    git tag v0.1.1
    git push origin v0.1.1
    ```

4.  **GitHub Action Build**:
    - GitHub Action sẽ tự động chạy workflow `publish`.
    - Nó sẽ build app cho macOS (và các OS khác nếu cấu hình).
    - Nó sẽ tạo bản release mới trên GitHub Releases.
    - Quan trọng: Nó sẽ upload file `latest.json` và các file chữ ký (`.sig`) cùng với bộ cài (`.dmg`, `.app.tar.gz`).

## 3. Cách Auto-Update hoạt động

1.  **Kiểm tra**:
    - App Nexo (đang chạy trên máy user) sẽ định kỳ (hoặc khi user bấm "Check for Updates") gọi API tới `https://github.com/nexo-agent/nexo/releases/latest/download/latest.json`.
    - URL này chứa thông tin về phiên bản mới nhất, link download, và chữ ký số.

2.  **So sánh**:
    - Tauri so sánh version trong `latest.json` với version hiện tại của app.
    - Nếu version trên mạng > version hiện tại, nó báo có update.

3.  **Xác thực**:
    - Khi user bấm Update, Tauri download file update và file chữ ký (`.sig`).
    - Nó dùng **Public Key** (đã nhúng trong app tại `tauri.conf.json`) để xác thực file download bằng file `.sig`.
    - Nếu khớp, nó tiến hành cài đặt và khởi động lại app.

## Checklist trước khi Release

- [ ] Đã verify code (`yarn lint`, `yarn typecheck`, `cargo check`).
- [ ] Đã cập nhật version đồng bộ ở 3 file (`package.json`, `tauri.conf.json`, `Cargo.toml`).
- [ ] Đã push code lên main.
- [ ] Đã add Private Key vào GitHub Secrets.
- [ ] Đã cấu hình đúng URL repo trong `tauri.conf.json` (`endpoints`).

## Xử lý sự cố

- **Lỗi Signature**: Nếu update báo lỗi xác thực, kiểm tra xem Public Key trong `tauri.conf.json` có khớp với Private Key trong GitHub Secrets không.
- **Lỗi 404**: Kiểm tra URL `endpoints` trong `tauri.conf.json` có chính xác với repo Github của bạn không.
