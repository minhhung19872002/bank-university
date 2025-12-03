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

    // Touch/Drag scroll support
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.style.cursor = 'grabbing';
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });

    // Set initial cursor style
    slider.style.cursor = 'grab';
}
