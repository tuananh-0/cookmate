# CookMate

CookMate là nền tảng web giúp người dùng chia sẻ công thức nấu ăn, lập thực đơn và quản lý nguyên liệu.

## Mục tiêu MVP

- Đăng ký và đăng nhập
- Xem, tìm kiếm và lọc công thức
- Tạo, chỉnh sửa và xóa công thức
- Lưu công thức yêu thích
- Lập thực đơn theo ngày hoặc tuần
- Tạo danh sách mua sắm

## Công nghệ dự kiến

- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express
- Database: MongoDB, Mongoose
- Authentication: JWT, bcrypt

## Cấu trúc

```text
client/  # React frontend
server/  # Express REST API
docs/    # API documentation and diagrams
```

## Chạy local

```bash
cd server
npm install
npm run dev

cd ../client
npm install
npm run dev
```

Backend health check: `http://localhost:5000/api/v1/health`

Tạo file `.env` dựa trên `.env.example` trước khi chạy backend.

Hướng dẫn cấu hình MongoDB Atlas: [docs/deployment.md](./docs/deployment.md).

## Production

- Web app: <https://cookmate-fe.onrender.com>
- Public API base URL: <https://cookmate-j4o2.onrender.com>
- API documentation (Swagger UI): <https://cookmate-j4o2.onrender.com/api-docs>
- Health check: <https://cookmate-j4o2.onrender.com/api/v1/health>
- Recipe list: <https://cookmate-j4o2.onrender.com/api/v1/recipes>

The recipe list may be empty until recipes are added to the production database. Import the [Postman collection](./postman/collections/CookMate%20API.postman_collection.json) to try the API; its default `baseUrl` targets production.

## Trạng thái

Đồ án đang được phát triển. Xem [PROJECT_CHECKLIST.md](./PROJECT_CHECKLIST.md) để theo dõi tiến độ.

