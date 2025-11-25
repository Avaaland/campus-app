console.log("script.js is connected to home page");

// Run JS after the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    setupCarousel();
    setupBackToTop();
    setupWeather();
    setupMapModal();
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

// Weather API
function setupWeather() {
    const tempEl = document.getElementById("weather-temp");
    if (!tempEl) return;

    // North Park University coordinates
    const latitude = 41.97503;
    const longitude = -87.71088;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=auto`;

    function describeWeather(code) {
        if (code === 0) return "Clear";
        if ([1, 2, 3].includes(code)) return "Partly cloudy";
        if ([45, 48].includes(code)) return "Foggy";
        if ([51, 53, 55].includes(code)) return "Drizzle";
        if ([61, 63, 65].includes(code)) return "Rain";
        if ([71, 73, 75, 77].includes(code)) return "Snow";
        if ([80, 81, 82].includes(code)) return "Showers";
        if ([95, 96, 99].includes(code)) return "Thunderstorms";
        return "Cloudy";
    }

    fetch(url)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            const current = data.current;
            if (!current) {
                throw new Error("No current weather data");
            }

            const temp = Math.round(current.temperature_2m);
            const desc = describeWeather(current.weather_code);

            tempEl.textContent = `Chicago, ${temp}°F, ${desc}`;
        })
        .catch((err) => {
            console.error("Weather error:", err);
            tempEl.textContent = "Chicago, 42°F, Cloudy"
        });
}

// Map zoom function
function setupMapModal() {
    const mapThumb = document.querySelector(".map-thumb");
    const modal = document.getElementById("map-modal");
    const modalImg = document.getElementById("map-modal-img");
    const closeBtn = document.querySelector(".close-map");

    if (!mapThumb || !modal || !modalImg) return;
    
    mapThumb.addEventListener("click", () => {
        modal.style.display = "flex";
        modalImg.src = mapThumb.src;
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
}