/* =========================================================
   ReSource Supplier Pages — Shared Page Interactions
   Used by supplier subpages (Listings, Requests, Quotations,
   Orders, Messages, Profile Settings, Completed Records).
   Frontend demo only; persistent actions require a backend.
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [
    ...root.querySelectorAll(selector),
  ];

  // Accessible toast feedback
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
  function notify(message, type = "success") {
    toast.textContent = message;
    toast.dataset.type = type;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3000);
  }

  // Update current year wherever the footer has a year placeholder
  const year = $("#currentYear");
  if (year) year.textContent = new Date().getFullYear();

  // Mobile sidebar toggle; supports existing button or creates one
  const sidebar = $(".sup-sidebar");
  const topbar = $(".sup-topbar");
  let menuButton = $(".sup-menu-toggle, #supMenuToggle");

  if (!menuButton && sidebar && topbar) {
    menuButton = document.createElement("button");
    menuButton.type = "button";
    menuButton.className = "sup-menu-toggle";
    menuButton.id = "supMenuToggle";
    menuButton.setAttribute("aria-label", "Toggle supplier navigation");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.innerHTML = "<span></span><span></span><span></span>";
    const right = $(".sup-top-right", topbar);
    topbar.insertBefore(menuButton, right || null);
  }

  if (menuButton && sidebar) {
    menuButton.addEventListener("click", () => {
      const open = sidebar.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("sup-nav-open", open);
    });

    document.addEventListener("click", (event) => {
      if (
        sidebar.classList.contains("is-open") &&
        !sidebar.contains(event.target) &&
        !menuButton.contains(event.target)
      ) {
        sidebar.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        document.body.classList.remove("sup-nav-open");
      }
    });
  }

  // Mark current sidebar item based on current filename
  const currentFile = location.pathname.split("/").pop();
  $$(".sup-nav-link").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const targetFile = href.split("/").pop();
    if (targetFile && targetFile === currentFile) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  // Current date if a page provides a date placeholder
  const dateLabel = $("[data-current-date], .sup-date");
  if (dateLabel && !dateLabel.textContent.trim()) {
    dateLabel.textContent = new Intl.DateTimeFormat("en", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date());
  }

  // Generic live search for table rows and supplier cards
  $$(
    'input[type="search"], input[aria-label*="Search"], input[placeholder*="Search"]',
  ).forEach((input) => {
    input.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();
      const region =
        input.closest("main, section, .sup-panel, .sup-content-card") ||
        document;
      const items = $$(
        ".sup-table tbody tr, .sup-listing-card, .sup-request-card, .sup-quote-card, .sup-order-card, .sup-conversation",
        region,
      );
      let visibleCount = 0;

      items.forEach((item) => {
        const match = !query || item.textContent.toLowerCase().includes(query);
        item.hidden = !match;
        if (match) visibleCount++;
      });

      const emptyState = $(".sup-empty-state", region);
      if (emptyState) emptyState.hidden = visibleCount > 0 || !query;
    });
  });

  // Generic filters for supplier tables/cards
  $$(
    "select[data-filter], select[name='status'], select[name='category'], select[name='district']",
  ).forEach((select) => {
    select.addEventListener("change", () => {
      const value = select.value.trim().toLowerCase();
      const region =
        select.closest("main, section, .sup-panel, .sup-content-card") ||
        document;
      const items = $$(
        ".sup-table tbody tr, .sup-listing-card, .sup-request-card, .sup-quote-card, .sup-order-card",
        region,
      );

      items.forEach((item) => {
        const allOption =
          !value || /^(all|any|all statuses|all categories)$/i.test(value);
        item.hidden =
          !allOption && !item.textContent.toLowerCase().includes(value);
      });
    });
  });

  // Password show/hide where password fields exist on profile/security forms
  $$(".password-toggle[data-password-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById(button.dataset.passwordTarget);
      if (!input) return;
      const visible = input.type === "password";
      input.type = visible ? "text" : "password";
      button.setAttribute(
        "aria-label",
        visible ? "Hide password" : "Show password",
      );
      button.setAttribute("aria-pressed", String(visible));
      if (window.lucide) window.lucide.createIcons();
    });
  });

  // Message composer: append the sent text to the visible conversation as a demo
  $$(".sup-chat-compose").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = $('input[name="message"], textarea[name="message"]', form);
      const message = input?.value.trim();
      if (!message) {
        notify("Write a message before sending.", "error");
        input?.focus();
        return;
      }

      const pane = form.closest(".sup-chat-pane") || form.parentElement;
      const body = $(".sup-chat-body", pane);
      if (body) {
        const bubble = document.createElement("div");
        bubble.className = "sup-bubble outgoing";
        const text = document.createElement("span");
        text.textContent = message;
        bubble.appendChild(text);

        const time = document.createElement("small");
        time.className = "sup-chat-time";
        time.textContent = "Just now · Demo";
        bubble.appendChild(time);

        body.appendChild(bubble);
        body.scrollTop = body.scrollHeight;
      }

      input.value = "";
      notify("Message added to this demo conversation.");
    });
  });

  // Forms marked for frontend demo handling
  $$("form[data-demo-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      notify(
        form.dataset.successMessage ||
          "Your changes are validated in this demo. Connect the backend to save them.",
      );
    });
  });

  // Status dropdowns update a nearby status label visually
  $$("select[data-status-control]").forEach((select) => {
    select.addEventListener("change", () => {
      const container =
        select.closest("tr, article, .sup-content-card") ||
        select.parentElement;
      const badge = $(".sup-status, .sup-badge, .status-badge", container);
      if (badge)
        badge.textContent =
          select.options[select.selectedIndex]?.text || select.value;
      notify("Status updated in this frontend demo.");
    });
  });

  // Explicitly tagged actions only; avoids guessing what arbitrary buttons do
  $$("[data-supplier-action]").forEach((control) => {
    control.addEventListener("click", (event) => {
      const action = control.dataset.supplierAction;

      if (action === "export-csv") {
        const table = $(control.dataset.target || ".sup-table");
        if (!table) return notify("No table found to export.", "info");

        const csv = [...table.rows]
          .map((row) =>
            [...row.cells]
              .map((cell) => '"' + cell.innerText.replace(/"/g, '""') + '"')
              .join(","),
          )
          .join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "resource-supplier-export.csv";
        anchor.click();
        URL.revokeObjectURL(url);
        notify("CSV export downloaded.");
      }

      if (action === "print") window.print();

      if (action === "confirm") {
        const message =
          control.dataset.confirmMessage ||
          "Are you sure you want to continue?";
        if (!window.confirm(message)) event.preventDefault();
      }

      if (action === "logout") {
        const destination =
          control.getAttribute("href") || "../../supplier-login.html";
        if (!window.confirm("Are you sure you want to log out?")) {
          event.preventDefault();
        } else if (!control.hasAttribute("href")) {
          location.href = destination;
        }
      }
    });
  });

  // Logout links with the explicit class
  $$(".sup-logout-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (!window.confirm("Are you sure you want to log out?"))
        event.preventDefault();
    });
  });

  if (window.lucide) window.lucide.createIcons();
  console.info("ReSource Supplier Page JavaScript loaded.");
});
