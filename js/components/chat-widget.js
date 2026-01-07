/**
 * Floating Chat Widget
 * Toggle functionality for mobile view
 */
(function () {
	'use strict';

	function initChatWidget() {
		const widget = document.querySelector('.chat-widget');
		const toggle = document.querySelector('.chat-widget__toggle');

		if (!widget || !toggle) return;

		// Toggle open/close on mobile
		toggle.addEventListener('click', function (e) {
			e.preventDefault();
			widget.classList.toggle('chat-widget--open');
		});

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

		// Reset state on resize
		let resizeTimer;
		window.addEventListener('resize', function () {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function () {
				if (window.innerWidth > 767) {
					widget.classList.remove('chat-widget--open');
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
