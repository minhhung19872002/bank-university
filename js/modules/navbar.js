// Hardcoded main navbar structure (edit here to change menu)
const NAVBAR_MENU = [
    { label: "Trang Chủ", path: "/" },
    {
        label: "Lý Do Chọn HUB",
        path: "/gioi-thieu/",
        children: [
            { label: "Lịch Sử Hình Thành", path: "/lich-su/" },
            { label: "Cơ Sở Vật Chất", path: "/co-so-vat-chat/" },
        ],
    },
    {
        label: "Chương Trình Đào Tạo",
        path: "/dai-hoc/",
        children: [
            { label: "Đại Học Chính Quy Chuẩn", path: "/dai-hoc/" },
            { label: "Thạc Sĩ", path: "/thac-si/" },
            { label: "Tiến Sĩ", path: "/tien-si/" },
            { label: "Hệ Quốc Tế", path: "/quoc-te/" },
        ],
    },
    { label: "Đời Sống Sinh Viên", path: "/doi-song-sinh-vien/" },
    {
        label: "Tin Tức Tuyển Sinh",
        path: "/tin-tuyen-sinh/",
        children: [
            { label: "Đăng ký tư vấn tuyển sinh", path: "/dktv-tuyen-sinh/" },
        ],
    },
    { label: "Thông Báo", path: "/danh-muc-thong-bao/" },
    { label: "Sự Kiện", path: "/su-kien/" },
];

function renderNavbar(menu) {
    const ul = document.getElementById("main-navbar");
    if (!ul) return;
    ul.innerHTML = "";
    menu.forEach((item) => {
        if (!item.children) {
            // Simple nav item
            const li = document.createElement("li");
            li.className = "nav-item";
            li.innerHTML = `<a class="nav-link" href="${item.path}">${item.label}</a>`;
            ul.appendChild(li);
        } else {
            // Dropdown
            const li = document.createElement("li");
            li.className = "nav-item dropdown nav-dropdown-hoverfix";
            const wrapper = document.createElement("div");
            wrapper.className = "nav-link-wrapper";
            wrapper.innerHTML = `<a class="nav-link" href="${
                item.path
            }" id="nav-${item.path.replace(
                /\W/g,
                ""
            )}" role="button" aria-expanded="false">${
                item.label
            }</a><span class="nav-hover-fix"></span>`;
            li.appendChild(wrapper);
            const ulDropdown = document.createElement("ul");
            ulDropdown.className = "dropdown-menu";
            ulDropdown.setAttribute(
                "aria-labelledby",
                `nav-${item.path.replace(/\W/g, "")}`
            );
            item.children.forEach((child) => {
                const liChild = document.createElement("li");
                liChild.innerHTML = `<a class="dropdown-item" href="${child.path}">${child.label}</a>`;
                ulDropdown.appendChild(liChild);
            });
            li.appendChild(ulDropdown);
            ul.appendChild(li);
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    renderNavbar(NAVBAR_MENU);

    // Dropdown hover giữ menu khi rê vào nav-link hoặc dropdown-menu (desktop)
    if (window.innerWidth >= 992) {
        document
            .querySelectorAll(".navbar-nav .dropdown")
            .forEach(function (dropdown) {
                let timer;
                const showMenu = () => {
                    dropdown.classList.add("show");
                    const menu = dropdown.querySelector(".dropdown-menu");
                    if (menu) menu.classList.add("show");
                };
                const hideMenu = () => {
                    dropdown.classList.remove("show");
                    const menu = dropdown.querySelector(".dropdown-menu");
                    if (menu) menu.classList.remove("show");
                };
                dropdown.addEventListener("mouseenter", function () {
                    clearTimeout(timer);
                    showMenu();
                });
                dropdown.addEventListener("mouseleave", function () {
                    timer = setTimeout(hideMenu, 120);
                });
                // Đảm bảo menu con cũng giữ được hover
                const menu = dropdown.querySelector(".dropdown-menu");
                if (menu) {
                    menu.addEventListener("mouseenter", function () {
                        clearTimeout(timer);
                        showMenu();
                    });
                    menu.addEventListener("mouseleave", function () {
                        timer = setTimeout(hideMenu, 120);
                    });
                }
            });
    }
});
