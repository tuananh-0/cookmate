# CookMate — Work Log

File này ghi lại các phiên làm việc, thay đổi đã thực hiện, kiểm thử và quyết định kỹ thuật của project.

## 2026-11-06

### Khởi tạo project

- Tạo repository GitHub public `tuananh-0/cookmate`.
- Tạo bộ khung React/Vite trong `client/` và Express trong `server/`.
- Thêm API health check tại `GET /api/v1/health`.
- Kết nối backend với MongoDB local database `cookmate`.
- Kiểm tra frontend build thành công và backend kết nối MongoDB thành công.

### Thiết lập Git workflow

- Thống nhất branch workflow: `main` ổn định, `develop` tích hợp, `feature/*` cho từng task.
- Quy ước mới: không push trực tiếp vào `main` hoặc `develop`.
- Mỗi task phải tạo branch riêng từ `develop` đã cập nhật.

### Authentication — đang chờ Pull Request review

- Tạo model `User` với role `user/admin`.
- Mã hóa password bằng `bcryptjs`.
- Thêm `POST /api/v1/auth/register`.
- Thêm `POST /api/v1/auth/login`.
- Thêm JWT token.
- Test đăng ký thực tế với MongoDB local và xóa dữ liệu test sau khi kiểm tra.
- Đã commit và push branch `feature/user-auth`.
- Cần tạo Pull Request và review trước khi đánh dấu hoàn thành trong checklist.
