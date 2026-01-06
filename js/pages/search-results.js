document.addEventListener("DOMContentLoaded", function () {
    // Mock Data
    const searchResults = [
        {
            title: "Ngành quản trị kinh doanh tại HUB - Tuyển sinh HUB?",
            url: "https://hub.edu.vn/dao-tao/dai-hoc/dai-hoc-chinh-quy-chuan/nganh-quan-tri-kinh-doanh",
            date: "8 thg 7, 2025",
            description:
                "Lorem Ipsum chỉ đơn giản là một đoạn văn bản giả, được dùng vào việc trình bày và dàn trang phục vụ cho in ấn. Lorem Ipsum đã được sử dụng như một văn bản chuẩn cho ngành công nghiệp in ấn từ những năm 1500",
        },
        {
            title: "Ngành Quản trị kinh doanh chất lượng cao (Chương trình tiếng Anh bán phần)",
            url: "https://hub.edu.vn/dao-tao/dai-hoc/dai-hoc-chinh-quy-chuan/nganh-quan-tri-kinh-doanh-clc",
            date: "8 thg 7, 2025",
            description:
                "Lorem Ipsum chỉ đơn giản là một đoạn văn bản giả, được dùng vào việc trình bày và dàn trang phục vụ cho in ấn. Lorem Ipsum đã được sử dụng như một văn bản chuẩn cho ngành công nghiệp in ấn từ những năm 1500",
        },
        {
            title: "Quản trị kinh doanh - Trường Đại học Ngân hàng TP.HCM",
            url: "https://hub.edu.vn/dao-tao/dai-hoc/dai-hoc-chinh-quy-chuan/quan-tri-kinh-doanh",
            date: "8 thg 7, 2025",
            description:
                "Lorem Ipsum chỉ đơn giản là một đoạn văn bản giả, được dùng vào việc trình bày và dàn trang phục vụ cho in ấn. Lorem Ipsum đã được sử dụng như một văn bản chuẩn cho ngành công nghiệp in ấn từ những năm 1500",
        },
        {
            title: "Bộ môn quản trị kinh doanh",
            url: "https://hub.edu.vn/dao-tao/dai-hoc/dai-hoc-chinh-quy-chuan/bo-mon-quan-tri-kinh-doanh",
            date: "8 thg 7, 2025",
            description:
                "Lorem Ipsum chỉ đơn giản là một đoạn văn bản giả, được dùng vào việc trình bày và dàn trang phục vụ cho in ấn. Lorem Ipsum đã được sử dụng như một văn bản chuẩn cho ngành công nghiệp in ấn từ những năm 1500",
        },
        {
            title: "Ngành quản trị kinh doanh tại HUB - Tuyển sinh HUB?",
            url: "https://hub.edu.vn/dao-tao/dai-hoc/dai-hoc-chinh-quy-chuan/nganh-quan-tri-kinh-doanh-2",
            date: "8 thg 7, 2025",
            description:
                "Lorem Ipsum chỉ đơn giản là một đoạn văn bản giả, được dùng vào việc trình bày và dàn trang phục vụ cho in ấn. Lorem Ipsum đã được sử dụng như một văn bản chuẩn cho ngành công nghiệp in ấn từ những năm 1500",
        },
        {
            title: "Ngành quản trị kinh doanh tại HUB - Tuyển sinh HUB?",
            url: "https://hub.edu.vn/dao-tao/dai-hoc/dai-hoc-chinh-quy-chuan/nganh-quan-tri-kinh-doanh-3",
            date: "8 thg 7, 2025",
            description:
                "Lorem Ipsum chỉ đơn giản là một đoạn văn bản giả, được dùng vào việc trình bày và dàn trang phục vụ cho in ấn. Lorem Ipsum đã được sử dụng như một văn bản chuẩn cho ngành công nghiệp in ấn từ những năm 1500",
        },
        // Add more items to test pagination
        {
            title: "Thông tin tuyển sinh 2025",
            url: "https://hub.edu.vn/tuyen-sinh/thong-tin-tuyen-sinh-2025",
            date: "15 thg 8, 2025",
            description:
                "Thông tin chi tiết về quy chế tuyển sinh đại học chính quy năm 2025. Các phương thức xét tuyển và chỉ tiêu cho từng ngành đào tạo.",
        },
        {
            title: "Chương trình đào tạo Thạc sĩ",
            url: "https://hub.edu.vn/dao-tao/thac-si",
            date: "20 thg 8, 2025",
            description:
                "Chương trình đào tạo Thạc sĩ tại HUB được thiết kế nhằm cung cấp kiến thức chuyên sâu và kỹ năng nghiên cứu cho học viên.",
        },
        {
            title: "Hoạt động sinh viên HUB",
            url: "https://hub.edu.vn/doi-song-sinh-vien/hoat-dong",
            date: "25 thg 8, 2025",
            description:
                "Tổng hợp các hoạt động sôi nổi của sinh viên HUB: CLB, đội nhóm, các cuộc thi học thuật và văn nghệ thể thao.",
        },
        {
            title: "Hợp tác quốc tế",
            url: "https://hub.edu.vn/hop-tac-quoc-te",
            date: "1 thg 9, 2025",
            description:
                "HUB mở rộng quan hệ hợp tác với nhiều trường đại học và tổ chức giáo dục uy tín trên thế giới, mang lại cơ hội trao đổi cho sinh viên.",
        },
        {
            title: "Cơ sở vật chất",
            url: "https://hub.edu.vn/gioi-thieu/co-so-vat-chat",
            date: "5 thg 9, 2025",
            description:
                "Hệ thống cơ sở vật chất hiện đại phục vụ giảng dạy, học tập và nghiên cứu khoa học tại Trường Đại học Ngân hàng TP.HCM.",
        },
        {
            title: "Thư viện HUB",
            url: "https://library.hub.edu.vn",
            date: "10 thg 9, 2025",
            description:
                "Thư viện HUB với nguồn tài liệu phong phú, không gian học tập hiện đại, là nơi lý tưởng cho sinh viên tự học và nghiên cứu.",
        },
    ];

    const resultsContainer = document.getElementById("searchResultsList");
    const paginationContainer = document.getElementById("pagination");
    const resultCountElement = document.getElementById("resultCount");
    const searchTimeElement = document.getElementById("searchTime");

    // Update result count (mock)
    if (resultCountElement) {
        resultCountElement.textContent = `Khoảng ${searchResults.length} kết quả`;
    }
    if (searchTimeElement) {
        searchTimeElement.textContent = "(0.20 giây)";
    }

    // Initialize Pagination
    if (searchResults.length === 0) {
        if (resultsContainer) {
            resultsContainer.innerHTML =
                '<div class="text-center py-5"><p class="mb-0 text-muted">Không tìm thấy kết quả nào phù hợp.</p></div>';
        }
        if (paginationContainer) {
            paginationContainer.style.display = "none";
        }
    } else if (
        window.createPagination &&
        resultsContainer &&
        paginationContainer
    ) {
        // Inject base pagination structure
        paginationContainer.innerHTML = `
        <button class="pagination__button pagination__button--prev" aria-label="Trang trước">
            <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.5 15L1.5 8L8.5 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
        <button class="pagination__button pagination__button--next" aria-label="Trang sau">
            <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 1L8.5 8L1.5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    `;

        const paginator = window.createPagination({
            items: searchResults,
            paginationNav: paginationContainer,
            itemsPerPage: 5, // Show 5 items per page as per image
            scrollTarget: document.querySelector(".search-filter"),
            scrollOffset: 100,
            showOnMobile: true,
            selectors: {
                prevBtn: ".pagination__button--prev",
                nextBtn: ".pagination__button--next",
                pageItem:
                    ".pagination__button:not(.pagination__button--prev):not(.pagination__button--next)",
            },
            classes: {
                active: "pagination__button--active",
            },
            // Custom page number button creation
            createPageElement: (pageNum, isActive) => {
                const btn = document.createElement("button");
                btn.className = `pagination__button ${
                    isActive ? "pagination__button--active" : ""
                }`;
                btn.textContent = pageNum;
                return btn;
            },
            // Render search results
            onPageChange: (visibleItems) => {
                resultsContainer.innerHTML = "";
                visibleItems.forEach((item) => {
                    const el = document.createElement("div");
                    el.className = "search-result-item";
                    el.innerHTML = `
            <div class="search-result-item__header">
                <img src="/assets/svg/logo.svg" alt="HUB Logo" class="search-result-item__logo" width="24" height="24">
                <div class="search-result-item__site-info">
                    <span class="search-result-item__site-name">Trường Đại Học Ngân Hàng TPHCM</span>
                    <a href="${item.url}" class="search-result-item__url">${item.url}</a>
                </div>
            </div>
            <h3 class="search-result-item__title">
                <a href="${item.url}">${item.title}</a>
            </h3>
            <div class="search-result-item__meta">
                <span class="search-result-item__date">${item.date}</span>
                <span class="search-result-item__separator">-</span>
                <p class="search-result-item__desc">${item.description}</p>
            </div>
          `;
                    resultsContainer.appendChild(el);
                });
            },
        });
    }
});
