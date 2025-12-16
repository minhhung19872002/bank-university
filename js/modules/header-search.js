/**
 * Header Search Module
 * Handles search input in topbar (desktop) and mobile search overlay
 * Redirects to search results page
 */

function initHeaderSearch() {
    // Desktop search (topbar)
    initDesktopSearch();

    // Mobile search overlay
    initMobileSearch();
}

function initDesktopSearch() {
    const searchInput = document.querySelector('.topbar__search-input');
    const searchContainer = document.querySelector('.topbar__search');

    if (!searchInput || !searchContainer) return;

    const searchIcon = searchContainer.querySelector('img');

    function performSearch() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            window.location.href = '/ket-qua-tim-kiem/?q=' + encodeURIComponent(searchTerm);
        }
    }

    // Enter key press
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });

    // Click on search icon
    if (searchIcon) {
        searchIcon.addEventListener('click', function(e) {
            e.preventDefault();
            performSearch();
        });
    }
}

function initMobileSearch() {
    const searchBtn = document.querySelector('.navbar-search-btn');
    const mobileSearch = document.querySelector('[data-mobile-search]');

    if (!searchBtn || !mobileSearch) return;

    const searchInput = mobileSearch.querySelector('.mobile-search__input');
    const submitBtn = mobileSearch.querySelector('.mobile-search__submit');
    const closeBtn = mobileSearch.querySelector('.mobile-search__close');

    function openSearch() {
        mobileSearch.classList.add('mobile-search--open');
        mobileSearch.setAttribute('aria-hidden', 'false');
        if (searchInput) {
            searchInput.focus();
        }
    }

    function closeSearch() {
        mobileSearch.classList.remove('mobile-search--open');
        mobileSearch.setAttribute('aria-hidden', 'true');
        if (searchInput) {
            searchInput.value = '';
        }
    }

    function performMobileSearch() {
        if (!searchInput) return;
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            window.location.href = '/ket-qua-tim-kiem/?q=' + encodeURIComponent(searchTerm);
        }
    }

    // Open search when clicking search button
    searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openSearch();
    });

    // Close search
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeSearch();
        });
    }

    // Submit search
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            performMobileSearch();
        });
    }

    // Enter key to submit
    if (searchInput) {
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performMobileSearch();
            }
            if (e.key === 'Escape') {
                closeSearch();
            }
        });
    }
}

// Auto-initialize when DOM is ready
(function() {
    let initialized = false;

    function init() {
        if (initialized) return;
        initialized = true;
        initHeaderSearch();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // Check if elements exist (header may be loaded via data-include)
            if (document.querySelector('.topbar__search') || document.querySelector('.navbar-search-btn')) {
                init();
            } else {
                // Observe for header being added
                const observer = new MutationObserver((mutations, obs) => {
                    if (document.querySelector('.topbar__search') || document.querySelector('.navbar-search-btn')) {
                        init();
                        obs.disconnect();
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        });
    } else {
        if (document.querySelector('.topbar__search') || document.querySelector('.navbar-search-btn')) {
            init();
        } else {
            // Observe for header being added
            const observer = new MutationObserver((mutations, obs) => {
                if (document.querySelector('.topbar__search') || document.querySelector('.navbar-search-btn')) {
                    init();
                    obs.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }
})();
