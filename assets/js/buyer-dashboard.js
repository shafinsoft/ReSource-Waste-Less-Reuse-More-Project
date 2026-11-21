/* =====================================================
   ReSource Buyer Dashboard
   Dashboard navigation and interactions
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

    // Toast notification
    function showToast(message) {
        let toast = $("#buyer-toast");

        if (!toast) {
            toast = document.createElement("div");
            toast.id = "buyer-toast";
            toast.setAttribute("role", "status");

            Object.assign(toast.style, {
                position: "fixed",
                right: "22px",
                bottom: "22px",
                zIndex: "9999",
                padding: "13px 18px",
                background: "#14213d",
                color: "#fff",
                borderRadius: "8px",
                fontSize: "14px",
                boxShadow: "0 5px 20px rgba(0,0,0,.18)",
                maxWidth: "320px"
            });

            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.style.display = "block";

        clearTimeout(toast.hideTimer);
        toast.hideTimer = setTimeout(() => {
            toast.style.display = "none";
        }, 2800);
    }

    // Set dashboard logo
    const logo = $(".brand-logo");

    if (logo) {
        logo.src = "assets/images/logo/1.png";
        logo.alt = "ReSource";
    }

    // Fix dashboard navigation paths
    const pageLinks = {
        "Dashboard": "buyer-dashboard.html",
        "Search Materials": "pages/buyer/browse-materials.html",
        "My Requests": "pages/buyer/my-requests.html",
        "Received Quotations": "pages/buyer/matching-quotations.html",
        "My Orders": "pages/buyer/my-orders.html",
        "Messages": "pages/buyer/messages.html",
        "Reviews": "pages/buyer/profile-settings.html#reviews",
        "Profile Settings": "pages/buyer/profile-settings.html"
    };

    $$(".sidebar a, .side-nav a").forEach(link => {
        const label = link.textContent.trim();

        if (pageLinks[label]) {
            link.href = pageLinks[label];
        }
    });

    // Logout: direct navigation, no confirmation popup
    $$(".logout-link, .logout").forEach(link => {
        link.href = "buyer-login.html";
        link.removeAttribute("onclick");
    });

    // Search materials
    const searchForm = $(".search-form");

    if (searchForm) {
        searchForm.addEventListener("submit", event => {
            event.preventDefault();

            const keyword = $('input[name="q"]', searchForm)?.value.trim() || "";
            const category = $('select[name="category"]', searchForm)?.value || "";

            const params = new URLSearchParams();

            if (keyword) params.set("q", keyword);
            if (category && category !== "All Categories") {
                params.set("category", category);
            }

            window.location.href =
                "pages/buyer/browse-materials.html" +
                (params.toString() ? "?" + params.toString() : "");
        });
    }

    // Dashboard View All links
    $$("a").forEach(link => {
        const label = link.textContent.trim().toLowerCase();

        if (label === "view all" && link.closest("#quotations")) {
            link.href = "pages/buyer/matching-quotations.html";
        }

        if (label === "view all" && link.closest("#requests, #request-history")) {
            link.href = "pages/buyer/my-requests.html";
        }
    });

    // Mobile sidebar toggle
    const toggle = $(".topbar-toggle");
    const sidebar = $(".sidebar");

    if (toggle && sidebar) {
        toggle.style.cursor = "pointer";
        toggle.setAttribute("role", "button");
        toggle.setAttribute("tabindex", "0");
        toggle.setAttribute("aria-label", "Toggle navigation");

        const toggleSidebar = () => {
            sidebar.classList.toggle("is-open");
        };

        toggle.addEventListener("click", toggleSidebar);

        toggle.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleSidebar();
            }
        });
    }

    // Generic demo action feedback
    document.addEventListener("click", event => {
        const button = event.target.closest("button, .small-button, .more-link");

        if (!button) return;

        const label = button.textContent.trim().toLowerCase();

        if (button.type === "submit" && button.closest("form")) return;
        if (button.closest(".search-form")) return;

        if (label === "view" || label.includes("view details")) {
            return;
        }

        if (label.includes("review")) {
            return;
        }

        if (label.includes("more options")) {
            event.preventDefault();
            showToast("More options are not connected yet.");
        }
    });

    // Current date
    const datePill = $(".today-pill");

    if (datePill) {
        datePill.textContent = new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    }

    console.log("ReSource Buyer Dashboard JS loaded.");
});