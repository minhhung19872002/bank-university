/**
 * Floating Chat Widget
 * Toggle functionality for mobile view with drag support
 */
(function () {
	'use strict';

	function initChatWidget() {
		const widget = document.querySelector('.chat-widget');
		const toggle = document.querySelector('.chat-widget__toggle');

		if (!widget || !toggle) return;

		// Drag state
		let isDragging = false;
		let hasMoved = false;
		let startX, startY;
		let startLeft, startBottom;
		const dragThreshold = 10; // Minimum pixels to consider as drag

		// Get initial position from CSS
		function getInitialPosition() {
			const style = window.getComputedStyle(widget);
			return {
				right: parseInt(style.right) || 16,
				bottom: parseInt(style.bottom) || 80
			};
		}

		// Touch/Mouse start
		function handleDragStart(e) {
			if (window.innerWidth > 767) return; // Only on mobile

			const touch = e.touches ? e.touches[0] : e;
			startX = touch.clientX;
			startY = touch.clientY;

			const rect = widget.getBoundingClientRect();
			startLeft = rect.left;
			startBottom = window.innerHeight - rect.bottom;

			isDragging = true;
			hasMoved = false;

			widget.style.transition = 'none';
		}

		// Touch/Mouse move
		function handleDragMove(e) {
			if (!isDragging || window.innerWidth > 767) return;

			const touch = e.touches ? e.touches[0] : e;
			const deltaX = touch.clientX - startX;
			const deltaY = touch.clientY - startY;

			// Check if moved enough to be considered a drag
			if (Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold) {
				hasMoved = true;
			}

			if (hasMoved) {
				e.preventDefault();

				const newLeft = startLeft + deltaX;
				const newBottom = startBottom - deltaY;

				// Calculate boundaries
				const widgetWidth = widget.offsetWidth;
				const widgetHeight = widget.offsetHeight;
				const maxLeft = window.innerWidth - widgetWidth;
				const maxBottom = window.innerHeight - widgetHeight;

				// Clamp values within viewport
				const clampedLeft = Math.max(0, Math.min(newLeft, maxLeft));
				const clampedBottom = Math.max(0, Math.min(newBottom, maxBottom));

				// Convert left to right for positioning
				const newRight = window.innerWidth - clampedLeft - widgetWidth;

				widget.style.right = newRight + 'px';
				widget.style.bottom = clampedBottom + 'px';
			}
		}

		// Touch/Mouse end
		function handleDragEnd() {
			if (!isDragging) return;

			isDragging = false;
			widget.style.transition = '';

			// Snap to nearest edge (left or right)
			if (hasMoved) {
				const rect = widget.getBoundingClientRect();
				const centerX = rect.left + rect.width / 2;
				const screenCenter = window.innerWidth / 2;

				widget.style.transition = 'right 0.3s ease, bottom 0.3s ease';

				if (centerX < screenCenter) {
					// Snap to left
					widget.style.right = 'auto';
					widget.style.left = '1.6rem';
				} else {
					// Snap to right
					widget.style.left = 'auto';
					widget.style.right = '1.6rem';
				}

				// Reset transition after animation
				setTimeout(() => {
					widget.style.transition = '';
				}, 300);
			}
		}

		// Toggle click handler (only if not dragging)
		toggle.addEventListener('click', function (e) {
			if (hasMoved) {
				e.preventDefault();
				e.stopPropagation();
				hasMoved = false;
				return;
			}
			e.preventDefault();
			widget.classList.toggle('chat-widget--open');
		});

		// Add drag event listeners to toggle button
		toggle.addEventListener('touchstart', handleDragStart, { passive: true });
		toggle.addEventListener('mousedown', handleDragStart);

		document.addEventListener('touchmove', handleDragMove, { passive: false });
		document.addEventListener('mousemove', handleDragMove);

		document.addEventListener('touchend', handleDragEnd);
		document.addEventListener('mouseup', handleDragEnd);

		// Close when clicking outside on mobile
		document.addEventListener('click', function (e) {
			if (window.innerWidth <= 767) {
				if (!widget.contains(e.target)) {
					widget.classList.remove('chat-widget--open');
				}
			}
		});

		// Close on escape key
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape') {
				widget.classList.remove('chat-widget--open');
			}
		});

		// Reset position on resize to desktop
		let resizeTimer;
		window.addEventListener('resize', function () {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function () {
				if (window.innerWidth > 767) {
					widget.classList.remove('chat-widget--open');
					// Reset to default position
					widget.style.right = '';
					widget.style.bottom = '';
					widget.style.left = '';
				}
			}, 100);
		});
	}

	// Initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initChatWidget);
	} else {
		initChatWidget();
	}
})();
