
/* =====================================================
   ReSource Supplier Dashboard
   Dashboard interactions and navigation
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    // Common selectors
    const $ = (selector, root = document) =>
        root.querySelector(selector);

    const $$ = (selector, root = document) =>
        [...root.querySelectorAll(selector)];


    // =====================================================
    // 1. TOAST NOTIFICATION
    // =====================================================

    let toast = $("#sup-toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "sup-toast";
        toast.className = "sup-toast";
        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");

        document.body.appendChild(toast);
    }

    let toastTimer;

    const notify = (message, type = "success") => {
        toast.textContent = message;
        toast.dataset.type = type;
        toast.classList.add("is-visible");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove("is-visible");
        }, 3000);
    };


    // =====================================================
    // 2. LIVE DASHBOARD DATE
    // =====================================================

    const date = $(".sup-page-head .sup-date");

    if (date) {
        date.textContent = new Intl.DateTimeFormat("en", {
            weekday: "long",
            month: "short",
            day: "numeric",
            year: "numeric"
        }).format(new Date());
    }


    // =====================================================
    // 3. RESPONSIVE SIDEBAR MENU
    // =====================================================

    const sidebar = $(".sup-sidebar");
    const topbar = $(".sup-topbar");

    if (sidebar && topbar && !$(".sup-menu-toggle", topbar)) {

        const toggle = document.createElement("button");

        toggle.type = "button";
        toggle.className = "sup-menu-toggle";
        toggle.setAttribute(
            "aria-label",
            "Toggle supplier navigation"
        );
        toggle.setAttribute("aria-expanded", "false");

        toggle.innerHTML =
            "<span></span><span></span><span></span>";

        const right = $(".sup-top-right", topbar);

        topbar.insertBefore(toggle, right || null);

        toggle.addEventListener("click", () => {

            const open = sidebar.classList.toggle("is-open");

            document.body.classList.toggle(
                "sup-nav-open",
                open
            );

            toggle.setAttribute(
                "aria-expanded",
                String(open)
            );
        });

        // Close sidebar when clicking outside
        document.addEventListener("click", event => {

            if (
                sidebar.classList.contains("is-open") &&
                !sidebar.contains(event.target) &&
                !toggle.contains(event.target)
            ) {
                sidebar.classList.remove("is-open");

                document.body.classList.remove(
                    "sup-nav-open"
                );

                toggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }
        });
    }


    // =====================================================
    // 4. LOGOUT
    // =====================================================

    $$(".sup-logout-link").forEach(link => {

        link.addEventListener("click", event => {

            event.preventDefault();

            window.location.href = "supplier-login.html";

        });
    });


    // =====================================================
    // 5. NOTIFICATION NAVIGATION
    // =====================================================

    const notification = $(".sup-notification");

    if (notification) {

        notification.addEventListener("click", event => {

            const target = $("#notifications");

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                target.classList.add("sup-highlight");

                setTimeout(() => {
                    target.classList.remove("sup-highlight");
                }, 1500);
            }
        });
    }


    // =====================================================
    // 6. DASHBOARD STAT CARDS
    // =====================================================

    $$(".sup-stat").forEach(card => {

        card.tabIndex = 0;

        card.setAttribute(
            "aria-label",
            card.innerText.replace(/\s+/g, " ").trim()
        );

        // Keyboard accessibility
        card.addEventListener("keydown", event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {
                const link = $("a", card);

                if (link) {
                    event.preventDefault();
                    link.click();
                }
            }
        });
    });


    // =====================================================
    // 7. CHART TOOLTIP
    // =====================================================

    $$(".sup-day").forEach(day => {

        const label =
            $(".sup-day-label", day) ||
            $("span", day);

        const bars = $$(".sup-bar", day);

        if (bars.length) {

            const total = bars.reduce((sum, bar) => {

                return sum +
                    (parseFloat(bar.style.height) || 0);

            }, 0);

            day.title =
                `${label?.textContent?.trim() || "Day"} · ${Math.round(total)}% activity index`;
        }
    });


    // =====================================================
    // 8. ACTIVE DASHBOARD NAVIGATION
    // =====================================================
// =====================================================
// 8. ACTIVE NAVIGATION
// =====================================================

const currentPage = window.location.pathname
    .split("/")
    .pop()
    .toLowerCase();

$$(".sup-nav-link").forEach(link => {

    const linkPage = link.getAttribute("href")
        .split("/")
        .pop()
        .toLowerCase();

    const isActive = linkPage === currentPage;

    link.classList.toggle("active", isActive);

    if (isActive) {
        link.setAttribute("aria-current", "page");
    } else {
        link.removeAttribute("aria-current");
    }
});


    // =====================================================
    // 9. DESTRUCTIVE ACTION CONFIRMATION
    // =====================================================

    $$("button[data-confirm], a[data-confirm]").forEach(control => {

        // Do not attach confirmation to logout
        if (control.classList.contains("sup-logout-link")) {
            return;
        }

        control.addEventListener("click", event => {

            const message =
                control.dataset.confirm ||
                "Are you sure you want to continue?";

            if (!window.confirm(message)) {
                event.preventDefault();
            }
        });
    });


    // =====================================================
    // 10. DASHBOARD READY
    // =====================================================

    console.info("ReSource Supplier Dashboard ready.");

});
