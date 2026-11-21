
document.addEventListener("DOMContentLoaded", function () {

    // Select all password toggle buttons
    const toggleButtons = document.querySelectorAll(".password-toggle");

    toggleButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const targetId = button.getAttribute("data-password-target");
            const passwordInput = document.getElementById(targetId);

            if (!passwordInput) {
                console.error("Password input not found:", targetId);
                return;
            }

            // Toggle password visibility
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                button.setAttribute("aria-label", "Hide password");
                button.setAttribute("aria-pressed", "true");
            } else {
                passwordInput.type = "password";
                button.setAttribute("aria-label", "Show password");
                button.setAttribute("aria-pressed", "false");
            }

        });

    });

    // Confirm Password Validation
    const form = document.querySelector(".signup-panel .auth-form");
    const password = document.getElementById("signup-password");
    const confirmPassword = document.getElementById("confirm-password");

    if (form && password && confirmPassword) {

        form.addEventListener("submit", function (event) {

            confirmPassword.setCustomValidity("");

            if (password.value !== confirmPassword.value) {
                event.preventDefault();
                confirmPassword.setCustomValidity("Passwords do not match.");
                confirmPassword.reportValidity();
            }

        });

        confirmPassword.addEventListener("input", function () {
            confirmPassword.setCustomValidity("");
        });

    }

});
