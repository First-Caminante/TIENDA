/* ═══════════════════════════════════════════════════
   SABOR & ALMA — MAIN.JS
   ═══════════════════════════════════════════════════ */

"use strict";

// ── Navbar scroll behavior ──
const nav = document.getElementById("mainNav");
if (nav) {
  window.addEventListener(
    "scroll",
    () => {
      nav.classList.toggle("scrolled", window.scrollY > 40);
    },
    { passive: true },
  );
}

// ── Scroll animations (IntersectionObserver) ──
const animEls = document.querySelectorAll("[data-anim]");
if (animEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger sibling cards
          const delay = entry.target.closest(".row")
            ? Array.from(entry.target.closest(".row").children).indexOf(
                entry.target.closest('[class*="col"]'),
              ) * 80
            : 0;
          setTimeout(() => entry.target.classList.add("visible"), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  animEls.forEach((el) => observer.observe(el));
}

// ── Menú tabs (filtro de categorías) ──
const tabs = document.querySelectorAll(".menu-tab");
const cards = document.querySelectorAll(".menu-card-col");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const cat = tab.dataset.category;

    // Actualizar tab activo
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    // Filtrar tarjetas
    cards.forEach((card) => {
      const match = cat === "todo" || card.dataset.category === cat;
      card.style.transition = "opacity .35s ease, transform .35s ease";
      if (match) {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
        card.style.display = "block";
      } else {
        card.style.opacity = "0";
        card.style.transform = "translateY(12px)";
        setTimeout(() => {
          if (tab.dataset.category === cat && !match) {
            card.style.display = "none";
          }
        }, 350);
      }
    });
  });
});

// ── Lightbox para galería ──
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lbClose = document.getElementById("lightboxClose");

document
  .querySelectorAll(".gallery-item:not(.img-placeholder)")
  .forEach((item) => {
    item.addEventListener("click", () => {
      const src = item.querySelector("img")?.src || "";
      if (!src) return;
      lightboxImg.src = src;
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

if (lbClose) {
  lbClose.addEventListener("click", closeLightbox);
}
if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
  setTimeout(() => {
    lightboxImg.src = "";
  }, 300);
}

// ── Formulario de contacto ──
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const mensaje = document.getElementById("mensaje")?.value.trim();

    if (!nombre || !email || !mensaje) {
      showToast("Por favor completa los campos requeridos.", "error");
      return;
    }
    if (!isValidEmail(email)) {
      showToast("Por favor ingresa un correo válido.", "error");
      return;
    }

    // Simular envío
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML =
      '<span class="spinner-border spinner-border-sm me-2"></span>Enviando...';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      contactForm.reset();
      showToast("¡Mensaje enviado! Te contactaremos pronto.", "success");
    }, 1800);
  });
}

// ── Formulario de reservaciones ──
const reservaForm = document.getElementById("reservaForm");
if (reservaForm) {
  // Mínimo fecha = hoy
  const fechaInput = document.getElementById("fecha");
  if (fechaInput) {
    const today = new Date().toISOString().split("T")[0];
    fechaInput.setAttribute("min", today);
  }

  reservaForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("r-nombre")?.value.trim();
    const fecha = document.getElementById("fecha")?.value;
    const hora = document.getElementById("hora")?.value;
    const personas = document.getElementById("personas")?.value;
    const telefono = document.getElementById("r-telefono")?.value.trim();

    if (!nombre || !fecha || !hora || !personas || !telefono) {
      showToast("Por favor completa todos los campos requeridos.", "error");
      return;
    }

    // Construir mensaje WhatsApp
    const msg = encodeURIComponent(
      `Hola! Quisiera hacer una reserva:\n` +
        `• Nombre: ${nombre}\n` +
        `• Fecha: ${fecha}\n` +
        `• Hora: ${hora}\n` +
        `• Personas: ${personas}\n` +
        `• Teléfono: ${telefono}`,
    );

    // Abrir WhatsApp con los datos
    window.open(`https://wa.me/59175233556?text=${msg}`, "_blank");

    showToast("¡Redirigiendo a WhatsApp para confirmar tu reserva!", "success");
  });
}

// ── Toast notification ──
function showToast(msg, type = "success") {
  const existing = document.querySelector(".custom-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = `custom-toast ${type}`;
  toast.innerHTML = `<i class="bi bi-${type === "success" ? "check-circle-fill" : "exclamation-circle-fill"}"></i> ${msg}`;

  document.body.appendChild(toast);

  // Estilos inline para portabilidad
  Object.assign(toast.style, {
    position: "fixed",
    bottom: "24px",
    left: "50%",
    transform: "translateX(-50%) translateY(20px)",
    background: type === "success" ? "#1c7a43" : "#b5341c",
    color: "#fff",
    padding: "14px 28px",
    borderRadius: "8px",
    fontSize: ".9rem",
    fontFamily: "Jost, sans-serif",
    fontWeight: "400",
    boxShadow: "0 8px 30px rgba(0,0,0,.25)",
    zIndex: "99999",
    opacity: "0",
    transition: "opacity .3s ease, transform .3s ease",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    maxWidth: "90vw",
    whiteSpace: "nowrap",
  });

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(10px)";
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}

// ── Helpers ──
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── Active nav link ──
const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-link").forEach((link) => {
  const href = link.getAttribute("href");
  if (href === currentPage || (currentPage === "" && href === "index.html")) {
    link.classList.add("active");
    link.style.color = "var(--gold)";
  }
});
