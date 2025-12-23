// Load HTML includes (footer, registration-card, etc.) - header is inlined for SEO
async function loadIncludes() {
    const includeElements = document.querySelectorAll('[data-include]');
    const promises = Array.from(includeElements).map(async (el) => {
        const file = el.getAttribute('data-include');
        try {
            const response = await fetch(file);
            if (response.ok) {
                el.innerHTML = await response.text();
            }
        } catch (error) {
            console.error('Failed to load include:', file, error);
        }
    });
    await Promise.all(promises);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async function () {
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
});

// Initialize navigation active states
function initNavigation() {
    // Set initial active state based on current path
    setActiveNavByPath();

    // Handle hash change (when clicking nav links)
    window.addEventListener('hashchange', setActiveNavByPath);
}

// Set active nav based on current path using Router utility
function setActiveNavByPath() {
    if (typeof Router === 'undefined') {
        console.warn('Router not loaded. Make sure to include js/utils/router.js');
        return;
    }

    const currentPath = window.location.pathname;
    const activeNavText = Router.getActiveNavLabel(currentPath);

    if (!activeNavText) return;

    // Update desktop nav
    const navLinks = document.querySelectorAll('.navbar .nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active', 'nav-link--active');
        if (link.textContent.trim() === activeNavText) {
            link.classList.add('active');
        }
    });

    // Update mobile nav
    const mobileNavLinks = document.querySelectorAll('.mobile-nav__link');
    mobileNavLinks.forEach(link => {
        link.classList.remove('mobile-nav__link--active');
        const linkText = link.querySelector('span');
        if (linkText && linkText.textContent.trim().toLowerCase() === activeNavText.toLowerCase()) {
            link.classList.add('mobile-nav__link--active');
        }
    });
}

// Initialize FAQ Accordion
function initFAQAccordion() {
    const faqHeaders = document.querySelectorAll('.faq-item__header');

    faqHeaders.forEach(header => {
        header.addEventListener('click', function () {
            const faqItem = this.closest('.faq-item');
            const isActive = faqItem.classList.contains('faq-item--active');

            // Close other FAQ items (single-open accordion)
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('faq-item--active');
                    const otherHeader = item.querySelector('.faq-item__header');
                    if (otherHeader) {
                        otherHeader.setAttribute('aria-expanded', 'false');
                    }
                }
            });

            // Toggle current item
            if (isActive) {
                faqItem.classList.remove('faq-item--active');
                this.setAttribute('aria-expanded', 'false');
            } else {
                faqItem.classList.add('faq-item--active');
                this.setAttribute('aria-expanded', 'true');
            }
        });

        // Add keyboard support (Enter/Space key)
        header.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Mobile sidebar navigation
function initMobileNav() {
    function setupMobileNav() {
        const mobileNav = document.querySelector('[data-mobile-nav]');
        const toggleBtn = document.querySelector('[data-nav-toggle]');
        const closeBtn = document.querySelector('[data-nav-close]');
        const overlay = document.querySelector('[data-mobile-nav-overlay]');
        const links = mobileNav
            ? mobileNav.querySelectorAll('.mobile-nav__link')
            : [];

        if (!mobileNav || !toggleBtn) return false;

        const openNav = () => {
            mobileNav.classList.add('mobile-nav--open');
            mobileNav.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };

        const closeNav = () => {
            mobileNav.classList.remove('mobile-nav--open');
            mobileNav.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        toggleBtn.addEventListener('click', openNav);

        if (closeBtn) {
            closeBtn.addEventListener('click', closeNav);
        }

        if (overlay) {
            overlay.addEventListener('click', closeNav);
        }

        links.forEach(link => {
            link.addEventListener('click', () => {
                closeNav();
            });
        });

        return true;
    }

    // Try to setup immediately
    if (setupMobileNav()) return;

    // If header not loaded yet, observe for it
    const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector('[data-nav-toggle]')) {
            setupMobileNav();
            obs.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Sticky header - add shadow on scroll
function initStickyHeader() {
    function setupStickyHeader() {
        const header = document.querySelector('[data-header]');
        if (!header) return false;

        const scrollThreshold = 10;

        function handleScroll() {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return true;
    }

    // Try to setup immediately
    if (setupStickyHeader()) return;

    // If header not loaded yet, observe for it
    const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector('[data-header]')) {
            setupStickyHeader();
            obs.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Programs section - tabs control card groups (desktop) and rows (mobile)
function initProgramsTabs() {
    const tabs = document.querySelectorAll('.programs-tabs__item');
    if (!tabs.length) return;

    const groups = document.querySelectorAll('.programs-group');
    const rows = document.querySelectorAll(
        '#programs .row.g-3'
    );

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // update active tab state
            tabs.forEach(t => {
                t.classList.remove('programs-tabs__item--active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('programs-tabs__item--active');
            tab.setAttribute('aria-selected', 'true');

            const targetId = tab.getAttribute('data-program-target');

            // desktop / tablet: show matching group
            if (targetId && groups.length) {
                groups.forEach(group => {
                    if (group.id === targetId) {
                        group.classList.add('programs-group--active');
                    } else {
                        group.classList.remove('programs-group--active');
                    }
                });
            } else if (rows.length) {
                // fallback: if no groups, just toggle rows for mobile usage
                rows.forEach((row, index) => {
                    if (index === 0) {
                        row.classList.remove('d-none');
                    } else {
                        row.classList.add('d-none');
                    }
                });
            }
        });
    });
}

// Programs section - mobile accordion (separate from desktop tabs)
function initProgramsAccordionMobile() {
    if (window.innerWidth > 575) return;

    const accordion = document.querySelector('.programs-accordion');
    if (!accordion) return;

    const headers = accordion.querySelectorAll('.programs-accordion__header');

    headers.forEach(header => {
        // Panel luôn nằm ngay sau header tương ứng
        const panel = header.nextElementSibling;
        if (!panel || !panel.classList.contains('programs-accordion__panel')) return;

        header.addEventListener('click', () => {
            const isActive = header.classList.contains('programs-accordion__header--active');

            // Đóng tất cả
            accordion.querySelectorAll('.programs-accordion__header').forEach(h => {
                h.classList.remove('programs-accordion__header--active');
            });
            accordion.querySelectorAll('.programs-accordion__panel').forEach(p => {
                p.classList.remove('programs-accordion__panel--open');
            });

            // Nếu header đang đóng thì mở nó (single-open accordion)
            if (!isActive) {
                header.classList.add('programs-accordion__header--active');
                panel.classList.add('programs-accordion__panel--open');
            }
        });
    });

    // Không tự động mở item nào, để user tự click
}

// Filter buttons and pagination for program cards
function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-button[data-filter]');
    const programGrid = document.querySelector('[data-program-grid]');
    const paginationNav = document.querySelector('.programs-section .pagination');

    if (!programGrid) return;

    const allCards = Array.from(programGrid.querySelectorAll('[data-category]'));
    const CARDS_PER_PAGE = 9;
    let currentPage = 1;
    let filteredCards = allCards;

    // Update pagination UI
    function updatePagination() {
        if (!paginationNav) return;

        const totalPages = Math.ceil(filteredCards.length / CARDS_PER_PAGE);

        // Hide pagination if 9 or fewer cards
        if (filteredCards.length <= CARDS_PER_PAGE) {
            paginationNav.classList.add('d-none');
            paginationNav.classList.remove('d-sm-flex');
            return;
        }

        paginationNav.classList.remove('d-none');
        paginationNav.classList.add('d-sm-flex');

        // Clear existing page buttons (keep prev/next)
        const prevBtn = paginationNav.querySelector('.pagination__button--prev');
        const nextBtn = paginationNav.querySelector('.pagination__button--next');
        const existingPageBtns = paginationNav.querySelectorAll('.pagination__button:not(.pagination__button--prev):not(.pagination__button--next)');
        existingPageBtns.forEach(btn => btn.remove());

        // Create page buttons
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'pagination__button' + (i === currentPage ? ' pagination__button--active' : '');
            pageBtn.type = 'button';
            pageBtn.setAttribute('aria-label', `Trang ${i}`);
            if (i === currentPage) pageBtn.setAttribute('aria-current', 'page');
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => goToPage(i));
            nextBtn.before(pageBtn);
        }

        // Update prev/next state
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }

    // Show cards for current page
    function showCardsForPage() {
        const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
        const endIndex = startIndex + CARDS_PER_PAGE;

        // Hide all cards first
        allCards.forEach(card => card.style.display = 'none');

        // Show only filtered cards for current page
        filteredCards.forEach((card, index) => {
            if (index >= startIndex && index < endIndex) {
                card.style.display = '';
            }
        });

        updatePagination();
    }

    // Go to specific page
    function goToPage(page) {
        currentPage = page;
        showCardsForPage();
        // Scroll to top of programs section
        const programsSection = document.getElementById('programs');
        if (programsSection) {
            programsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Filter cards by category
    function filterByCategory(category) {
        filteredCards = allCards.filter(card => card.getAttribute('data-category') === category);
        currentPage = 1;
        showCardsForPage();
    }

    // Initialize pagination buttons
    if (paginationNav) {
        const prevBtn = paginationNav.querySelector('.pagination__button--prev');
        const nextBtn = paginationNav.querySelector('.pagination__button--next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentPage > 1) goToPage(currentPage - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(filteredCards.length / CARDS_PER_PAGE);
                if (currentPage < totalPages) goToPage(currentPage + 1);
            });
        }
    }

    // Initialize filter buttons
    if (filterButtons.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('filter-button--active'));
                button.classList.add('filter-button--active');

                // Filter cards
                const selectedFilter = button.getAttribute('data-filter');
                filterByCategory(selectedFilter);
            });
        });
    }

    // Initial display
    showCardsForPage();
}

// Event countdown timer
// Usage: <div class="event-countdown" data-target-date="2025-10-01">
// Formats: "2025-10-01", "2025-10-01T09:00:00", "October 1, 2025"
// When countdown reaches 0, it stops and displays 0 - user needs to update data-target-date
function initEventCountdown() {
    const countdownContainers = document.querySelectorAll('.event-countdown');
    if (!countdownContainers.length) return;

    countdownContainers.forEach(container => {
        setupCountdown(container);
    });

    function setupCountdown(countdownContainer) {
        // Get countdown value elements
        const daysEl = countdownContainer.querySelector('.event-countdown__item:nth-child(1) .event-countdown__value');
        const hoursEl = countdownContainer.querySelector('.event-countdown__item:nth-child(2) .event-countdown__value');
        const minsEl = countdownContainer.querySelector('.event-countdown__item:nth-child(3) .event-countdown__value');
        const secsEl = countdownContainer.querySelector('.event-countdown__item:nth-child(4) .event-countdown__value');

        if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

        // Parse target date from data attribute
        const dateAttr = countdownContainer.getAttribute('data-target-date');
        if (!dateAttr) {
            // No date set - show zeros
            daysEl.textContent = '0';
            hoursEl.textContent = '00';
            minsEl.textContent = '00';
            secsEl.textContent = '00';
            return;
        }

        const targetDate = new Date(dateAttr);
        if (isNaN(targetDate.getTime())) {
            // Invalid date - show zeros
            daysEl.textContent = '0';
            hoursEl.textContent = '00';
            minsEl.textContent = '00';
            secsEl.textContent = '00';
            return;
        }

        let intervalId = null;

        // Update countdown every second
        function updateCountdown() {
            const now = new Date();
            const diff = targetDate - now;

            // If countdown finished, show zeros and stop
            if (diff <= 0) {
                daysEl.textContent = '0';
                hoursEl.textContent = '00';
                minsEl.textContent = '00';
                secsEl.textContent = '00';
                if (intervalId) {
                    clearInterval(intervalId);
                    intervalId = null;
                }
                return;
            }

            // Calculate time parts
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);

            // Update DOM with padded values
            daysEl.textContent = days.toString();
            hoursEl.textContent = hours.toString().padStart(2, '0');
            minsEl.textContent = mins.toString().padStart(2, '0');
            secsEl.textContent = secs.toString().padStart(2, '0');
        }

        // Initial update
        updateCountdown();

        // Update every second
        intervalId = setInterval(updateCountdown, 1000);
    }
}
