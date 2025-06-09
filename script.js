let isTextVisible = false;
let currentSlide = 0;
let slideInterval;
let startX = 0;
let isDragging = false;
const totalSlides = 5;
const slides = document.querySelectorAll('.carousel-slide');
const container = document.getElementById('carouselContainer');

function toggleText() {
    const hiddenText = document.getElementById('hiddenText');
    const btn = document.querySelector('.toggle-btn');
    if (hiddenText.style.display === 'block') {
        hiddenText.style.display = 'none';
        btn.textContent = 'Lihat Info';
    } else {
        hiddenText.style.display = 'block';
        btn.textContent = 'Tutup Info';
    }
}

// Carousel functionality
function updateCarousel() {
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

function updateIndicators(index) {
    const indicators = document.querySelectorAll('.carousel-indicator');
    indicators.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function showSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentSlide = index;
    container.style.transform = `translateX(-${index * 100}%)`;
}

// Tombol navigasi
function changeSlide(n) {
    showSlide(currentSlide + n);
}

// Inisialisasi
showSlide(0);

function autoSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide); // This moves the slide
    updateCarousel();        // This updates the indicators
}

function startAutoSlide() {
    slideInterval = setInterval(autoSlide, 3000);
}

function stopAutoSlide() {
    clearInterval(slideInterval);
}

function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}

// Mouse drag functionality
function handleMouseDown(e) {
    isDragging = true;
    startX = e.clientX;
    container.style.cursor = 'grabbing';
}

function handleMouseMove(e) {
    if (!isDragging) return;
    e.preventDefault();
}

function handleMouseUp(e) {
    if (!isDragging) return;
    isDragging = false;
    
    const endX = e.clientX;
    const diffX = startX - endX;
    
    if (Math.abs(diffX) > 50) { // Minimum drag distance
        if (diffX > 0) {
            changeSlide(1); // Drag left, go to next slide
        } else {
            changeSlide(-1); // Drag right, go to previous slide
        }
    }
    
    container.style.cursor = 'grab';
}

// Navigation bar hover effect
function initNavbarHover() {
    const navbar = document.querySelector('.navbar');
    navbar.addEventListener('mouseenter', () => {
        navbar.classList.add('dark');
    });
    navbar.addEventListener('mouseleave', () => {
        navbar.classList.remove('dark');
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-links a, .footer-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Scroll Animation Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Initialize animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-left, .slide-right, .scale-up');
    animatedElements.forEach(el => observer.observe(el));

    // Staggered animation for list items
    const staggerItems = document.querySelectorAll('.stagger-item');
    staggerItems.forEach((item, index) => {
        const itemObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                }, index * 200);
            }
        });
        }, observerOptions);
        itemObserver.observe(item);
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initNavbarHover();
    startAutoSlide();
    
    // Add mouse events to carousel
    container.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Pause auto-slide on hover
    const carousel = document.querySelector('.product-carousel');
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);
});

// Navbar background change on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50 && !navbar.classList.contains('dark')) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        navbar.style.borderBottom = '1px solid rgba(0, 0, 0, 0.15)';
    } else if (window.scrollY <= 50 && !navbar.classList.contains('dark')) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.72)';
        navbar.style.borderBottom = '1px solid rgba(0, 0, 0, 0.1)';
    }
});
