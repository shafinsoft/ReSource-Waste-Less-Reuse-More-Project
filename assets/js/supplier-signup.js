
// ========================================
// ReSource - Supplier Sign Up JavaScript
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    // 1. Load Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 2. Update footer year
    const yearElement = document.getElementById("currentYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // 3. Mobile Navigation
    const menuButton = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuButton && navLinks) {

        menuButton.addEventListener("click", function () {

            const isOpen = navLinks.classList.toggle("open");

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });

        navLinks.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                navLinks.classList.remove("open");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );
            });
        });
    }

    // 4. Show / Hide Password
    const passwordButtons = document.querySelectorAll(".password-toggle");

    passwordButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const targetId = button.dataset.passwordTarget;
            const passwordInput = document.getElementById(targetId);

            if (!passwordInput) return;

            const shouldShow = passwordInput.type === "password";

            passwordInput.type = shouldShow ? "text" : "password";

            button.setAttribute(
                "aria-label",
                shouldShow ? "Hide password" : "Show password"
            );

            button.setAttribute(
                "aria-pressed",
                String(shouldShow)
            );

            // Update eye icon
            button.innerHTML = shouldShow
                ? '<i data-lucide="eye-off"></i>'
                : '<i data-lucide="eye"></i>';

            if (window.lucide) {
                window.lucide.createIcons();
            }
        });
    });

    // 5. Supplier Signup Form
    const signupForm = document.getElementById("supplierSignupForm");
    const messageElement = document.getElementById("signupMessage");

    if (signupForm && messageElement) {

        signupForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const businessName = document.getElementById("businessName").value.trim();
            const ownerName = document.getElementById("ownerName").value.trim();
            const email = document.getElementById("signupEmail").value.trim();
            const phone = document.getElementById("phone").value.trim();

            const password = document.getElementById("signupPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            const agreeTerms = document.getElementById("agreeTerms").checked;

            // Clear previous message
            messageElement.textContent = "";
            messageElement.style.color = "#b42318";

            // 6. Required field validation
            if (!businessName || !ownerName || !email || !phone) {

                messageElement.textContent =
                    "Please fill in all required fields.";

                return;
            }

            // 7. Password length validation
            if (password.length < 8) {

                messageElement.textContent =
                    "Password must contain at least 8 characters.";

                return;
            }

            // 8. Confirm password validation
            if (password !== confirmPassword) {

                messageElement.textContent =
                    "Passwords do not match. Please try again.";

                return;
            }

            // 9. Terms validation
            if (!agreeTerms) {

                messageElement.textContent =
                    "Please accept the Terms & Conditions.";

                return;
            }

            // 10. Demo success message
            messageElement.style.color = "#087747";

            messageElement.textContent =
                "Form validation successful! This is a demo; your account has not been saved.";

            // Store demo details only (never store passwords)
            try {

                sessionStorage.setItem("resourceDemoEmail", email);

                sessionStorage.setItem("resourceDemoBusiness", businessName);

            } catch (error) {

                console.warn("Demo details could not be stored.", error);
            }

        });
    }

    // 11. Terms & Conditions demo message
    const termsLink = document.getElementById("termsLink");

    if (termsLink) {

        termsLink.addEventListener("click", function (event) {

            event.preventDefault();

            alert(
                "Terms & Conditions\n\n" +
                "1. Provide correct business and contact information.\n" +
                "2. List only materials you are authorised to supply.\n" +
                "3. Describe material quantity and condition accurately.\n\n" +
                "Full platform terms will be added before launch."
            );
        });
    }

    console.log("ReSource Supplier Sign Up JavaScript loaded.");

});
