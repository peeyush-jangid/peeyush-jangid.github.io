(function () {
  const STORAGE_KEY = "peeyush-certificates";

  const form = document.getElementById("certificate-form");
  const list = document.getElementById("certificate-list");
  const message = document.getElementById("cert-message");

  if (!form || !list) return;

  function getSavedCertificates() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function saveCertificates(certificates) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(certificates)
    );
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function renderCertificates(publicCertificates = []) {
    const localCertificates = getSavedCertificates();
    const certificates = [...publicCertificates, ...localCertificates];

    list.innerHTML = "";

    if (certificates.length === 0) {
      list.appendChild(
        createElement("p", "", "No certificates added yet.")
      );
      return;
    }

    certificates.forEach((cert, index) => {
      const card = createElement("article", "certificate-card");

      card.appendChild(
        createElement("h3", "", cert.title)
      );

      card.appendChild(
        createElement(
          "p",
          "",
          cert.issuer + (cert.date ? " · " + cert.date : "")
        )
      );

      const link = document.createElement("a");
      link.href = cert.file || cert.data;
      link.textContent = "View Certificate ↗";
      link.target = "_blank";
      link.rel = "noopener";
      card.appendChild(link);

      if (cert.data) {
        const remove = createElement("button", "", "Remove");

        remove.type = "button";

        remove.addEventListener("click", () => {
          const saved = getSavedCertificates();
          saved.splice(index - publicCertificates.length, 1);
          saveCertificates(saved);
          renderCertificates(publicCertificates);
        });

        card.appendChild(remove);
      }

      list.appendChild(card);
    });
  }

  async function loadPublicCertificates() {
    try {
      const response = await fetch("certificates.json");

      if (!response.ok) throw new Error("Could not load JSON");

      const certificates = await response.json();

      renderCertificates(
        Array.isArray(certificates) ? certificates : []
      );
    } catch (error) {
      renderCertificates([]);
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("cert-title").value.trim();
    const issuer = document.getElementById("cert-issuer").value.trim();
    const date = document.getElementById("cert-date").value;
    const fileInput = document.getElementById("cert-file");
    const file = fileInput.files[0];

    if (!title || !issuer || !file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png"
    ];

    if (!allowedTypes.includes(file.type)) {
      message.textContent = "Only PDF, JPG and PNG files are allowed.";
      return;
    }

    if (file.size > 900 * 1024) {
      message.textContent = "File must be smaller than 900 KB.";
      return;
    }

    const reader = new FileReader();

    reader.onload = function () {
      try {
        const certificates = getSavedCertificates();

        certificates.push({
          title,
          issuer,
          date,
          data: reader.result
        });

        saveCertificates(certificates);

        message.textContent = "Certificate added successfully!";
        form.reset();

        loadPublicCertificates();
      } catch (error) {
        message.textContent =
          "Storage is full. Please use a smaller certificate.";
      }
    };

    reader.readAsDataURL(file);
  });

  loadPublicCertificates();
})();
