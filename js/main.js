// Load HTML includes (footer, registration-card, etc.) - header is inlined for SEO
async function loadIncludes() {
  const includeElements = document.querySelectorAll("[data-include]");
  const promises = Array.from(includeElements).map(async (el) => {
    const file = el.getAttribute("data-include");
    try {
      const response = await fetch(file);
      if (response.ok) {
        el.innerHTML = await response.text();
      }
    } catch (error) {
      console.error("Failed to load include:", file, error);
    }
  });
  await Promise.all(promises);
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", async function () {
  // Load remaining includes (footer, registration-card, etc.)
  await loadIncludes();

  // Replace icons in dynamically loaded content (footer, etc.)
  if (window.IconSystem) {
    window.IconSystem.replace();
  }

  // Then initialize all components
  initNavigation();
  initFAQAccordion();
  initMobileNav();
  initStickyHeader();
  initProgramsTabs();
  initProgramsAccordionMobile();
  initFilterButtons();
  initEventCountdown();
  initRegistrationForm();
  initRelatedArticlesPagination();
  initProgramSliderMobile();
  initAdmissionsNewsPagination();
  initAnnouncementsPagination();
});

// Initialize navigation active states
function initNavigation() {
  // Set initial active state based on current path
  setActiveNavByPath();

  // Handle hash change (when clicking nav links)
  window.addEventListener("hashchange", setActiveNavByPath);
}

// Set active nav based on current path using Router utility
function setActiveNavByPath() {
  if (typeof Router === "undefined") {
    console.warn("Router not loaded. Make sure to include js/utils/router.js");
    return;
  }

  const currentPath = window.location.pathname;
  // Find the active route configuration object
  const activeRoute = Router.findParentRoute(currentPath);

  if (!activeRoute) return;

  // Use path comparison instead of text
  const targetPath = activeRoute.path;

  // Helper to normalize paths for comparison (remove trailing slashes, query, hashes)
  const normalize = (p) => (p || "").split(/[?#]/)[0].replace(/\/$/, "") || "/";
  const normTarget = normalize(targetPath);

  // Update desktop nav
  const navLinks = document.querySelectorAll(".navbar .nav-link");
  navLinks.forEach((link) => {
    link.classList.remove("active", "nav-link--active");
    const href = link.getAttribute("href");
    if (normalize(href) === normTarget) {
      link.classList.add("active");
    }
  });

  // Update mobile nav
  const mobileNavLinks = document.querySelectorAll(".mobile-nav__link");
  mobileNavLinks.forEach((link) => {
    link.classList.remove("mobile-nav__link--active");
    const href = link.getAttribute("href");
    if (normalize(href) === normTarget) {
      link.classList.add("mobile-nav__link--active");
    }
  });
}

// Initialize FAQ Accordion
function initFAQAccordion() {
  const faqHeaders = document.querySelectorAll(".faq-item__header");

  faqHeaders.forEach((header) => {
    header.addEventListener("click", function () {
      const faqItem = this.closest(".faq-item");
      const isActive = faqItem.classList.contains("faq-item--active");

      // Close other FAQ items (single-open accordion)
      document.querySelectorAll(".faq-item").forEach((item) => {
        if (item !== faqItem) {
          item.classList.remove("faq-item--active");
          const otherHeader = item.querySelector(".faq-item__header");
          if (otherHeader) {
            otherHeader.setAttribute("aria-expanded", "false");
          }
        }
      });

      // Toggle current item
      if (isActive) {
        faqItem.classList.remove("faq-item--active");
        this.setAttribute("aria-expanded", "false");
      } else {
        faqItem.classList.add("faq-item--active");
        this.setAttribute("aria-expanded", "true");
      }
    });

    // Add keyboard support (Enter/Space key)
    header.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.click();
      }
    });
  });
}

// Mobile sidebar navigation
function initMobileNav() {
  function setupMobileNav() {
    const mobileNav = document.querySelector("[data-mobile-nav]");
    const toggleBtn = document.querySelector("[data-nav-toggle]");
    const closeBtn = document.querySelector("[data-nav-close]");
    const overlay = document.querySelector("[data-mobile-nav-overlay]");
    const links = mobileNav
      ? mobileNav.querySelectorAll(".mobile-nav__link")
      : [];

    if (!mobileNav || !toggleBtn) return false;

    const openNav = () => {
      mobileNav.classList.add("mobile-nav--open");
      mobileNav.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    const closeNav = () => {
      mobileNav.classList.remove("mobile-nav--open");
      mobileNav.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    toggleBtn.addEventListener("click", openNav);

    if (closeBtn) {
      closeBtn.addEventListener("click", closeNav);
    }

    if (overlay) {
      overlay.addEventListener("click", closeNav);
    }

    links.forEach((link) => {
      link.addEventListener("click", () => {
        closeNav();
      });
    });

    return true;
  }

  // Try to setup immediately
  if (setupMobileNav()) return;

  // If header not loaded yet, observe for it
  const observer = new MutationObserver((mutations, obs) => {
    if (document.querySelector("[data-nav-toggle]")) {
      setupMobileNav();
      obs.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Sticky header - add shadow on scroll
function initStickyHeader() {
  function setupStickyHeader() {
    const header = document.querySelector("[data-header]");
    if (!header) return false;

    const scrollThreshold = 10;

    function handleScroll() {
      if (window.scrollY > scrollThreshold) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return true;
  }

  // Try to setup immediately
  if (setupStickyHeader()) return;

  // If header not loaded yet, observe for it
  const observer = new MutationObserver((mutations, obs) => {
    if (document.querySelector("[data-header]")) {
      setupStickyHeader();
      obs.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Programs section - tabs control card groups (desktop) and rows (mobile)
function initProgramsTabs() {
  const tabs = document.querySelectorAll(".programs-tabs__item");
  if (!tabs.length) return;

  const groups = document.querySelectorAll(".programs-group");
  const rows = document.querySelectorAll("#programs .row.g-3");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // update active tab state
      tabs.forEach((t) => {
        t.classList.remove("programs-tabs__item--active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("programs-tabs__item--active");
      tab.setAttribute("aria-selected", "true");

      const targetId = tab.getAttribute("data-program-target");

      // desktop / tablet: show matching group
      if (targetId && groups.length) {
        groups.forEach((group) => {
          if (group.id === targetId) {
            group.classList.add("programs-group--active");
          } else {
            group.classList.remove("programs-group--active");
          }
        });
      } else if (rows.length) {
        // fallback: if no groups, just toggle rows for mobile usage
        rows.forEach((row, index) => {
          if (index === 0) {
            row.classList.remove("d-none");
          } else {
            row.classList.add("d-none");
          }
        });
      }
    });
  });
}

// Programs section - mobile accordion (separate from desktop tabs)
function initProgramsAccordionMobile() {
  const accordion = document.querySelector(".programs-accordion");
  if (!accordion) return;

  const headers = accordion.querySelectorAll(".programs-accordion__header");

  headers.forEach((header) => {
    // Panel luôn nằm ngay sau header tương ứng
    const panel = header.nextElementSibling;
    if (!panel || !panel.classList.contains("programs-accordion__panel"))
      return;

    // Remove existing listeners by cloning
    const newHeader = header.cloneNode(true);
    header.parentNode.replaceChild(newHeader, header);

    newHeader.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const currentPanel = newHeader.nextElementSibling;
      const isActive = newHeader.classList.contains(
        "programs-accordion__header--active"
      );

      // Đóng tất cả
      accordion.querySelectorAll(".programs-accordion__header").forEach((h) => {
        h.classList.remove("programs-accordion__header--active");
      });
      accordion.querySelectorAll(".programs-accordion__panel").forEach((p) => {
        p.classList.remove("programs-accordion__panel--open");
      });

      // Nếu header đang đóng thì mở nó (single-open accordion)
      if (!isActive && currentPanel) {
        newHeader.classList.add("programs-accordion__header--active");
        currentPanel.classList.add("programs-accordion__panel--open");
      }
    });
  });
}

// Mobile slider for program cards (dai-hoc page)
function initProgramSliderMobile() {
  const programGrid = document.querySelector(
    ".programs-section [data-program-grid]"
  );
  const sliderNav = document.querySelector(".program-slider-nav");

  if (!programGrid || !sliderNav || typeof initGallerySlider !== "function")
    return;

  // Function to update slider nav visibility based on visible items
  const updateSliderNavVisibility = () => {
    const visibleItems = programGrid.querySelectorAll(
      '.col-lg-4:not([style*="display: none"])'
    );
    sliderNav.style.display = visibleItems.length <= 1 ? "none" : "";
  };

  // Initial check
  updateSliderNavVisibility();

  // Store function globally so filter buttons can call it
  window.updateProgramSliderNav = updateSliderNavVisibility;

  // Initialize slider with gallery-slider module (snap mode for smooth swipe)
  initGallerySlider({
    gallerySelector: ".programs-section [data-program-grid]",
    prevBtnSelector: ".program-slider-nav__btn--prev",
    nextBtnSelector: ".program-slider-nav__btn--next",
    itemSelector: ".col-lg-4",
    gap: 0, // CSS handles padding
    swipeThreshold: 50,
    mode: "snap",
    disableButtons: true,
  });

  // Store all cards for mobile show/hide
  const allCards = Array.from(programGrid.querySelectorAll(".col-lg-4"));
  window.showAllProgramCards = () => {
    allCards.forEach((card) => {
      card.classList.remove("pagination-hidden");
      // Only show if matches current filter
      if (
        !card.style.display ||
        card.style.display !== "none" ||
        card.getAttribute("data-category")
      ) {
        const activeFilter = document.querySelector(
          ".filter-button--active[data-filter]"
        );
        if (activeFilter) {
          const filter = activeFilter.getAttribute("data-filter");
          if (card.getAttribute("data-category") === filter) {
            card.style.display = "";
          }
        } else {
          card.style.display = "";
        }
      }
    });
    updateSliderNavVisibility();
  };
}

// Filter buttons and pagination for program cards
function initFilterButtons() {
  const filterButtons = document.querySelectorAll(
    ".filter-button[data-filter]"
  );
  const programGrid = document.querySelector("[data-program-grid]");
  const paginationNav = document.querySelector(".programs-section .pagination");

  if (!programGrid) return;

  const allCards = Array.from(programGrid.querySelectorAll("[data-category]"));

  // Get initial filter from active button
  const activeButton = document.querySelector(
    ".filter-button--active[data-filter]"
  );
  const initialFilter = activeButton
    ? activeButton.getAttribute("data-filter")
    : null;
  let currentFilteredCards = initialFilter
    ? allCards.filter(
        (card) => card.getAttribute("data-category") === initialFilter
      )
    : allCards;

  // Hide cards not matching initial filter
  if (initialFilter) {
    allCards.forEach((card) => {
      card.style.display =
        card.getAttribute("data-category") === initialFilter ? "" : "none";
    });
  }

  // Get header height for scroll offset
  const header = document.querySelector(".header");
  const headerHeight = header ? header.offsetHeight : 120;

  // Responsive: only use pagination on sm+ screens
  const mobileQuery = window.matchMedia("(max-width: 575px)");
  let paginator = null;

  function initPagination(cards) {
    return createPagination({
      items: cards,
      paginationNav,
      itemsPerPage: 9,
      scrollTarget: document.getElementById("programs"),
      scrollOffset: headerHeight + 20,
      classes: { active: "pagination__button--active" },
      createPageElement: (pageNum, isActive) => {
        const btn = document.createElement("button");
        btn.className =
          "pagination__button" +
          (isActive ? " pagination__button--active" : "");
        btn.type = "button";
        btn.setAttribute("aria-label", `Trang ${pageNum}`);
        btn.textContent = pageNum;
        return btn;
      },
    });
  }

  function showAllFilteredCards() {
    // Show all cards matching current filter for mobile slider
    currentFilteredCards.forEach((card) => {
      card.classList.remove("pagination-hidden");
      card.style.display = "";
    });
    if (typeof window.updateProgramSliderNav === "function") {
      window.updateProgramSliderNav();
    }
  }

  function handleBreakpointChange(e) {
    if (e.matches) {
      // Mobile: show all filtered cards for slider
      showAllFilteredCards();
    } else {
      // Desktop/Tablet: enable pagination
      paginator = initPagination(currentFilteredCards);
    }
  }

  // Initial setup based on current viewport
  if (mobileQuery.matches) {
    showAllFilteredCards();
  } else {
    paginator = initPagination(currentFilteredCards);
  }

  // Listen for breakpoint changes
  mobileQuery.addEventListener("change", handleBreakpointChange);

  // Initialize filter buttons
  if (filterButtons.length) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Update active state
        filterButtons.forEach((btn) =>
          btn.classList.remove("filter-button--active")
        );
        button.classList.add("filter-button--active");

        // Filter cards and update current filtered cards
        const selectedFilter = button.getAttribute("data-filter");
        currentFilteredCards = allCards.filter(
          (card) => card.getAttribute("data-category") === selectedFilter
        );

        // Hide all cards first
        allCards.forEach((card) => (card.style.display = "none"));

        // Show filtered cards based on viewport
        if (mobileQuery.matches) {
          // Mobile: show all filtered cards for slider
          showAllFilteredCards();
        } else {
          // Desktop/Tablet: use pagination
          paginator.setItems(currentFilteredCards);
        }

        // Update slider nav visibility
        if (typeof window.updateProgramSliderNav === "function") {
          window.updateProgramSliderNav();
        }
      });
    });
  }
}

// Event countdown timer
function initEventCountdown() {
  const countdownContainers = document.querySelectorAll(".event-countdown");
  if (!countdownContainers.length) return;

  countdownContainers.forEach((container) => {
    setupCountdown(container);
  });

  function setupCountdown(countdownContainer) {
    // Get countdown value elements
    const daysEl = countdownContainer.querySelector(
      ".event-countdown__item:nth-child(1) .event-countdown__value"
    );
    const hoursEl = countdownContainer.querySelector(
      ".event-countdown__item:nth-child(2) .event-countdown__value"
    );
    const minsEl = countdownContainer.querySelector(
      ".event-countdown__item:nth-child(3) .event-countdown__value"
    );
    const secsEl = countdownContainer.querySelector(
      ".event-countdown__item:nth-child(4) .event-countdown__value"
    );

    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    // Parse target date from data attribute
    const dateAttr = countdownContainer.getAttribute("data-target-date");
    if (!dateAttr) {
      // No date set - show zeros
      daysEl.textContent = "0";
      hoursEl.textContent = "00";
      minsEl.textContent = "00";
      secsEl.textContent = "00";
      return;
    }

    const targetDate = new Date(dateAttr);
    if (isNaN(targetDate.getTime())) {
      // Invalid date - show zeros
      daysEl.textContent = "0";
      hoursEl.textContent = "00";
      minsEl.textContent = "00";
      secsEl.textContent = "00";
      return;
    }

    let intervalId = null;

    // Update countdown every second
    function updateCountdown() {
      const now = new Date();
      const diff = targetDate - now;

      // If countdown finished, show zeros and stop
      if (diff <= 0) {
        daysEl.textContent = "0";
        hoursEl.textContent = "00";
        minsEl.textContent = "00";
        secsEl.textContent = "00";
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        return;
      }

      // Calculate time parts
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      // Update DOM with padded values
      daysEl.textContent = days.toString();
      hoursEl.textContent = hours.toString().padStart(2, "0");
      minsEl.textContent = mins.toString().padStart(2, "0");
      secsEl.textContent = secs.toString().padStart(2, "0");
    }

    // Initial update
    updateCountdown();

    // Update every second
    intervalId = setInterval(updateCountdown, 1000);
  }
}

// Related articles pagination (tuyen-sinh-chi-tiet page)
function initRelatedArticlesPagination() {
  const articlesContainer = document.querySelector(".related-articles");
  const paginationNav = document.querySelector(".admissions-detail-pagination");

  if (!articlesContainer || !paginationNav) return;

  const allArticles = Array.from(
    articlesContainer.querySelectorAll(".related-article")
  );
  const allDividers = Array.from(
    articlesContainer.querySelectorAll(".related-article-divider")
  );

  // Get header height for scroll offset
  const header = document.querySelector(".header");
  const headerHeight = header ? header.offsetHeight : 120;

  // Create paginator using reusable utility
  createPagination({
    items: allArticles,
    paginationNav,
    itemsPerPage: 9,
    scrollTarget: document.querySelector(".admissions-detail-related"),
    scrollOffset: headerHeight + 20,
    onPageChange: (_visibleItems, startIndex, endIndex, items) => {
      // Hide all articles and dividers first
      items.forEach((article) => (article.style.display = "none"));
      allDividers.forEach((divider) => (divider.style.display = "none"));

      // Show articles for current page
      items.forEach((article, index) => {
        if (index >= startIndex && index < endIndex) {
          article.style.display = "";
          // Show divider after each article except the last one on the page
          if (
            allDividers[index] &&
            index < endIndex - 1 &&
            index < items.length - 1
          ) {
            allDividers[index].style.display = "";
          }
        }
      });
    },
  });
}

// Admissions news pagination (tin-tuyen-sinh page)
function initAdmissionsNewsPagination() {
  const newsContainer = document.querySelector(".news-items");
  const paginationNav = document.querySelector(
    ".admissions-news-list .pagination"
  );

  if (!newsContainer || !paginationNav) return;

  const allNewsItems = Array.from(newsContainer.querySelectorAll(".news-item"));
  const allDividers = Array.from(
    newsContainer.querySelectorAll(".news-divider")
  );

  // Get header height for scroll offset
  const header = document.querySelector(".header");
  const headerHeight = header ? header.offsetHeight : 120;

  // Create paginator using reusable utility
  createPagination({
    items: allNewsItems,
    paginationNav,
    itemsPerPage: 9,
    scrollTarget: document.querySelector(".admissions-news-list"),
    scrollOffset: headerHeight + 20, // Extra padding for visual comfort
    showOnMobile: true, // Show pagination on mobile for this page
    classes: { active: "pagination__item--active" },
    createPageElement: (pageNum, isActive) => {
      const link = document.createElement("a");
      link.href = "#";
      link.className =
        "pagination__item" + (isActive ? " pagination__item--active" : "");
      link.textContent = pageNum;
      if (isActive) link.setAttribute("aria-current", "page");
      return link;
    },
    onPageChange: (_visibleItems, startIndex, endIndex, items) => {
      // Hide all news items and dividers first
      items.forEach((item) => (item.style.display = "none"));
      allDividers.forEach((divider) => (divider.style.display = "none"));

      // Show items for current page
      items.forEach((item, index) => {
        if (index >= startIndex && index < endIndex) {
          item.style.display = "";
          // Show divider after each item except the last one on the page
          if (
            allDividers[index] &&
            index < endIndex - 1 &&
            index < items.length - 1
          ) {
            allDividers[index].style.display = "";
          }
        }
      });
    },
  });
}

// Announcements pagination (danh-muc-thong-bao page)
function initAnnouncementsPagination() {
  const announcementsSection = document.querySelector(
    ".announcements-featured"
  );
  const paginationNav = announcementsSection?.querySelector(".pagination");

  if (!announcementsSection || !paginationNav) return;

  const allCards = Array.from(
    announcementsSection.querySelectorAll(".announcement-card")
  ).map((card) => card.closest(".col-12"));

  // Get header height for scroll offset
  const header = document.querySelector(".header");
  const headerHeight = header ? header.offsetHeight : 120;

  // Create paginator using reusable utility
  createPagination({
    items: allCards,
    paginationNav,
    itemsPerPage: 10,
    scrollTarget: announcementsSection,
    scrollOffset: headerHeight + 20,
    showOnMobile: true,
    classes: { active: "pagination__item--active" },
    createPageElement: (pageNum, isActive) => {
      const link = document.createElement("a");
      link.href = "#";
      link.className =
        "pagination__item" + (isActive ? " pagination__item--active" : "");
      link.textContent = pageNum;
      if (isActive) link.setAttribute("aria-current", "page");
      return link;
    },
  });
}

// Registration form with snackbar notification
function initRegistrationForm() {
  // Create snackbar element if not exists
  let snackbar = document.getElementById("snackbar");
  if (!snackbar) {
    snackbar = document.createElement("div");
    snackbar.id = "snackbar";
    snackbar.className = "snackbar";
    snackbar.style.display = "none";
    snackbar.setAttribute("aria-hidden", "true");
    snackbar.innerHTML = `
            <span class="snackbar__icon">✓</span>
            <span class="snackbar__message">Đăng ký thành công! Chúng tôi sẽ liên hệ bạn sớm.</span>
        `;
    document.body.appendChild(snackbar);
  }

  // Show snackbar function
  function showSnackbar(message, type = "success") {
    const icon = type === "success" ? "✓" : "✕";
    snackbar.querySelector(".snackbar__icon").textContent = icon;
    snackbar.querySelector(".snackbar__message").textContent = message;
    snackbar.className = `snackbar snackbar--${type} snackbar--show`;
    snackbar.style.display = "";
    snackbar.setAttribute("aria-hidden", "false");

    // Auto hide after 4 seconds
    setTimeout(() => {
      snackbar.classList.remove("snackbar--show");
      snackbar.style.display = "none";
      snackbar.setAttribute("aria-hidden", "true");
    }, 4000);
  }

  // Wait for registration form to be loaded (it's in a partial)
  function setupForm() {
    const form = document.getElementById("registrationForm");
    if (!form) return false;

    // Prevent double initialization
    if (form.dataset.initialized) return true;
    form.dataset.initialized = "true";

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(form);

      // Manual Validation
      const fullName = form.querySelector("#fullName");
      const phone = form.querySelector("#phone");
      const email = form.querySelector("#email");
      const program = form.querySelector("#program");
      const major = form.querySelector("#major");

      // Validate Full Name
      if (!fullName || !fullName.value.trim()) {
        showSnackbar("Vui lòng nhập họ tên", "error");
        fullName?.focus();
        return;
      }

      // Validate Phone
      if (!phone || !phone.value.trim()) {
        showSnackbar("Vui lòng nhập số điện thoại", "error");
        phone?.focus();
        return;
      }
      // Simple phone regex (10-11 digits)
      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
      if (!phoneRegex.test(phone.value.trim())) {
        showSnackbar("Số điện thoại không hợp lệ", "error");
        phone?.focus();
        return;
      }

      // Validate Email
      if (!email || !email.value.trim()) {
        showSnackbar("Vui lòng nhập email", "error");
        email?.focus();
        return;
      }
      // Basic email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        showSnackbar(
          "Email không đúng định dạng (ví dụ: abc@gmail.com)",
          "error"
        );
        email?.focus();
        return;
      }

      // Validate Program
      if (!program || !program.value) {
        showSnackbar("Vui lòng chọn chương trình quan tâm", "error");
        program?.focus();
        return;
      }

      // Validate Major
      if (!major || !major.value) {
        showSnackbar("Vui lòng chọn ngành học quan tâm", "error");
        major?.focus();
        return;
      }

      // reCAPTCHA v3 verification
      const RECAPTCHA_SITE_KEY = "6LfQiUEsAAAAAGiC3h3lM8swyCEIo8cTA_DjeSD0";
      const CAPTCHA_API_URL = "https://verify-captcha-v3.vercel.app/api/verify";

      // Get submit button and show loading state
      const submitBtn = form.querySelector(".registration-form__submit");
      const setLoading = (isLoading) => {
        if (submitBtn) {
          submitBtn.classList.toggle(
            "registration-form__submit--loading",
            isLoading
          );
          submitBtn.disabled = isLoading;
        }
      };

      if (typeof grecaptcha !== "undefined") {
        setLoading(true);
        grecaptcha.ready(async function () {
          try {
            // Get reCAPTCHA token
            const token = await grecaptcha.execute(RECAPTCHA_SITE_KEY, {
              action: "submit_registration",
            });

            // Verify token with server
            const res = await fetch(CAPTCHA_API_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ recaptchaToken: token }),
            });

            const result = await res.json();

            setLoading(false);
            if (result.success) {
              // Captcha verified - submit form
              showSnackbar(
                "Đăng ký thành công! Chúng tôi sẽ liên hệ bạn sớm.",
                "success"
              );
              form.reset();
            } else {
              // Captcha failed - block spam
              showSnackbar("Xác minh thất bại. Vui lòng thử lại.", "error");
            }
          } catch (error) {
            setLoading(false);
            console.error("reCAPTCHA error:", error);
            showSnackbar("Lỗi xác minh. Vui lòng thử lại.", "error");
          }
        });
      } else {
        // reCAPTCHA not loaded - block submission
        showSnackbar("Không thể xác minh. Vui lòng tải lại trang.", "error");
      }
    });
    return true;
  }

  // Try to setup immediately
  if (setupForm()) return;

  // If form not loaded yet (partial), observe for it
  const observer = new MutationObserver((mutations, obs) => {
    if (document.getElementById("registrationForm")) {
      setupForm();
      obs.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
