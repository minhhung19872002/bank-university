/**
 * Activities Carousel Drag Handler
 * Handles smooth grab/drag with momentum for activities carousel track
 */

export function initActivitiesCarousel() {
    const track = document.querySelector('.activities-carousel__track');
    if (!track) return;

    // Get card width for navigation
    const getCardWidth = () => {
        const card = track.querySelector('.activity-card');
        return card ? card.offsetWidth + 17 : 0; // 17 = gap
    };

    // Scroll by one card width
    const scrollByCard = (direction) => {
        const cardWidth = getCardWidth();
        track.scrollBy({
            left: direction * cardWidth,
            behavior: 'smooth'
        });
    };

    // Desktop Navigation buttons
    const prevBtn = document.querySelector('.carousel-nav--prev');
    const nextBtn = document.querySelector('.carousel-nav--next');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => scrollByCard(-1));
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => scrollByCard(1));
    }

    // Mobile Slider Navigation buttons
    const mobilePrevBtn = document.querySelector('.activities-slider-nav__btn--prev');
    const mobileNextBtn = document.querySelector('.activities-slider-nav__btn--next');

    if (mobilePrevBtn) {
        mobilePrevBtn.addEventListener('click', () => scrollByCard(-1));
    }

    if (mobileNextBtn) {
        mobileNextBtn.addEventListener('click', () => scrollByCard(1));
    }

    // Drag functionality
    (function initDrag() {
        let isDown = false;
        let startX;
        let scrollLeft;
        let velX = 0;
        let momentumID;
        let lastX;
        let lastTime;
        let hasMoved = false;

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
            track.scrollLeft += velX;
            velX *= 0.92;
            if (Math.abs(velX) > 0.5) {
                momentumID = requestAnimationFrame(momentumLoop);
            }
        }

        // Mouse events
        track.addEventListener('mousedown', (e) => {
            isDown = true;
            hasMoved = false;
            track.classList.add('is-dragging');
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
            lastX = e.pageX;
            lastTime = Date.now();
            velX = 0;
            cancelMomentum();
        });

        track.addEventListener('mouseleave', () => {
            if (!isDown) return;
            isDown = false;
            track.classList.remove('is-dragging');
            startMomentum();
        });

        track.addEventListener('mouseup', () => {
            if (!isDown) return;
            isDown = false;
            track.classList.remove('is-dragging');
            startMomentum();
        });

        track.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();

            const x = e.pageX - track.offsetLeft;
            const walk = x - startX;

            if (Math.abs(walk) > 5) {
                hasMoved = true;
            }

            track.scrollLeft = scrollLeft - walk;

            const now = Date.now();
            const dt = now - lastTime;
            if (dt > 0) {
                velX = (lastX - e.pageX) / dt * 15;
            }
            lastX = e.pageX;
            lastTime = now;
        });

        // Prevent click on links/cards if dragged
        track.addEventListener('click', (e) => {
            if (hasMoved) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, true);

        // Touch events for mobile
        let touchStartX;
        let touchScrollLeft;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].pageX - track.offsetLeft;
            touchScrollLeft = track.scrollLeft;
            lastX = e.touches[0].pageX;
            lastTime = Date.now();
            velX = 0;
            cancelMomentum();
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            const x = e.touches[0].pageX - track.offsetLeft;
            const walk = x - touchStartX;
            track.scrollLeft = touchScrollLeft - walk;

            const now = Date.now();
            const dt = now - lastTime;
            if (dt > 0) {
                velX = (lastX - e.touches[0].pageX) / dt * 15;
            }
            lastX = e.touches[0].pageX;
            lastTime = now;
        }, { passive: true });

        track.addEventListener('touchend', () => {
            startMomentum();
        });
    })();
}
