/**
 * Gallery Slider Module
 * Reusable horizontal slider with drag/swipe support for mobile and desktop
 *
 * Usage:
 * initGallerySlider({
 *   gallerySelector: '.your-gallery',
 *   prevBtnSelector: '.your-prev-btn',    // optional
 *   nextBtnSelector: '.your-next-btn',    // optional
 *   itemSelector: '.your-item',           // optional, default: first child class
 *   gap: 12,                              // optional, gap between items in px
 *   swipeThreshold: 50,                   // optional, min distance to trigger swipe
 *   mode: 'snap'                          // optional: 'snap' or 'simple'
 * });
 *
 * Modes:
 * - 'snap': Snap to item after drag/swipe (1 item per swipe)
 * - 'simple': Only prev/next buttons, no drag functionality
 */

function initGallerySlider(options = {}) {
    const {
        gallerySelector,
        prevBtnSelector = null,
        nextBtnSelector = null,
        itemSelector = null,
        gap = 12,
        swipeThreshold = 50,
        mode = "snap",
    } = options;

    const gallery = document.querySelector(gallerySelector);
    if (!gallery) return null;

    const prevBtn = prevBtnSelector
        ? document.querySelector(prevBtnSelector)
        : null;
    const nextBtn = nextBtnSelector
        ? document.querySelector(nextBtnSelector)
        : null;

    // Get item width for scrolling
    const getItemWidth = () => {
        const item = itemSelector
            ? gallery.querySelector(itemSelector)
            : gallery.firstElementChild;
        if (!item) return 300;
        return item.offsetWidth + gap;
    };

    // Get all items
    const getItems = () => {
        if (itemSelector) {
            return gallery.querySelectorAll(itemSelector);
        }
        return gallery.children;
    };

    // Smooth scroll to position
    const smoothScrollTo = (targetScroll) => {
        gallery.classList.add("is-snapping");
        gallery.scrollTo({
            left: targetScroll,
            behavior: "smooth",
        });
        setTimeout(() => {
            gallery.classList.remove("is-snapping");
        }, 400);
    };

    // Navigate to specific index
    const goToIndex = (index) => {
        const itemWidth = getItemWidth();
        const maxScroll = gallery.scrollWidth - gallery.clientWidth;
        const totalItems = getItems().length;
        const clampedIndex = Math.max(0, Math.min(totalItems - 1, index));
        const targetScroll = Math.min(maxScroll, clampedIndex * itemWidth);
        smoothScrollTo(targetScroll);
        return clampedIndex;
    };

    // Get current index
    const getCurrentIndex = () => {
        const itemWidth = getItemWidth();
        return Math.round(gallery.scrollLeft / itemWidth);
    };

    // Navigate previous
    const prev = () => {
        const currentIndex = getCurrentIndex();
        return goToIndex(currentIndex - 1);
    };

    // Navigate next
    const next = () => {
        const currentIndex = getCurrentIndex();
        return goToIndex(currentIndex + 1);
    };

    // Navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener("click", prev);
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", next);
    }

    // Simple mode: only prev/next buttons, no drag
    if (mode === "simple") {
        return {
            gallery,
            prev,
            next,
            goToIndex,
            getCurrentIndex,
            getItemWidth,
        };
    }

    // Drag/Swipe functionality (for snap mode)
    let isDown = false;
    let startX;
    let scrollLeft;
    let hasMoved = false;

    const handleDragStart = (pageX) => {
        isDown = true;
        hasMoved = false;
        gallery.classList.add("is-dragging");
        startX = pageX - gallery.offsetLeft;
        scrollLeft = gallery.scrollLeft;
    };

    const handleDragEnd = (pageX) => {
        if (!isDown) return;
        isDown = false;
        gallery.classList.remove("is-dragging");

        // Snap mode: Calculate swipe direction based on distance moved
        const endX = pageX - gallery.offsetLeft;
        const distance = startX - endX; // Positive = swipe left, Negative = swipe right
        const itemWidth = getItemWidth();
        const maxScroll = gallery.scrollWidth - gallery.clientWidth;

        // Calculate current item index based on initial scroll position
        const currentIndex = Math.round(scrollLeft / itemWidth);
        let targetIndex = currentIndex;

        // Only move 1 item if swiped more than threshold
        if (distance > swipeThreshold) {
            // Swipe left - go to next item
            targetIndex = currentIndex + 1;
        } else if (distance < -swipeThreshold) {
            // Swipe right - go to previous item
            targetIndex = currentIndex - 1;
        }

        // Clamp to valid range
        const totalItems = getItems().length;
        targetIndex = Math.max(0, Math.min(totalItems - 1, targetIndex));

        const targetScroll = targetIndex * itemWidth;
        smoothScrollTo(Math.min(maxScroll, targetScroll));
    };

    const handleDragMove = (pageX, e) => {
        if (!isDown) return;
        if (e && e.cancelable) e.preventDefault();

        const x = pageX - gallery.offsetLeft;
        const walk = x - startX;

        if (Math.abs(walk) > 5) {
            hasMoved = true;
        }

        gallery.scrollLeft = scrollLeft - walk;
    };

    // Mouse events
    gallery.addEventListener("mousedown", (e) => {
        handleDragStart(e.pageX);
    });

    gallery.addEventListener("mouseleave", (e) => {
        handleDragEnd(e.pageX);
    });

    gallery.addEventListener("mouseup", (e) => {
        handleDragEnd(e.pageX);
    });

    gallery.addEventListener("mousemove", (e) => {
        handleDragMove(e.pageX, e);
    });

    // Prevent click if dragged
    gallery.addEventListener(
        "click",
        (e) => {
            if (hasMoved) {
                e.preventDefault();
                e.stopPropagation();
            }
        },
        true
    );

    // Touch events
    gallery.addEventListener(
        "touchstart",
        (e) => {
            handleDragStart(e.touches[0].pageX);
        },
        { passive: true }
    );

    gallery.addEventListener(
        "touchmove",
        (e) => {
            handleDragMove(e.touches[0].pageX, e);
        },
        { passive: false }
    );

    gallery.addEventListener("touchend", (e) => {
        const touch = e.changedTouches[0];
        handleDragEnd(touch.pageX);
    });

    // Return public API
    return {
        gallery,
        prev,
        next,
        goToIndex,
        getCurrentIndex,
        getItemWidth,
    };
}

// Export for module usage (if using ES modules)
if (typeof module !== "undefined" && module.exports) {
    module.exports = { initGallerySlider };
}
