# CookMate

CookMate là nền tảng web giúp người dùng chia sẻ công thức nấu ăn, lập thực đơn và quản lý nguyên liệu.

## Mục tiêu MVP

- Đăng ký và đăng nhập
- Xem, tìm kiếm và lọc công thức
- Tạo, chỉnh sửa và xóa công thức
- Lưu công thức yêu thích
- Lập thực đơn theo ngày hoặc tuần
- Quản lý nguyên liệu trong nhà
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

Tạo file `.env` dựa trên `.env.example` trước khi chạy backend.

## Trạng thái

Đồ án đang được phát triển. Xem [PROJECT_CHECKLIST.md](./PROJECT_CHECKLIST.md) để theo dõi tiến độ.

