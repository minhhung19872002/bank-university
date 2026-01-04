// Hardcoded main navbar structure (edit here to change menu)
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
            { label: "Đại Học Chính Quy Chuẩn", path: "/dai-hoc/" },
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
            { label: "Đăng ký tư vấn tuyển sinh", path: "/dktv-tuyen-sinh/" },
        ],
    },
    {
        label: "Thông Báo",
        path: "/danh-muc-thong-bao/",
        icon: "/assets/svg/notify.svg",
    },
    { label: "Sự Kiện", path: "/su-kien/", icon: "/assets/svg/map.svg" },
];

// Expose for other modules
window.NAVBAR_MENU = NAVBAR_MENU;

// Helper functions
function normalizePath(p) {
    if (!p) return "/";
    // strip query/hash
    let u = p.split(/[?#]/)[0];
    if (!u.endsWith("/")) u += "/";
    return u;
}

function isPathActive(path, currentPath) {
    const normPath = normalizePath(path);
    if (normPath === currentPath) return true;

    if (typeof ROUTES_CONFIG !== "undefined") {
        const config = ROUTES_CONFIG.find(
            (r) => normalizePath(r.path) === normPath
        );
        if (config && config.children) {
            return config.children.some(
                (child) => normalizePath(child) === currentPath
            );
        }
    }
    return false;
}

// Helper to resolve which children should be visually active
// Resolves conflict when a parent path is also present as a child item
function getActiveChildPaths(children, currentPath) {
    // 1. Find all potentially active children
    const activeChildren = children.filter((child) =>
        isPathActive(child.path, currentPath)
    );

    // 2. Filter out those that are ancestors of others in the list
    const finalActivePaths = activeChildren
        .filter((childA) => {
            // Check if childA is an ancestor of any other childB in the active list
            const isAncestorOfAnother = activeChildren.some((childB) => {
                if (childA === childB) return false;
                // If childA is active for childB's path, then childA is an ancestor
                // (e.g. /dai-hoc/ is active for /thac-si/)
                return isPathActive(childA.path, normalizePath(childB.path));
            });
            return !isAncestorOfAnother;
        })
        .map((c) => normalizePath(c.path));

    return finalActivePaths;
}

function renderMobileNavbar(menu) {
    const mobileList = document.querySelector(".mobile-nav__list");
    if (!mobileList) return;
    mobileList.innerHTML = ""; // Clear existing

    const currentPath =
        typeof location !== "undefined" && location.pathname
            ? normalizePath(location.pathname)
            : "/";

    menu.forEach((item) => {
        const li = document.createElement("li");
        li.className = "mobile-nav__item";

        // Wrapper for flex layout
        const wrapper = document.createElement("div");
        wrapper.className = "d-flex align-items-center justify-content-between";

        // Check if parent is active
        const parentActive =
            isPathActive(item.path, currentPath) ||
            (item.children &&
                item.children.some((c) => isPathActive(c.path, currentPath)));

        // Link
        const link = document.createElement("a");
        link.className = `mobile-nav__link flex-grow-1${
            parentActive ? " mobile-nav__link--active" : ""
        }`;
        link.href = item.path;

        // Icon
        if (item.icon) {
            const img = document.createElement("img");
            img.src = item.icon;
            img.className = "mobile-nav__icon";
            img.width = 24;
            img.height = 24;
            link.appendChild(img);
        }

        const span = document.createElement("span");
        span.textContent = item.label;
        link.appendChild(span);

        wrapper.appendChild(link);

        // Submenu
        if (item.children && item.children.length > 0) {
            // Check if any child is active to auto-open
            const hasActiveChild = item.children.some((c) =>
                isPathActive(c.path, currentPath)
            );

            // Get strictly active children (handling duplicates)
            const activeChildPaths = getActiveChildPaths(
                item.children,
                currentPath
            );

            // Add toggle button
            const toggle = document.createElement("button");
            toggle.className = `mobile-nav__toggle${
                hasActiveChild ? " open" : ""
            }`;
            toggle.type = "button";
            toggle.ariaLabel = "Toggle submenu";
            toggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

            wrapper.appendChild(toggle);
            li.appendChild(wrapper);

            // Submenu list
            const ulSub = document.createElement("ul");
            ulSub.className = `mobile-nav__submenu${
                hasActiveChild ? " open" : ""
            }`;

            item.children.forEach((child) => {
                const liSub = document.createElement("li");
                liSub.className = "mobile-nav__submenu-item";
                // Use strict check
                const childActive = activeChildPaths.includes(
                    normalizePath(child.path)
                );
                liSub.innerHTML = `<a class="mobile-nav__submenu-link${
                    childActive ? " active" : ""
                }" href="${child.path}">${child.label}</a>`;
                ulSub.appendChild(liSub);
            });

            li.appendChild(ulSub);

            // Event listener for toggle
            toggle.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggle.classList.toggle("open");
                ulSub.classList.toggle("open");
            });
        } else {
            li.appendChild(wrapper);
        }

        mobileList.appendChild(li);
    });
}

function renderNavbar(menu) {
    const ul = document.getElementById("main-navbar");
    if (!ul) return;
    ul.innerHTML = "";

    const currentPath =
        typeof location !== "undefined" && location.pathname
            ? normalizePath(location.pathname)
            : "/";

    menu.forEach((item) => {
        if (!item.children) {
            // Simple nav item
            const li = document.createElement("li");
            li.className = "nav-item";
            const isActive = isPathActive(item.path, currentPath);
            li.innerHTML = `<a class="nav-link${
                isActive ? " active" : ""
            }" href="${item.path}"${isActive ? ' aria-current="page"' : ""}>${
                item.label
            }</a>`;
            ul.appendChild(li);
        } else {
            // Dropdown
            const li = document.createElement("li");
            li.className = "nav-item dropdown nav-dropdown-hoverfix";
            const wrapper = document.createElement("div");
            wrapper.className = "nav-link-wrapper";
            // Parent is active if its path is active or any child path is active
            const parentActive =
                isPathActive(item.path, currentPath) ||
                item.children.some((c) => isPathActive(c.path, currentPath));

            wrapper.innerHTML = `<a class="nav-link${
                parentActive ? " active" : ""
            }" href="${item.path}" id="nav-${item.path.replace(
                /\W/g,
                ""
            )}" role="button" aria-expanded="false"${
                parentActive ? ' aria-current="page"' : ""
            }>${item.label}</a><span class="nav-hover-fix"></span>`;
            li.appendChild(wrapper);
            const ulDropdown = document.createElement("ul");
            ulDropdown.className = "dropdown-menu";
            ulDropdown.setAttribute(
                "aria-labelledby",
                `nav-${item.path.replace(/\W/g, "")}`
            );
            const activeChildPaths = getActiveChildPaths(
                item.children,
                currentPath
            );
            item.children.forEach((child) => {
                const liChild = document.createElement("li");
                const childActive = activeChildPaths.includes(
                    normalizePath(child.path)
                );
                liChild.innerHTML = `<a class="dropdown-item${
                    childActive ? " active" : ""
                }" href="${child.path}"${
                    childActive ? ' aria-current="page"' : ""
                }>${child.label}</a>`;
                ulDropdown.appendChild(liChild);
            });
            li.appendChild(ulDropdown);
            ul.appendChild(li);
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    renderNavbar(NAVBAR_MENU);
    renderMobileNavbar(NAVBAR_MENU);

    // Dropdown hover giữ menu khi rê vào nav-link hoặc dropdown-menu (desktop)
    function attachHoverHandlers() {
        document
            .querySelectorAll(".navbar-nav .dropdown")
            .forEach(function (dropdown) {
                if (dropdown.dataset.hoverBound === "true") return;
                dropdown.dataset.hoverBound = "true";
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
                const startShow = () => {
                    clearTimeout(timer);
                    showMenu();
                };
                const startHide = () => {
                    timer = setTimeout(hideMenu, 120);
                };

                const wrapper = dropdown.querySelector(".nav-link-wrapper");
                const trigger = wrapper
                    ? wrapper.querySelector(".nav-link")
                    : dropdown.querySelector(".nav-link");
                const menu = dropdown.querySelector(".dropdown-menu");

                const wrappedElements = [dropdown, wrapper, trigger, menu];
                wrappedElements.forEach((el) => {
                    if (!el) return;
                    el.addEventListener("mouseenter", function () {
                        startShow();
                    });
                    el.addEventListener("mouseleave", function () {
                        startHide();
                    });
                });
            });
    }

    if (window.innerWidth >= 992) {
        attachHoverHandlers();
    }

    // Re-attach handlers when resizing into desktop breakpoint
    let lastIsDesktop = window.innerWidth >= 992;
    window.addEventListener("resize", function () {
        const isDesktop = window.innerWidth >= 992;
        if (isDesktop && !lastIsDesktop) attachHoverHandlers();
        lastIsDesktop = isDesktop;
    });
});
