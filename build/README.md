# HUB University Static Site Generator

Hệ thống tạo trang tĩnh (SSG) cho website tuyển sinh HUB University.

## Cấu trúc thư mục

```
build/
├── build.js          # Script chính để generate trang
├── data/             # Dữ liệu JSON cho các bài viết
│   ├── tin-tuyen-sinh.json
│   ├── su-kien.json
│   ├── dai-hoc.json
│   ├── thac-si.json
│   └── tien-si.json
├── templates/        # HTML templates cho từng category
│   ├── tin-tuyen-sinh.html
│   ├── su-kien.html
│   └── default.html
└── README.md
```

## Cách sử dụng

### 1. Chạy build

```bash
node build/build.js
```

### 2. Kết quả

Script sẽ tạo:
- Các trang chi tiết tại `/{category}/{slug}/index.html`
- File `sitemap.xml` ở root

Ví dụ URLs được tạo:
- `/tin-tuyen-sinh/cong-thuc-tinh-diem-xet-tuyen/index.html`
- `/su-kien/ngay-hoi-tuyen-sinh-2025/index.html`
- `/dai-hoc/nganh-tai-chinh-ngan-hang/index.html`

## Thêm bài viết mới

### 1. Thêm dữ liệu vào file JSON

Mở file `build/data/{category}.json` và thêm object mới:

```json
{
    "slug": "url-slug-cua-bai-viet",
    "title": "Tiêu đề bài viết",
    "description": "Mô tả SEO (150-160 ký tự)",
    "keywords": "từ khóa, SEO, phân cách bằng dấu phẩy",
    "date": "DD/MM/YYYY",
    "lastmod": "YYYY-MM-DD",
    "og_image": "https://hub.edu.vn/assets/images/thumbnail.png",
    "hero_image": "/assets/images/hero.png",
    "featured_image": "/assets/images/featured.png",
    "content": "<p>Nội dung HTML của bài viết</p>",
    "related": [
        {
            "title": "Bài viết liên quan",
            "excerpt": "Mô tả ngắn...",
            "image": "/assets/images/related.png",
            "url": "/category/slug/"
        }
    ]
}
```

### 2. Chạy lại build

```bash
node build/build.js
```

## Các placeholders trong template

| Placeholder | Mô tả |
|-------------|-------|
| `{{title}}` | Tiêu đề bài viết |
| `{{description}}` | Mô tả SEO |
| `{{keywords}}` | Từ khóa SEO |
| `{{canonical}}` | URL canonical |
| `{{og_title}}` | Tiêu đề Open Graph |
| `{{og_description}}` | Mô tả Open Graph |
| `{{og_image}}` | Hình ảnh Open Graph |
| `{{og_url}}` | URL Open Graph |
| `{{slug}}` | Slug của bài viết |
| `{{category}}` | Category của bài viết |
| `{{date}}` | Ngày đăng |
| `{{author}}` | Tác giả |
| `{{hero_image}}` | Hình ảnh hero (banner) |
| `{{featured_image}}` | Hình ảnh chính |
| `{{content}}` | Nội dung HTML |
| `{{excerpt}}` | Mô tả ngắn |
| `{{breadcrumb_category}}` | Tên category (breadcrumb) |
| `{{breadcrumb_category_url}}` | URL category (breadcrumb) |
| `{{breadcrumb_current}}` | Tiêu đề trang hiện tại |
| `{{related_items}}` | HTML các bài viết liên quan |

## Categories hỗ trợ

- `tin-tuyen-sinh` - Tin tức tuyển sinh
- `su-kien` - Sự kiện
- `dai-hoc` - Chương trình đại học
- `thac-si` - Chương trình thạc sĩ
- `tien-si` - Chương trình tiến sĩ

## Tùy chỉnh

### Thay đổi base URL

Mở `build/build.js` và sửa:

```javascript
const CONFIG = {
    baseUrl: 'https://hub.edu.vn',  // Thay đổi ở đây
    // ...
};
```

### Thêm category mới

1. Thêm vào `CONFIG.categories` trong `build.js`
2. Tạo file template `build/templates/{category}.html`
3. Tạo file data `build/data/{category}.json`
4. Cập nhật `getCategoryName()` và `getCategoryUrl()`

## SEO Features

- ✅ Title tag động
- ✅ Meta description
- ✅ Meta keywords
- ✅ Canonical URL
- ✅ Open Graph tags
- ✅ Robots meta
- ✅ Sitemap.xml tự động
- ✅ Clean URLs (folder-based)
