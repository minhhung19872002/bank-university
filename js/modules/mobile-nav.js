/**
 * Mobile Navigation & Header Module
 * Handles mobile sidebar navigation toggle and sticky header
 */

function initStickyHeader() {
    const header = document.querySelector('[data-header]');
    if (!header) return;

    let lastScrollY = 0;
    const scrollThreshold = 10;

    function handleScroll() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > scrollThreshold) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }

        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
}

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

// Auto-initialize after partials are loaded
// This handles the case where header is loaded via data-include
(function() {
    function initAll() {
        initMobileNav();
        initStickyHeader();
    }

    // Check if header is already in DOM
    if (document.querySelector('[data-nav-toggle]')) {
        initAll();
        return;
    }

    // Otherwise, observe for header being added
    const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector('[data-nav-toggle]')) {
            initAll();
            obs.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Fallback: also init on DOMContentLoaded in case observer missed it
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initAll, 100);
    });
})();
