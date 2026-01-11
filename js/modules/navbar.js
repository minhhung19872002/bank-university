const CHEVRON_DOWN_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// Check if any descendant is active (recursive)
function hasActiveDescendant(item, currentPath) {
    if (!item.children || item.children.length === 0) return false;
    return item.children.some((child) => {
        if (isPathActive(child.path, currentPath)) return true;
        return hasActiveDescendant(child, currentPath);
    });
}

// Helper functions
function stripQuery(p) {
    if (!p) return '';
    return p.split('?')[0];
}

function normalizePathForComparison(p) {
    if (!p) return '/';
    let pure = stripQuery(p);
    // Remove hash for base path comparison
    let noHash = pure.split('#')[0];
    if (!noHash.endsWith('/')) noHash += '/';
    return noHash;
}

function isPathActive(itemPath, currentFull) {
    if (!itemPath) return false;

    const itemPure = stripQuery(itemPath);
    const currentPure = stripQuery(currentFull);

    // If item has a hash, strict match required against full current path (path + hash)
    if (itemPure.includes('#')) {
        return itemPure === currentPure;
    }

    // If item has NO hash, match against the base path of current URL
    // This allows Parent (/page/) to be active when Child (/page/#section) is active
    const itemBase = normalizePathForComparison(itemPure);
    const currentBase = normalizePathForComparison(currentPure);

    if (itemBase === currentBase) return true;

    // Check if item path is a parent/ancestor of current path
    // Example: /tin-tuyen-sinh/ should be active when viewing /tra-cuu-tuyen-sinh/ket-qua/
    // because current path STARTS WITH item path
    if (itemBase !== '/' && currentBase.startsWith(itemBase)) {
        return true;
    }

    // Check Router config for relationships (e.g. su-kien-chi-tiet -> su-kien)
    if (typeof Router !== 'undefined' && typeof ROUTES_CONFIG !== 'undefined') {
        const parentRoute = Router.findParentRoute(currentFull);
        if (
            parentRoute &&
            normalizePathForComparison(parentRoute.path) === itemBase
        ) {
            return true;
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
    // (This heuristic might need adjustment if hash-based nesting implies ancestor relationship differently,
    // but for now, we rely on the generic check)
    return activeChildren.map((c) => c.path);
}

function renderMobileNavbar(menu) {
    const mobileList = document.querySelector('.mobile-nav__list');
    if (!mobileList) return;
    mobileList.innerHTML = ''; // Clear existing

    // Get full path with hash for accurate comparison
    const currentPath =
        typeof location !== 'undefined'
            ? location.pathname + location.hash
            : '/';

    // Recursive item builder for Mobile
    function createMobileItem(item, level = 0) {
        const li = document.createElement('li');

        // Classes based on level
        if (level === 0) {
            li.className = 'mobile-nav__item';
        } else {
            li.className = 'mobile-nav__submenu-item';
        }

        // Wrapper for content + toggle
        const wrapper = document.createElement('div');
        wrapper.className = 'd-flex align-items-center justify-content-between';

        // Check active status
        const isActive = isPathActive(item.path, currentPath);
        const hasActiveChildren = hasActiveDescendant(item, currentPath);

        // Link
        const link = document.createElement('a');
        // Base class
        let linkClass =
            level === 0 ? 'mobile-nav__link' : 'mobile-nav__submenu-link';
        // Modifier for active
        if (isActive || hasActiveChildren) {
            linkClass += level === 0 ? ' mobile-nav__link--active' : ' active';
        }
        link.className = `${linkClass} flex-grow-1`;
        link.href = item.path;

        // Icon (Level 0 only usually)
        if (level === 0 && item.icon) {
            const img = document.createElement('img');
            img.src = item.icon;
            img.className = 'mobile-nav__icon';
            img.width = 24;
            img.height = 24;
            link.appendChild(img);
        }

        const span = document.createElement('span');
        span.textContent = item.label;
        link.appendChild(span);
        wrapper.appendChild(link);

        // Recursive children
        if (item.children && item.children.length > 0) {
            // Toggle Button
            const toggle = document.createElement('button');
            // Auto open if active path inside
            const isOpen = hasActiveChildren;

            toggle.className = `mobile-nav__toggle${isOpen ? ' open' : ''}`;
            toggle.type = 'button';
            toggle.ariaLabel = 'Toggle submenu';
            toggle.innerHTML = CHEVRON_DOWN_SVG;
            // Basic inline styles for better reset
            toggle.style.background = 'transparent';
            toggle.style.border = 'none';
            toggle.style.padding = '0.5rem';
            toggle.style.cursor = 'pointer';

            wrapper.appendChild(toggle);
            li.appendChild(wrapper);

            // Submenu UL
            const ulSub = document.createElement('ul');
            ulSub.className =
                level === 0
                    ? 'mobile-nav__submenu'
                    : 'mobile-nav__submenu list-unstyled ps-3';
            // Reuse mobile-nav__submenu class for transition
            if (isOpen) {
                ulSub.classList.add('open');
                ulSub.style.display = 'block'; // Ensure it shows
            } else if (level > 0) {
                ulSub.style.display = 'none'; // Hide initially for deep levels
            }

            item.children.forEach((child) => {
                ulSub.appendChild(createMobileItem(child, level + 1));
            });

            li.appendChild(ulSub);

            // Event listener
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggle.classList.toggle('open');
                ulSub.classList.toggle('open');
                // For nested levels, enforce display toggle if CSS relies on specific structure
                if (level > 0) {
                    if (ulSub.classList.contains('open')) {
                        ulSub.style.display = 'block';
                    } else {
                        ulSub.style.display = 'none';
                    }
                }
            });
        } else {
            li.appendChild(wrapper);
        }

        return li;
    }

    // Render loop
    menu.forEach((item) => {
        mobileList.appendChild(createMobileItem(item, 0));
    });
}

function renderNavbar(menu) {
    const ul = document.getElementById('main-navbar');
    if (!ul) return;
    ul.innerHTML = '';

    // Get full path with hash for accurate comparison
    const currentPath =
        typeof location !== 'undefined'
            ? location.pathname + location.hash
            : '/';

    // Recursive dropdown item builder
    function createDropdownItem(item) {
        const li = document.createElement('li'); // Main list item

        const isActive = isPathActive(item.path, currentPath);
        const hasChildren = item.children && item.children.length > 0;
        const hasActiveChildren = hasActiveDescendant(item, currentPath);

        if (!hasChildren) {
            // Simple Item
            li.innerHTML = `<a class="dropdown-item${
                isActive ? ' active' : ''
            }" href="${item.path}">${item.label}</a>`;
        } else {
            // Item with Children -> Accordion style

            // Wrapper for Link + Toggle
            const wrapper = document.createElement('div');
            wrapper.className =
                'd-flex align-items-center justify-content-between';

            const link = document.createElement('a');
            link.className = `dropdown-item flex-grow-1 pe-2${
                isActive || hasActiveChildren ? ' active' : ''
            }`;
            link.href = item.path;
            link.textContent = item.label;

            const toggle = document.createElement('button');
            toggle.className =
                'btn btn-sm btn-icon text-muted border-0 p-0 ms-2 me-4 transition-transform';
            toggle.innerHTML = CHEVRON_DOWN_SVG;
            toggle.style.width = '20px';
            toggle.style.height = '20px';
            toggle.style.padding = '0';
            toggle.style.background = 'transparent';
            toggle.type = 'button';

            // Initial State based on activity
            let isOpen = hasActiveChildren;

            if (isOpen) {
                toggle.style.transform = 'rotate(180deg)';
            } else {
                toggle.style.transform = 'rotate(0deg)';
            }
            toggle.style.transition = 'transform 0.2s';

            wrapper.appendChild(link);
            wrapper.appendChild(toggle);
            li.appendChild(wrapper);

            // Nested Submenu
            const submenu = document.createElement('ul');
            submenu.className = 'list-unstyled border-start ms-3 ps-2 my-1';
            submenu.style.display = isOpen ? 'block' : 'none';
            submenu.style.fontSize = '0.95em';

            // Populate Submenu
            item.children.forEach((child) => {
                submenu.appendChild(createDropdownItem(child));
            });
            li.appendChild(submenu);

            // Toggle Handler
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Stop from closing the main dropdown

                if (submenu.style.display === 'none') {
                    submenu.style.display = 'block';
                    toggle.style.transform = 'rotate(180deg)';
                } else {
                    submenu.style.display = 'none';
                    toggle.style.transform = 'rotate(0deg)';
                }
            });
        }
        return li;
    }

    menu.forEach((item) => {
        // Top Level Logic
        const li = document.createElement('li');

        const isActive = isPathActive(item.path, currentPath);
        const hasChildren = item.children && item.children.length > 0;
        const hasActiveChildren = hasActiveDescendant(item, currentPath);

        if (!hasChildren) {
            li.className = 'nav-item';
            li.innerHTML = `<a class="nav-link${
                isActive ? ' active' : ''
            }" href="${item.path}"${isActive ? ' aria-current="page"' : ''}>${
                item.label
            }</a>`;
        } else {
            li.className = 'nav-item dropdown nav-dropdown-hoverfix';

            const wrapper = document.createElement('div');
            wrapper.className = 'nav-link-wrapper';

            const parentActive = isActive || hasActiveChildren;
            const linkId = `nav-${item.path.replace(/\W/g, '')}`;

            wrapper.innerHTML = `
                <a class="nav-link${parentActive ? ' active' : ''}" 
                   href="${item.path}" 
                   id="${linkId}" 
                   role="button" 
                   aria-expanded="false"
                   ${parentActive ? ' aria-current="page"' : ''}>
                   ${item.label}
                </a>
                <span class="nav-hover-fix"></span>
            `;
            li.appendChild(wrapper);

            const ulDropdown = document.createElement('ul');
            ulDropdown.className = 'dropdown-menu';
            ulDropdown.setAttribute('aria-labelledby', linkId);

            item.children.forEach((child) => {
                ulDropdown.appendChild(createDropdownItem(child));
            });

            li.appendChild(ulDropdown);
        }
        ul.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    renderNavbar(NAVBAR_MENU);
    renderMobileNavbar(NAVBAR_MENU);

    // Dropdown hover Logic (Simplified & Robust)
    function attachHoverHandlers() {
        document
            .querySelectorAll('.navbar-nav .dropdown')
            .forEach(function (dropdown) {
                if (dropdown.dataset.hoverBound === 'true') return;
                dropdown.dataset.hoverBound = 'true';

                let timer;
                const menu = dropdown.querySelector('.dropdown-menu');

                const showMenu = () => {
                    dropdown.classList.add('show');
                    if (menu) menu.classList.add('show');
                };

                const hideMenu = () => {
                    dropdown.classList.remove('show');
                    if (menu) menu.classList.remove('show');
                };

                const startShow = () => {
                    clearTimeout(timer); // Cancel any pending hide
                    showMenu();
                };

                const startHide = () => {
                    timer = setTimeout(hideMenu, 200); // 200ms delay to bridge gaps
                };

                // Attach ONLY to the main container (li.dropdown)
                // This relies on 'mouseleave' not firing when moving to children (a, ul, etc)
                // which is standard DOM behavior.
                dropdown.addEventListener('mouseenter', startShow);
                dropdown.addEventListener('mouseleave', startHide);
            });
    }

    if (window.innerWidth >= 992) {
        attachHoverHandlers();
    }

    // Re-attach handlers when resizing into desktop breakpoint
    let lastIsDesktop = window.innerWidth >= 992;
    window.addEventListener('resize', function () {
        const isDesktop = window.innerWidth >= 992;
        if (isDesktop && !lastIsDesktop) attachHoverHandlers();
        lastIsDesktop = isDesktop;
    });
});
