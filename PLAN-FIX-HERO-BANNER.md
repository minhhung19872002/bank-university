# Plan Fix Hero Banner

## Vấn đề hiện tại

### 1. Tỉ lệ resize khó chọn hình
- Hero section đang dùng `height: calc(100vh - header)` → chiều cao thay đổi theo viewport
- `background-size: cover` + `background-position: center` → hình bị crop không kiểm soát
- Tỉ lệ hình không cố định → khó thiết kế/chọn hình phù hợp

### 2. Mobile bị mất góc hình
- Khi responsive xuống mobile, hero height giảm
- `background-size: cover` crop hình để fill → mất các góc quan trọng
- Không có `background-position` riêng cho mobile

---

## Giải pháp đề xuất

### Option A: Fixed Aspect Ratio (Khuyến nghị)
Cố định tỉ lệ khung hình cho banner để dễ thiết kế

**Ưu điểm:**
- Tỉ lệ cố định → dễ chuẩn bị hình
- Predictable layout
- Consistent across devices

**Tỉ lệ đề xuất:**
- Desktop: 16:9 hoặc 21:9 (cinematic)
- Mobile: 4:3 hoặc 1:1 (vuông hơn để giữ nội dung)

### Option B: Art Direction (Picture/srcset)
Dùng nhiều phiên bản hình khác nhau cho từng breakpoint

**Ưu điểm:**
- Kiểm soát hoàn toàn hình ảnh hiển thị
- Tối ưu kích thước file

**Nhược điểm:**
- Cần chuẩn bị nhiều phiên bản hình
- Phức tạp hơn khi cập nhật

### Option C: Focal Point
Cho phép set điểm focus của hình, responsive sẽ crop quanh điểm đó

---

## Kế hoạch triển khai (Option A - Fixed Aspect Ratio)

### Phase 1: CSS Changes

#### 1.1 Thêm aspect-ratio cho hero
```css
/* Desktop - 21:9 aspect ratio */
.hero-section {
  position: relative;
  width: 100%;
  aspect-ratio: 21 / 9;
  max-height: 80vh; /* Giới hạn max để không quá cao */
  min-height: 400px;
  overflow: hidden;
}

/* Tablet */
@media (max-width: 991.98px) {
  .hero-section {
    aspect-ratio: 16 / 9;
    min-height: 350px;
  }
}

/* Mobile */
@media (max-width: 575.98px) {
  .hero-section {
    aspect-ratio: 4 / 3;
    min-height: 280px;
    max-height: 60vh;
  }
}
```

#### 1.2 Cải thiện background positioning
```css
.hero-section__bg {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

/* Mobile - focus phần trên của hình */
@media (max-width: 575.98px) {
  .hero-section__bg {
    background-position: center top;
  }
}
```

#### 1.3 Thêm data attribute để custom focal point (optional)
```css
/* Cho phép override qua inline style hoặc data attribute */
.hero-section__bg[data-focus="top"] {
  background-position: center top;
}
.hero-section__bg[data-focus="bottom"] {
  background-position: center bottom;
}
.hero-section__bg[data-focus="left"] {
  background-position: left center;
}
.hero-section__bg[data-focus="right"] {
  background-position: right center;
}
```

### Phase 2: Update HTML (nếu cần)
- Thêm data attribute cho focal point nếu implement option đó
- Không cần thay đổi structure

### Phase 3: Image Guidelines
Tạo document hướng dẫn:
- Desktop: Chuẩn bị hình 2100x900px (21:9)
- Mobile: Nội dung quan trọng nên nằm trong vùng safe zone 4:3 ở giữa

---

## Files cần sửa

1. `css/components/hero.css` - Hero component styles
2. `css/pages/home.css` - Home page hero specifics
3. Có thể cần update các page-specific CSS nếu có override

---

## Hình ảnh minh họa khu vực safe zone

```
┌─────────────────────────────────────────────────────────┐
│                    Desktop 21:9                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │                                                  │    │
│  │     ┌─────────────────────────────┐             │    │
│  │     │                             │             │    │
│  │     │    SAFE ZONE (4:3)         │             │    │
│  │     │    Mobile sẽ hiển thị      │             │    │
│  │     │    vùng này                │             │    │
│  │     │                             │             │    │
│  │     └─────────────────────────────┘             │    │
│  │                                                  │    │
│  └─────────────────────────────────────────────────┘    │
│              ▲ crop khi mobile                          │
└─────────────────────────────────────────────────────────┘
```

---

## Thời gian ước tính
- CSS changes: ~1-2 giờ
- Testing responsive: ~1 giờ
- Documentation: ~30 phút

---

## Câu hỏi cần xác nhận

1. **Tỉ lệ aspect ratio mong muốn:**
   - Desktop: 21:9 (cinematic) hay 16:9 (standard)?
   - Mobile: 4:3 hay 1:1?

2. **Focal point mặc định:**
   - Center (mặc định)
   - Top (để giữ phần trên của hình)
   - Custom per page?

3. **Hero banner các trang con (subpages):**
   - Giữ height cố định như hiện tại hay cũng chuyển sang aspect-ratio?
