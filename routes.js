/**
 * Route Configuration Data
 * Defines navigation structure and parent-child relationships
 *
 * Khi thêm trang mới, chỉ cần thêm path vào mảng children của parent tương ứng
 */

const ROUTES_CONFIG = [
    {
        path: '/',
        label: 'Trang Chủ',
        children: []
    },
    {
        path: '/gioi-thieu/',
        label: 'Lý Do Chọn HUB',
        children: [
            '/lich-su/',
            '/co-so-vat-chat/'
        ]
    },
    {
        path: '/dai-hoc/',
        label: 'Chương Trình Đào Tạo',
        children: [
            '/dai-hoc-nganh-hoc/',
            '/thac-si/',
            '/thac-si-nganh-hoc/',
            '/tien-si/',
            '/tien-si-nganh-hoc/',
            '/quoc-te/'
        ]
    },
    {
        path: '/doi-song-sinh-vien/',
        label: 'Đời Sống Sinh Viên',
        children: [
            '/doi-song-sinh-vien-chi-tiet/'
        ]
    },
    {
        path: '/tin-tuyen-sinh/',
        label: 'Tin Tức Tuyển Sinh',
        children: [
            '/tuyen-sinh-chi-tiet/',
            '/dktv-tuyen-sinh/'
        ]
    },
    {
        path: '/danh-muc-thong-bao/',
        label: 'Thông Báo',
        children: []
    },
    {
        path: '/su-kien/',
        label: 'Sự Kiện',
        children: [
            '/su-kien-chi-tiet/'
        ]
    }
];
