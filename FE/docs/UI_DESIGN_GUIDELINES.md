# QUY ĐỊNH THIẾT KẾ GIAO DIỆN HỆ THỐNG (UI/UX DESIGN GUIDELINES)
**Dự án:** E-Commerce Enterprise System  
**Phiên bản:** 2.0  
**Cập nhật lần cuối:** 2026-10-06  

---

## 1. TRIẾT LÝ THIẾT KẾ (DESIGN PHILOSOPHY)

Hệ thống giao diện của **E-Commerce Enterprise** được xây dựng dựa trên 5 nguyên tắc cốt lõi:
1. **Tính Đồng Nhất (Consistency):** Toàn bộ các phân hệ (Customer, Seller, Admin, Auth) tuân thủ chung một bộ Design Tokens, màu sắc, khoảng cách và quy chuẩn button.
2. **Trải Nghiệm Chuyển Đổi Cao (Conversion-Driven):** Các thành phần kêu gọi hành động (CTA) được làm nổi bật, có thị giác rõ ràng, phản hồi tương tác tức thì.
3. **Hiện Đại & Tinh Tế (Clean & Modern):** Loại bỏ chi tiết rườm rà, tập trung vào khoảng trắng (whitespace), typographic hierarchy và viền bo mềm mại.
4. **Tiêu Chuẩn Đã Truy Cập (Accessibility - WCAG 2.1 AA):** Độ tương phản màu sắc cao, trạng thái focus-visible rõ ràng cho bàn phím, nhãn aria-label hỗ trợ trình đọc màn hình.
5. **Tối Ưu Chuẩn SEO & Performance:** Cấu trúc HTML Semantic, lazy-loading hình ảnh, không gây giật lag giao diện (CLS = 0).

---

## 2. HỆ THỐNG MÀU SẮC & DESIGN TOKENS

Hệ thống sử dụng các biến CSS Root (`:root`) định nghĩa sẵn trong `src/styles/global.css`:

### 2.1. Màu Thương Hiệu (Brand Colors)
| Biến CSS | Mã Color | Ứng Dụng |
| :--- | :--- | :--- |
| `--color-primary` | `#ee4d2d` | Màu chủ đạo, Primary Buttons, Active Tabs, Highlights |
| `--color-primary-hover` | `#d73211` | Trạng thái Hover của Primary CTA |
| `--color-primary-active` | `#b8280c` | Trạng thái Press/Click của Primary CTA |
| `--color-primary-light` | `#fff2ef` | Background cho Badge primary, Highlight box, Item selected |
| `--color-secondary` | `#0f172a` | Nút phụ, Header/Sidebar dark, Slate text |

### 2.2. Thang Màu Trung Tính (Neutral Slate Scale)
- **Slate 50 (`#f8fafc`):** Background toàn trang (`--bg-page`).
- **Slate 100 (`#f1f5f9`):** Background card hover, input disabled, table header.
- **Slate 200 (`#e2e8f0`):** Viền đường kẻ phân cách (`--border-color`).
- **Slate 500 (`#64748b`):** Văn bản phụ, subtitle, icon muted.
- **Slate 800 (`#1e293b`):** Tiêu đề bài viết, văn bản chính (`--text-main`).
- **White (`#ffffff`):** Card background, modal content.

### 2.3. Màu Trạng Thái (Status Colors)
- **Success (`#10b981`):** Hoàn thành, Đã giao, Approve, Active badge.
- **Warning (`#f59e0b`):** Chờ xử lý, Cảnh báo, Pending status.
- **Danger (`#ef4444`):** Xóa, Từ chối, Lỗi validation, Hủy đơn.
- **Info (`#06b6d4`):** Thông tin phụ, Đang vận chuyển (In-transit).

---

## 3. QUY ĐỊNH HỆ THỐNG NÚT BẤM (BUTTON SYSTEM STANDARDS)

Button là thành phần tương tác quan trọng nhất trên hệ thống. Tất cả nút bấm phải sử dụng class chuẩn `.btn` hoặc Reusable Component `<Button />` từ `@/shared/components/ui/Button`.

### 3.1. Phân Loại Nút (Button Variants)

| Biến thể (Variant) | Class CSS | Mục Đích Sử Dụng |
| :--- | :--- | :--- |
| **Primary** | `.btn-primary` | Hành động chính quan trọng nhất trên màn hình (Thanh toán, Đặt hàng, Lưu sản phẩm, Đăng nhập). |
| **Secondary** | `.btn-secondary` | Hành động phụ có độ ưu tiên cao thứ hai (Tìm kiếm, Lọc, Xuất báo cáo). |
| **Outline** | `.btn-outline` | Hành động Hủy, Quay lại, Xem chi tiết, Đóng modal. |
| **Outline Primary** | `.btn-outline-primary` | Hành động phụ mang tính nhận diện thương hiệu (Thêm vào giỏ hàng, Lưu nháp). |
| **Danger** | `.btn-danger` | Hành động nguy hiểm không thể hoàn tác (Xóa sản phẩm, Từ chối đơn đăng ký, Hủy đơn). |
| **Success** | `.btn-success` | Hành động phê duyệt, xác nhận (Phê duyệt Seller, Phê duyệt thanh toán). |
| **Ghost** | `.btn-ghost` | Nút không viền dùng cho thao tác bảng dữ liệu (Sửa/Xóa icon). |
| **Link** | `.btn-link` | Nút dạng văn bản liên kết. |

### 3.2. Kích Thước Nút (Button Sizes)
- **Extra Small (`.btn-xs`):** Height `28px`, Font `12px` – Dùng cho tag thao tác nhỏ trong table.
- **Small (`.btn-sm`):** Height `34px`, Font `13px` – Dùng cho button trong bảng dữ liệu, filter bar.
- **Medium (`.btn-md` - Default):** Height `40px`, Font `14px` – Kích thước tiêu chuẩn cho form.
- **Large (`.btn-lg`):** Height `46px`, Font `16px` – Dùng cho CTA chính, Thanh toán, Mua ngay.
- **Extra Large (`.btn-xl`):** Height `52px`, Font `18px` – Dùng cho Landing Page banner CTA.

### 3.3. Quy Định Trạng Thái & Hiệu Ứng Nút (States & Interactions)
1. **Hover Effect:** Nút nâng nhẹ (`translateY(-1px)`), tăng độ đậm bóng đổ (`shadow-md`).
2. **Active Press Effect:** Nút lún nhẹ (`translateY(1px) scale(0.985)`).
3. **Focus Ring:** Khi bấm Tab bằng bàn phím, xuất hiện viền mờ `box-shadow: 0 0 0 3px var(--color-primary-focus)`.
4. **Disabled:** Giảm opacity xuống `55%`, khóa con trỏ `cursor: not-allowed`, tắt hiệu ứng hover/click.
5. **Loading (`isLoading`):** Hiển thị Icon Spinner quay nhẹ, tự động disabled nút để tránh duplicate click.

### 3.4. Ví Dụ Sử Dụng Component `<Button />` (React)
```jsx
import Button from '@/shared/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';

// Nút Tạo Mới
<Button variant="primary" size="md" icon={<Plus size={18} />} onClick={handleCreate}>
  Thêm Sản Phẩm
</Button>

// Nút Xóa Đang Loading
<Button variant="danger" size="md" isLoading={isDeleting} icon={<Trash2 size={18} />} onClick={handleDelete}>
  Xóa Sản Phẩm
</Button>

// Nút Hủy
<Button variant="outline" onClick={handleClose}>
  Hủy Bỏ
</Button>
```

---

## 4. QUY ĐỊNH FORM & INPUT CONTROL

1. **Cấu trúc Form Group (`.form-group`):**
   - Bao gồm `.form-label` (Font 14px, Bold 600, màu Slate 700).
   - Input/Select/Textarea (`.form-input`, `.form-select`, `.form-textarea`).
   - Thông báo lỗi (`.form-error`) đặt ngay bên dưới input khi bị validate sai.
2. **Trạng Thái Focus:** Khi user click/focus vào input, viền đổi sang màu Primary và có viền sáng mờ nhẹ (`box-shadow: 0 0 0 3px var(--color-primary-focus)`).
3. **Trạng Thái Lỗi (`.is-invalid`):** Viền chuyển sang màu đỏ Danger (`#ef4444`).

---

## 5. QUY ĐỊNH COMPONENT HỆ THỐNG (CARDS, BADGES, TABLES, MODALS)

### 5.1. Card System (`.card`)
- Background trắng, viền `#e2e8f0`, bo góc `12px` (`--radius-lg`), bóng mờ nhẹ `var(--shadow-sm)`.
- Class `.card-hover` giúp card nổi nhẹ lên khi di chuột vào (dùng cho danh sách sản phẩm).

### 5.2. Badges & Tag Trạng Thái (`.badge`)
- Dạng viên thuốc bo tròn (`border-radius: 9999px`), chữ Bold 600, font 12px.
- Đặt màu tương ứng trạng thái:
  - `Active / Delivered / Approved`: `.badge-success` (Nền xanh nhạt, chữ xanh đậm).
  - `Pending / Preparing`: `.badge-warning` (Nền vàng nhạt, chữ nâu vàng).
  - `Cancelled / Rejected / Deleted`: `.badge-danger` (Nền đỏ nhạt, chữ đỏ).

### 5.3. Table System (`.table-container`)
- Thẻ bọc ngoài có `overflow-x: auto` tránh vỡ giao diện trên di động.
- Header `<th>` nền Slate 50, chữ Slate 700, Font 600, border bottom.
- Row `<tr>` có hiệu ứng hover đổi màu mờ nhẹ (`.table-hover`).

### 5.4. Modal & Dialog System (`.modal-backdrop`, `.modal-content`)
- Backdrop đen mờ `rgba(15, 23, 42, 0.6)` có hiệu ứng làm mờ nền `backdrop-filter: blur(4px)`.
- Nội dung Modal bo góc `16px`, có animation nẩy nhẹ từ dưới lên (`slideUp`).

---

## 6. QUY ĐỊNH SEO, ACCESSIBILITY & PERFORMANCE

1. **Dynamic Page Title (SEO):** Mỗi trang phải khai báo `<SEOHead title="..." description="..." />` riêng biệt. Không được dùng tiêu đề cố định.
2. **Heading Hierarchy (On-Page SEO):**
   - Mỗi trang chỉ chứa duy nhất **1 thẻ `<h1>`**.
   - Các thẻ `<h2>`, `<h3>` tổ chức theo thứ tự cấp bậc logic.
3. **Image Alt Text:** Tất cả thẻ `<img>` phải có thuộc tính `alt` mô tả nội dung ảnh (Vd: `alt="Hình ảnh sản phẩm Áo sơ mi"`).
4. **Semantic Tags:** Sử dụng đúng thẻ `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`.
5. **Button Accessibility:** Các nút chỉ có Icon (không có chữ) bắt buộc phải có thuộc tính `aria-label` hoặc `title`.

---

## 7. QUY ĐỊNH RESPONSIVE (BREAKPOINTS)

- **Mobile (< 640px):** Button chuyển thành kích thước chuẩn full-width nếu cần thiết, form chuyển thành 1 cột.
- **Tablet (640px - 1024px):** Grid 2 cột hoặc 3 cột.
- **Desktop (> 1024px):** Grid 4-5 cột, container giới hạn max-width `1280px` căn giữa.
