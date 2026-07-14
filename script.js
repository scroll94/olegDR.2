// ---------- wishes data ----------
const wishes = [
  { wish: "Жену, за которую не стыдно ни в свете, ни дома.", sum: "идеальный брак" },
  { wish: "Кучу детей — пусть несут твою фамилию и твоё чувство юмора дальше.", sum: "большая семья" },
  { wish: "Долларов больше, чем поместится в один сейф.", sum: "безлимитный счёт" },
  { wish: "Bugatti в гараже — просто потому что тебе положено.", sum: "гиперкар в подарок" },
  { wish: "Пусть новый уровень будет не мечтой, а вопросом времени.", sum: "бесконечность возможностей" },
  { wish: "Пусть каждое утро начинается с уверенности, а не с будильника.", sum: "спокойствие короля" },
  { wish: "20 — это вступительный взнос в клуб больших дел.", sum: "место в клубе" },
  { wish: "Пусть друзья остаются такими же настоящими, как 12 лет назад.", sum: "верность×12" },
  { wish: "Вкус, что не купишь ни за какие деньги — у тебя он уже есть.", sum: "безупречный стиль" },
  { wish: "12 лет позади. Всё лучшее — только начинается.", sum: "безлимитный кредит на счастье" },
];

const grid = document.getElementById('chequeGrid');
wishes.forEach((w, i) => {
  const rot = (Math.random() * 6 - 3).toFixed(1);
  const el = document.createElement('div');
  el.className = 'cheque';
  el.style.setProperty('--r', rot + 'deg');
  el.style.transitionDelay = (i * 90) + 'ms';
  el.innerHTML = `
    <div class="cheque-head"><span>ПЕРВЫЙ ЧАСТНЫЙ БАНК ДРУЖБЫ</span><span>№ ${String(i + 1).padStart(3, '0')}/12</span></div>
    <div class="cheque-bank">Уплатить по предъявлении: ОЛЕГУ</div>
    <div class="cheque-line">Дата: 13.07.2026</div>
    <div class="cheque-wish">«${w.wish}»</div>
    <div class="cheque-foot">
      <div class="cheque-sig">друг</div>
      <div class="cheque-num">СУММА: ${w.sum}</div>
    </div>`;
  grid.appendChild(el);
});

// ---------- scroll reveal ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      if (e.target.classList.contains('signature-svg')) e.target.classList.add('draw');
    }
  });
}, { threshold: .2 });

document.querySelectorAll('.reveal, .cheque').forEach(el => io.observe(el));
document.querySelectorAll('.signature-svg').forEach(el => io.observe(el));

// ---------- gold dust particles ----------
const dc = document.getElementById('dust-canvas');
const dctx = dc.getContext('2d');
let W, H, particles = [];
function resize() { W = dc.width = innerWidth; H = dc.height = innerHeight; }
resize();
addEventListener('resize', resize);

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const particleCount = reduceMotion ? 0 : 46;
for (let i = 0; i < particleCount; i++) {
  particles.push({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 1.6 + .4,
    vy: -(Math.random() * .35 + .08),
    vx: (Math.random() * .2 - .1),
    a: Math.random() * .5 + .15
  });
}
function tick() {
  dctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    p.y += p.vy; p.x += p.vx;
    if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
    dctx.beginPath();
    dctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    dctx.fillStyle = `rgba(201,169,97,${p.a})`;
    dctx.fill();
  });
  requestAnimationFrame(tick);
}
tick();

// ---------- confetti burst ----------
const cc = document.getElementById('confetti-canvas');
const cctx = cc.getContext('2d');
function resizeC() { cc.width = innerWidth; cc.height = innerHeight; }
resizeC();
addEventListener('resize', resizeC);

const popBtn = document.getElementById('popBtn');
popBtn.addEventListener('click', () => {
  popBtn.classList.add('popped');
  popBtn.querySelector('.btn-label').textContent = 'За тебя! 🥂';
  burst(innerWidth / 2, innerHeight / 2);
});

function burst(x, y) {
  const colors = ['#c9a961', '#f0dca3', '#8a6d1f', '#f6f1e2'];
  const bits = reduceMotion ? 0 : 140;
  const conf = [];
  for (let i = 0; i < bits; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 7 + 3;
    conf.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      g: 0.18,
      size: Math.random() * 5 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
      rot: Math.random() * 360,
      vr: Math.random() * 10 - 5
    });
  }
  let frame = 0;
  function step() {
    cctx.clearRect(0, 0, cc.width, cc.height);
    frame++;
    let alive = false;
    conf.forEach(p => {
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= 0.012;
      if (p.life > 0) {
        alive = true;
        cctx.save();
        cctx.translate(p.x, p.y);
        cctx.rotate(p.rot * Math.PI / 180);
        cctx.globalAlpha = Math.max(p.life, 0);
        cctx.fillStyle = p.color;
        cctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * .6);
        cctx.restore();
      }
    });
    if (alive && frame < 260) requestAnimationFrame(step);
    else cctx.clearRect(0, 0, cc.width, cc.height);
  }
  step();
}
