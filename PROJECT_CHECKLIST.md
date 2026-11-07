# CookMate — Project Checklist

## Ngày 1 — Phân tích và khởi tạo

- [ ] Chốt MVP: authentication, recipe CRUD, search/filter, favorite, meal plan và shopping list
- [ ] Chốt role đơn giản: `user`, `admin` (admin chỉ dùng để quản lý công thức)
- [ ] Vẽ use case và wireframe các màn hình chính
- [ ] Thiết kế database và API endpoint
- [ ] Tạo MongoDB Atlas và các file `.env`
- [ ] Hoàn thiện README và commit đầu tiên

## Ngày 2 — Backend nền tảng

- [ ] Khởi tạo Express và kết nối MongoDB
- [ ] Cấu hình CORS, JSON parser và error handler
- [ ] Tạo health check API
- [x] Tạo model User
- [x] Làm register, login và JWT
- [x] Thêm protected routes và kiểm tra role
- [x] Kiểm tra role user/admin
- [x] Test authentication bằng Postman

## Ngày 3 — Recipe API

- [x] Tạo model Recipe
- [x] Làm API list/detail/create/update/delete recipe
- [x] Thêm tìm kiếm và lọc
- [x] Kiểm tra quyền sửa/xóa
- [~] Tạo model Favorite và làm API favorite
- [~] Tạo 8–12 công thức mẫu

## Ngày 4 — Meal plan, pantry và shopping list

- [~] Tạo model MealPlan
- [~] Làm thực đơn theo ngày hoặc tuần
- [~] Tạo shopping list đơn giản từ meal plan
- [~] Gộp nguyên liệu trùng nhau nếu còn thời gian
- [ ] Pantry là chức năng bonus, chỉ làm sau khi hoàn thành MVP

## Ngày 5 — Frontend chính

- [~] Tạo layout, navbar và responsive cơ bản
- [~] Làm Login/Register, lưu JWT và logout
- [~] Làm Home, recipe list và recipe card
- [~] Làm search/filter
- [ ] Làm recipe detail
- [ ] Làm form create/edit/delete recipe
- [ ] Làm favorite button

## Ngày 6 — Hoàn thiện và kiểm thử

- [ ] Làm meal planner page
- [ ] Làm shopping list page
- [ ] Kết nối toàn bộ API với frontend
- [ ] Xử lý loading, error, empty state và token hết hạn
- [ ] Kiểm tra phân quyền và các nghiệp vụ chính
- [ ] Chạy build, lint và sửa console error

## Ngày 7 — Deploy và thuyết trình

- [ ] Deploy MongoDB Atlas
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Cấu hình CORS và environment variables production
- [ ] Tạo API documentation public bằng Postman hoặc Swagger
- [ ] Public API base URL và kiểm tra các endpoint trên môi trường production
- [ ] Hoàn thiện README và link live
- [ ] Làm PowerPoint 8–10 slide
- [ ] Chuẩn bị tài khoản và dữ liệu demo
- [ ] Quay video dự phòng

## Flow demo chính

Đăng nhập → tìm công thức → xem chi tiết → lưu yêu thích → lập thực đơn → xem nguyên liệu cần mua.

## Phạm vi MVP

- Bắt buộc: đăng ký/đăng nhập, xem/tìm kiếm/lọc công thức, yêu thích, meal plan và shopping list.
- Admin: thêm/sửa/xóa công thức; user chỉ xem và lưu yêu thích.
- Không bắt buộc: pantry, trừ nguyên liệu theo số lượng, đánh giá/bình luận, upload ảnh và thông báo.

## Nhật ký làm việc

### 2026-11-06 — Khởi tạo quy trình Git và bộ khung dự án

- Tạo repository GitHub public `tuananh-0/cookmate`.
- Khởi tạo bộ khung React/Vite trong `client/` và Express trong `server/`.
- Thêm API health check tại `/api/v1/health`.
- Kết nối backend với MongoDB local `cookmate` và kiểm tra thành công.
- Thiết lập quy trình branch: `main` ổn định, `develop` tích hợp, `feature/*` cho từng task.
- Đã build frontend thành công và push các commit nền tảng lên repository.

### 2026-11-06 — Authentication trên feature/user-auth

- Tạo model `User` với role `user/admin` và mã hóa password bằng bcrypt.
- Thêm API `POST /api/v1/auth/register` và `POST /api/v1/auth/login`.
- Thêm JWT token cho các phiên đăng nhập.
- Kiểm tra đăng ký thực tế với MongoDB local; đã xóa dữ liệu test sau khi kiểm tra.
- Còn lại: middleware bảo vệ route và kiểm tra role.

