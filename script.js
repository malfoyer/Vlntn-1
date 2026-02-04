// ===== Helpers =====
const rand = (min, max) => Math.random() * (max - min) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ===== Elements =====
const card = document.getElementById("card");
const reveal = document.getElementById("reveal");

const actions = document.getElementById("actions");
const yesBtn = document.getElementById("yesBtn");
const noBtn  = document.getElementById("noBtn");
const micro  = document.getElementById("micro");

const moreBtn = document.getElementById("moreBtn");
const resetBtn = document.getElementById("resetBtn");

const floaties = document.getElementById("floaties");
const confetti = document.getElementById("confetti");

// Popup
const popup = document.getElementById("popup");
const popupClose = document.getElementById("popupClose");
const popupX = document.getElementById("popupX");
const popupBtn = document.getElementById("popupBtn");

// Music
const bgm = document.getElementById("bgm");
const musicBtn = document.getElementById("musicBtn");
let musicPlaying = false;

// ===== NO behavior (unlimited escape) =====
let noIsAbsolute = false;

// ===== Floaties =====
const FLOAT_SET = ["💗","💞","💘","💕","💖","🌸","🌺","🌷","🌹","✨","🫶"];
let floatTimer = null;

// ===== Fireworks =====
const canvas = document.getElementById("fx");
const ctx = canvas.getContext("2d");
let particles = [];
let fireworksOn = false;
let fwTimer = null;

// ---------- Arrow touches YES -> heart button ----------
let heartMode = false;
function heartifyYesBriefly() {
  if (heartMode) return;
  heartMode = true;
  yesBtn.classList.add("is-heart");
  setTimeout(() => {
    yesBtn.classList.remove("is-heart");
    heartMode = false;
  }, 900);
}
setInterval(heartifyYesBriefly, 1700);

// ---------- NO escape ----------
function ensureNoAbsolute() {
  if (noIsAbsolute) return;
  noBtn.style.position = "absolute";
  noBtn.style.left = "50%";
  noBtn.style.top = "76%";
  noBtn.style.transform = "translate(-50%, -50%)";
  noIsAbsolute = true;
}

function moveNo() {
  ensureNoAbsolute();

  const area = actions.getBoundingClientRect();
  const btn  = noBtn.getBoundingClientRect();
  const pad = 10;

  const maxX = Math.max(pad, area.width - btn.width - pad);
  const maxY = Math.max(pad, area.height - btn.height - pad);

  // Mobile safe zone: keep NO below YES area
  const isMobile = window.innerWidth <= 520;
  const yesRect = yesBtn.getBoundingClientRect();

  let x, y, tries = 0;
  do {
    x = rand(pad, maxX);
    y = rand(pad, maxY);
    tries++;
  } while (
    tries < 18 &&
    isMobile &&
    (y < (yesRect.bottom - area.top + 10))
  );

  noBtn.style.left = `${x}px`;
  noBtn.style.top  = `${y}px`;
  noBtn.style.transform = "none";

  const lines = [
    "(ih kok milih no 😭)",
    "(jangan yaa… aku nangis 🥺)",
    "(bentar aku bujuk dulu 😳)",
    "(no itu typo kan? 😤💗)",
    "(ayo yes dong… pleaseeee 🫶)",
    "(aku kirim bunga 1 truk ya 😭🌷)"
  ];
  micro.textContent = pick(lines);
}

noBtn.addEventListener("mouseenter", moveNo);
noBtn.addEventListener("touchstart", (e) => { e.preventDefault(); moveNo(); }, { passive: false });
noBtn.addEventListener("click", moveNo);

// ---------- Floaties ----------
function spawnFloaty() {
  const el = document.createElement("div");
  el.className = "floaty";
  el.textContent = pick(FLOAT_SET);

  el.style.left = `${rand(6, 94)}vw`;
  el.style.bottom = `-10vh`;
  el.style.fontSize = `${rand(18, 34)}px`;
  el.style.animationDuration = `${rand(3.0, 6.2)}s`;
  el.style.animationDelay = `${rand(0, 0.5)}s`;

  floaties.appendChild(el);
  setTimeout(() => el.remove(), 9000);
}

function burstFloaties(n = 28){ for (let i=0;i<n;i++) spawnFloaty(); }

function startFloaties() {
  if (floatTimer) return;
  floatTimer = setInterval(spawnFloaty, 105);
}
function stopFloaties() {
  clearInterval(floatTimer);
  floatTimer = null;
}

// ---------- Heart confetti ----------
function spawnConfettiHeart() {
  const el = document.createElement("div");
  el.className = "confettiHeart";
  el.textContent = pick(["💗","💖","💕","💞","💘","❤️"]);

  const x = rand(2, 98);
  const size = rand(14, 28);
  const dur = rand(2.8, 5.4);
  const delay = rand(0, 0.25);

  el.style.left = `${x}vw`;
  el.style.fontSize = `${size}px`;
  el.style.animationDuration = `${dur}s`;
  el.style.animationDelay = `${delay}s`;

  confetti.appendChild(el);
  setTimeout(() => el.remove(), (dur + delay) * 1000 + 250);
}

function confettiBurst(seconds = 2.2) {
  const endAt = Date.now() + seconds * 1000;
  const t = setInterval(() => {
    for (let i = 0; i < 7; i++) spawnConfettiHeart();
    if (Date.now() > endAt) clearInterval(t);
  }, 120);
}

// ---------- Fireworks ----------
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function launchFirework() {
  const cx = rand(0.18, 0.82) * window.innerWidth;
  const cy = rand(0.16, 0.54) * window.innerHeight;

  const colors = ["#ffffff", "#ff2e82", "#ff6fb1", "#ff9ad0", "#f7c948"];
  const count = Math.floor(rand(50, 86));

  for (let i = 0; i < count; i++) {
    const a = rand(0, Math.PI * 2);
    const sp = rand(1.6, 5.6);
    particles.push({
      x: cx, y: cy,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      life: rand(42, 86),
      color: pick(colors),
      size: rand(1.5, 3.4),
      drag: rand(0.965, 0.985),
      gravity: rand(0.02, 0.06)
    });
  }
}

function tickFx() {
  if (!fireworksOn && particles.length === 0) return;

  ctx.fillStyle = "rgba(255,255,255,0.10)";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  particles = particles.filter(p => p.life > 0);

  for (const p of particles) {
    p.vx *= p.drag;
    p.vy = p.vy * p.drag + p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;

    ctx.beginPath();
    ctx.fillStyle = p.color;
    ctx.globalAlpha = Math.min(1, p.life / 44);
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  requestAnimationFrame(tickFx);
}

function startFireworks() {
  fireworksOn = true;
  launchFirework(); launchFirework();
  tickFx();
  fwTimer = setInterval(() => {
    launchFirework();
    if (Math.random() < 0.35) launchFirework();
  }, 650);
}

function stopFireworks() {
  fireworksOn = false;
  clearInterval(fwTimer);
  fwTimer = null;
}

// ---------- Music ----------
function setMusicIcon() {
  if (!musicBtn) return;
  musicBtn.textContent = musicPlaying ? "❚❚" : "♫";
}

async function forcePlayMusic() {
  if (!bgm || musicPlaying) return;
  try {
    bgm.volume = 0.8;
    await bgm.play();
    musicPlaying = true;
    setMusicIcon();
  } catch (e) {
    console.log("Audio blocked:", e);
  }
}

musicBtn?.addEventListener("click", async () => {
  if (!bgm) return;
  if (musicPlaying) {
    bgm.pause();
    musicPlaying = false;
    setMusicIcon();
  } else {
    try {
      await bgm.play();
      musicPlaying = true;
      bgm.volume = Math.max(bgm.volume || 0.7, 0.7);
      setMusicIcon();
    } catch (e) {
      console.log("Audio blocked:", e);
    }
  }
});

// ---------- Popup ----------
function openPopup() {
  popup.classList.add("is-open");
  popup.setAttribute("aria-hidden", "false");
  burstFloaties(18);
}
function closePopup() {
  popup.classList.remove("is-open");
  popup.setAttribute("aria-hidden", "true");
}
popupClose?.addEventListener("click", closePopup);
popupX?.addEventListener("click", closePopup);
popupBtn?.addEventListener("click", closePopup);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePopup(); });

// ---------- Flow ----------
function showReveal() {
  card.style.display = "none";
  reveal.style.display = "flex";
  reveal.setAttribute("aria-hidden", "false");

  confettiBurst(2.6);
  burstFloaties(40);
  startFloaties();
  startFireworks();
}

// Mobile-reliable YES (click + touchstart), don’t await audio
function onYes() {
  yesBtn.classList.add("is-love");
  const span = yesBtn.querySelector("span");
  if (span) span.textContent = "YESSS 😭💖";
  forcePlayMusic();
  showReveal();
}

yesBtn.addEventListener("click", onYes);
yesBtn.addEventListener("touchstart", (e) => { e.preventDefault(); onYes(); }, { passive: false });

// More
moreBtn?.addEventListener("click", () => {
  openPopup();
  confettiBurst(1.4);
  burstFloaties(22);
  launchFirework();
});

// Reset
resetBtn?.addEventListener("click", () => {
  stopFloaties();
  stopFireworks();
  particles = [];
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  closePopup();

  reveal.style.display = "none";
  reveal.setAttribute("aria-hidden", "true");
  card.style.display = "block";

  yesBtn.classList.remove("is-love");
  const span = yesBtn.querySelector("span");
  if (span) span.textContent = "YES 💖";

  micro.textContent = "(Tombol “No” itu cuma hiasan. Kayak kamu: lucu banget.)";

  noBtn.style.position = "relative";
  noBtn.style.left = "auto";
  noBtn.style.top = "auto";
  noBtn.style.transform = "none";
  noIsAbsolute = false;

  burstFloaties(12);
});
