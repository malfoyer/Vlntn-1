// Elements
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const card = document.getElementById("card");
const reveal = document.getElementById("reveal");
const micro = document.getElementById("micro");

const bgm = document.getElementById("bgm");
const musicBtn = document.getElementById("musicBtn");
let musicPlaying = false;

const floaties = document.getElementById("floaties");
const confetti = document.getElementById("confetti");

// Fireworks
const canvas = document.getElementById("fx");
const ctx = canvas.getContext("2d");
let particles = [];
let fireworksOn = false;
let fwTimer = null;

// Helpers
const rand = (a,b)=>Math.random()*(b-a)+a;
const pick = (arr)=>arr[Math.floor(Math.random()*arr.length)];

// --- Mobile safe: NO runs but never blocks YES
let noIsAbsolute = false;
function ensureNoAbsolute(){
  if (noIsAbsolute) return;
  noBtn.style.position = "absolute";
  noBtn.style.left = "50%";
  noBtn.style.top = "76%";
  noBtn.style.transform = "translate(-50%, -50%)";
  noIsAbsolute = true;
}
function moveNo(){
  ensureNoAbsolute();
  const area = document.getElementById("actions").getBoundingClientRect();
  const btn = noBtn.getBoundingClientRect();
  const pad = 10;

  const maxX = Math.max(pad, area.width - btn.width - pad);
  const maxY = Math.max(pad, area.height - btn.height - pad);

  const isMobile = window.innerWidth <= 520;
  const yesRect = yesBtn.getBoundingClientRect();

  let x,y,tries=0;
  do{
    x = rand(pad, maxX);
    y = rand(pad, maxY);
    tries++;
  }while(tries<18 && isMobile && (y < (yesRect.bottom - area.top + 10)));

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  noBtn.style.transform = "none";

  micro.textContent = pick([
    "(no itu typo kan? 😭)",
    "(jangan gituuu 🥺)",
    "(aku kirim bunga 1 truk ya 🌷)",
    "(ayo yes dong… please 🫶)",
    "(aku nangis beneran 😳💗)"
  ]);
}
noBtn.addEventListener("mouseenter", moveNo);
noBtn.addEventListener("touchstart", (e)=>{ e.preventDefault(); moveNo(); }, {passive:false});
noBtn.addEventListener("click", moveNo);

// --- Cupid arrow “hits” YES in sync with CSS loop
setInterval(()=>{
  yesBtn.classList.add("is-hit");
  setTimeout(()=>yesBtn.classList.remove("is-hit"), 900);
}, 3100);

// --- Floaties
const FLOAT_SET = ["💗","💞","💘","💕","💖","🌸","🌺","🌷","✨","🫶"];
let floatTimer = null;
function spawnFloaty(){
  const el = document.createElement("div");
  el.className = "floaty";
  el.textContent = pick(FLOAT_SET);
  el.style.left = `${rand(6,94)}vw`;
  el.style.bottom = `-10vh`;
  el.style.fontSize = `${rand(18,34)}px`;
  el.style.animationDuration = `${rand(3.0,6.2)}s`;
  floaties.appendChild(el);
  setTimeout(()=>el.remove(), 9000);
}
function startFloaties(){
  if (floatTimer) return;
  floatTimer = setInterval(spawnFloaty, 110);
}
function stopFloaties(){ clearInterval(floatTimer); floatTimer=null; }

// --- Confetti hearts
function spawnConfettiHeart(){
  const el = document.createElement("div");
  el.className = "confettiHeart";
  el.textContent = pick(["💖","💗","💕","💞","💘","❤️"]);
  el.style.left = `${rand(2,98)}vw`;
  el.style.fontSize = `${rand(14,28)}px`;
  const dur = rand(2.8,5.4);
  el.style.animationDuration = `${dur}s`;
  confetti.appendChild(el);
  setTimeout(()=>el.remove(), dur*1000+300);
}
function confettiBurst(seconds=2.2){
  const endAt = Date.now() + seconds*1000;
  const t = setInterval(()=>{
    for(let i=0;i<7;i++) spawnConfettiHeart();
    if (Date.now() > endAt) clearInterval(t);
  }, 120);
}

// --- Fireworks
function resizeCanvas(){
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth*dpr);
  canvas.height = Math.floor(window.innerHeight*dpr);
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function launchFirework(){
  const cx = rand(0.18,0.82)*window.innerWidth;
  const cy = rand(0.16,0.54)*window.innerHeight;
  const colors = ["#ffffff","#ff2e82","#ff6fb1","#ff9ad0","#f7c948"];
  const count = Math.floor(rand(50,86));
  for(let i=0;i<count;i++){
    const a = rand(0,Math.PI*2);
    const sp = rand(1.6,5.6);
    particles.push({
      x:cx,y:cy,
      vx:Math.cos(a)*sp,
      vy:Math.sin(a)*sp,
      life:rand(42,86),
      color:pick(colors),
      size:rand(1.5,3.4),
      drag:rand(0.965,0.985),
      gravity:rand(0.02,0.06)
    });
  }
}
function tickFx(){
  if (!fireworksOn && particles.length===0) return;
  ctx.fillStyle = "rgba(255,255,255,0.10)";
  ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
  particles = particles.filter(p=>p.life>0);
  for(const p of particles){
    p.vx*=p.drag;
    p.vy = p.vy*p.drag + p.gravity;
    p.x+=p.vx; p.y+=p.vy; p.life-=1;
    ctx.beginPath();
    ctx.fillStyle = p.color;
    ctx.globalAlpha = Math.min(1, p.life/44);
    ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(tickFx);
}
function startFireworks(){
  fireworksOn = true;
  launchFirework(); launchFirework();
  tickFx();
  fwTimer = setInterval(()=>{
    launchFirework();
    if (Math.random()<0.35) launchFirework();
  }, 650);
}
function stopFireworks(){
  fireworksOn=false;
  clearInterval(fwTimer);
  fwTimer=null;
}

// --- Music
function setMusicIcon(){ musicBtn.textContent = musicPlaying ? "❚❚" : "♫"; }
async function forcePlayMusic(){
  if (!bgm || musicPlaying) return;
  try{
    bgm.volume = 0.8;
    await bgm.play();
    musicPlaying = true;
    setMusicIcon();
  }catch(e){ console.log(e); }
}
musicBtn.addEventListener("click", async ()=>{
  if (musicPlaying){
    bgm.pause(); musicPlaying=false; setMusicIcon();
  }else{
    try{ await bgm.play(); musicPlaying=true; setMusicIcon(); }catch(e){}
  }
});

// --- YES flow
function showReveal(){
  card.style.display="none";
  reveal.style.display="flex";
  reveal.setAttribute("aria-hidden","false");

  confettiBurst(2.6);
  startFloaties();
  startFireworks();
}
function onYes(){
  yesBtn.classList.add("is-hit");
  forcePlayMusic();
  showReveal();
}
yesBtn.addEventListener("click", onYes);
yesBtn.addEventListener("touchstart", (e)=>{ e.preventDefault(); onYes(); }, {passive:false});

// Reset
document.getElementById("resetBtn").addEventListener("click", ()=>{
  stopFloaties();
  stopFireworks();
  particles=[];
  ctx.clearRect(0,0,window.innerWidth,window.innerHeight);

  reveal.style.display="none";
  reveal.setAttribute("aria-hidden","true");
  card.style.display="block";

  micro.textContent="(No itu cuma bercanda ya…)";

  noBtn.style.position="relative";
  noBtn.style.left="auto";
  noBtn.style.top="auto";
  noBtn.style.transform="none";
  noIsAbsolute=false;
});
