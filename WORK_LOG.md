# CookMate — Work Log

File này ghi lại các phiên làm việc, thay đổi đã thực hiện và kết quả kiểm thử.

## 2026-11-06

### Khởi tạo project

- Tạo repository GitHub public `tuananh-0/cookmate`.
- Tạo bộ khung React/Vite trong `client/` và Express trong `server/`.
- Thêm API health check tại `GET /api/v1/health`.
- Kết nối backend với MongoDB local database `cookmate`.
- Kiểm tra frontend build và backend kết nối MongoDB thành công.

### Authentication

- Tạo model `User` với role `user/admin`.
- Mã hóa password bằng `bcryptjs`.
- Thêm register, login và JWT.
- Đã kiểm tra đăng ký thực tế với MongoDB local và xóa dữ liệu test.
- Đã commit/push branch `feature/user-auth`.

### JWT middleware — chờ Pull Request review

- Tạo `requireAuth` để kiểm tra Bearer token và user tồn tại.
- Tạo `requireRole` cho các route cần phân quyền.
- Thêm protected endpoint `GET /api/v1/auth/me`.
- Test token hợp lệ thành công: route trả về user hiện tại.
- Test request không có token thành công: route trả về `401`.
- Đã xóa dữ liệu test sau khi kiểm tra.
- Cần tạo Pull Request và review trước khi đánh dấu hoàn thành trong checklist.
