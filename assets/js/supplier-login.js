
// ========================================
// ReSource - Supplier Login JavaScript
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    // 1. Load Lucide icons (if available)
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 2. Update footer year (if available)
    const yearElement = document.getElementById("currentYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // 3. Show / Hide Password
    const passwordButtons = document.querySelectorAll(".password-toggle");

    passwordButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const targetId = button.dataset.passwordTarget;
            const passwordInput = document.getElementById(targetId);

            if (!passwordInput) return;

            const shouldShow = passwordInput.type === "password";

            // Toggle password visibility
            passwordInput.type = shouldShow ? "text" : "password";

            // Update accessibility attributes
            button.setAttribute(
                "aria-label",
                shouldShow ? "Hide password" : "Show password"
            );

            button.setAttribute(
                "aria-pressed",
                String(shouldShow)
            );

            // Change eye icon without requiring Lucide
            button.innerHTML = shouldShow
                ? `
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M3 3l18 18"/>
                        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/>
                        <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5
                            c6.1 0 9.5 7 9.5 7a16 16 0 0 1-3.1 3.8"/>
                        <path d="M6.2 6.2C3.8 7.8 2.5 12 2.5 12
                            s3.4 7 9.5 7c1.3 0 2.5-.3 3.5-.8"/>
                    </svg>
                `
                : `
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M2.5 12s3.4-6.5 9.5-6.5
                            9.5 6.5 9.5 6.5-3.4 6.5-9.5 6.5
                            S2.5 12 2.5 12Z"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>
                `;
        });
    });

    // 4. Supplier Login Form
    const loginForm = document.querySelector(".login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {

            const email = loginForm.querySelector(
                'input[name="email"]'
            );

            const password = loginForm.querySelector(
                'input[name="password"]'
            );

            if (!email.value.trim() || !password.value) {
                event.preventDefault();
                alert("Please enter your email and password.");
            }

        });
    }

    console.log("ReSource Supplier Login JavaScript loaded.");

});
