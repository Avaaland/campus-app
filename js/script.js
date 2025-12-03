// Log to confirm that the script fiels is loaded correctly
console.log("script.js is connected to home page");

// Run JS after the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    setupCarousel(); // Sets up image carousel
    setupBackToTop(); // Sets up back to top button
    setupWeather(); // Fetches and displays current weather
    setupMapModal(); // Sets up clickable campus map modal
});

// Carousel logic. This rotates background photos and has manual navigation
function setupCarousel() {
    // Get all slide elements, navigation dots and arrow buttons
    const slides = document.querySelectorAll(".carousel-slide");
    const dots = document.querySelectorAll(".dot");
    const prevBtn = document.querySelector(".carousel-control.prev");
    const nextBtn = document.querySelector(".carousel-control.next");

    // If tehere are no slides, exit. For example, the dining and events pages
    if (!slides.length) return;

    let currentIndex = 0; // Track which slide is currenlty active
    let autoplayTimer = null; // Holds the interval ID for automatic rotation

    // Move to specific slide by index and update visible slide and active dot
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

    // Next slide
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    // Previous slide
    function prevSlide() {
        goToSlide(currentIndex -1);
    }

    // Button listener
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            nextSlide();
            resetAutoplay(); // Restart the timer if user navigates manually
        });
    }

    // Button listener
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

    // Autoplay function, every 5 seconds
    function startAutoplay() {
        autoplayTimer = setInterval(() => {
            nextSlide();
        }, 5000);
    }

    // Clear the current timer and start a new one
    function resetAutoplay() {
        clearInterval(autoplayTimer);
        startAutoplay();
    }

    // Initialize carousel on first slide and start
    goToSlide(0);
    startAutoplay();
}

// Back to top button
function setupBackToTop() {
    const btn = document.getElementById("back-to-top");
    // If no button exists, exit
    if (!btn) return;

    btn.addEventListener("click", () => {
        // Smoothly scrool to the top
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });
}

// Weather API using Open-Meteo
function setupWeather() {
    const tempEl = document.getElementById("weather-temp");
    // If weather element is missing, do not run
    if (!tempEl) return;

    // North Park University coordinates
    const latitude = 41.97503;
    const longitude = -87.71088;

    // Request URL for Open-Meteo with farhenheit and current weather
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=auto`;

    // Helper function to translate Open-Meteo weather codes to text description
    function describeWeather(code) {
        if (code === 0) return "Clear";
        if ([1, 2, 3].includes(code)) return "Partly cloudy";
        if ([45, 48].includes(code)) return "Foggy";
        if ([51, 53, 55].includes(code)) return "Drizzle";
        if ([61, 63, 65].includes(code)) return "Rain";
        if ([71, 73, 75, 77].includes(code)) return "Snow";
        if ([80, 81, 82].includes(code)) return "Showers";
        if ([95, 96, 99].includes(code)) return "Thunderstorms";
        // Fallback if code is unknown
        return "Cloudy";
    }

    // Fetch current weather data
    fetch(url)
        .then((res) => {
            // Check for HTTP errors
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            const current = data.current;
            // If API didn't return current data, show fallback
            if (!current) {
                throw new Error("No current weather data");
            }

            // Round temperature
            const temp = Math.round(current.temperature_2m);
            const desc = describeWeather(current.weather_code);

            // Show weather in the header
            tempEl.textContent = `Chicago, ${temp}°F, ${desc}`;
        })
        .catch((err) => {
            // Log error in console and show fallback
            console.error("Weather error:", err);
            tempEl.textContent = "Chicago, 42°F, Cloudy"
        });
}

// Map zoom function
function setupMapModal() {
    const mapThumb = document.querySelector(".map-thumb"); // Small map image
    const modal = document.getElementById("map-modal"); // Modal overlay
    const modalImg = document.getElementById("map-modal-img"); // Large image inside modal
    const closeBtn = document.querySelector(".close-map"); // Close button

    // If elements don't exist, exit
    if (!mapThumb || !modal || !modalImg) return;
    
    // When user clicks, show modal
    mapThumb.addEventListener("click", () => {
        modal.style.display = "flex"; // Show modal using flexbox centering
        modalImg.src = mapThumb.src; // Use the same image source
    });

    // Close button hides modal
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    // A click outside the image also closes the modal
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
}