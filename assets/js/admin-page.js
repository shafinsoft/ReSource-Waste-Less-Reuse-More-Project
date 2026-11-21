/* =====================================================
   ReSource Admin Pages
   Shared JavaScript for all secondary Admin pages
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const $ = (selector, root = document) =>
        root.querySelector(selector);

    const $$ = (selector, root = document) =>
        [...root.querySelectorAll(selector)];


    /* =================================================
       1. TABLE SEARCH
    ================================================= */

    const tables = $$("table").filter(table =>
        $("tbody", table)
    );

    const searchInput = $("#tableSearch");

    function applyFilters() {

        tables.forEach(table => {

            const rows = $$("tbody tr", table);

            const searchText = searchInput
                ? searchInput.value.trim().toLowerCase()
                : "";

            rows.forEach(row => {

                const rowText = row.textContent.toLowerCase();

                let visible = rowText.includes(searchText);

                // Status filter
                const statusFilter = $("#statusFilter");

                if (statusFilter && statusFilter.value !== "all" && statusFilter.value !== "") {

                    const headers = $$("thead th", table);

                    const statusIndex = headers.findIndex(th =>
                        th.textContent.toLowerCase().includes("status")
                    );

                    if (statusIndex >= 0) {

                        const statusText = row.cells[statusIndex]
                            ?.textContent.trim().toLowerCase() || "";

                        if (!statusText.includes(statusFilter.value.toLowerCase())) {
                            visible = false;
                        }
                    }
                }

                // Category filter
                const categoryFilter = $("#categoryFilter");

                if (categoryFilter && categoryFilter.value !== "all" && categoryFilter.value !== "") {

                    const headers = $$("thead th", table);

                    const categoryIndex = headers.findIndex(th =>
                        th.textContent.toLowerCase().includes("category")
                    );

                    if (categoryIndex >= 0) {

                        const categoryText = row.cells[categoryIndex]
                            ?.textContent.trim().toLowerCase() || "";

                        if (!categoryText.includes(categoryFilter.value.toLowerCase())) {
                            visible = false;
                        }
                    }
                }

                row.hidden = !visible;

            });

        });

    }

    searchInput?.addEventListener("input", applyFilters);

    $("#statusFilter")?.addEventListener("change", applyFilters);

    $("#categoryFilter")?.addEventListener("change", applyFilters);


    /* =================================================
       2. EXPORT TABLE TO CSV
    ================================================= */

    const exportButton = $("#exportButton");

    exportButton?.addEventListener("click", event => {

        event.preventDefault();

        const table = tables[0];

        if (!table) {
            alert("No table found!");
            return;
        }

        const escapeCSV = value =>
            `"${String(value).replace(/"/g, '""').trim()}"`;

        const headers = $$("thead th", table).map(th =>
            escapeCSV(th.textContent)
        );

        const rows = $$("tbody tr", table)
            .filter(row => !row.hidden && getComputedStyle(row).display !== "none")
            .map(row =>
                [...row.cells].map(cell =>
                    escapeCSV(cell.textContent)
                ).join(",")
            );

        if (rows.length === 0) {
            alert("No visible data to export!");
            return;
        }

        const csvContent = [
            headers.join(","),
            ...rows
        ].join("\n");

        const blob = new Blob(
            ["\uFEFF" + csvContent],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "admin-data.csv";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);

    });


    /* =================================================
       3. SETTINGS FORM
    ================================================= */

    const settingsForm = $("#settingsForm");

    if (settingsForm) {

        const storageKey = "resourceAdminSettings";

        // Load previously saved demo settings
        try {

            const savedSettings = JSON.parse(
                localStorage.getItem(storageKey) || "{}"
            );

            Object.entries(savedSettings).forEach(([name, value]) => {

                const field = settingsForm.elements.namedItem(name);

                if (field && "value" in field) {
                    field.value = value;
                }

            });

        } catch (error) {
            console.error("Settings loading error:", error);
        }


        // Save settings
        settingsForm.addEventListener("submit", event => {

            event.preventDefault();

            if (!settingsForm.checkValidity()) {
                settingsForm.reportValidity();
                return;
            }

            const settings = {};

            [...settingsForm.elements].forEach(field => {

                if (!field.name || field.disabled) return;

                if (field.type === "submit" || field.type === "button") return;

                settings[field.name] = field.value;

            });

            try {

                localStorage.setItem(
                    storageKey,
                    JSON.stringify(settings)
                );

                showMessage(
                    "Settings saved successfully! (Demo only)"
                );

            } catch (error) {

                console.error(error);

                showMessage(
                    "Unable to save settings."
                );

            }

        });

    }


    /* =================================================
       4. MESSAGE NOTIFICATION
    ================================================= */

    function showMessage(message) {

        let notice = $("#adminPageNotice");

        if (!notice) {

            notice = document.createElement("div");

            notice.id = "adminPageNotice";

            notice.style.cssText = `
                position: fixed;
                right: 20px;
                bottom: 20px;
                z-index: 9999;
                background: #172033;
                color: white;
                padding: 14px 20px;
                border-radius: 8px;
                font-size: 14px;
                box-shadow: 0 5px 20px rgba(0,0,0,.2);
            `;

            document.body.appendChild(notice);

        }

        notice.textContent = message;

    }


    /* =================================================
       5. INITIALIZE FILTERS
    ================================================= */

    applyFilters();

});