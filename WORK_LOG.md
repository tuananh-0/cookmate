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

### Bắt đầu Recipe API

- Đã đồng bộ `develop` sau khi PR `feature/auth-middleware` được merge.
- Tạo branch `feature/recipe-api` từ `develop` mới nhất.
- Bắt đầu model Recipe, Favorite và các API CRUD theo checklist.

### Recipe CRUD — chờ Pull Request review

- Tạo model `Recipe` với ingredients, instructions, category, thời gian và servings.
- Thêm public API list/detail tại `/api/v1/recipes`.
- Thêm tìm kiếm theo text và lọc theo category.
- Thêm create/update/delete cho admin với JWT và role middleware.
- Test tạo recipe, tìm kiếm và xem chi tiết thành công.
- Đã xóa user admin và recipe test sau khi kiểm tra.
- Favorite chưa làm; sẽ tách thành task tiếp theo.

### Sửa lỗi validation đăng ký

- Phát hiện request password ngắn hơn 6 ký tự làm server crash do lỗi validation chưa được phản hồi.
- Thêm kiểm tra password trong controller để trả về `400 Bad Request`.
- Cần test lại với password ngắn và password hợp lệ trước khi tạo PR Recipe API.

### Xác nhận test Postman

- Đã test các API hiện có bằng Postman.
- Authentication, protected route và Recipe API đều hoạt động đúng.
- Recipe API đã sẵn sàng để tạo Pull Request vào `develop`.

### Recipe API hoàn thành và bắt đầu Favorites

- PR Recipe API đã được merge vào `develop`.
- Cập nhật checklist: Recipe CRUD, search/filter, role protection và Postman test thành `[x]`.
- Đồng bộ `develop` mới nhất.
- Tạo branch `feature/favorites`.
- Bắt đầu model Favorite và các API lưu/bỏ lưu công thức.

### Favorite API — chờ Pull Request review

- Tạo model `Favorite` với unique index theo cặp user/recipe.
- Thêm `GET /api/v1/favorites` để lấy danh sách yêu thích của user hiện tại.
- Thêm `POST /api/v1/favorites/:recipeId` để lưu công thức.
- Thêm `DELETE /api/v1/favorites/:recipeId` để bỏ lưu công thức.
- Test thêm, xem danh sách, bỏ yêu thích và duplicate request bằng API.
- Duplicate favorite trả về `409`; dữ liệu test đã được xóa.

### Recipe seed data — đang kiểm thử

- Thêm 8 công thức mẫu thuộc nhiều category.
- Thêm lệnh `npm run seed:recipes`.
- Seed dùng upsert theo title nên có thể chạy lại mà không tạo bản ghi trùng.
- Đã chạy seed thành công hai lần với MongoDB local; mỗi lần báo `Seeded 8 recipes`.
- Kiểm tra khả năng chạy lặp mà không phát sinh lỗi duplicate.
