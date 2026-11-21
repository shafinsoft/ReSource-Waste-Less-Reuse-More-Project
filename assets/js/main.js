// ReSource homepage interactions — original behavior retained + refined motion.
document.addEventListener("DOMContentLoaded", () => {

    // Hero video fallback and resource-friendly playback.
    const heroVideo = document.querySelector(".hero-video");
    if (heroVideo) {
        heroVideo.addEventListener("error", () => {
            heroVideo.style.display = "none";
        });
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) heroVideo.pause();
            else if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                heroVideo.play().catch(() => {});
            }
        });
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            heroVideo.pause();
        }
    }

    // Render Lucide icons.
    if (window.lucide) window.lucide.createIcons();

    // Mobile navigation toggle.
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            const isOpen = mainNav.classList.toggle("open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
            if (window.lucide) {
                menuToggle.innerHTML = isOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
                window.lucide.createIcons();
            }
        });
        mainNav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                mainNav.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open navigation");
                if (window.lucide) {
                    menuToggle.innerHTML = '<i data-lucide="menu"></i>';
                    window.lucide.createIcons();
                }
            });
        });
    }

    // Homepage category search — original category matching retained.
    const searchForm = document.getElementById("material-search-form");
    const searchInput = document.getElementById("material-search");
    const categoryCards = document.querySelectorAll(".category-card");
    const searchFeedback = document.getElementById("searchFeedback");

    if (searchForm && searchInput && categoryCards.length) {
        searchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const query = searchInput.value.trim().toLowerCase();
            let visibleCount = 0;

            categoryCards.forEach((card) => {
                const category = (card.dataset.category || "").toLowerCase();
                const cardText = card.textContent.toLowerCase();
                const matches = !query || category.includes(query) || cardText.includes(query);
                card.classList.toggle("search-hidden", !matches);
                if (matches) visibleCount += 1;
            });

            if (searchFeedback) {
                if (!query) searchFeedback.textContent = "Showing all material categories.";
                else if (visibleCount > 0) searchFeedback.textContent =
                    `${visibleCount} matching categor${visibleCount === 1 ? "y" : "ies"} found.`;
                else searchFeedback.textContent = "No matching category found. Try another material name.";
            }
            document.getElementById("categories")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });

        searchInput.addEventListener("input", () => {
            if (!searchInput.value.trim()) {
                categoryCards.forEach((card) => card.classList.remove("search-hidden"));
                if (searchFeedback) searchFeedback.textContent = "";
            }
        });
    }

    // Staggered reveal on scroll.
    const revealItems = document.querySelectorAll(
        ".benefit, .category-card, .how-heading, .step, .contact-copy, .contact-actions, .footer-brand-column, .footer-column, .footer-bottom"
    );
    if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        revealItems.forEach((item, index) => {
            item.classList.add("reveal-item");
            item.style.transitionDelay = `${(index % 4) * 75}ms`;
        });
        const observer = new IntersectionObserver((entries, currentObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    currentObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
        revealItems.forEach((item) => observer.observe(item));
    }

    // Subtle pointer tilt on material cards, desktop only.
    const canTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (canTilt) {
        document.querySelectorAll(".category-card").forEach((card) => {
            card.addEventListener("pointermove", (event) => {
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;
                card.style.transform = `perspective(900px) translateY(-5px) rotateX(${(0.5-y)*3}deg) rotateY(${(x-0.5)*3}deg)`;
            });
            card.addEventListener("pointerleave", () => { card.style.transform = ""; });
        });
    }

    // Update copyright year automatically.
    const yearElement = document.getElementById("current-year");
    if (yearElement) yearElement.textContent = new Date().getFullYear();
});
