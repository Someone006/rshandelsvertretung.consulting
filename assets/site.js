// RS Handelsvertretung. No tracking, no cookies, no network requests. Forms only compose an e-mail.
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".menu"), nav = document.getElementById("nav");
  if (btn && nav) btn.addEventListener("click", () => btn.setAttribute("aria-expanded", String(nav.classList.toggle("open"))));

  document.querySelectorAll("button[data-copy]").forEach((b) => {
    const label = b.textContent;
    b.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(b.dataset.copy); b.textContent = b.dataset.done + " ✓"; }
      catch { const r = document.createRange(); r.selectNodeContents(document.getElementById("addr")); getSelection().removeAllRanges(); getSelection().addRange(r); }
      setTimeout(() => (b.textContent = label), 2000);
    });
  });

  const mailto = (to, subject, body) => "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

  const enq = document.getElementById("enq");
  if (enq) enq.addEventListener("submit", (ev) => {
    ev.preventDefault();
    if (!enq.reportValidity()) return;
    const d = new FormData(enq);
    const body = [d.get("role"), d.get("co"), d.get("pr"), "", d.get("msg")].filter((x) => x !== null).join("\n");
    location.href = mailto(enq.dataset.mail, "Website: " + d.get("role") + " – " + d.get("co"), body);
  });

  const fit = document.getElementById("fit");
  if (fit) fit.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const out = document.getElementById("fitout"), link = document.getElementById("fitmail");
    const sets = [...fit.querySelectorAll("fieldset")];
    const open = [], lines = [];
    let dealer = false, unanswered = 0;
    sets.forEach((fs, i) => {
      const v = (fs.querySelector("input:checked") || {}).value;
      const q = fs.querySelector("legend").textContent;
      if (!v) { unanswered++; return; }
      lines.push(q + " " + v);
      if (v === fs.dataset.bad) { if (i === 0) dealer = true; else open.push(q.replace(/^\d+\.\s*/, "")); }
    });
    if (unanswered) { sets.find((fs) => !fs.querySelector("input:checked")).querySelector("input").focus(); return; }
    let text;
    if (dealer) text = fit.dataset.dealer;
    else if (open.length === 0) text = fit.dataset.good;
    else if (open.length <= 2) text = fit.dataset.mid + open.join(" · ");
    else text = fit.dataset.bad + open.join(" · ");
    out.textContent = text;
    out.hidden = false;
    link.hidden = false;
    link.href = mailto(fit.dataset.mail, "Fit check", lines.join("\n") + "\n\n" + text);
  });
});

// v6: the header gets a hairline shadow once the page is scrolled; the example review fills in when it comes into view.
(() => {
  const head = document.getElementById("head");
  if (head) {
    const set = () => head.classList.toggle("scrolled", window.scrollY > 8);
    set();
    window.addEventListener("scroll", set, {passive: true});
  }
  const menu = document.querySelector(".menu"), nav = document.getElementById("nav");
  if (menu && nav) document.addEventListener("keydown", (ev) => {   // Escape closes the phone menu
    if (ev.key === "Escape" && nav.classList.contains("open")) { nav.classList.remove("open"); menu.setAttribute("aria-expanded", "false"); menu.focus(); }
  });
  const sheet = document.querySelector(".sheet");
  if (!sheet || !("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (sheet.getBoundingClientRect().top < innerHeight) return;   // already on screen at load (tall window, print, preview tools): show it at once
  sheet.classList.add("pre");
  const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { sheet.classList.add("in"); io.disconnect(); } }, {threshold: 0.3});
  io.observe(sheet);
  setTimeout(() => sheet.classList.add("in"), 6000);   // never leave the rows hidden
})();
