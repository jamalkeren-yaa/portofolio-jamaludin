// ===== Tema terang / gelap =====
const root = document.documentElement;
const themeBtn = document.getElementById("themeBtn");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  try { localStorage.setItem("tema", theme); } catch (e) { /* abaikan */ }
}

let saved = null;
try { saved = localStorage.getItem("tema"); } catch (e) { /* abaikan */ }
applyTheme(saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

themeBtn.addEventListener("click", () => {
  applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
});

// ===== Menu mobile =====
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");

burger.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", String(open));
});
menu.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    menu.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  })
);

// ===== Efek mengetik pada peran =====
const roles = [
  "Mahasiswa Teknik Informatika",
  "Videografer dan editor video",
  "Pelayanan pelanggan dan operasional",
];
const typed = document.getElementById("typed");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion) {
  typed.textContent = roles[0];
} else {
  let r = 0, c = 0, deleting = false;
  (function tick() {
    const word = roles[r];
    typed.textContent = word.slice(0, c);
    let delay = deleting ? 35 : 70;

    if (!deleting && c === word.length) { deleting = true; delay = 1600; }
    else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 350; }
    else { c += deleting ? -1 : 1; }

    setTimeout(tick, delay);
  })();
}

// ===== Timecode kamera =====
const tcEl = document.getElementById("timecode");
const startTime = performance.now();
const pad = (n) => String(n).padStart(2, "0");

function updateTimecode() {
  const ms = performance.now() - startTime;
  const total = Math.floor(ms / 1000);
  const frames = Math.floor((ms % 1000) / (1000 / 30));
  tcEl.textContent = `${pad(Math.floor(total / 3600))}:${pad(Math.floor(total / 60) % 60)}:${pad(total % 60)}:${pad(frames)}`;
}
if (!reduceMotion) setInterval(updateTimecode, 66);

// ===== Efek fokus kamera saat foto diklik/disentuh =====
const vf = document.querySelector(".viewfinder");
function triggerFocus() {
  vf.classList.remove("focusing");
  void vf.offsetWidth; // paksa animasi mulai ulang
  vf.classList.add("focusing");
}
vf.addEventListener("click", triggerFocus);
setTimeout(triggerFocus, 900);

// ===== Akordeon pengalaman =====
document.querySelectorAll(".job-head").forEach((btn) => {
  btn.addEventListener("click", () => {
    const job = btn.closest(".job");
    const open = job.dataset.open === "true";
    job.dataset.open = String(!open);
    btn.setAttribute("aria-expanded", String(!open));
  });
});

// ===== Playhead timeline mengikuti scroll di bagian pengalaman =====
const editor = document.querySelector(".editor");
const playhead = document.getElementById("playhead");

function movePlayhead() {
  const rect = editor.getBoundingClientRect();
  const vh = window.innerHeight;
  const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
  const pad = 16;
  const width = editor.clientWidth - pad * 2;
  playhead.style.left = pad + width * progress + "px";
}
window.addEventListener("scroll", movePlayhead, { passive: true });
window.addEventListener("resize", movePlayhead);
movePlayhead();

// ===== Tandai menu aktif saat scroll =====
const links = [...menu.querySelectorAll("a")];
const sections = links.map((a) => document.querySelector(a.getAttribute("href")));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((l) =>
          l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id)
        );
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => s && observer.observe(s));

// ===== Formulir: kirim pesan lewat WhatsApp =====
document.getElementById("msgForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const nama = document.getElementById("fName").value.trim();
  const pesan = document.getElementById("fMsg").value.trim();
  const teks = `Halo Jamaludin, saya ${nama}.\n\n${pesan}`;
  window.open("https://wa.me/6281295205041?text=" + encodeURIComponent(teks), "_blank", "noopener");
});

// ===== Tahun footer =====
document.getElementById("year").textContent = new Date().getFullYear();
