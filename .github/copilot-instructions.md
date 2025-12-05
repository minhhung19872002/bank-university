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

---

### 8. Bổ sung quy tắc từ yêu cầu kỹ thuật khách hàng

#### 8.1. Tối ưu SEO

    - Luôn kiểm tra và bổ sung các thẻ meta, title, description, từ khóa, Open Graph, favicon… cho từng trang.
    - Heading phải đúng hierarchy, mỗi trang chỉ có 1 `<h1>`, các heading khác dùng `h2`, `h3` theo thứ bậc nội dung.

#### 8.2. Accessibility

    - Đảm bảo các thành phần tương tác (button, link, form…) có text rõ ràng, không dùng placeholder `#` trừ khi là demo.
    - Thêm thuộc tính `aria-label`, `aria-expanded`, `aria-controls` cho các phần có tương tác (menu, accordion, hamburger…).
    - Tất cả ảnh phải có `alt` mô tả.

#### 8.3. Hiệu năng

    - Ưu tiên dùng ảnh tối ưu (webp, kích thước phù hợp), lazy load cho ảnh lớn hoặc gallery.
    - Sử dụng Bootstrap utility class để giảm CSS custom, tránh lặp lại style.

#### 8.4. Tái sử dụng component

    - Nhận diện các pattern lặp lại (card, button, section-title, slider…) và tạo class/component chung để dễ maintain.
    - Đề xuất tách header, footer, navbar, topbar thành các file riêng trong `/partials`.

#### 8.5. Kiểm soát responsive

    - Luôn kiểm tra và đảm bảo layout hiển thị tốt trên các breakpoint (mobile, tablet, desktop).
    - Nếu mobile khác biệt lớn, dùng chiến lược tách markup như instruction đã nêu.

#### 8.6. Kiểm thử & kiểm tra chất lượng

    - Sau khi refactor, kiểm tra lại toàn bộ UI/UX, responsive, SEO, accessibility, hiệu năng.
    - Đề xuất checklist kiểm thử cho từng trang/component.

1. **Font-size & font-weight – AI tự động nhận diện**

    - AI được phép tự động nhận diện hierarchy nội dung (heading, body, caption…) và thiết lập hệ token `--fs-*` và font-weight phù hợp nhất cho từng trang, đảm bảo nhất quán, dễ đọc, tối ưu UI/UX.
    - Không cần bám sát mapping cứng, AI có thể đề xuất lại giá trị token nếu phát hiện design thực tế không ổn định.
    - Line-height dùng tỷ lệ (`1.2–1.6`) theo hierarchy nội dung.

2. **Spacing, radius, shadow – AI tự động nhận diện**

    - AI tự động nhận diện pattern spacing, border-radius, shadow… và sử dụng hoặc đề xuất hệ token phù hợp, đảm bảo đồng bộ toàn site.

3. **Màu sắc – luôn ưu tiên token trong `variables.css`**

    - Không dùng thẳng `#fff`, `#000`, `#333`, `#fafafa`… Nếu cần, map sang:
        - Nền/trắng: `var(--color-light)`
        - Text chính: `var(--gray-900)`
        - Text phụ: `var(--text-muted)` / `var(--gray-600, --gray-500)`
        - Màu brand: `var(--brand-primary)`, `var(--brand-secondary)`, `var(--brand-accent)`, `var(--brand-accent-dark)`
        - Border gray: `var(--gray-border)` hoặc `var(--gray-300)`
    - Nếu phải thêm màu mới → thêm vào `variables.css` trước, sau đó mới dùng.

4. **Ảnh & background**

    - Ảnh luôn `display: block; max-width: 100%; height: auto;` trừ khi cần ratio cố định.
    - `object-fit: cover` cho thumbnail/card; nếu dùng màu nền riêng → dùng token, không hard-code.

5. **Ưu tiên sửa code cũ theo hệ token**

    - Khi đụng vào bất kỳ component/page CSS nào:
        - Thay `font-size` px → `--fs-*` phù hợp.
        - Thay màu thô (`#ffffff`, `#333333`, `#fafafa`…) → token tương ứng.
        - Thay `border-radius`, `box-shadow`, `transition` lẻ → token nếu đã có.
    - Mục tiêu: toàn bộ `css/components` và `css/pages` **không còn** style “magic number” khó reuse, tất cả đi qua hệ token.

6. **AI tự động hóa nhận diện & refactor**

    - AI được phép tự động nhận diện các vấn đề về typography, spacing, radius, shadow… và refactor lại CSS/HTML cho đồng bộ, dễ maintain.

7. **Instruction bổ sung:**
    - “AI được phép tự động nhận diện và thiết lập hệ token (font-size, font-weight, spacing, radius, shadow…) phù hợp nhất với từng trang, đảm bảo nhất quán, dễ maintain, tối ưu cho UI/UX và responsive. Không cần bám sát mapping cứng nếu phát hiện design thực tế không ổn định. Màu sắc vẫn phải mapping đúng token đã quy định.”
