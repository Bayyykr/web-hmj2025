document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector(".carousel");
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");
  const teamMembers = document.querySelectorAll(".team-member");

  let currentPosition = 0;
  let slidesToShow = getSlidesToShow();
  let autoSlideInterval; // Variable to store the interval

  // Initialize carousel
  function initCarousel() {
    updateCarouselDimensions();
    attachEventListeners();
    startAutoSlide(); // Start the automatic sliding
    updateButtonVisibility(); // Handle button visibility
  }

  // Get number of slides to show based on screen width
  function getSlidesToShow() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  // Update button visibility based on screen size
  function updateButtonVisibility() {
    if (window.innerWidth <= 768) {
      prevButton.style.display = "none";
      nextButton.style.display = "flex";
    } else {
      prevButton.style.display = "flex";
      nextButton.style.display = "flex";
    }
  }

  // Start automatic sliding
  function startAutoSlide() {
    // Clear any existing interval first
    stopAutoSlide();

    // Set new interval - slide every 5 seconds
    autoSlideInterval = setInterval(() => {
      const maxPosition = teamMembers.length - slidesToShow;
      if (currentPosition < maxPosition) {
        currentPosition++;
      } else {
        currentPosition = 0; // Loop back to the beginning
      }
      updateSlidePosition();
    }, 5000); // 5000 milliseconds = 5 seconds
  }

  // Stop automatic sliding
  function stopAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
    }
  }

  // Update carousel dimensions
  function updateCarouselDimensions() {
    slidesToShow = getSlidesToShow();
    let containerWidth, slideWidth;

    if (window.innerWidth <= 768) {
      // Mobile view - full width slides with smaller gap
      containerWidth = carousel.parentElement.offsetWidth - 40; // Less padding on mobile
      slideWidth = containerWidth; // Full width slides on mobile
    } else {
      // Desktop/tablet view
      containerWidth = carousel.parentElement.offsetWidth - 120;
      slideWidth = containerWidth / slidesToShow - (40 * (slidesToShow - 1)) / slidesToShow;
    }

    // Update each team member's width
    teamMembers.forEach((member) => {
      member.style.width = `${slideWidth}px`;
      member.style.minWidth = `${slideWidth}px`;
      member.style.maxWidth = `${slideWidth}px`;
    });

    // Update carousel width to accommodate all slides
    carousel.style.width = `${slideWidth * teamMembers.length + 40 * (teamMembers.length - 1)}px`;

    // Reset position when screen size changes
    currentPosition = 0;
    updateSlidePosition();
    updateButtonVisibility();
  }

  // Handle next slide
  function nextSlide() {
    const maxPosition = teamMembers.length - slidesToShow;
    if (currentPosition < maxPosition) {
      currentPosition++;
    } else {
      currentPosition = 0; // Loop back to beginning on mobile
    }
    updateSlidePosition();

    // Reset the auto-slide timer when manually navigating
    startAutoSlide();
  }

  // Handle previous slide
  function prevSlide() {
    if (currentPosition > 0) {
      currentPosition--;
      updateSlidePosition();
    }

    // Reset the auto-slide timer when manually navigating
    startAutoSlide();
  }

  // Update slide position with smooth transition
  function updateSlidePosition() {
    const slideWidth = teamMembers[0].offsetWidth;
    const gapWidth = 40; // Match the gap from CSS
    const moveAmount = slideWidth + gapWidth;
    carousel.style.transition = "transform 0.5s ease";
    carousel.style.transform = `translateX(${-currentPosition * moveAmount}px)`;

    // Update button states
    updateButtonStates();
  }

  // Update button states based on position
  function updateButtonStates() {
    // On mobile, we always enable the next button for circular navigation
    if (window.innerWidth <= 768) {
      nextButton.disabled = false;
      nextButton.style.opacity = "1";
    } else {
      prevButton.disabled = currentPosition === 0;
      nextButton.disabled = currentPosition === teamMembers.length - slidesToShow;

      prevButton.style.opacity = prevButton.disabled ? "0.5" : "1";
      nextButton.style.opacity = nextButton.disabled ? "0.5" : "1";
    }
  }

  // Attach event listeners
  function attachEventListeners() {
    nextButton.addEventListener("click", nextSlide);
    prevButton.addEventListener("click", prevSlide);
    window.addEventListener(
      "resize",
      debounce(() => {
        updateCarouselDimensions();
        updateButtonVisibility();
      }, 250)
    );

    // Touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
      // Pause the auto-slide while touching
      stopAutoSlide();
    });

    carousel.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      // Resume auto-slide after touch ends
      startAutoSlide();
    });

    // Pause the auto-slide when user hovers on carousel
    carousel.addEventListener("mouseenter", stopAutoSlide);

    // Resume auto-slide when user leaves the carousel
    carousel.addEventListener("mouseleave", startAutoSlide);

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
