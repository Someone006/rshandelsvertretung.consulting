// Mobile menu and "copy address" – no tracking, no cookies, no external requests.
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".menu-btn");
  const nav = document.getElementById("nav");
  if (btn && nav) {
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));
  }
  document.querySelectorAll("button[data-copy]").forEach((b) => {
    const label = b.textContent;
    b.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(b.dataset.copy);
        b.textContent = document.documentElement.lang.startsWith("de") ? "Kopiert ✓" : "Copied ✓";
      } catch {
        const r = document.createRange();
        r.selectNodeContents(b.previousElementSibling);
        getSelection().removeAllRanges();
        getSelection().addRange(r);
      }
      setTimeout(() => (b.textContent = label), 2000);
    });
  });
});
