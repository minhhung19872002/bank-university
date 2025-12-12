# HUB University - Sitemap & Navigation Links

## Menu Navigation (Header)

| Menu Item | Link | Trang |
|-----------|------|-------|
| Trang Chu | `/` | index.html |
| Ly Do Chon HUB | `/gioi-thieu.html` | Gioi thieu truong |
| Chuong Trinh Dao Tao | `/dai-hoc.html` | Dai hoc chinh quy |
| Doi Song Sinh Vien | `/doi-song-sinh-vien.html` | Doi song sinh vien |
| Tin Tuc Tuyen Sinh | `/tin-tuyen-sinh.html` | Tin tuyen sinh |
| Thong Bao | `/danh-muc-thong-bao.html` | Danh muc thong bao |
| Su Kien | `/su-kien.html` | Trang su kien |

---

## Tat Ca Cac Trang

### Trang Chinh
| Trang | URL | Mo ta |
|-------|-----|-------|
| Trang Chu | `/index.html` | Trang chu website |
| Gioi Thieu | `/gioi-thieu.html` | Gioi thieu ve HUB University |
| Lich Su Hinh Thanh | `/lich-su.html` | Lich su phat trien truong |
| Co So Vat Chat | `/co-so-vat-chat.html` | He thong co so vat chat |

### Chuong Trinh Dao Tao
| Trang | URL | Mo ta |
|-------|-----|-------|
| Dai Hoc Chinh Quy | `/dai-hoc.html` | Chuong trinh dai hoc |
| Dai Hoc - Chi Tiet Nganh | `/dai-hoc-nganh-hoc.html` | Chi tiet nganh hoc dai hoc |
| Thac Si | `/thac-si.html` | Chuong trinh thac si |
| Thac Si - Chi Tiet Nganh | `/thac-si-nganh-hoc.html` | Chi tiet nganh thac si |
| Tien Si | `/tien-si.html` | Chuong trinh tien si |
| Tien Si - Chi Tiet Nganh | `/tien-si-nganh-hoc.html` | Chi tiet nganh tien si |
| Quoc Te | `/quoc-te.html` | Vien Dao tao Quoc te |

### Tuyen Sinh
| Trang | URL | Mo ta |
|-------|-----|-------|
| Tin Tuyen Sinh | `/tin-tuyen-sinh.html` | Danh sach tin tuyen sinh |
| Chi Tiet Tuyen Sinh | `/tuyen-sinh-chi-tiet.html` | Chi tiet bai viet tuyen sinh |
| Dang Ky Tu Van | `/dktv-tuyen-sinh.html` | Form dang ky tu van |

### Thong Bao & Tin Tuc
| Trang | URL | Mo ta |
|-------|-----|-------|
| Danh Muc Thong Bao | `/danh-muc-thong-bao.html` | Cac thong bao truong |
| Su Kien | `/su-kien.html` | Danh sach su kien |
| Chi Tiet Su Kien | `/su-kien-chi-tiet.html` | Chi tiet su kien |

### Doi Song Sinh Vien
| Trang | URL | Mo ta |
|-------|-----|-------|
| Doi Song Sinh Vien | `/doi-song-sinh-vien.html` | Tong quan doi song SV |
| Chi Tiet Hoat Dong | `/doi-song-sinh-vien-chi-tiet.html` | Chi tiet hoat dong |

### Tien Ich
| Trang | URL | Mo ta |
|-------|-----|-------|
| Ket Qua Tim Kiem | `/ket-qua-tim-kiem.html` | Trang ket qua search |

---

## Cau Truc Thu Muc

```
bank-university/
├── index.html                      # Trang chu
├── gioi-thieu.html                 # Gioi thieu
├── lich-su.html                    # Lich su hinh thanh
├── co-so-vat-chat.html             # Co so vat chat
│
├── dai-hoc.html                    # Dai hoc chinh quy
├── dai-hoc-nganh-hoc.html          # Chi tiet nganh dai hoc
├── thac-si.html                    # Thac si
├── thac-si-nganh-hoc.html          # Chi tiet nganh thac si
├── tien-si.html                    # Tien si
├── tien-si-nganh-hoc.html          # Chi tiet nganh tien si
├── quoc-te.html                    # Vien Dao tao Quoc te
│
├── tin-tuyen-sinh.html             # Tin tuyen sinh
├── tuyen-sinh-chi-tiet.html        # Chi tiet tuyen sinh
├── dktv-tuyen-sinh.html            # Dang ky tu van
│
├── danh-muc-thong-bao.html         # Thong bao
├── su-kien.html                    # Su kien
├── su-kien-chi-tiet.html           # Chi tiet su kien
│
├── doi-song-sinh-vien.html         # Doi song sinh vien
├── doi-song-sinh-vien-chi-tiet.html # Chi tiet hoat dong
│
├── ket-qua-tim-kiem.html           # Tim kiem
│
├── partials/
│   ├── header.html                 # Header component
│   ├── footer.html                 # Footer component
│   ├── head.html                   # Head meta tags
│   └── registration-card.html      # Card dang ky
│
├── css/
│   ├── variables.css
│   ├── base.css
│   ├── components/
│   └── pages/
│
├── js/
│   └── main.js
│
└── assets/
    ├── images/
    └── svg/
```

---

## Ghi Chu

1. **Header Navigation**: Da cap nhat tat ca links trong `partials/header.html`
2. **Mobile Navigation**: Tuong tu desktop, da dong bo links
3. **Internal Links**: Cac link noi bo trong trang (vd: "Xem them") can kiem tra rieng

### Links Can Kiem Tra Them
- Footer links (partials/footer.html)
- Links trong noi dung tung trang
- Breadcrumb navigation (neu co)
