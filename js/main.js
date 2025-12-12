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
document.addEventListener('DOMContentLoaded', async function() {
    // Load remaining includes (footer, registration-card, etc.)
    await loadIncludes();

    // Then initialize all components
    initNavigation();
    initFAQAccordion();
    initMobileNav();
    initStickyHeader();
    initProgramsTabs();
    initProgramsAccordionMobile();
});

// Initialize navigation active states
function initNavigation() {
    // Set initial active state based on current path
    setActiveNavByHash();

    // Handle hash change (when clicking nav links)
    window.addEventListener('hashchange', setActiveNavByHash);
}

// Set active nav based on current path
function setActiveNavByHash() {
    const navLinks = document.querySelectorAll('.navbar .nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav__link');
    const currentPath = window.location.pathname;

    // Normalize path - remove trailing slash and handle index
    const normalizePath = (path) => {
        let normalized = path.replace(/\/$/, '') || '/';
        if (normalized.endsWith('/index.html')) {
            normalized = normalized.replace('/index.html', '/');
        }
        return normalized;
    };

    const normalizedCurrentPath = normalizePath(currentPath);

    // Helper to check if link matches current page (including sub-pages)
    const isActiveLink = (linkHref) => {
        if (!linkHref) return false;

        // Handle hash-only links (only active on home page)
        if (linkHref.startsWith('#')) {
            return normalizedCurrentPath === '/' || normalizedCurrentPath === '';
        }

        // Handle path links
        const linkPath = normalizePath(new URL(linkHref, window.location.origin).pathname);

        // Exact match
        if (linkPath === normalizedCurrentPath) return true;

        // Home page special case
        if (linkPath === '/' && (normalizedCurrentPath === '/' || normalizedCurrentPath === '')) {
            return true;
        }

        // Sub-page match: /tin-tuyen-sinh/ should match /tin-tuyen-sinh/chi-tiet/
        if (linkPath !== '/' && normalizedCurrentPath.startsWith(linkPath)) {
            return true;
        }

        return false;
    };

    // Update desktop nav
    navLinks.forEach(link => {
        link.classList.remove('active', 'nav-link--active');
        const linkHref = link.getAttribute('href');
        if (isActiveLink(linkHref)) {
            link.classList.add('active');
        }
    });

    // Update mobile nav
    mobileNavLinks.forEach(link => {
        link.classList.remove('mobile-nav__link--active');
        const linkHref = link.getAttribute('href');
        if (isActiveLink(linkHref)) {
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
