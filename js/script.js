console.log("script.js is connected to home page");

// Run JS after the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    setupCarousel();
    setupBackToTop();
    setupWeatherPlaceholder();
});

// Carousel logic
function setupCarousel() {
    const slides = document.querySelectorAll(".carousel-slide");
    const dots = document.querySelectorAll(".dot");
    const prevBtn = document.querySelector(".carousel-control.prev");
    const nextBtn = document.querySelector(".carousel-control.next");

    if (!slides.length) return;

    let currentIndex = 0;
    let autoplayTimer = null;

    function goToSlide(index) {
        // keep index in range
        if (index < 0) {
            index = slides.length -1;
        } else if (index >= slides.length) {
            index = 0
        }
        currentIndex = index;

        // update active slide
        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === currentIndex);
        });

        // update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentIndex);
        });
    }

    // Next / Previous
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex -1);
    }

    // Button listeners
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            nextSlide();
            resetAutoplay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            prevSlide();
            resetAutoplay();
        });
    }

    // Dots Click
    dots.forEach((dot) => {
        dot.addEventListener("click", () => {
            const index = parseInt(dot.dataset.index, 10);
            goToSlide(index);
            resetAutoplay();
        });
    });

    // Autoplay function
    function startAutoplay() {
        autoplayTimer = setInterval(() => {
            nextSlide();
        }, 5000);
    }

    function resetAutoplay() {
        clearInterval(autoplayTimer);
        startAutoplay();
    }

    goToSlide(0);
    startAutoplay();
}

// Back to top button
function setupBackToTop() {
    const btn = document.getElementById("back-to-top");
    if (!btn) return;

    btn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });
}

// Weather placeholder, will replace with real API later
function setupWeatherPlaceholder() {
    const tempEl = document.getElementById("weather-temp");
    if (!tempEl) return;

    //For now, fake text sp it doesn't look empty
    tempEl.textContent = "Chicago, 42 F, Cloudy";
}