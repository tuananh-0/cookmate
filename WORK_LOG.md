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

### Meal Plan API — đang kiểm thử

- Tạo model `MealPlan` theo user, ngày và buổi ăn.
- Thêm API list/create/update/delete meal plan.
- Thêm populate recipe và lọc theo khoảng ngày.
- Ngăn trùng cùng user, ngày và meal type.
- Test tạo meal plan, lọc theo ngày và duplicate slot thành công.
- Duplicate slot trả về `409`; dữ liệu test đã được xóa.

### Shopping List API — đang kiểm thử

- Tạo shopping list từ ingredients của các recipe trong meal plan.
- Gộp nguyên liệu trùng theo tên, cộng chuỗi quantity.
- Thêm API xem, generate, cập nhật checked và xóa shopping item.
- Test generate từ meal plan, lấy danh sách và cập nhật `checked` thành công.
- Test với 2 meal plan tạo ra 3 shopping items sau khi gộp nguyên liệu.
- Đã xóa user, meal plan và shopping items test.
- Cần tạo Pull Request và review trước khi đánh dấu hoàn thành trong checklist.

### Frontend shell — đang kiểm thử

- Đồng bộ `develop` sau khi Shopping List PR được merge.
- Tạo branch `feature/frontend-shell`.
- Thêm React Router, Axios API client và layout responsive.
- Thêm các màn hình khung Home, Recipes, Login và Register.
- Đang kiểm tra production build và điều hướng giữa các màn hình.

### Frontend authentication — đang chờ tự test

- Tạo `AuthContext` để lưu user và JWT trong localStorage.
- Kết nối form Login/Register với API backend bằng Axios.
- Thêm loading state và hiển thị lỗi từ API.
- Project owner đã test thành công đăng ký, đăng nhập, localStorage và trường hợp lỗi.
- Đủ điều kiện commit và push; chờ Pull Request review.

### Frontend Meal Planner — đang chờ tự test

- Đồng bộ `develop` sau khi Favorite frontend được merge.
- Tạo branch `feature/frontend-meal-planner`.
- Thêm route `/meal-planner`.
- Kết nối danh sách, thêm và xóa meal plan.
- Thêm trạng thái chưa đăng nhập, loading, empty và error.
- Project owner đã xác nhận Frontend Meal Planner test thành công.
- Đủ điều kiện commit và push; chờ Pull Request review.

### Frontend recipe list — đang chờ tự test

- Đồng bộ `develop` sau khi frontend authentication được merge.
- Tạo branch `feature/frontend-recipes`.
- Kết nối trang Recipes với `GET /api/v1/recipes`.
- Thêm recipe cards, tìm kiếm và lọc category.
- Chưa commit/push; chờ test thủ công từ project owner.

### Điều chỉnh password và recipe search — đã tự test

- Tăng password registration lên tối thiểu 8 ký tự, bắt buộc chữ hoa, chữ thường và số.
- Cập nhật frontend validation và thông báo hướng dẫn password.
- Đổi recipe search sang regex không phân biệt hoa thường trên title, description, category và ingredient.
- Thêm gợi ý recipe khi người dùng nhập từ khóa từ ký tự đầu tiên.
- Project owner đã xác nhận password policy và frontend recipe list/search test thành công.

### Điều chỉnh autocomplete search

- Giữ danh sách search trên title, description, category và ingredients.
- Giới hạn autocomplete chỉ theo title để tránh đề xuất `Gà teriyaki` khi `ph` chỉ khớp với từ `phủ` trong description.
- Autocomplete test cũng đã được xác nhận thành công.
- Đủ điều kiện commit và push; chờ Pull Request review.
- Cần tạo Pull Request và review trước khi đánh dấu hoàn thành trong checklist.
### Frontend Recipe Detail — đang chờ tự test

- Đồng bộ `develop` sau khi frontend recipe list được merge.
- Tạo branch `feature/frontend-recipe-detail`.
- Thêm route `/recipes/:id` và kết nối `GET /api/v1/recipes/:id`.
- Hiển thị ingredients, instructions, thời gian và servings.
- Thêm link từ recipe card sang trang chi tiết và link quay lại.
- Project owner đã xác nhận Recipe Detail test thành công.
- Đủ điều kiện commit và push; chờ Pull Request review.

### Frontend Favorites — đang chờ tự test

- Đồng bộ `develop` sau khi Recipe Detail PR được merge.
- Tạo branch `feature/frontend-favorites`.
- Thêm Favorite button trên Recipe Detail.
- Kết nối GET/POST/DELETE với Favorite API bằng JWT.
- Hiển thị trạng thái saved và lỗi khi chưa đăng nhập.
- Chưa commit/push; chờ project owner tự test.

### Phân biệt giao diện đăng nhập — đang chờ tự test

- Cập nhật navbar theo auth state từ `AuthContext`.
- Chưa đăng nhập: hiển thị `Log in` và `Get started`.
- Đã đăng nhập: hiển thị tên user và `Log out`.
- Project owner đã xác nhận Auth UI state test thành công.
- Đủ điều kiện commit và push; chờ Pull Request review.
