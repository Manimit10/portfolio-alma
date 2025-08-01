document.addEventListener("DOMContentLoaded", () => {
    // Set initial theme from localStorage or use system preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem("theme") || (prefersDark ? "dark" : "light");
    document.querySelector("html").setAttribute("data-theme", savedTheme);

    // Smooth scrolling
    document.querySelectorAll("a[href^=\"#\"]").forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute("href")).scrollIntoView({
                behavior: "smooth"
            });
        });
    });

    // Responsive navigation toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    // Dark/Light theme toggle
    const themeToggleBtn = document.getElementById("theme-toggle");

    // Function to handle theme updates
    function setTheme(theme) {
        document.querySelector("html").setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
        // Update button icon: sun for dark mode, moon for light mode
        themeToggleBtn.innerHTML = `<span class="theme-icon">${theme === "dark" ? "&#9788;" : "&#9728;"}</span>`;
        
        // Update theme-color meta tag
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === 'dark' ? '#121212' : '#f8f9fa');
        }
    }

    // Initialize theme
    setTheme(savedTheme);

    // Handle theme toggle
    themeToggleBtn.addEventListener("click", () => {
        const currentTheme = document.querySelector("html").getAttribute("data-theme");
        setTheme(currentTheme === "dark" ? "light" : "dark");
    });

    // Modal functionality for publications
    const modalButtons = document.querySelectorAll(".btn-read-more");
    modalButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modalId = button.getAttribute("data-modal-target");
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = "block";
            }
        });
    });

    const closeButtons = document.querySelectorAll(".modal .close-btn");
    closeButtons.forEach(closeBtn => {
        closeBtn.addEventListener("click", () => {
            closeBtn.closest(".modal").style.display = "none";
        });
    });

    window.addEventListener("click", (event) => {
        if (event.target.classList.contains("modal")) {
            event.target.style.display = "none";
        }
    });
});
