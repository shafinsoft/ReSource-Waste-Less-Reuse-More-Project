
// ReSource Authentication Page Interactions

document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // MOBILE NAVIGATION
    // =====================================

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {

        // Initial accessibility state
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-controls", "navLinks");
        menuToggle.setAttribute("aria-label", "Open menu");

        // Open / Close menu
        menuToggle.addEventListener("click", () => {

            const isOpen = navLinks.classList.toggle("open");

            menuToggle.setAttribute("aria-expanded", isOpen);
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close menu" : "Open menu"
            );

            menuToggle.textContent = isOpen ? "✕" : "☰";
        });

        // Close menu after clicking a navigation link
        navLinks.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {
                closeMenu();
            });

        });

        // Close menu when clicking outside
        document.addEventListener("click", (event) => {

            if (
                !navLinks.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMenu();
            }

        });

        // Close menu with Escape key
        document.addEventListener("keydown", (event) => {

            if (event.key === "Escape") {
                closeMenu();
            }

        });

        // Close menu when returning to desktop screen
        window.addEventListener("resize", () => {

            if (window.innerWidth > 850) {
                closeMenu();
            }

        });

        // Reusable close function
        function closeMenu() {

            navLinks.classList.remove("open");

            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open menu");

            menuToggle.textContent = "☰";
        }
    }

    // =====================================
    // ROLE CARD HOVER INTERACTIONS
    // =====================================

    const roleCards = document.querySelectorAll(".role");

    roleCards.forEach(card => {

        card.addEventListener("mouseenter", () => {
            card.classList.add("is-hovered");
        });

        card.addEventListener("mouseleave", () => {
            card.classList.remove("is-hovered");
        });

    });

});
