const header = document.querySelector("[data-header]") || document.querySelector(".site-header");
const nav = document.querySelector("[data-nav]") || header?.querySelector(".site-nav");
let menuToggle = document.querySelector("[data-menu-toggle]");
const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const lightboxMeta = document.querySelector("[data-lightbox-meta]");
const closeLightboxButton = document.querySelector("[data-lightbox-close]");
const prevLightboxButton = document.querySelector("[data-lightbox-prev]");
const nextLightboxButton = document.querySelector("[data-lightbox-next]");
const leadForms = document.querySelectorAll("[data-quote-form], [data-contact-form]");
const mobileCta = document.querySelector("[data-mobile-cta]");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

let activeGalleryIndex = 0;

if (header && nav && !menuToggle) {
  menuToggle = document.createElement("button");
  menuToggle.className = "menu-toggle";
  menuToggle.type = "button";
  menuToggle.setAttribute("aria-label", "Deschide meniul");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("data-menu-toggle", "");
  menuToggle.innerHTML = "<span></span><span></span>";
  header.insertBefore(menuToggle, nav);
}

function trackEvent(eventName, params = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

function updateHeaderState() {
  const isScrolled = window.scrollY > 18;
  header?.classList.toggle("is-scrolled", isScrolled);

  const alwaysShowMobileCta = mobileCta?.dataset.mobileCta === "always";
  mobileCta?.classList.toggle("is-visible", alwaysShowMobileCta || window.scrollY > window.innerHeight * 0.45);
}

function closeMenu() {
  nav?.classList.remove("is-open");
  header?.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

function openMenu() {
  nav?.classList.add("is-open");
  header?.classList.add("is-open");
  menuToggle?.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-open");
}

function visibleGalleryItems() {
  return galleryItems.filter((item) => !item.classList.contains("is-hidden"));
}

function renderLightbox(index) {
  const items = visibleGalleryItems();
  const item = items[index] || items[0];
  if (!item) {
    return;
  }

  activeGalleryIndex = items.indexOf(item);
  lightboxImage.src = item.dataset.full;
  lightboxImage.alt = item.querySelector("img").alt;
  lightboxCaption.textContent = item.dataset.title;
  if (lightboxMeta) {
    lightboxMeta.textContent = item.dataset.meta || "";
  }
}

function openLightbox(item) {
  const items = visibleGalleryItems();
  renderLightbox(items.indexOf(item));
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
  closeLightboxButton?.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.classList.remove("lightbox-open");
}

function showPreviousImage() {
  const items = visibleGalleryItems();
  renderLightbox((activeGalleryIndex - 1 + items.length) % items.length);
}

function showNextImage() {
  const items = visibleGalleryItems();
  renderLightbox((activeGalleryIndex + 1) % items.length);
}

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
});

nav?.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    closeMenu();
  }
});

window.addEventListener("scroll", updateHeaderState, { passive: true });
updateHeaderState();

const revealItems = document.querySelectorAll(
  ".intro-grid, .trust-grid article, .section-heading, .service-card, .price-brief-card, .motion-card, .material-grid, .material-preview, .before-grid, .compare-table, .process-list li, .gallery-item, .case-study-card, .maintenance-grid, .areas-grid, .faq-list details, .final-cta-grid"
);

if (!reducedMotionQuery.matches && "IntersectionObserver" in window) {
  document.body.classList.add("reveal-ready");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item, index) => {
    item.classList.add("reveal");
    item.style.setProperty("--reveal-delay", `${(index % 4) * 65}ms`);
    revealObserver.observe(item);
  });
}

if (lightbox && lightboxImage && lightboxCaption) {
  galleryItems.forEach((item) => {
    item.addEventListener("click", () => openLightbox(item));
  });
}

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    galleryItems.forEach((item) => {
      const categories = item.dataset.category || "";
      item.classList.toggle("is-hidden", filter !== "all" && !categories.includes(filter));
    });
  });
});

closeLightboxButton?.addEventListener("click", closeLightbox);
prevLightboxButton?.addEventListener("click", showPreviousImage);
nextLightboxButton?.addEventListener("click", showNextImage);

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (!lightbox || lightbox.hidden) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    showPreviousImage();
  }

  if (event.key === "ArrowRight") {
    showNextImage();
  }
});

leadForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const message = [
      "Buna ziua, as dori o oferta Amprent PNA.",
      `Localitate: ${formData.get("location")}`,
      `Suprafata: ${formData.get("area")} m2`,
      `Lucrare: ${formData.get("service")}`,
      `Telefon: ${formData.get("phone")}`,
      `Termen: ${formData.get("timeline") || "-"}`,
      `Acces / suport existent: ${formData.get("access") || "-"}`,
      `Detalii: ${formData.get("message") || "-"}`
    ].join("\n");

    trackEvent("lead_form_submit", {
      form: form.dataset.quoteForm !== undefined ? "hero_quote" : "contact_quote",
      service: String(formData.get("service") || ""),
      location: String(formData.get("location") || "")
    });

    window.location.href = `https://wa.me/40771849735?text=${encodeURIComponent(message)}`;
  });
});

document.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) {
    return;
  }

  const href = link.getAttribute("href") || "";

  if (href.startsWith("tel:")) {
    trackEvent("phone_click", { location: link.dataset.trackLocation || document.title });
  }

  if (href.includes("wa.me")) {
    trackEvent("whatsapp_click", { location: link.dataset.trackLocation || document.title });
  }

  if (href.includes("contact.html") || href.includes("oferta-beton-amprentat.html")) {
    trackEvent("quote_cta_click", { label: link.textContent.trim(), location: document.title });
  }
});

const materialData = {
  piatra: {
    label: "Piatra naturala",
    title: "Aspect cald, potrivit pentru curti rezidentiale.",
    text: "Bun pentru alei, curti si terase unde se doreste un finisaj decorativ sobru, usor de integrat langa fatade moderne.",
    image: "assets/images/whatsapp-image-2020-11-09-at-19.01.39-2.jpeg"
  },
  ardezie: {
    label: "Ardezie gri",
    title: "Finisaj modern pentru case minimaliste.",
    text: "Griul si antracitul pun accent pe linii curate, contrast cu verdeata si un aspect contemporan al curtii.",
    image: "assets/images/whatsapp-image-2020-11-09-at-19.01.47-4.jpeg"
  },
  caramida: {
    label: "Caramida / oxid",
    title: "Tonuri calde pentru curti cu personalitate.",
    text: "Culorile oxid si maro sunt potrivite pentru suprafete ample, borduri decorative si treceri calde spre gradina.",
    image: "assets/images/whatsapp-image-2020-11-09-at-19.01.40-1-3.jpeg"
  },
  antracit: {
    label: "Antracit modern",
    title: "Contrast puternic pentru acces auto si zone tehnice.",
    text: "O alegere buna cand arhitectura este moderna si se doreste o suprafata discreta, densa vizual si usor de citit.",
    image: "assets/images/whatsapp-image-2020-11-09-at-19.01.39-2.jpeg"
  }
};

document.querySelectorAll("[data-swatch]").forEach((button) => {
  button.addEventListener("click", () => {
    const data = materialData[button.dataset.swatch];
    if (!data) {
      return;
    }

    document.querySelectorAll("[data-swatch]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    document.querySelector("[data-material-preview] img").src = data.image;
    document.querySelector("[data-material-label]").textContent = data.label;
    document.querySelector("[data-material-title]").textContent = data.title;
    document.querySelector("[data-material-text]").textContent = data.text;
  });
});

document.querySelectorAll("[data-before-after]").forEach((slider) => {
  const range = slider.querySelector("[data-ba-range]");
  const after = slider.querySelector("[data-ba-after]");

  function updateSlider() {
    after.style.width = `${range.value}%`;
  }

  range.addEventListener("input", updateSlider);
  updateSlider();
});

const counters = document.querySelectorAll("[data-count]");

if (!reducedMotionQuery.matches && "IntersectionObserver" in window) {
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const target = entry.target;
        const finalValue = Number(target.dataset.count);
        let frame = 0;
        const frames = 40;

        const tick = () => {
          frame += 1;
          target.textContent = Math.round((finalValue * frame) / frames);

          if (frame < frames) {
            requestAnimationFrame(tick);
          }
        };

        tick();
        countObserver.unobserve(target);
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((counter) => countObserver.observe(counter));
}
