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
const cardHeight = document.querySelector('.schedule-card').offsetHeight + 17; // height + margin

// Clone the initial cards and append them to create infinite scroll effect
function setupInfiniteScroll() {
    // Clone all original cards
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        cardsContainer.appendChild(clone);
        
        // Add hover effects to both original and cloned cards
        [card, clone].forEach(element => {
            element.addEventListener('mouseover', () => {
                element.style.transform = 'translateY(-5px)';
                element.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
            });
            
            element.addEventListener('mouseout', () => {
                element.style.transform = 'translateY(0)';
                element.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
            });
        });
    });
}

// Initialize current position and total cards
let currentPosition = 0;
const totalOriginalCards = cards.length;

// Handle pagination dots click
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        // Update active dot
        dots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        
        // Calculate new position
        currentPosition = index * cardHeight;
        
        // Smooth scroll to position
        cardsContainer.style.transition = 'transform 0.5s ease';
        cardsContainer.style.transform = `translateY(-${currentPosition}px)`;
        
        // Check if we're at the end
        if (index === totalOriginalCards - 1) {
            // Wait for animation to complete
            setTimeout(() => {
                // Remove transition for instant jump
                cardsContainer.style.transition = 'none';
                currentPosition = 0;
                cardsContainer.style.transform = `translateY(0)`;
                
                // Reset active dot
                dots.forEach(d => d.classList.remove('active'));
                dots[0].classList.add('active');
                
                // Restore transition after jump
                setTimeout(() => {
                    cardsContainer.style.transition = 'transform 0.5s ease';
                }, 50);
            }, 500);
        }
    });
});

// Initialize infinite scroll
setupInfiniteScroll();