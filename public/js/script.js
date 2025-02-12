// NAVBAR scroll
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    // Check if the page has been scrolled more than 50px
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});
// ANIMASI HOVER
document.body.classList.add('preload');

document.addEventListener('DOMContentLoaded', function () {
    const navItems = document.querySelectorAll('.navbar-nav .nav-item');
    const animation = document.querySelector('.animation');
    let activeItem = null;

    // Remove preload after a brief delay
    setTimeout(() => {
        document.body.classList.remove('preload');
    }, 100);

    // Function to update animation position
    function updateAnimation(item) {
        animation.style.left = item.offsetLeft + 15 + 'px';
        animation.style.width = item.offsetWidth - 30 + 'px';
    }

    // Function to update active state
    function setActiveState(item) {
        // Remove active class from all links
        navItems.forEach(navItem => {
            navItem.querySelector('.nav-link').classList.remove('active');
        });

        // Add active class to current item
        if (item) {
            item.querySelector('.nav-link').classList.add('active');
        }
    }

    // Set initial position based on current page
    const currentPath = window.location.pathname;
    navItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        const href = link.getAttribute('href');

        // Check if this is the current page
        if ((currentPath === '/' && href === '/') ||
            (href !== '/' && currentPath.includes(href))) {
            activeItem = item;
            updateAnimation(item);
            setActiveState(item);
        }
    });

    // Handle hover
    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            updateAnimation(item);
        });

        item.addEventListener('mouseleave', () => {
            if (activeItem) {
                updateAnimation(activeItem);
            }
        });
    });
});

//video yt
document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('video-popup');
    const playButton = document.getElementById('play-button');
    const closeButton = document.getElementById('close-button');
    const iframe = document.getElementById('youtube-player');

    // Open popup when play button is clicked
    playButton.addEventListener('click', function(e) {
        e.preventDefault();
        popup.style.display = 'flex'; // Changed to flex for better centering
        iframe.src = iframe.src.replace('autoplay=0', 'autoplay=1');
    });

    // Close popup when close button is clicked
    closeButton.addEventListener('click', function() {
        popup.style.display = 'none';
        iframe.src = iframe.src.replace('autoplay=1', 'autoplay=0');
    });

    // Close popup when clicking outside the video container
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            popup.style.display = 'none';
            iframe.src = iframe.src.replace('autoplay=1', 'autoplay=0');
        }
    });
});

//kalender kegiatan
const dots = document.querySelectorAll('.dot');
const cardsContainer = document.querySelector('.cards-container');
const cards = document.querySelectorAll('.schedule-card');
const cardHeight = 113; // Card height (93px) + margin (20px)
const maxScrollCount = 100; // Maximum number of scrolls
const visibleCards = 3; // Number of visible cards at once
const eventImage = document.querySelector('.image-section img'); // Get the image element

// Array of image paths for each slide
const images = [
    '/img/schedule/kegiatan1.png',
    '/img/schedule/kegiatan2.png',
    '/img/schedule/kegiatan3.png'
];

let currentPosition = 0;
let isAnimating = false;
let currentDotIndex = 0;
let autoScrollInterval;
let isPaused = false;
let scrollCount = 0;
let totalCards = 0;
let currentImageIndex = 0; // Track current image index

function preloadImages() {
    // Preload all images to prevent flashing
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

function setupCards() {
    // Clone original cards multiple times to allow for more scrolling
    const originalCards = Array.from(cards);
    
    // Create multiple sets of clones
    for (let i = 0; i < 100; i++) {
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            cardsContainer.appendChild(clone);
            addCardListeners(clone);
        });
    }
    
    totalCards = cardsContainer.children.length;

    // Set initial active state for the first card of each set
    const allCards = cardsContainer.querySelectorAll('.schedule-card');
    allCards.forEach((card, index) => {
        if (index % 3 === 0) {
            card.classList.add('active');
        }
    });
}

function updateImage(newIndex) {
    // Only update if the image index has actually changed
    if (currentImageIndex === newIndex) return;
    
    // Create and prepare new image
    const newImage = new Image();
    newImage.src = images[newIndex];
    
    // Once new image is loaded, perform the transition
    newImage.onload = () => {
        eventImage.style.opacity = '0';
        
        setTimeout(() => {
            eventImage.src = images[newIndex];
            eventImage.style.opacity = '1';
            currentImageIndex = newIndex;
        }, 300);
    };
}

function updateCardColors() {
    // Get all cards (including clones)
    const allCards = cardsContainer.querySelectorAll('.schedule-card');
    
    // Calculate which cards should be active based on current position
    const visibleIndex = Math.floor(currentPosition / cardHeight) % 3;
    
    // Remove active class from all cards
    allCards.forEach(card => {
        card.classList.remove('active');
    });
    
    // Add active class to cards at the current visible position
    for (let i = 0; i < allCards.length; i++) {
        if (i % 3 === visibleIndex) {
            allCards[i].classList.add('active');
        }
    }

    // Update image based on visible index
    updateImage(visibleIndex);
}

function smoothScroll(targetPosition, duration) {
    if (isAnimating || scrollCount >= maxScrollCount) return;

    const start = currentPosition;
    const change = targetPosition - start;
    const startTime = performance.now();
    isAnimating = true;

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeProgress = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        currentPosition = start + change * easeProgress;
        cardsContainer.style.transform = `translateY(-${currentPosition}px)`;
        updateCardColors();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isAnimating = false;
            scrollCount++;

            if (scrollCount >= maxScrollCount) {
                pauseAutoScroll();
            }
        }
    }

    requestAnimationFrame(animate);
}

function addCardListeners(card) {
    card.addEventListener('mouseover', () => pauseAutoScroll());
    card.addEventListener('mouseout', () => {
        if (scrollCount < maxScrollCount) {
            resumeAutoScroll();
        }
    });
}

function nextSlide() {
    if (isPaused || scrollCount >= maxScrollCount) return;

    currentDotIndex = (currentDotIndex + 1) % dots.length;
    updateDots(currentDotIndex);

    const targetPosition = currentPosition + cardHeight;
    smoothScroll(targetPosition, 500);
}

function startAutoScroll() {
    // Delay the start of auto-scrolling to show initial active state
    setTimeout(() => {
        if (scrollCount < maxScrollCount) {
            autoScrollInterval = setInterval(nextSlide, 3000);
        }
    }, 1000); // 1 second delay before starting auto-scroll
}

function pauseAutoScroll() {
    isPaused = true;
    clearInterval(autoScrollInterval);
}

function resumeAutoScroll() {
    if (scrollCount < maxScrollCount) {
        isPaused = false;
        startAutoScroll();
    }
}

function updateDots(index) {
    dots.forEach(d => d.classList.remove('active'));
    dots[index].classList.add('active');
}

// Handle dot clicks
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        if (scrollCount >= maxScrollCount) return;

        pauseAutoScroll();

        const rotations = Math.floor(currentPosition / (cardHeight * cards.length));
        const basePosition = rotations * cardHeight * cards.length;
        const targetPosition = basePosition + (index * cardHeight);
        
        currentDotIndex = index;
        updateDots(index);

        smoothScroll(targetPosition, 500);
        setTimeout(resumeAutoScroll, 500);
    });
});

// Add CSS for image transitions
const style = document.createElement('style');
style.textContent = `
    .image-section img {
        transition: opacity 0.3s ease-in-out;
    }
`;
document.head.appendChild(style);

// Preload images before starting
preloadImages();

// Add listeners to original cards
cards.forEach(card => addCardListeners(card));

// Initialize
setupCards();

// Set initial dot state
updateDots(0);

// Start auto-scroll with delay
startAutoScroll();