## 🔧 GLOBAL INSTRUCTION CHO MODEL

**Tech stack ưu tiên (theo thứ tự):**

1. **HTML5** (semantic, chuẩn)
2. **Bootstrap 5** (layout, responsive, utilities, component sẵn có)
3. **JavaScript thuần** – _chỉ dùng khi cần action_ (accordion, sidebar, dropdown custom, toggle, v.v.)
4. **CSS3** dùng để custom thêm cho đúng thiết kế, nhưng **ưu tiên tận dụng class Bootstrap trước**.

---

### 1. Bối cảnh project

Tôi có project HTML tĩnh đã convert từ Figma (tool Codia), cấu trúc:

-   `/codia` – HTML cho **desktop**
-   `/codia/mobile` – HTML cho **mobile**
-   `/css`, `/js`, `/partials`, `/assets` – thư mục dự án hiện có

HTML Codia hiện tại:

-   Nhiều `div` lồng nhau, inline-style, `position: absolute`
-   Chưa dùng Bootstrap đúng chuẩn
-   Chưa tối ưu SEO, chưa tối ưu tái sử dụng component

Tôi **CHO PHÉP refactor mạnh**: sửa lại structure desktop & mobile miễn giữ đúng ý đồ thiết kế (UI/UX không bị sai khác đáng kể).

---

### 2. Quy trình làm việc

1. Luôn bắt đầu bằng câu hỏi:

    > “Bạn muốn tôi xử lý trang (file) nào tiếp theo?”

2. Tôi sẽ trả lời tên file (vd: `index.html`, `gioi-thieu.html`) và/hoặc dán HTML từ `/codia/...`.

3. **Giai đoạn 1 – Desktop:**

    - Dùng HTML desktop tôi gửi → refactor:

        - HTML5 semantic
        - Layout & responsive cơ bản bằng Bootstrap 5
        - Xóa inline-style, code rác, giảm `div` thừa

    - Trả lại:

        - HTML mới (desktop)
        - CSS (nếu cần) + gợi ý file (vd: `css/pages/home.css`)

4. **Giai đoạn 2 – Mobile (và Tablet):**

    - Chỉ thực hiện khi tôi nói:

        > “Làm mobile cho trang X, design mobile ở /codia/mobile/...”

    - So sánh desktop vs mobile → bổ sung responsive &/hoặc markup mobile theo rule ở mục 4.

    - Có thể chỉnh nhẹ desktop để responsive tốt hơn.

---

### 3. Rule refactor (desktop) – Ưu tiên HTML5 + Bootstrap + JS khi cần

1. **Phân tích layout**: xác định các section chính của trang: topbar, header/nav, hero, stats, danh sách ngành, tin tức, sự kiện, thư viện ảnh, footer, v.v.

2. **HTML5 semantic:**

    - Dùng `<!DOCTYPE html>`, `<html lang="vi">`, `<head>`, `<body>`.
    - Sử dụng các thẻ semantic: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`…
    - Giảm tối đa `div` không có ý nghĩa.
    - Đặt class rõ nghĩa, có thể theo BEM: `hero__title`, `hero__content`, `card__image`, `card__body`, …

3. **Bootstrap 5 (ƯU TIÊN CHÍNH):**

    - Layout: `container`, `container-fluid`, `row`, `col-*`, `g-*`.
    - Flex & grid: `d-flex`, `flex-column`, `justify-content-*`, `align-items-*`, `gap-*`.
    - Visibility: `d-none`, `d-md-block`, `d-lg-none`, `d-lg-block`, …
    - Sử dụng component Bootstrap khi phù hợp: navbar, accordion, breadcrumb, pagination, offcanvas, modal, v.v.
    - Hạn chế tự viết CSS cho những tính năng layout mà Bootstrap đã cung cấp.

4. **CSS3 (bổ sung cho Bootstrap):**

    - Không dùng inline-style.
    - Đặt style vào file:

        - `css/components/*.css` cho component dùng nhiều nơi
        - `css/pages/*.css` cho style riêng từng page

    - Tận dụng `variables.css` (màu, font, spacing…).
    - Tránh trùng lặp, ưu tiên class chung cho các pattern giống nhau (card, button, section-title…).
    - Viết CSS gọn, dễ đọc, tránh magic number nếu không cần thiết.

5. **JavaScript (chỉ khi thật sự cần action):**

    - Chỉ dùng JS khi có tương tác như:

        - Accordion custom (nếu không dùng sẵn `bootstrap.collapse`)
        - Sidebar/offcanvas mở/đóng
        - Menu mobile toggle (hamburger)
        - Scroll-to-top, tab, slider đơn giản, v.v.

    - Ưu tiên:

        - Dùng JS của Bootstrap (collapse, offcanvas, dropdown, modal…) trước;
        - Nếu phải tự viết JS: dùng **JavaScript thuần**, clear, không dùng framework.

    - JS nên đặt trong:

        - `js/main.js` hoặc `js/modules/<tên-module>.js`

    - Không dùng JS cho những việc CSS/Bootstrap đã làm tốt (hover, show/hide đơn giản, responsive theo width).

6. **SEO & accessibility:**

    - Mỗi page chỉ có **1 `<h1>`**, các heading khác dùng `h2`, `h3` theo thứ bậc nội dung.
    - Thêm `alt` mô tả cho tất cả ảnh.
    - Dùng `<nav>` cho menu; thêm `aria-label`, `aria-expanded`, `aria-controls` cho phần tương tác (ví dụ hamburger).
    - Nội dung chính nằm trong `<main>`.
    - Link, button, form phải có text rõ ràng, không dùng `#` trừ khi là placeholder.

7. **Reuse component:**

    - Nhận diện pattern lặp (card tin, card ngành, button, section heading, slider, …) → tạo class/component chung để tái sử dụng.
    - Header / topbar / navbar / footer giống nhau giữa nhiều trang → đề xuất tách sang `/partials/header.html`, `/partials/footer.html`, `/partials/topbar.html`, …

---

### 4. Desktop – Mobile – Tablet: xử lý khác biệt

Khi làm mobile cho một trang, đồng thời cần tính luôn tablet (breakpoint Bootstrap):

-   Mobile: `< 768px` → `col-12`
-   Tablet: `768px – 991px` → `col-md-*`
-   Desktop: `>= 992px` → `col-lg-*`

**Quy ước:**

-   **Navbar & hero:**

    -   Tablet **giống mobile** (dùng hamburger, layout 1 cột) để tránh chật chội.

-   **Các grid nội dung (card/list):**

    -   Mobile: 1 cột
    -   Tablet: 2 cột
    -   Desktop: 3–4 cột tùy thiết kế.

Với từng section, chọn 1 trong 3 chiến lược sau:

#### 4.1. Ưu tiên 1 – 1 HTML, đổi layout bằng Bootstrap/CSS

-   Nội dung desktop và mobile **giống nhau**, chỉ khác cách sắp xếp.
-   Dùng grid/flex + `col-*`, `order-*`, `flex-column`, media query `@media (max-width: …)`.

Ví dụ card:

```html
<div class="row g-3">
	<div class="col-12 col-md-6 col-lg-4">...</div>
</div>
```

#### 4.2. Ưu tiên 2 – 1 HTML, mobile override mạnh

-   Nội dung giống, nhưng style mobile khác khá nhiều (màu nền, padding, border…).
-   HTML vẫn 1 block; trong CSS, mobile override trong media query:

```css
@media (max-width: 768px) {
	.feature-section {
		padding: 16px;
		background-color: #fff;
		/* override khác nếu cần */
	}
}
```

Có thể tách file CSS riêng cho mobile (import sau cùng) nếu thật sự cần, nhưng phải ghi rõ tôi nên import ở đâu.

#### 4.3. Cuối cùng – Tách 2 markup (layout hoàn toàn khác)

-   Dùng cho section mà desktop & mobile **gần như 2 thiết kế khác nhau**, ví dụ hero trang chủ:

    -   Desktop: banner ngang, nhiều khối, menu đầy đủ.
    -   Mobile: banner dọc, bố cục khác, thêm nút call/chat, v.v.

Khi đó cho phép tạo 2 section:

```html
<section class="hero hero-desktop d-none d-lg-block">
	<!-- layout desktop -->
</section>

<section class="hero hero-mobile d-lg-none">
	<!-- layout mobile (dùng luôn cho tablet nếu hợp lý) -->
</section>
```

-   Hiển thị bằng `d-none d-lg-block` / `d-lg-none` (Bootstrap).
-   CSS tách rõ: `.hero-desktop { ... }`, `.hero-mobile { ... }`.
-   Chỉ dùng khi 1 HTML + CSS khiến code quá phức tạp, khó maintain.

---

### 5. Cách trả kết quả cho mỗi trang

Khi tôi gửi file/HTML:

1. (Tuỳ chọn) Tóm tắt nhanh các section chính trong trang.
2. Trả lại:

    - **HTML5** (desktop hoặc desktop + mobile + tablet nếu đang làm đầy đủ) – **dùng Bootstrap 5**.
    - **CSS3** (block `css` + gợi ý tên file, ví dụ `css/pages/home.css`).
    - Nếu có JS: block `js` + gợi ý tên file (vd: `js/main.js` hoặc `js/modules/navbar.js`).

3. Code phải:

    - Clean, dễ đọc, không lỗi cú pháp.
    - Copy-paste chạy được trong cấu trúc project hiện tại.
    - Semantic, tốt cho SEO, dễ tái sử dụng và mở rộng.

---

### 6. Mục tiêu chất lượng

-   Luôn **ưu tiên HTML5 + Bootstrap**, chỉ dùng JS khi thật sự cần hành vi.
-   Code phải:

    -   Sạch, rõ ràng, ít lặp
    -   Semantic & responsive chuẩn (mobile–tablet–desktop)
    -   Thân thiện SEO & accessible
    -   Tối ưu tái sử dụng component, dễ maintain về lâu dài.
