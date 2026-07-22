document.addEventListener("DOMContentLoaded", () => {
  // Smooth scrolling for internal navigation links.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        event.preventDefault();
        targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Animated navbar and mobile menu toggle.
  const header = document.querySelector(".site-header");
  const nav = document.querySelector(".site-nav");
  const toggleButton = document.querySelector(".nav-toggle");

  if (header && nav && toggleButton) {
    toggleButton.addEventListener("click", () => {
      nav.classList.toggle("open");
      const isExpanded = nav.classList.contains("open");
      toggleButton.setAttribute("aria-expanded", String(isExpanded));
    });

    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 20);
    });
  }

  // Hero typing animation.
  const heroHeading = document.querySelector(".hero h1");
  if (heroHeading) {
    const fullText = heroHeading.textContent.trim();
    heroHeading.textContent = "";
    let index = 0;

    const typeText = () => {
      heroHeading.textContent = fullText.slice(0, index);
      index += 1;
      if (index <= fullText.length) {
        setTimeout(typeText, 45);
      }
    };

    setTimeout(typeText, 400);
  }

  // Reveal section content when it enters the viewport.
  const revealItems = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  // Add a brief press animation to buttons and links.
  document.querySelectorAll(".btn, .nav-toggle, .site-nav a, .contact-link").forEach((element) => {
    element.addEventListener("click", () => {
      element.animate(
        [
          { transform: "scale(0.97)" },
          { transform: "scale(1)" }
        ],
        { duration: 180, easing: "ease-out" }
      );
    });
  });

  // Validate the contact form and show a success message.
  const form = document.getElementById("contact-form");
  const messageBox = document.querySelector(".form-message");

  if (form && messageBox) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const text = form.message.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      let isValid = true;

      if (name.length < 2) {
        isValid = false;
        form.name.style.borderColor = "#fda4af";
      } else {
        form.name.style.borderColor = "rgba(255, 255, 255, 0.16)";
      }

      if (!emailPattern.test(email)) {
        isValid = false;
        form.email.style.borderColor = "#fda4af";
      } else {
        form.email.style.borderColor = "rgba(255, 255, 255, 0.16)";
      }

      if (text.length < 10) {
        isValid = false;
        form.message.style.borderColor = "#fda4af";
      } else {
        form.message.style.borderColor = "rgba(255, 255, 255, 0.16)";
      }

      if (!isValid) {
        messageBox.textContent = "Please complete every field correctly before sending.";
        messageBox.style.color = "#fecaca";
        return;
      }

      form.reset();
      messageBox.textContent = "Thank you! Your message has been sent successfully.";
      messageBox.style.color = "#bbf7d0";
    });
  }
});
