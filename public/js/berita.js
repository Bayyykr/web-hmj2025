//klik navbar
document.addEventListener('DOMContentLoaded', () => {
    // Get all elements
    const nav = document.querySelectorAll('[id^="klik"]');
    const cardAreas = document.querySelectorAll('.cardarea');
    const color = '#0000FF';

    let activespan = null;

    nav.forEach(span => {
        span.addEventListener("click", function () {
            // Reset previous active state
            if (activespan && activespan !== this) {
                activespan.style.color = "#000000";
            }

            // Set current span as active
            activespan = this;
            this.style.color = color;

            // Get selected category text
            const selectedCategory = this.textContent.trim();

            // Filter card areas
            cardAreas.forEach(card => {
                const cardCategory = card.querySelector('.widget ul li:last-child span:last-child').textContent.trim();

                if (selectedCategory === 'Semua' || cardCategory === selectedCategory) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});

// pagination
document.addEventListener('DOMContentLoaded', () => {
    // Pagination settings
    const itemsPerPage = 6;
    const cardAreas = document.querySelectorAll('.cardarea');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');

    // Category navigation elements
    const nav = document.querySelectorAll('[id^="klik"]');
    const color = '#0000FF';
    let activespan = null;

    // Pagination and filtering function
    function filterAndPaginateCards(category = 'Semua') {
        // Filter cards by category
        const visibleCards = Array.from(cardAreas).filter(card => {
            const cardCategory = card.querySelector('.widget ul li:last-child span:last-child').textContent.trim();
            return category === 'Semua' || cardCategory === category;
        });

        // Pagination calculations
        const totalCards = visibleCards.length;
        const totalPages = Math.ceil(totalCards / itemsPerPage);
        let currentPage = 1;

        // Function to show cards for current page
        function showCurrentPageCards() {
            // Hide all cards first
            cardAreas.forEach(card => card.style.display = 'none');

            // Calculate start and end indices
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;

            // Show cards for current page
            visibleCards.slice(startIndex, endIndex).forEach(card => card.style.display = 'block');

            // Update page info
            pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

            // Enable/disable pagination buttons
            prevPageBtn.disabled = currentPage === 1;
            nextPageBtn.disabled = currentPage === totalPages;
        }

        // Previous page button
        prevPageBtn.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                showCurrentPageCards();
            }
        };

        // Next page button
        nextPageBtn.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                showCurrentPageCards();
            }
        };

        // Initial page display
        showCurrentPageCards();

        // Category navigation
        nav.forEach(span => {
            span.addEventListener("click", function () {
                // Reset previous active state
                if (activespan && activespan !== this) {
                    activespan.style.color = "#000000";
                }

                // Set current span as active
                activespan = this;
                this.style.color = color;

                // Get selected category and filter
                const selectedCategory = this.textContent.trim();

                // Refilter and reset to first page
                filterAndPaginateCards(selectedCategory);
            });
        });
    }

    // Initial pagination
    filterAndPaginateCards();
});

// active nav
const nav = document.querySelectorAll('[id^="klik"]');
const color = '#0000FF';

let activespan = null;
nav.forEach(span => {
    span.addEventListener("click", function () {
        if (activespan && activespan !== this) {
            activespan.style.color = "#000000";
        }

        activespan = this;

        this.style.color = color;
    });
})