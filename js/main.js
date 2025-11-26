import { includePartials } from './modules/includePartials.js';

(async function start() {
    await includePartials();
    initNavigation();
    initFAQAccordion();
    initMobileNav();
    initProgramsTabs();
    initProgramsAccordionMobile();
})();

// Initialize navigation active states and scroll spy
function initNavigation() {
    const navLinks = document.querySelectorAll('.navbar .nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Set initial active state based on hash or default to home
    setActiveNavByHash();

    // Handle hash change (when clicking nav links)
    window.addEventListener('hashchange', setActiveNavByHash);

    // Handle scroll spy - update active nav based on scroll position
    if (sections.length > 0) {
        window.addEventListener('scroll', throttle(handleScrollSpy, 100));
    }

    // Smooth scroll for anchor links
    navLinks.forEach(link => {
        if (link.getAttribute('href').startsWith('#')) {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href').slice(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    e.preventDefault();
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    window.history.pushState(null, '', link.getAttribute('href'));
                }
            });
        }
    });
}

// Set active nav based on current hash or path
function setActiveNavByHash() {
    const navLinks = document.querySelectorAll('.navbar .nav-link');
    const currentHash = window.location.hash || '#';
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        link.classList.remove('active', 'nav-link--active');

        const linkHref = link.getAttribute('href');

        // Handle hash links
        if (linkHref.startsWith('#')) {
            if (linkHref === currentHash || (currentHash === '' && linkHref === '#' || linkHref === '/')) {
                link.classList.add('active');
            }
        }
        // Handle path links
        else {
            const linkPath = new URL(link.href, window.location.origin).pathname;
            if (linkPath === currentPath) {
                link.classList.add('active');
            }
        }
    });

    // If no hash and on home page, activate first link (Trang Chủ)
    if (!currentHash && currentPath.match(/\/(index\.html)?$/)) {
        const homeLink = document.querySelector('.navbar .nav-link[href="/"], .navbar .nav-link[href="index.html"]');
        if (homeLink) homeLink.classList.add('active');
    }
}

// Scroll spy - update active nav based on visible section
function handleScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100; // Offset for navbar height

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    // Update active states
    if (currentSection) {
        const navLinks = document.querySelectorAll('.navbar .nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active', 'nav-link--active');

            const linkHref = link.getAttribute('href');
            if (linkHref === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
}

// Throttle function to limit scroll event calls
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
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
    const mobileNav = document.querySelector('[data-mobile-nav]');
    const toggleBtn = document.querySelector('[data-nav-toggle]');
    const closeBtn = document.querySelector('[data-nav-close]');
    const overlay = document.querySelector('[data-mobile-nav-overlay]');
    const links = mobileNav
        ? mobileNav.querySelectorAll('.mobile-nav__link')
        : [];

    if (!mobileNav || !toggleBtn) return;

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
