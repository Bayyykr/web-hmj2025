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
// Get all required elements
const dots = document.querySelectorAll('.dot');
const cardsContainer = document.querySelector('.cards-container');
const cards = document.querySelectorAll('.schedule-card');
const cardHeight = document.querySelector('.schedule-card').offsetHeight + 20;

// Clone the initial cards and append them to create infinite scroll effect
function setupInfiniteScroll() {
    // Clone many more sets for continuous infinite scroll
    for (let i = 0; i < 100; i++) {  // Significantly increased clone sets
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            cardsContainer.appendChild(clone);
            
            clone.addEventListener('mouseover', () => {
                clone.style.transform = 'translateY(-5px)';
                clone.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
                pauseAutoScroll();
            });
            
            clone.addEventListener('mouseout', () => {
                clone.style.transform = 'translateY(0)';
                clone.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                resumeAutoScroll();
            });
        });
    }
}

// Initialize variables
let currentPosition = 0;
const totalOriginalCards = cards.length;
let isAnimating = false;
let currentDotIndex = 0;
let autoScrollInterval;
let isPaused = false;

// Function to update dots
function updateDots(index) {
    dots.forEach(d => d.classList.remove('active'));
    dots[index].classList.add('active');
}

// Function to handle smooth scroll
function smoothScroll(targetPosition, duration) {
    const start = currentPosition;
    const change = targetPosition - start;
    const startTime = performance.now();

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        currentPosition = start + change * progress;
        cardsContainer.style.transform = `translateY(-${currentPosition}px)`;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isAnimating = false;
        }
    }

    requestAnimationFrame(animate);
}

// Function to handle next slide
function nextSlide() {
    if (isAnimating || isPaused) return;
    
    currentDotIndex = (currentDotIndex + 1) % totalOriginalCards;
    updateDots(currentDotIndex);

    // Always move downward
    currentPosition += cardHeight;
    
    isAnimating = true;
    smoothScroll(currentPosition, 500);
}

// Auto scroll functions
function startAutoScroll() {
    autoScrollInterval = setInterval(nextSlide, 5000);
}

function pauseAutoScroll() {
    isPaused = true;
    clearInterval(autoScrollInterval);
}

function resumeAutoScroll() {
    isPaused = false;
    startAutoScroll();
}

// Handle pagination dots click
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        if (isAnimating) return;
        pauseAutoScroll();
        
        const previousDotIndex = currentDotIndex;
        currentDotIndex = index;
        updateDots(index);

        // Calculate position adjustment based on dot change
        const dotDifference = index - previousDotIndex;
        const adjustedPosition = currentPosition + (dotDifference * cardHeight);
        
        isAnimating = true;
        smoothScroll(adjustedPosition, 500);
        
        setTimeout(resumeAutoScroll, 500);
    });
});

// Add hover effects to original cards
cards.forEach(card => {
    card.addEventListener('mouseover', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
        pauseAutoScroll();
    });
    
    card.addEventListener('mouseout', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
        resumeAutoScroll();
    });
});

// Initialize
setupInfiniteScroll();
startAutoScroll();