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
- [x] Cấu hình CORS, JSON parser và error handler
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
- [x] Tạo model Favorite và làm API favorite
- [~] Tạo 100 công thức mẫu

## Ngày 4 — Meal plan, pantry và shopping list

- [x] Tạo model MealPlan
- [x] Làm thực đơn theo ngày hoặc tuần
- [x] Tạo shopping list đơn giản từ meal plan
- [~] Gộp nguyên liệu trùng nhau nếu còn thời gian
- [ ] Pantry là chức năng bonus, chỉ làm sau khi hoàn thành MVP

## Ngày 5 — Frontend chính

- [x] Tạo layout, navbar và responsive cơ bản
- [x] Làm Login/Register, lưu JWT và logout
- [x] Làm Home, recipe list và recipe card
- [x] Làm search/filter
- [x] Làm recipe detail
- [x] Làm form create/edit/delete recipe
- [x] Làm favorite button

## Ngày 6 — Hoàn thiện và kiểm thử

- [x] Làm meal planner page
- [x] Làm shopping list page
- [x] Kết nối toàn bộ API với frontend
- [x] Xử lý loading, error, empty state và token hết hạn
- [x] Kiểm tra phân quyền và các nghiệp vụ chính
- [x] Không trả email creator trong recipe detail công khai
- [x] Chạy build, lint và rà console error

## Ngày 7 — Deploy và thuyết trình

- [x] Deploy MongoDB Atlas
- [x] Deploy backend
- [x] Deploy frontend
- [x] Cấu hình CORS và environment variables production
- [x] Tạo API documentation public bằng Postman hoặc Swagger
- [x] Public API base URL và kiểm tra các endpoint trên môi trường production
- [x] Hoàn thiện README và link live
- [ ] Làm PowerPoint 8–10 slide
- [x] Chuẩn bị tài khoản và dữ liệu demo
- [ ] Quay video dự phòng

## Flow demo chính

Đăng nhập → tìm công thức → xem chi tiết → lưu yêu thích → lập thực đơn → xem nguyên liệu cần mua.

## Phạm vi MVP

- Bắt buộc: đăng ký/đăng nhập, xem/tìm kiếm/lọc công thức, yêu thích, meal plan và shopping list.
- Admin: thêm/sửa/xóa công thức; user chỉ xem và lưu yêu thích.
- Không bắt buộc: pantry, trừ nguyên liệu theo số lượng, đánh giá/bình luận, upload ảnh và thông báo.

## CookMate V2 — Kế hoạch tính năng

Thực hiện theo thứ tự đã thống nhất. Mỗi tính năng dùng branch riêng từ `develop`; chỉ chuyển sang `[~]` khi bắt đầu task và `[x]` sau khi code, test, commit và PR đã merge.

### V2.1 — Tìm công thức theo nguyên liệu có sẵn `[x]`

- [x] Chốt cách chuẩn hóa và đối chiếu tên nguyên liệu cho MVP: so khớp tên chính xác sau khi chuẩn hóa chữ hoa/thường và khoảng trắng; không tự suy đoán nguyên liệu gần giống.
- [x] Làm API tìm công thức theo danh sách nguyên liệu người dùng cung cấp.
- [x] Trả về nguyên liệu đã có và nguyên liệu còn thiếu cho từng công thức.
- [x] Thêm giao diện nhập/chọn nguyên liệu và hiển thị kết quả phù hợp.
- [x] Cho phép thêm nguyên liệu còn thiếu vào shopping list.
- [x] Kiểm tra danh sách rỗng, nguyên liệu không khớp, công thức thiếu một phần và quyền truy cập shopping list.

### V2.2 — Người dùng gửi công thức, admin duyệt `[x]`

- [x] Bổ sung trạng thái công thức `pending`, `approved`, `rejected`.
- [x] Đặt công thức seed hiện tại và công thức do admin tạo ở trạng thái `approved`.
- [x] Cho user gửi công thức và xem trạng thái các công thức đã gửi.
- [x] Tạo hàng đợi duyệt cho admin với thao tác approve/reject.
- [x] Chỉ công khai công thức `approved` trong list, search và detail.
- [x] Yêu cầu duyệt lại khi nội dung công thức đã publish bị sửa.
- [x] Kiểm tra quyền sở hữu, quyền admin, trạng thái pending/rejected và tính riêng tư của công thức chưa duyệt.

### V2.3 — Đánh giá sao và xếp hạng công thức `[x]`

- [x] Tạo dữ liệu đánh giá 1–5 sao, tối đa một đánh giá cho mỗi user/công thức; cho phép sửa đánh giá.
- [x] Chỉ user đăng nhập được đánh giá công thức đã publish; không cho tác giả tự đánh giá công thức của mình.
- [x] Hiển thị điểm trung bình và số lượt đánh giá trên danh sách/chi tiết công thức.
- [x] Thêm sắp xếp theo đánh giá, tránh để công thức chỉ có một lượt đánh giá tự động đứng đầu.
- [x] Kiểm tra quyền, điểm hợp lệ, cập nhật/xóa đánh giá và công thức chưa duyệt.

### V2 — Hoàn thiện trước khi phát hành

- [x] Cập nhật tài liệu API và README cho các tính năng V2.
- [x] Sửa lỗi meal plan bị ẩn nhưng vẫn khóa slot khi recipe được đưa về `pending`; bảo đảm chủ sở hữu có thể xóa lịch mà không lộ recipe chưa duyệt.
- [x] Làm rõ và xử lý an toàn việc tạo shopping list từ meal plan để nguyên liệu người dùng thêm thủ công không bị mất ngoài ý muốn.
- [x] Ngăn response tìm kiếm công thức/nguyên liệu cũ ghi đè kết quả ứng với lựa chọn hiện tại.
- [x] Rà soát các hợp đồng Swagger V2 so với controller; Postman collection và apidoc được ghi rõ là tài liệu V1 nếu chưa cập nhật.
- [x] Chạy lint/build và kiểm thử các luồng V2 trên môi trường production.
- [ ] Chỉ phát hành V2 sau khi các tính năng trong phạm vi được test và merge.

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

