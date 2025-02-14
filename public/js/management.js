document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.querySelector('.carousel');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const teamMembers = document.querySelectorAll('.team-member');

    let currentIndex = 0;
    const maxIndex = teamMembers.length - 3;

    function updateCarousel() {
        const itemWidth = teamMembers[0].offsetWidth + 32; // Width + gap
        carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    }

    function updateButtons() {
        prevButton.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextButton.style.opacity = currentIndex === maxIndex ? '0.5' : '1';
    }

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
            updateButtons();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
            updateButtons();
        }
    });

    // Update carousel on window resize
    window.addEventListener('resize', updateCarousel);

    // Initialize button states
    updateButtons();

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) > 50) {
            if (difference > 0 && currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
                updateButtons();
            } else if (difference < 0 && currentIndex > 0) {
                currentIndex--;
                updateCarousel();
                updateButtons();
            }
        }
    });
});