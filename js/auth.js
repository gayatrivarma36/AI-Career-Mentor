document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(".auth-form");

  forms.forEach((form) => {
    const submitButton = form.querySelector("button[type='submit']");
    const messageBox = document.createElement("p");
    messageBox.className = "form-message";
    form.appendChild(messageBox);

    const passwordFields = form.querySelectorAll('input[type="password"]');

    passwordFields.forEach((field) => {
      const wrapper = field.closest(".input-with-icon");
      if (!wrapper) return;

      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "toggle-password";
      toggle.innerHTML = '<i class="fas fa-eye"></i>';
      toggle.setAttribute("aria-label", "Toggle password visibility");
      wrapper.appendChild(toggle);

      toggle.addEventListener("click", () => {
        const isHidden = field.type === "password";
        field.type = isHidden ? "text" : "password";
        toggle.innerHTML = isHidden ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const inputs = form.querySelectorAll("input:not([type='checkbox'])");
      let isValid = true;

      inputs.forEach((input) => {
        input.style.borderColor = "rgba(255, 255, 255, 0.16)";
      });

      const emailInput = form.querySelector('input[type="email"]');
      const email = emailInput ? emailInput.value.trim() : "";
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (emailInput && !emailPattern.test(email)) {
        isValid = false;
        emailInput.style.borderColor = "#fda4af";
        showMessage(messageBox, "Please enter a valid email address.", "error");
        return;
      }

      const passwordInput = form.querySelector('input[type="password"]');
      const password = passwordInput ? passwordInput.value : "";
      if (passwordInput && password.length < 6) {
        isValid = false;
        passwordInput.style.borderColor = "#fda4af";
        showMessage(messageBox, "Password must be at least 6 characters long.", "error");
        return;
      }

      const fullNameInput = form.querySelector('input[type="text"]');
      if (fullNameInput && fullNameInput.value.trim().length < 2) {
        isValid = false;
        fullNameInput.style.borderColor = "#fda4af";
        showMessage(messageBox, "Please enter your full name.", "error");
        return;
      }

      const confirmPasswordInput = form.querySelector('#confirm-password');
      if (confirmPasswordInput) {
        const confirmPassword = confirmPasswordInput.value;
        if (confirmPassword !== password) {
          isValid = false;
          confirmPasswordInput.style.borderColor = "#fda4af";
          showMessage(messageBox, "Passwords do not match.", "error");
          return;
        }
      }

      if (!isValid) {
        showMessage(messageBox, "Please fix the highlighted fields.", "error");
        return;
      }

      form.reset();
      showMessage(messageBox, "Success! Your request has been processed.", "success");
      if (submitButton) {
        submitButton.animate(
          [
            { transform: "scale(0.97)" },
            { transform: "scale(1)" }
          ],
          { duration: 180, easing: "ease-out" }
        );
      }
    });
  });

  function showMessage(box, text, type) {
    box.textContent = text;
    box.className = `form-message ${type}`;
    box.style.opacity = "1";
    box.animate(
      [
        { opacity: 0, transform: "translateY(4px)" },
        { opacity: 1, transform: "translateY(0)" }
      ],
      { duration: 220, easing: "ease-out" }
    );
  }
});
