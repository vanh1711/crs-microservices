# BÁO CÁO TÀI LIỆU BUỔI 6 - GIAO DIỆN DANH SÁCH MÔN HỌC, TÌM KIẾM & PHÂN TRANG

## 1. Tổng quan & Mục tiêu
Buổi 6 tập trung vào việc xây dựng giao diện người dùng hoàn chỉnh cho hệ thống Đăng ký học phần (CRS Frontend), kết nối tới Backend thông qua **API Gateway** (`http://localhost:8080`), đồng thời nâng cấp toàn diện trải nghiệm người dùng (UI/UX).

### Các yêu cầu cốt lõi đạt được:
- **Tách biệt trách nhiệm rõ ràng (Separation of Concerns):** Tách logic gọi API ra khỏi giao diện hiển thị bằng Custom Hook.
- **Tối ưu tìm kiếm với Debounce (400ms):** Hạn chế tối đa việc gửi request thừa lên Gateway/Backend khi người dùng đang nhập từ khóa.
- **Xử lý đủ 4 trạng thái bắt buộc:**
  1. `Loading`: Hiển thị Skeleton loader dạng bảng với hiệu ứng shimmer chuyển động mượt mà.
  2. `Success`: Hiển thị bảng danh sách môn học đầy đủ, bao gồm mã học phần, tên, số tín chỉ và thanh tiến độ số chỗ còn lại.
  3. `Empty`: Hiển thị giao diện thông báo khi không tìm thấy kết quả tương ứng.
  4. `Error`: Hiển thị thông báo lỗi chi tiết (lỗi nghiệp vụ hoặc mất kết nối Gateway/Service) kèm nút **"Thử lại kết nối"**.
- **Phân trang chuẩn Spring Data Pageable:** Chỉ số trang bắt đầu từ `0`, tự động ẩn khi tổng số trang $\le 1$, và tự động reset về trang `0` khi tìm kiếm từ khóa mới.

---

## 2. Kiến trúc & Cấu trúc Component Frontend

```
crs-frontend/src/
├── api/
│   ├── axiosClient.ts       # Axios instance cấu hình Base URL trỏ về Gateway (:8080)
│   ├── courseApi.ts         # Hàm gọi API GET /api/courses (keyword, page, size)
│   └── useCourses.ts        # Custom Hook quản lý dữ liệu, debounce, 4 trạng thái
├── components/
│   ├── SearchBox.tsx        # Ô tìm kiếm với debounce 400ms, nút xóa nhanh & hiển thị số lượng
│   ├── CourseList.tsx       # Bảng hiển thị danh sách môn học & xử lý 4 trạng thái (Loading/Success/Empty/Error)
│   └── Pagination.tsx       # Điều hướng phân trang (Trang trước, số trang, Trang sau)
├── types/
│   ├── apiError.ts          # Định nghĩa kiểu dữ liệu phản hồi lỗi từ backend
│   └── course.ts            # Định nghĩa Interface Course & PagedResponse<T>
├── App.tsx                  # Layout chính, Header thương hiệu CRS & gắn kết các components
├── index.css                # Hệ thống Design Tokens, Glassmorphism, Animation & Responsive styles
└── main.tsx                 # Entrypoint khởi tạo React 19 root
```

---

## 3. Chi tiết chức năng & Nâng cấp UI/UX

### 3.1. Custom Hook `useCourses`
- **Quản lý state:** `courses`, `totalPages`, `state` (`loading` | `success` | `empty` | `error`), `errorMessage`.
- **Phân biệt lỗi thông minh:**
  - Nếu `!err.response`: Thông báo *"Không kết nối được tới hệ thống. Vui lòng thử lại sau."* (xảy ra khi API Gateway hoặc Course Service bị tắt).
  - Nếu có `err.response.data.message`: Hiển thị đúng thông điệp lỗi nghiệp vụ từ backend.

### 3.2. Cải tiến UI/UX giao diện
- **Typography & Font:** Sử dụng font chữ hiện đại **Plus Jakarta Sans** và **JetBrains Mono** tạo phong cách SaaS/EdTech chuyên nghiệp.
- **Bảng dữ liệu môn học:**
  - Icon avatar viết tắt cho từng môn học.
  - Badge số tín chỉ màu xám sang trọng.
  - Thanh tiến độ hiển thị trực quan tỷ lệ số chỗ còn lại (`soChoConLai / soChoToiDa`).
  - Badge trạng thái đổi màu linh hoạt:
    - **Xanh lục:** Còn nhiều chỗ ($> 50\%$).
    - **Cam:** Sắp hết chỗ ($\le 5$ chỗ).
    - **Đỏ:** Đã hết chỗ ($= 0$).
- **Skeleton Shimmer Loading:** Tránh giật màn hình khi tải trang hoặc chuyển trang.

---

## 4. Kịch bản kiểm thử (Test Cases)

| STT | Thao tác | Kỳ vọng quan sát được | Trạng thái |
|:---:|:---|:---|:---:|
| 1 | Mở trang lần đầu / F5 | Hiệu ứng Skeleton Loading xuất hiện ngắn trước khi bảng dữ liệu hiển thị. | `Loading` -> `Success` |
| 2 | Nhập từ khóa không tồn tại (`xxx999`) | Sau 400ms, hiển thị giao diện Empty State thân thiện. | `Empty` |
| 3 | Xóa ô tìm kiếm | Danh sách môn học hiển thị lại đầy đủ và quay về trang đầu (Trang 1). | `Success` |
| 4 | Chuyển trang qua lại | Chuyển trang mượt mà, số trang đang xem được active nổi bật. | `Success` |
| 5 | Tắt API Gateway / Course Service rồi bấm "Thử lại kết nối" | Hiển thị thông báo lỗi mất kết nối màu đỏ kèm nút thử lại, không bị crash trắng trang. | `Error` |
| 6 | Bật lại Service và bấm "Thử lại kết nối" | Tự động tải lại dữ liệu thành công. | `Success` |
