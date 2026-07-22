document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  const mainPanel = document.querySelector(".main-panel");
  const toggleButton = document.createElement("button");
  toggleButton.className = "icon-btn sidebar-toggle";
  toggleButton.innerHTML = '<i class="fas fa-bars"></i>';
  toggleButton.setAttribute("aria-label", "Toggle sidebar");

  if (sidebar && mainPanel) {
    mainPanel.insertBefore(toggleButton, mainPanel.firstChild);

    toggleButton.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
      mainPanel.classList.toggle("expanded");
    });
  }

  const statValues = document.querySelectorAll(".stat-card p");
  statValues.forEach((value, index) => {
    value.animate(
      [
        { opacity: 0, transform: "translateY(8px)" },
        { opacity: 1, transform: "translateY(0)" }
      ],
      {
        duration: 500 + index * 180,
        easing: "ease-out"
      }
    );
  });

  const progressBars = document.querySelectorAll(".bar div");
  progressBars.forEach((bar, index) => {
    const width = bar.style.width;
    bar.style.width = "0%";
    setTimeout(() => {
      bar.animate(
        [
          { width: "0%" },
          { width: width }
        ],
        {
          duration: 800 + index * 200,
          easing: "ease-out"
        }
      );
      bar.style.width = width;
    }, 250);
  });

  const bellButton = document.querySelector(".icon-btn");
  const notification = document.createElement("div");
  notification.className = "notification-popup";
  notification.innerHTML = "<strong>New insight:</strong> Your resume is 8% stronger this week.";
  notification.style.display = "none";

  if (bellButton) {
    bellButton.parentNode.appendChild(notification);
    bellButton.addEventListener("click", () => {
      notification.style.display = notification.style.display === "block" ? "none" : "block";
    });
  }

  const darkModeToggle = document.createElement("button");
  darkModeToggle.className = "icon-btn theme-toggle";
  darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  darkModeToggle.setAttribute("aria-label", "Toggle dark mode");

  if (bellButton && bellButton.parentNode) {
    bellButton.parentNode.insertBefore(darkModeToggle, bellButton.nextSibling);
  }

  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const icon = darkModeToggle.querySelector("i");
    icon.className = document.body.classList.contains("dark-mode")
      ? "fas fa-sun"
      : "fas fa-moon";
  });

  document.querySelectorAll(".sidebar-nav a, .btn-primary, .stat-card, .panel, .icon-btn").forEach((element) => {
    element.addEventListener("mouseover", () => {
      element.style.transition = "transform 0.25s ease, box-shadow 0.25s ease";
    });
  });
});
