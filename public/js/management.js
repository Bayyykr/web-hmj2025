document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const teamMembers = document.querySelectorAll('.team-member');
    
    let currentPosition = 0;
    let slidesToShow = getSlidesToShow();
    
    // Initialize carousel
    function initCarousel() {
        updateCarouselDimensions();
        attachEventListeners();
    }
    
    // Get number of slides to show based on screen width
    function getSlidesToShow() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }
    
    // Update carousel dimensions
    function updateCarouselDimensions() {
        slidesToShow = getSlidesToShow();
        const containerWidth = carousel.parentElement.offsetWidth - 120; // Account for padding
        const slideWidth = (containerWidth / slidesToShow) - (40 * (slidesToShow - 1) / slidesToShow); // Account for gap
        
        // Update each team member's width
        teamMembers.forEach(member => {
            member.style.width = `${slideWidth}px`;
            member.style.minWidth = `${slideWidth}px`;
            member.style.maxWidth = `${slideWidth}px`;
        });
        
        // Update carousel width to accommodate all slides
        carousel.style.width = `${slideWidth * teamMembers.length + (40 * (teamMembers.length - 1))}px`;
        
        // Reset position when screen size changes
        currentPosition = 0;
        updateSlidePosition();
    }
    
    // Handle next slide
    function nextSlide() {
        const maxPosition = teamMembers.length - slidesToShow;
        if (currentPosition < maxPosition) {
            currentPosition++;
            updateSlidePosition();
        }
    }
    
    // Handle previous slide
    function prevSlide() {
        if (currentPosition > 0) {
            currentPosition--;
            updateSlidePosition();
        }
    }
    
    // Update slide position with smooth transition
    function updateSlidePosition() {
        const slideWidth = teamMembers[0].offsetWidth;
        const gapWidth = 40; // Match the gap from CSS
        const moveAmount = slideWidth + gapWidth;
        carousel.style.transition = 'transform 0.5s ease';
        carousel.style.transform = `translateX(${-currentPosition * moveAmount}px)`;
        
        // Update button states
        updateButtonStates();
    }
    
    // Update button states based on position
    function updateButtonStates() {
        prevButton.disabled = currentPosition === 0;
        nextButton.disabled = currentPosition === teamMembers.length - slidesToShow;
        
        prevButton.style.opacity = prevButton.disabled ? '0.5' : '1';
        nextButton.style.opacity = nextButton.disabled ? '0.5' : '1';
    }
    
    // Attach event listeners
    function attachEventListeners() {
        nextButton.addEventListener('click', nextSlide);
        prevButton.addEventListener('click', prevSlide);
        window.addEventListener('resize', debounce(updateCarouselDimensions, 250));
        
        // Touch support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        carousel.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const swipeLength = touchStartX - touchEndX;
            
            if (Math.abs(swipeLength) > swipeThreshold) {
                if (swipeLength > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }
    }
    
    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Initialize the carousel
    initCarousel();
});