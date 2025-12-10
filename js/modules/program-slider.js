/**
 * Program Cards Mobile Slider
 * Handles scroll-snap based slider with prev/next navigation
 */

export function initProgramSlider() {
    // Support multiple slider types
    const sliderConfigs = [
        {
            slider: document.querySelector('.programs-section .row.g-4'),
            cardSelector: '.col-lg-4'
        },
        {
            slider: document.querySelector('.program-cards-grid'),
            cardSelector: '.program-card-item'
        }
    ];

    // Find the first valid slider
    let activeConfig = null;
    for (const config of sliderConfigs) {
        if (config.slider) {
            activeConfig = config;
            break;
        }
    }

    if (!activeConfig) return;

    const slider = activeConfig.slider;
    const cardSelector = activeConfig.cardSelector;
    const prevBtn = document.querySelector('.program-slider-nav__btn--prev');
    const nextBtn = document.querySelector('.program-slider-nav__btn--next');

    let currentIndex = 0;
    const cards = slider.querySelectorAll(cardSelector);
    const totalCards = cards.length;

    // Get card width
    function getCardWidth() {
        const card = slider.querySelector(cardSelector);
        return card ? card.offsetWidth : 0;
    }

    // Scroll to specific index
    function scrollToIndex(index) {
        const cardWidth = getCardWidth();
        if (cardWidth === 0) return;

        // Clamp index
        index = Math.max(0, Math.min(index, totalCards - 1));
        currentIndex = index;

        slider.scrollTo({
            left: cardWidth * index,
            behavior: 'smooth'
        });
    }

    // Handle prev button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            scrollToIndex(currentIndex - 1);
        });
    }

    // Handle next button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            scrollToIndex(currentIndex + 1);
        });
    }

    // Update current index on scroll
    let scrollTimeout;
    slider.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const cardWidth = getCardWidth();
            if (cardWidth > 0) {
                currentIndex = Math.round(slider.scrollLeft / cardWidth);
            }
        }, 50);
    });

    // Touch/Drag scroll support with smooth momentum
    let isDown = false;
    let startX;
    let scrollLeft;
    let velX = 0;
    let momentumID;
    let lastX;
    let lastTime;

    function startMomentum() {
        cancelMomentum();
        if (Math.abs(velX) > 0.5) {
            momentumID = requestAnimationFrame(momentumLoop);
        }
    }

    function cancelMomentum() {
        if (momentumID) {
            cancelAnimationFrame(momentumID);
            momentumID = null;
        }
    }

    function momentumLoop() {
        slider.scrollLeft += velX;
        velX *= 0.92; // Slower decay for smoother feeling
        if (Math.abs(velX) > 0.5) {
            momentumID = requestAnimationFrame(momentumLoop);
        }
    }

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('is-dragging');
        slider.style.cursor = 'grabbing';
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        lastX = e.pageX;
        lastTime = Date.now();
        velX = 0;
        cancelMomentum();
    });

    slider.addEventListener('mouseleave', () => {
        if (!isDown) return;
        isDown = false;
        slider.classList.remove('is-dragging');
        slider.style.cursor = 'grab';
        startMomentum();
    });

    slider.addEventListener('mouseup', () => {
        if (!isDown) return;
        isDown = false;
        slider.classList.remove('is-dragging');
        slider.style.cursor = 'grab';
        startMomentum();
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();

        const x = e.pageX - slider.offsetLeft;
        const walk = x - startX;
        slider.scrollLeft = scrollLeft - walk;

        // Calculate velocity based on movement over time
        const now = Date.now();
        const dt = now - lastTime;
        if (dt > 0) {
            velX = (lastX - e.pageX) / dt * 15; // Scale for smooth momentum
        }
        lastX = e.pageX;
        lastTime = now;
    });

    // Set initial cursor style
    slider.style.cursor = 'grab';
}
