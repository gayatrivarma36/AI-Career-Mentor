document.addEventListener("DOMContentLoaded", () => {
  const dropZone = document.getElementById("drop-zone");
  const fileInput = document.getElementById("resume-file");
  const previewBox = document.querySelector(".preview-box");
  const scoreCircle = document.querySelector(".score-circle");

  if (!dropZone || !fileInput || !previewBox || !scoreCircle) return;

  const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

  const showMessage = (message, isError = false) => {
    const messageBox = document.createElement("p");
    messageBox.className = isError ? "upload-message error" : "upload-message success";
    messageBox.textContent = message;
    previewBox.appendChild(messageBox);
    setTimeout(() => messageBox.remove(), 2200);
  };

  const animateScore = (target) => {
    const start = 0;
    const duration = 900;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const current = Math.round(start + (target - start) * progress);
      scoreCircle.textContent = current;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const handleFile = (file) => {
    if (!file) return;

    const isValid = allowedTypes.includes(file.type) || /\.(pdf|doc|docx)$/i.test(file.name);
    if (!isValid) {
      showMessage("Please upload a valid PDF or DOCX file.", true);
      return;
    }

    const fileName = document.createElement("p");
    fileName.className = "selected-file";
    fileName.textContent = `Selected file: ${file.name}`;
    previewBox.innerHTML = "";
    previewBox.appendChild(fileName);
    showMessage("Upload successful! Your resume is ready for analysis.");
    animateScore(84);
  };

  ["dragenter", "dragover"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.add("dragover");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.remove("dragover");
    });
  });

  dropZone.addEventListener("drop", (event) => {
    const file = event.dataTransfer.files[0];
    handleFile(file);
  });

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    handleFile(file);
  });
});
