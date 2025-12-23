/**
 * Reusable Pagination Utility
 *
 * Usage:
 * const paginator = createPagination({
 *     items: document.querySelectorAll('.item'),
 *     paginationNav: document.querySelector('.pagination'),
 *     itemsPerPage: 9,
 *     scrollTarget: document.querySelector('.section'),
 *     scrollOffset: 140, // Offset for sticky header (header height + padding)
 *     selectors: {
 *         prevBtn: '.pagination__btn--prev',
 *         nextBtn: '.pagination__btn--next',
 *         pageItem: '.pagination__item'
 *     },
 *     classes: { active: 'pagination__item--active' },
 *     createPageElement: (pageNum, isActive) => { return element; },
 *     onPageChange: (visibleItems, startIndex, endIndex, items) => { }
 * });
 *
 * // Public API:
 * paginator.setItems(newItems); // Update items (e.g., after filtering)
 * paginator.goToPage(2);        // Go to specific page
 * paginator.getCurrentPage();   // Get current page number
 * paginator.refresh();          // Refresh pagination display
 */

function createPagination(options) {
	const {
		items: initialItems = [],
		paginationNav,
		itemsPerPage = 9,
		scrollTarget = null,
		scrollOffset = 0, // Offset for sticky header (positive value = scroll higher)
		showOnMobile = false, // Show pagination on mobile (default: hidden on mobile)
		selectors = {},
		classes = {},
		createPageElement = null,
		onPageChange = null,
	} = options;

	// Default selectors (support both naming conventions)
	const prevSelector =
		selectors.prevBtn || '.pagination__btn--prev, .pagination__button--prev';
	const nextSelector =
		selectors.nextBtn || '.pagination__btn--next, .pagination__button--next';
	const pageItemSelector =
		selectors.pageItem ||
		'.pagination__item, .pagination__button:not(.pagination__button--prev):not(.pagination__button--next)';

	// Default classes
	const activeClass = classes.active || 'pagination__item--active';

	let items = Array.from(initialItems);
	let currentPage = 1;

	// Return no-op API if no pagination nav
	if (!paginationNav) {
		return {
			setItems: (newItems) => {
				items = Array.from(newItems);
			},
			goToPage: () => {},
			getCurrentPage: () => 1,
			refresh: () => {},
		};
	}

	const prevBtn = paginationNav.querySelector(prevSelector);
	const nextBtn = paginationNav.querySelector(nextSelector);

	function getTotalPages() {
		return Math.ceil(items.length / itemsPerPage);
	}

	function updatePaginationUI() {
		const totalPages = getTotalPages();

		// Hide pagination if no items or items fit in one page
		if (items.length === 0 || items.length <= itemsPerPage) {
			paginationNav.classList.add('d-none');
			paginationNav.classList.remove('d-sm-flex', 'd-flex');
			return;
		}

		// Show pagination - use d-flex for mobile or d-sm-flex for desktop only
		paginationNav.classList.remove('d-none');
		paginationNav.classList.add(showOnMobile ? 'd-flex' : 'd-sm-flex');

		// Clear existing page items
		const existingItems = paginationNav.querySelectorAll(pageItemSelector);
		existingItems.forEach((item) => item.remove());

		// Create page items
		for (let i = 1; i <= totalPages; i++) {
			let pageEl;

			if (createPageElement) {
				pageEl = createPageElement(i, i === currentPage);
			} else {
				// Default: create <a> element
				pageEl = document.createElement('a');
				pageEl.href = '#';
				pageEl.className =
					'pagination__item' + (i === currentPage ? ` ${activeClass}` : '');
				pageEl.textContent = i;
			}

			if (i === currentPage) {
				pageEl.setAttribute('aria-current', 'page');
			}

			pageEl.addEventListener('click', (e) => {
				e.preventDefault();
				goToPage(i);
			});

			if (nextBtn) {
				nextBtn.before(pageEl);
			} else {
				paginationNav.appendChild(pageEl);
			}
		}

		// Update prev/next button states
		if (prevBtn) {
			prevBtn.disabled = currentPage === 1;
			prevBtn.style.opacity = currentPage === 1 ? '0.5' : '1';
			prevBtn.style.cursor = currentPage === 1 ? 'not-allowed' : 'pointer';
		}
		if (nextBtn) {
			nextBtn.disabled = currentPage === totalPages;
			nextBtn.style.opacity = currentPage === totalPages ? '0.5' : '1';
			nextBtn.style.cursor =
				currentPage === totalPages ? 'not-allowed' : 'pointer';
		}
	}

	function showItemsForPage() {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;

		// Get visible items for this page
		const visibleItems = items.slice(startIndex, endIndex);

		// Callback for custom display logic
		if (onPageChange) {
			onPageChange(visibleItems, startIndex, endIndex, items);
		} else {
			// Default behavior: show/hide items using class for better CSS compatibility
			items.forEach((item, index) => {
				if (index >= startIndex && index < endIndex) {
					item.classList.remove('pagination-hidden');
					item.style.display = '';
				} else {
					item.classList.add('pagination-hidden');
					item.style.display = 'none';
				}
			});
		}

		updatePaginationUI();
	}

	function goToPage(page) {
		const totalPages = getTotalPages();
		if (page < 1 || page > totalPages) return;

		currentPage = page;
		showItemsForPage();

		// Scroll to target with offset for sticky header
		if (scrollTarget) {
			const targetRect = scrollTarget.getBoundingClientRect();
			const absoluteTop = window.pageYOffset + targetRect.top - scrollOffset;
			window.scrollTo({ top: absoluteTop, behavior: 'smooth' });
		}
	}

	// Setup prev/next button listeners
	if (prevBtn) {
		prevBtn.addEventListener('click', (e) => {
			e.preventDefault();
			if (currentPage > 1) goToPage(currentPage - 1);
		});
	}

	if (nextBtn) {
		nextBtn.addEventListener('click', (e) => {
			e.preventDefault();
			if (currentPage < getTotalPages()) goToPage(currentPage + 1);
		});
	}

	// Initial display
	showItemsForPage();

	// Return public API
	return {
		setItems: (newItems) => {
			items = Array.from(newItems);
			currentPage = 1;
			showItemsForPage();
		},
		goToPage,
		getCurrentPage: () => currentPage,
		refresh: () => showItemsForPage(),
	};
}

// Export for use in other modules
if (typeof window !== 'undefined') {
	window.createPagination = createPagination;
}
