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
const eventImage = document.querySelector('.image-section img');

const images = window.EVENT_IMAGES || [];

let currentPosition = 0;
let isAnimating = false;
let currentDotIndex = 0;
let autoScrollInterval;
let isPaused = false;
let scrollCount = 0;
let totalCards = 0;
let currentImageIndex = 0;

function preloadImages() {
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

function setupCards() {
    const originalCards = Array.from(cards);
    
    for (let i = 0; i < 100; i++) {
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            cardsContainer.appendChild(clone);
            addCardListeners(clone);
        });
    }
    
    totalCards = cardsContainer.children.length;

    const allCards = cardsContainer.querySelectorAll('.schedule-card');
    allCards.forEach((card, index) => {
        if (index % 3 === 0) {
            card.classList.add('active');
        }
    });

    updateImage(0);
}

function updateImage(newIndex) {
    // Normalize the index to stay within bounds (0-2)
    newIndex = newIndex % 3;
    
    if (currentImageIndex === newIndex || newIndex >= images.length) return;
    
    const newImage = new Image();
    newImage.src = images[newIndex];
    
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
    const allCards = cardsContainer.querySelectorAll('.schedule-card');
    
    // Normalize the visible index to stay within 0-2 range
    const visibleIndex = Math.floor(currentPosition / cardHeight) % 3;
    
    allCards.forEach(card => {
        card.classList.remove('active');
    });
    
    for (let i = 0; i < allCards.length; i++) {
        if (i % 3 === visibleIndex) {
            allCards[i].classList.add('active');
        }
    }

    updateImage(visibleIndex);
}

function smoothScroll(targetPosition, duration) {
    if (isAnimating) return;

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

            // Only check for max scroll count during auto-scroll
            if (!isPaused && scrollCount >= maxScrollCount) {
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
    if (isPaused) return;

    // Keep currentDotIndex within bounds (0-2)
    currentDotIndex = (currentDotIndex + 1) % 3;
    updateDots(currentDotIndex);

    const targetPosition = currentPosition + cardHeight;
    smoothScroll(targetPosition, 500);
}

function startAutoScroll() {
    setTimeout(() => {
        if (!isPaused && scrollCount < maxScrollCount) {
            autoScrollInterval = setInterval(nextSlide, 3000);
        }
    }, 1000);
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

// Modified dots click handler
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        if (isAnimating) return; // Prevent clicking while animating
        
        pauseAutoScroll();
        
        // Calculate the nearest multiple of 3 cards for smooth transitions
        const currentCardSet = Math.floor(currentPosition / (cardHeight * 3));
        const basePosition = currentCardSet * cardHeight * 3;
        const targetPosition = basePosition + (index * cardHeight);
        
        currentDotIndex = index;
        updateDots(index);
        
        // Use a longer duration for dot navigation to make it smoother
        smoothScroll(targetPosition, 800);
        
        // Resume auto-scroll after a longer delay
        setTimeout(resumeAutoScroll, 1000);
    });
});

const style = document.createElement('style');
style.textContent = `
    .image-section img {
        transition: opacity 0.3s ease-in-out;
    }
`;
document.head.appendChild(style);

preloadImages();
cards.forEach(card => addCardListeners(card));
setupCards();
updateDots(0);
startAutoScroll();