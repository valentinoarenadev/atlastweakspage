const header = document.getElementById("header");
const toggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 10);
});

function closeMenu() {
  document.body.classList.remove("nav-open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Abrir menú");
}

toggle.addEventListener("click", () => {
  const open = document.body.classList.toggle("nav-open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
});

navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || "";
  const duration = 1600;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased).toLocaleString("es-ES") + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function animateBars(card) {
  const before = parseFloat(card.dataset.before);
  const after = parseFloat(card.dataset.after);
  const fills = card.querySelectorAll(".bench-fill");
  const values = card.querySelectorAll(".bench-value");
  const afterPct = 100;
  const basePct = Math.round((before / after) * 100);

  fills[0].style.width = afterPct + "%";
  fills[1].style.width = basePct + "%";
  values[0].textContent = after.toLocaleString("es-ES") + " FPS";
  values[1].textContent = before.toLocaleString("es-ES") + " FPS";
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("visible");

      el.querySelectorAll("[data-count]").forEach((counter) => {
        if (reduceMotion) {
          counter.textContent =
            parseInt(counter.dataset.count, 10).toLocaleString("es-ES") +
            (counter.dataset.suffix || "");
        } else {
          animateCount(counter);
        }
      });

      if (el.dataset.before && el.dataset.after) {
        if (reduceMotion) {
          const fills = el.querySelectorAll(".bench-fill");
          const values = el.querySelectorAll(".bench-value");
          fills[0].style.width = "100%";
          fills[1].style.width =
            Math.round((parseFloat(el.dataset.before) / parseFloat(el.dataset.after)) * 100) + "%";
          values[0].textContent = parseFloat(el.dataset.after).toLocaleString("es-ES") + " FPS";
          values[1].textContent = parseFloat(el.dataset.before).toLocaleString("es-ES") + " FPS";
        } else {
          animateBars(el);
        }
      }

      observer.unobserve(el);
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

document.getElementById("year").textContent = new Date().getFullYear();
