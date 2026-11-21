/* =====================================================
   ReSource Buyer Pages
   Common navigation and page interactions
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

    // Common logo
    const logo = $(".brand-logo");

    if (logo) {
        logo.src = "../../assets/images/logo/1.png";
        logo.alt = "ReSource";
    }

    // Common buyer navigation
    const pageLinks = {
        "Dashboard": "../../buyer-dashboard.html",
        "Search Materials": "browse-materials.html",
        "My Requests": "my-requests.html",
        "Received Quotations": "matching-quotations.html",
        "My Orders": "my-orders.html",
        "Messages": "messages.html",
        "Reviews": "profile-settings.html#reviews",
        "Profile Settings": "profile-settings.html"
    };

    $$(".buyer-side-nav a, .buyer-sidebar a, .side-link").forEach(link => {
        const label = link.querySelector("span:last-child")?.textContent.trim()
            || link.textContent.trim();

        if (pageLinks[label]) {
            link.href = pageLinks[label];
        }
    });

    // Active sidebar item based on current page
    const currentPage = window.location.pathname.split("/").pop();

    $$(".buyer-side-nav .side-link, .buyer-sidebar .side-link").forEach(link => {
        const href = link.getAttribute("href") || "";
        const targetPage = href.split("#")[0].split("/").pop();

        if (targetPage && targetPage === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        } else if (!href.includes("#reviews")) {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        }
    });

    // Logout without confirmation
    $$(".logout, .logout-link, a[href*='buyer-login']").forEach(link => {
        link.href = "../../buyer-login.html";
        link.removeAttribute("onclick");
    });

    // Search form: browse materials
    $$("form").forEach(form => {
        const searchInput = $('input[type="search"], input[name="q"]', form);

        if (searchInput) {
            form.addEventListener("submit", event => {
                event.preventDefault();

                const keyword = searchInput.value.trim();
                const category = $('select[name="category"]', form)?.value || "";

                const params = new URLSearchParams();

                if (keyword) params.set("q", keyword);
                if (category && !category.toLowerCase().includes("all")) {
                    params.set("category", category);
                }

                window.location.href =
                    "browse-materials.html" +
                    (params.toString() ? "?" + params.toString() : "");
            });

            return;
        }

        // Demo forms: validate and show preview
        form.addEventListener("submit", event => {
            event.preventDefault();

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const button = $('button[type="submit"]', form);
            const buttonText = button?.textContent.trim() || "Action";

            showToast(buttonText + " submitted in demo mode.");
        });
    });

    // Search filter from URL
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    const category = params.get("category");

    const searchBox = $('input[name="q"]');

    if (searchBox && query) {
        searchBox.value = query;
    }

    const categorySelect = $('select[name="category"]');

    if (categorySelect && category) {
        const option = [...categorySelect.options].find(
            item => item.value === category || item.textContent.trim() === category
        );

        if (option) categorySelect.value = option.value;
    }

    // Table / card filtering
    const filterInputs = $$(
        'input[type="search"]:not([name="q"]), input[data-filter], select[data-filter]'
    );

    filterInputs.forEach(input => {
        input.addEventListener("input", applyFilters);
        input.addEventListener("change", applyFilters);
    });

    function applyFilters() {
        const keyword = filterInputs
            .map(input => input.value.trim().toLowerCase())
            .filter(Boolean)
            .join(" ");

        const rows = $$(".data-table tbody tr, .material-card, .request-card, .order-card");

        rows.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.hidden = keyword && !text.includes(keyword);
        });
    }

    // Profile settings tabs
    $$(".settings-tabs a").forEach(tab => {
        tab.addEventListener("click", () => {
            $$(".settings-tabs a").forEach(item => item.classList.remove("active"));
            tab.classList.add("active");
        });
    });

    // Button feedback for demo actions
    document.addEventListener("click", event => {
        const button = event.target.closest("button, [data-action]");

        if (!button) return;
        if (button.type === "submit" && button.closest("form")) return;

        const label = (
            button.dataset.action ||
            button.textContent
        ).trim().toLowerCase();

        if (label.includes("delete") || label.includes("remove")) {
            event.preventDefault();

            if (window.confirm("Are you sure you want to continue?")) {
                showToast("This action needs backend integration.");
            }

            return;
        }

        if (
            label.includes("save") ||
            label.includes("update") ||
            label.includes("accept") ||
            label.includes("reject") ||
            label.includes("confirm") ||
            label.includes("close") ||
            label.includes("send") ||
            label.includes("preview")
        ) {
            showToast("This demo action is ready for backend integration.");
        }
    });

    // Anchor links: smooth scroll
    $$('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const target = $(link.getAttribute("href"));

            if (target) {
                event.preventDefault();
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                history.replaceState(null, "", link.getAttribute("href"));
            }
        });
    });

    console.log("ReSource Buyer Page JS loaded:", currentPage);
});
// Buyer Sidebar Active Menu
document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop();
    const currentHash = window.location.hash;

    document.querySelectorAll(".buyer-side-nav .side-link, .side-nav .nav-link")
        .forEach(link => {
            link.classList.remove("active");
            link.removeAttribute("aria-current");

            const href = link.getAttribute("href");
            if (!href) return;

            const linkPage = href.split("/").pop().split("#")[0];
            const linkHash = href.includes("#") ? href.split("#")[1] : "";

            let isActive = false;

            if (linkPage === currentPage) {
                if (linkHash) {
                    isActive = currentHash === "#" + linkHash;
                } else {
                    isActive = !currentHash;
                }
            }

            if (isActive) {
                link.classList.add("active");
                link.setAttribute("aria-current", "page");
            }
        });
});
// Buyer sidebar active menu based on URL
function updateBuyerActiveMenu() {
    const currentPage = window.location.pathname.split("/").pop();
    const currentHash = window.location.hash;

    document.querySelectorAll(
        ".buyer-side-nav .side-link, .side-nav .nav-link"
    ).forEach(link => {
        link.classList.remove("active");
        link.removeAttribute("aria-current");

        const href = link.getAttribute("href");
        if (!href) return;

        const url = new URL(href, window.location.href);
        const linkPage = url.pathname.split("/").pop();

        if (linkPage !== currentPage) return;

        if (url.hash) {
            if (url.hash === currentHash) {
                link.classList.add("active");
                link.setAttribute("aria-current", "page");
            }
        } else if (!currentHash) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });
}

document.addEventListener("DOMContentLoaded", updateBuyerActiveMenu);
window.addEventListener("hashchange", updateBuyerActiveMenu);