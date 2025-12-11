/**
 * Mobile Navigation Module
 * Handles mobile sidebar navigation toggle
 */

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
    // Check if header is already in DOM
    if (document.querySelector('[data-nav-toggle]')) {
        initMobileNav();
        return;
    }

    // Otherwise, observe for header being added
    const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector('[data-nav-toggle]')) {
            initMobileNav();
            obs.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Fallback: also init on DOMContentLoaded in case observer missed it
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initMobileNav, 100);
    });
})();
