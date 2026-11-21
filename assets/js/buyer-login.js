
document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("buyer-password");
    const passwordToggle = document.querySelector(".password-toggle");

    // Show / Hide Password
    if (passwordInput && passwordToggle) {
        passwordToggle.addEventListener("click", () => {
            const isHidden = passwordInput.type === "password";

            passwordInput.type = isHidden ? "text" : "password";

            passwordToggle.setAttribute(
                "aria-pressed",
                String(isHidden)
            );

            passwordToggle.setAttribute(
                "aria-label",
                isHidden ? "Hide password" : "Show password"
            );
        });
    }
});
