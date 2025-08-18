//Function for generating the rating stars:
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Function to create product HTML:
function createProductHTML(product) {
    return `
        <div class="pro" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}">
            <div class="des">
               <strong><span>${product.brand}</span></strong>
                <h5>${product.name}</h5>
                <div class="star">
                    ${generateStars(product.rating)}
                </div>
                <h4>৳${product.price}</h4>
            </div>
            <a href="#" class="add-to-cart" onclick="cart.addItem({
                id: '${product.id}',
                name: '${product.name}',
                price: ${product.price},
                image: '${product.image}'
            }); return false;">
                <i class="fas fa-shopping-cart cart"></i>
            </a>
        </div>
    `;
}

// Function to load products
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        const data = await response.json();

        // Check if we're on the shop page by looking for specific elements
        const isShopPage = document.querySelector('#page-header') !== null;

        if (isShopPage) {
            // Shop page - combine all products in one container
            const productContainer = document.querySelector('#product1 .pro-container');
            if (productContainer) {
                const allProducts = [...data.featuredProducts, ...data.newArrivals];
                productContainer.innerHTML = allProducts
                    .map(product => createProductHTML(product))
                    .join('');
            }
        } else {
            // Home page - separate featured and new arrivals
            const featuredContainer = document.querySelector('#product1 .pro-container');
            if (featuredContainer) {
                featuredContainer.innerHTML = data.featuredProducts
                    .map(product => createProductHTML(product))
                    .join('');
            }

            const newArrivalsContainer = document.querySelector('#product2 .pro-container');
            if (newArrivalsContainer) {
                newArrivalsContainer.innerHTML = data.newArrivals
                    .map(product => createProductHTML(product))
                    .join('');
            }
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Initialize slideshow functionality
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    // Slideshow functionality
    const slider = document.querySelector('.slider');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.slider-dots');

    let currentSlide = 0;
    const slideCount = slides.length;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(n) {
        currentSlide = (n + slideCount) % slideCount;
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateDots();
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    // Event listeners
    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);

    // Initialize first slide
    goToSlide(0);

    // Auto-advance slides every 5 seconds
    setInterval(nextSlide, 5000);
});