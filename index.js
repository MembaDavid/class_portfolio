// Helper: query
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

// Sticky nav: toggle mobile menu
const toggleBtn = $(".nav-toggle");
const navMenu = $("#nav-menu");

toggleBtn?.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  toggleBtn.setAttribute("aria-expanded", String(isOpen));
});

// Close mobile menu on link click
$$(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    toggleBtn.setAttribute("aria-expanded", "false");
  });
});

// Scroll spy: highlight active section in nav
const sections = ["home", "about", "skills", "projects", "contact"].map((id) =>
  document.getElementById(id)
);
const linkMap = new Map(
  $$(".nav-link").map((a) => [a.getAttribute("href")?.replace("#", ""), a])
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = entry.target.id;
      const link = linkMap.get(id);
      if (!link) return;
      if (entry.isIntersecting) {
        $$(".nav-link").forEach((a) => a.classList.remove("active"));
        link.classList.add("active");
        history.replaceState(null, "", `#${id}`); // update hash without scrolling
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 }
);

sections.forEach((sec) => sec && observer.observe(sec));

// Animate skill bars on first view
const progressBars = $$(".progress");
const progObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const val = el.getAttribute("data-value") || "0";
        el.style.setProperty("--value", `${val}%`);
        obs.unobserve(el);
      }
    });
  },
  { threshold: 0.4 }
);
progressBars.forEach((el) => progObserver.observe(el));

// Contact form (client-side validation + demo handler)
const form = $("#contact-form");
const statusEl = $(".form-status");
const showError = (name, msg) => {
  const small = $(`.error-msg[data-for="${name}"]`);
  if (small) small.textContent = msg || "";
};

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "";
  showError("name", "");
  showError("email", "");
  showError("message", "");

  const data = Object.fromEntries(new FormData(form).entries());
  let hasError = false;

  if (!data.name || String(data.name).trim().length < 2) {
    showError("name", "Please enter your name.");
    hasError = true;
  }
  const email = String(data.email || "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError("email", "Enter a valid email address.");
    hasError = true;
  }
  if (!data.message || String(data.message).trim().length < 10) {
    showError("message", "Message should be at least 10 characters.");
    hasError = true;
  }

  if (hasError) return;

  // Demo success (replace with your API call)
  await new Promise((r) => setTimeout(r, 500));
  statusEl.textContent = "Thanks! I’ll get back to you soon.";
  form.reset();
});

// Year in footer
$("#year").textContent = new Date().getFullYear();
