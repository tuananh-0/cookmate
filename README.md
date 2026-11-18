# CookMate

CookMate là ứng dụng web giúp người dùng khám phá công thức, lưu món yêu thích, lập thực đơn và chuẩn bị danh sách mua sắm. Dự án được xây dựng cho đồ án môn Phát triển Web.

## Bản chạy trực tuyến

- **Ứng dụng:** [cookmate-fe.onrender.com](https://cookmate-fe.onrender.com)
- **API base URL:** [cookmate-j4o2.onrender.com](https://cookmate-j4o2.onrender.com)
- **API v1:** `https://cookmate-j4o2.onrender.com/api/v1`
- **Tài liệu API Swagger:** [cookmate-j4o2.onrender.com/api-docs](https://cookmate-j4o2.onrender.com/api-docs)
- **Health check:** [GET /api/v1/health](https://cookmate-j4o2.onrender.com/api/v1/health)
- **Danh sách công thức:** [GET /api/v1/recipes](https://cookmate-j4o2.onrender.com/api/v1/recipes)

> Danh sách công thức có thể trả về `{"count":0,"recipes":[]}` nếu database production chưa có dữ liệu. Đây là phản hồi thành công; hãy đăng nhập bằng tài khoản phù hợp hoặc thêm công thức mẫu để demo đầy đủ.

## Tính năng

- Đăng ký, đăng nhập và xác thực phiên bằng JWT.
- Khám phá, tìm kiếm công thức theo tên, mô tả, danh mục và nguyên liệu; lọc danh mục và sắp xếp theo mới nhất/đánh giá.
- Tìm món từ nguyên liệu đang có; xem nguyên liệu khớp và còn thiếu.
- Gửi công thức để admin duyệt; công thức chỉ xuất hiện công khai sau khi được duyệt.
- Đánh giá công thức từ 1–5 sao, sửa/xóa đánh giá của mình; xem điểm trung bình và sắp xếp theo điểm có điều chỉnh độ tin cậy.
- Lưu công thức yêu thích, lập thực đơn và tạo danh sách mua sắm.
- Admin duyệt/từ chối công thức user gửi và quản lý công thức.
- Tạo danh sách mua sắm từ meal plan sẽ bổ sung nguyên liệu còn thiếu, giữ nguyên item và trạng thái đã đánh dấu hiện có.

### Quyền và trạng thái công thức

- Đăng ký công khai luôn tạo tài khoản `user`. Không có endpoint công khai để đăng ký `admin`; tài khoản admin demo cần được cấp quyền riêng trong database.
- Công thức user gửi bắt đầu ở trạng thái `pending`; chỉ admin mới có thể approve/reject. Chỉ công thức đã publish (`approved`, cùng dữ liệu V1 cũ không có trạng thái) xuất hiện trong khám phá và tìm theo nguyên liệu.
- Tài khoản cần đăng nhập để gửi công thức, đánh giá, lưu yêu thích, dùng meal planner và shopping list. Tác giả không thể tự đánh giá công thức của mình.

### Các endpoint V2

| Tính năng | Endpoint | Truy cập |
| --- | --- | --- |
| Gợi ý nguyên liệu đang có trong công thức | `GET /api/v1/recipes/ingredients` | Công khai |
| Tìm món theo nguyên liệu | `POST /api/v1/recipes/match` | Công khai |
| Gửi công thức chờ duyệt | `POST /api/v1/recipes/submissions` | Đăng nhập |
| Xem trạng thái các công thức đã gửi | `GET /api/v1/recipes/submissions/mine` | Đăng nhập, chủ tài khoản |
| Xem hàng đợi duyệt | `GET /api/v1/recipes/review-queue` | Admin |
| Duyệt/từ chối công thức | `PATCH /api/v1/recipes/{id}/review` | Admin |
| Xem đánh giá của mình | `GET /api/v1/recipes/{id}/ratings/me` | Đăng nhập |
| Tạo/cập nhật đánh giá 1–5 sao | `PUT /api/v1/recipes/{id}/ratings` | Đăng nhập |
| Xóa đánh giá của mình | `DELETE /api/v1/recipes/{id}/ratings` | Đăng nhập |

Swagger UI là tài liệu API chính cho V2, gồm request, response, mã lỗi và các luồng gửi/duyệt công thức, đánh giá, tìm theo nguyên liệu. Endpoint list/detail trả `ratingAverage` và `ratingCount`; dùng `GET /api/v1/recipes?sort=rating` để xếp hạng. Điểm xếp hạng được điều chỉnh theo số lượt đánh giá để một rating đơn lẻ không dễ đẩy món lên đầu.

## Công nghệ

- **Frontend:** React, Vite, React Router, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcryptjs
- **Hosting:** Render Static Site và Web Service; MongoDB Atlas

## Chạy local

### Yêu cầu

| Công cụ/thư viện | Phiên bản tham chiếu | Ghi chú |
| --- | --- | --- |
| Node.js | 24.x | Đã dùng local `v24.21.0`; Render build với Node `24.22.1`. |
| npm | 11.x | Local `11.19.0`, đi kèm bản Node.js đã kiểm tra. |
| MongoDB | Local hoặc MongoDB Atlas | Cần có database để API khởi động; URI cấu hình qua `MONGO_URI`. Repo không khóa phiên bản server MongoDB cụ thể. |
| Trình duyệt | Chrome, Edge, Firefox hoặc Safari bản hiện hành | Dùng để chạy giao diện React. |

Các dependency chính đang được lockfile phân giải tới: React `18.3.1`, Vite `6.4.5`, React Router `7.18.5`, Express `4.22.3` và Mongoose `8.24.8`. `package.json` khai báo các khoảng phiên bản tương thích; `package-lock.json` lưu phiên bản cụ thể. Dùng `npm ci` để cài theo lockfile.

### 1. Cấu hình backend

Mở PowerShell tại thư mục repository:

```powershell
cd server
Copy-Item .env.example .env
```

Mở `server/.env`, đặt `MONGO_URI` trỏ tới MongoDB local hoặc Atlas. Thay `JWT_SECRET` bằng giá trị ngẫu nhiên riêng cho môi trường local. Không commit hoặc chia sẻ file `.env`.

Khởi động API:

```powershell
npm ci
npm run dev
```

Khi terminal báo `MongoDB connected` và API đang chạy ở `http://localhost:5000`, kiểm tra health tại [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health). Swagger UI local ở [http://localhost:5000/api-docs](http://localhost:5000/api-docs).

### 2. Khởi động frontend

Mở terminal PowerShell thứ hai tại thư mục repository:

```powershell
cd client
npm ci
npm run dev
```

Mở địa chỉ local do Vite in ra, thường là `http://localhost:5173`. Mặc định frontend gọi API local tại `http://localhost:5000/api/v1`. Nếu cần đổi API, tạo `client/.env.local` với `VITE_API_URL` phù hợp; không đưa file này lên Git.

### 3. Chuẩn bị dữ liệu demo (tùy chọn)

Chỉ chạy seed khi muốn thêm/cập nhật dữ liệu trong database được chỉ định bởi `MONGO_URI`. Seed công thức dùng tài khoản đã tồn tại trong chính database đó; các recipe mẫu được tạo ở trạng thái đã publish. Cùng tiêu đề sẽ được cập nhật khi chạy lại.

```powershell
cd server
$env:MONGO_URI = "mongodb://127.0.0.1:27017/cookmate"
$env:SEED_USER_EMAIL = "admin-demo@example.com"
npm run seed:recipes
```

Để chuẩn bị rating demo, cần có các tài khoản demo đã đăng ký trong database đích. Chỉ định rõ email bằng dấu phẩy rồi chạy:

```powershell
$env:SEED_RATING_USERS = "demo1@example.com,demo2@example.com"
npm run seed:ratings
```

Rating seed là dữ liệu tổng hợp 3–5 sao, chỉ thêm cho công thức đã publish, bỏ qua tự đánh giá và không ghi đè rating đã có. Không dùng các rating này như phản hồi thực của người dùng. Để seed Atlas, thay `MONGO_URI` bằng URI Atlas riêng của bạn; không đưa URI/mật khẩu vào Git, PR hoặc tài liệu công khai. Không chạy seed trên production nếu chưa chủ động chọn đúng database và tài khoản demo.

## Tài liệu và kiểm thử API

- Swagger UI production: [https://cookmate-j4o2.onrender.com/api-docs](https://cookmate-j4o2.onrender.com/api-docs)
- Postman collection: [`postman/collections/CookMate API.postman_collection.json`](./postman/collections/CookMate%20API.postman_collection.json)
- Hướng dẫn Postman: [`postman/README.md`](./postman/README.md)
- Hướng dẫn MongoDB Atlas và Render: [`docs/deployment.md`](./docs/deployment.md)

`docs/api.apidoc.js` và Postman collection hiện là tài liệu/request set kế thừa cho các API V1; chúng chưa bao phủ đầy đủ luồng V2. Dùng Swagger làm nguồn chuẩn khi tra cứu hoặc thử các endpoint V2.

Trong Postman collection, `baseUrl` mặc định trỏ tới production. Đổi thành `http://localhost:5000` để chạy local. Hai request GET health và recipes phù hợp để smoke test; endpoint recipes có thể trả danh sách rỗng.

## Cấu trúc repository

```text
client/                 React/Vite frontend
server/                 Express API và OpenAPI/Swagger spec
docs/                   Hướng dẫn deploy và nguồn tài liệu API
postman/                Postman collection và hướng dẫn
render.yaml             Render Blueprint cho API và frontend
PROJECT_CHECKLIST.md    Tiến độ đồ án
WORK_LOG.md             Nhật ký các phiên làm việc
```

## Phát triển dự án

Xem [PROJECT_CHECKLIST.md](./PROJECT_CHECKLIST.md) để theo dõi yêu cầu và trạng thái công việc, [WORK_LOG.md](./WORK_LOG.md) để xem nhật ký thay đổi. Quy trình nhánh và deploy được mô tả trong [docs/deployment.md](./docs/deployment.md).
