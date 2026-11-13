/* ====== EDIT THIS PART ====== */
const CONFIG = {
  name: "Maahi",
  from: "Ritik",
  // Put your photos in images/ and match the names here.
  photos: [
    { src: "images/1.jpg", cap: "When we couldn't stop laughing" },
    { src: "images/2.jpg", cap: "My favourite version of us" },
    { src: "images/3.jpg", cap: "You, being the best part" },
    { src: "images/4.jpg", cap: "The day I fell for you again" },
    { src: "images/5.jpg", cap: "Home is wherever you are" }
  ],
  letter: [
    "I'm sorry. I know I hurt you, and no words can undo that, but you deserve to hear it from me, properly.",
    "I'm sorry for the things I said, and for the things I didn't say. I'm sorry for the moments you felt unheard, and for the times I let my pride speak louder than my love.",
    "You are the best part of my life, and the thought that I made you sad is the one thing I can't stop thinking about.",
    "I'm not asking you to forget it. I'm only asking for a chance to show you, with actions and not just words, that I can do better."
  ],
  promises: [
    "I'll listen before I react",
    "I'll say sorry sooner, not later",
    "I'll never let silence win",
    "I'll make time for us, always",
    "I'll be honest, even when it's hard",
    "I'll love you louder every day"
  ],
  thanks: "Thank you for giving me another chance. I promise to deserve it, every single day. I love you."
};
/* ============================ */

const $ = s => document.querySelector(s), $$ = s => document.querySelectorAll(s), rnd = (a, b) => a + Math.random() * (b - a);
document.title = `I'm sorry, ${CONFIG.name}`;

/* rain + hearts canvas */
const cv = $('#fx'), cx = cv.getContext('2d'); let W, H, dpr, rainOn = true, forgiven = false;
const size = () => { dpr = Math.min(devicePixelRatio || 1, 2); W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr; };
size(); addEventListener('resize', size);
const COLORS = ['#ff4d85', '#ff8fb1', '#ffc9dc', '#ffd9a0', '#fff'];
const drop = init => ({ x: rnd(0, W + H * .2), y: init ? rnd(0, H) : -rnd(20, 300) * dpr, l: rnd(12, 26) * dpr, v: rnd(11, 19) * dpr });
const drops = Array.from({ length: innerWidth < 600 ? 70 : 130 }, () => drop(true));
const P = [];
function burst(x, y, n) {
  for (let i = 0; i < n; i++) { const a = rnd(0, 6.28), v = rnd(2, 7) * dpr; P.push({ x: x * dpr, y: y * dpr, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 2 * dpr, g: .1 * dpr, s: rnd(12, 26) * dpr, c: COLORS[i % 5], a: 1, d: .01, ch: Math.random() < .4 ? '■' : '♥' }); }
}
(function loop() {
  cx.clearRect(0, 0, W, H); cx.globalAlpha = 1; cx.strokeStyle = 'rgba(175,198,255,.38)'; cx.lineWidth = dpr; cx.beginPath();
  for (let i = drops.length - 1; i >= 0; i--) {
    const d = drops[i]; d.y += d.v; d.x -= d.v * .2; cx.moveTo(d.x, d.y); cx.lineTo(d.x - d.l * .2, d.y + d.l);
    if (d.y > H) rainOn ? Object.assign(d, drop()) : drops.splice(i, 1);
  }
  cx.stroke();
  if (forgiven && Math.random() < .12) P.push({ x: rnd(0, W), y: H + 20, vx: rnd(-.3, .3) * dpr, vy: -rnd(1, 2.2) * dpr, g: 0, s: rnd(12, 30) * dpr, c: COLORS[(Math.random() * 4) | 0], a: .8, d: .0025, ch: '♥' });
  for (let i = P.length - 1; i >= 0; i--) {
    const p = P[i]; p.x += p.vx; p.y += p.vy; p.vy += p.g; p.a -= p.d;
    if (p.a <= 0) { P.splice(i, 1); continue; }
    cx.globalAlpha = Math.min(p.a, 1); cx.fillStyle = p.c; cx.font = p.s + 'px serif'; cx.fillText(p.ch, p.x, p.y);
  }
  requestAnimationFrame(loop);
})();
addEventListener('pointerdown', e => { if (forgiven) burst(e.clientX, e.clientY, 10); });

/* steps */
const stages = [...$$('.stage')], dots = []; let cur = 0, seen = 0, t1;
$('#dots').innerHTML = stages.map((_, i) => `<button aria-label="Step ${i + 1}"></button>`).join('');
$$('#dots button').forEach((b, i) => { dots.push(b); b.onclick = () => show(i); });
function show(i) {
  cur = i; seen = Math.max(seen, i);
  stages.forEach((s, k) => s.classList.toggle('on', k === i));
  dots.forEach((b, k) => { b.classList.toggle('on', k === i); b.disabled = k > seen; });
  clearTimeout(t1);
  if (i === 1) { $('#go1').classList.add('hide'); t1 = setTimeout(() => $('#go1').classList.remove('hide'), (CONFIG.letter.length + 2) * 1000 + 800); }
}
$$('[data-next]').forEach(b => b.onclick = () => show(cur + 1));
show(0);

/* music (optional: add music.mp3) */
const audio = $('#music');
$('#start').addEventListener('click', () => audio.play().then(() => $('#mute').hidden = false).catch(() => {}));
$('#mute').onclick = e => { audio.paused ? audio.play() : audio.pause(); e.currentTarget.textContent = audio.paused ? '🔇' : '🔊'; };

/* letter */
$('#apology').innerHTML = `<h3>${CONFIG.name},</h3>` + CONFIG.letter.map((t, i) => `<p style="--i:${i}">${t}</p>`).join('') +
  `<p class="sign" style="--i:${CONFIG.letter.length}">Always yours,<br>${CONFIG.from}</p>`;

/* photo stack */
const PH = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#cfd8ff"/><text x="50" y="66" font-size="46" text-anchor="middle" fill="#8fa3d9">♥</text></svg>');
$('#stack').innerHTML = CONFIG.photos.map((p, i) => `<figure class="ph" style="--s:${i % 2 ? -1 : 1}"><img src="${p.src}" alt="${p.cap}"><figcaption>${p.cap}</figcaption></figure>`).join('');
const phs = [...$$('.ph')]; let top = 0;
const layout = () => phs.forEach((p, i) => p.style.setProperty('--k', (i - top + phs.length) % phs.length));
layout();
phs.forEach(p => {
  const img = p.querySelector('img'); img.onerror = () => { img.onerror = null; img.src = PH; };
  p.onclick = () => {
    if (p.style.getPropertyValue('--k') !== '0') return;
    p.classList.add('fly');
    setTimeout(() => { p.classList.add('snap'); p.classList.remove('fly'); top = (top + 1) % phs.length; layout(); void p.offsetWidth; p.classList.remove('snap'); }, 500);
  };
});

/* promises */
$('#promises').innerHTML = CONFIG.promises.map(p => `<button class="pr"><i></i><span>${p}</span></button>`).join('');
$$('.pr').forEach(b => b.onclick = () => {
  b.classList.add('sealed');
  if (!$$('.pr:not(.sealed)').length) { $('#go3').disabled = false; $('#phint').textContent = 'Every promise is sealed 💖'; burst(innerWidth / 2, innerHeight / 2, 24); }
});

/* the runaway "No" */
const NO = ['No', 'Are you sure?', 'Please? 🥺', 'Think again…', 'Pretty please?', "I'm really sorry", 'Last chance 😢', 'Just say yes 💖'];
let dodges = 0;
function dodge(e) {
  const b = $('#no');
  if (!dodges) { const r = b.getBoundingClientRect(); b.style.position = 'fixed'; b.style.left = r.left + 'px'; b.style.top = r.top + 'px'; void b.offsetWidth; }
  dodges++; b.textContent = NO[Math.min(dodges, NO.length - 1)];
  b.style.left = rnd(10, innerWidth - b.offsetWidth - 10) + 'px'; b.style.top = rnd(70, innerHeight - b.offsetHeight - 10) + 'px';
  b.style.setProperty('--ns', Math.max(.55, 1 - dodges * .06)); $('#yes').style.setProperty('--ys', Math.min(2.2, 1 + dodges * .12));
}
['pointerenter', 'pointerdown', 'focus'].forEach(ev => $('#no').addEventListener(ev, dodge));

/* forgiven */
$('#yes').onclick = () => {
  forgiven = true; rainOn = false; document.body.classList.add('forgiven');
  $('#thanks').textContent = `Thank you, ${CONFIG.name} 💖`;
  $('#thanksmsg').innerHTML = `${CONFIG.thanks}<br><br>— ${CONFIG.from}`;
  show(5);
  [0, 500, 1100, 1800].forEach(t => setTimeout(() => burst(rnd(.2, .8) * innerWidth, rnd(.25, .55) * innerHeight, 40), t));
};
$('#replay').onclick = () => location.reload();
