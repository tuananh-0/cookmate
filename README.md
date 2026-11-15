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

## Tính năng MVP

- Đăng ký, đăng nhập và xác thực phiên bằng JWT.
- Khám phá, tìm kiếm và lọc công thức theo tên, mô tả, danh mục và nguyên liệu.
- Xem chi tiết công thức; quản trị viên có thể tạo, sửa và xóa công thức.
- Lưu công thức yêu thích.
- Lập thực đơn và tạo danh sách mua sắm từ thực đơn.

## Công nghệ

- **Frontend:** React, Vite, React Router, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcryptjs
- **Hosting:** Render Static Site và Web Service; MongoDB Atlas

## Chạy local

### Yêu cầu

- Node.js và npm
- MongoDB chạy local hoặc một MongoDB Atlas URI

### 1. Cấu hình backend

Mở PowerShell tại thư mục repository:

```powershell
cd server
Copy-Item .env.example .env
```

Mở `server/.env`, đặt `MONGO_URI` trỏ tới MongoDB local hoặc Atlas. Thay `JWT_SECRET` bằng giá trị ngẫu nhiên riêng cho môi trường local. Không commit hoặc chia sẻ file `.env`.

Khởi động API:

```powershell
npm install
npm run dev
```

Khi terminal báo `MongoDB connected` và API đang chạy ở `http://localhost:5000`, kiểm tra health tại [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health). Swagger UI local ở [http://localhost:5000/api-docs](http://localhost:5000/api-docs).

### 2. Khởi động frontend

Mở terminal PowerShell thứ hai tại thư mục repository:

```powershell
cd client
npm install
npm run dev
```

Mở địa chỉ local do Vite in ra, thường là `http://localhost:5173`. Mặc định frontend gọi API local tại `http://localhost:5000/api/v1`. Nếu cần đổi API, tạo `client/.env.local` với `VITE_API_URL` phù hợp; không đưa file này lên Git.

## Tài liệu và kiểm thử API

- Swagger UI production: [https://cookmate-j4o2.onrender.com/api-docs](https://cookmate-j4o2.onrender.com/api-docs)
- Postman collection: [`postman/collections/CookMate API.postman_collection.json`](./postman/collections/CookMate%20API.postman_collection.json)
- Hướng dẫn Postman: [`postman/README.md`](./postman/README.md)
- Hướng dẫn MongoDB Atlas và Render: [`docs/deployment.md`](./docs/deployment.md)

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
