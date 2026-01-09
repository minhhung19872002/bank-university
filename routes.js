/**
 * Route Configuration Data
 * Defines navigation structure and parent-child relationships
 *
 * Khi thêm trang mới, chỉ cần thêm path vào mảng children của parent tương ứng
 */

const ROUTES_CONFIG = [
    {
        path: '/',
        children: []
    },
    {
        path: '/gioi-thieu/',
        children: [
            '/lich-su/',
            '/co-so-vat-chat/'
        ]
    },
    {
        path: '/dai-hoc/',
        children: [
            '/dai-hoc-nganh-hoc/'
        ]
    },
    {
        path: '/thac-si/',
        children: [
            '/thac-si-nganh-hoc/'
        ]
    },
    {
        path: '/tien-si/',
        children: [
            '/tien-si-nganh-hoc/'
        ]
    },
    {
        path: '/quoc-te/',
        children: []
    },
    {
        path: '/doi-song-sinh-vien/',
        children: [
            '/doi-song-sinh-vien-chi-tiet/'
        ]
    },
    {
        path: '/tin-tuyen-sinh/',
        children: [
            '/tuyen-sinh-chi-tiet/',
            '/dktv-tuyen-sinh/'
        ]
    },
    {
        path: '/danh-muc-thong-bao/',
        children: [
            '/danh-muc-thong-bao-chi-tiet/'
        ]
    },
    {
        path: '/su-kien/',
        children: [
            '/su-kien-chi-tiet/'
        ]
    }
];

/**
 * Navbar Menu Configuration Data
 *
 * Khi thêm trang mới, ngoài việc thêm vào ROUTES_CONFIG
 * Nếu cần hiển thị trang đó trên menu navbar, cần thêm path tương ứng vào NAVBAR_MENU
 * Vì 2 cấu trúc có thể khác nhau, cần quản lý riêng.
 * ROUTES_CONFIG: Nhận biết trang nào là children/parent của trang nào
 * NAVBAR_MENU: Cấu trúc menu hiển thị trên giao diện
 */

const NAVBAR_MENU = [
    { label: "Trang Chủ", path: "/", icon: "/assets/svg/home.svg" },
    {
        label: "Lý Do Chọn HUB",
        path: "/gioi-thieu/",
        icon: "/assets/svg/reason.svg",
        children: [
            { label: "Lịch Sử Hình Thành", path: "/lich-su/" },
            { label: "Cơ Sở Vật Chất", path: "/co-so-vat-chat/" },
        ],
    },
    {
        label: "Chương Trình Đào Tạo",
        path: "/dai-hoc/",
        icon: "/assets/svg/buildings.svg",
        children: [
            {
                label: "Đại Học Chính Quy Chuẩn",
                path: "/dai-hoc/",
                children: [
                    {
                        label: "Khoa Tài Chínhhh",
                        path: "/tai-chinh/",
                        children: [
                                {
                                    label: "Tài chính doanh nghiệp",
                                    path: "/tai-chinh-doanh-nghiep/",
                                },
                                 {
                                    label: "Tài chính ngân hàng",
                                    path: "/tai-chinh-ngan-hang/",
                                },
                        ],
                    },
                    {
                        label: "Khoa Marketing",
                        path: "/marketing/",
                    },
                ],
            },
            { label: "Thạc Sĩ", path: "/thac-si/" },
            { label: "Tiến Sĩ", path: "/tien-si/" },
            { label: "Hệ Quốc Tế", path: "/quoc-te/" },
        ],
    },
    {
        label: "Đời Sống Sinh Viên",
        path: "/doi-song-sinh-vien/",
        icon: "/assets/svg/document.svg",
    },
    {
        label: "Tin Tức Tuyển Sinh",
        path: "/tin-tuyen-sinh/",
        icon: "/assets/svg/phone.svg",
        children: [
            {
                label: "Đăng ký tư vấn tuyển sinh",
                path: "/dktv-tuyen-sinh/",
            },
        ],
    },
    {
        label: "Thông Báo",
        path: "/danh-muc-thong-bao/",
        icon: "/assets/svg/notify.svg",
    },
    { label: "Sự Kiện", path: "/su-kien/", icon: "/assets/svg/map.svg" },
];

