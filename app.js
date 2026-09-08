document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavbar();
  initMobileMenu();
  initReveal();
  initScenarioSwitcher();
  initTelemetryJitter();
  initContactForm();
});

/* ── Particle Canvas ── */
function initParticles() {
  const canvas = document.getElementById('radarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });

  const count = Math.min(Math.floor(W / 28), 50);
  const pts = Array.from({ length: count }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
    r: Math.random() * 1.4 + 0.6,
    c: Math.random() > 0.35 ? 'rgba(0,240,255,0.45)' : 'rgba(0,255,157,0.35)'
  }));

  (function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,240,255,${0.12 * (1 - d / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
      const p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  })();
}

/* ── Navbar scroll ── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ── Mobile menu ── */
function initMobileMenu() {
  const btn = document.getElementById('mobileToggle');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
}

/* ── Reveal on scroll ── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

/* ── Tactical Scenario Switcher ── */
function initScenarioSwitcher() {
  const scenarios = [
    {
      query: 'India-China Border Tensions &amp; LAC Patrol Signals 2024',
      nodes: ['Sector 4 Patrol', 'Disengagement Pact', 'Satellite Feed #892'],
      confidence: '98.4%',
      source: 'Archive #104',
      summary: 'Correlated 14 patrol logs with automated OCR verification. Satellite infrared confirms structural pullback along Sector 4 matching bilateral disengagement parameters.',
      latency: '0.94s'
    },
    {
      query: 'Indian Ocean Maritime OSINT Dark Vessel Tracking',
      nodes: ['AIS Dark Vessel #44', 'Naval Radar Track 09', 'Port Radar Vizag'],
      confidence: '96.8%',
      source: 'Naval OSINT DB #22',
      summary: 'Spoofed AIS transponder detected 84nm off coastal corridor. Cross-referenced SAR imaging confirms unflagged vessel rendezvous at classified coordinates.',
      latency: '1.08s'
    },
    {
      query: 'CERT-In Critical Power Grid Cyber Attack Vector Analysis',
      nodes: ['C2 Server 185.x', 'SCADA Telemetry', 'Malware Signature Q3'],
      confidence: '99.2%',
      source: 'CERT-In Archive #81',
      summary: 'Coordinated spear-phishing payload targeting sub-station PLC firmware identified. Endpoints quarantined. Zero telemetry egress. Integrity hashes verified.',
      latency: '0.78s'
    }
  ];

  const btns = document.querySelectorAll('.scenario-btn');
  const queryEl = document.getElementById('activeQueryText');
  const statusEl = document.getElementById('queryStatus');
  const confEl = document.getElementById('confidenceBadge');
  const srcEl = document.getElementById('sourceDocText');
  const summaryEl = document.getElementById('intelSummaryText');
  const node1 = document.getElementById('node1');
  const node2 = document.getElementById('node2');
  const node3 = document.getElementById('node3');

  let typeTimer;
  function loadScenario(idx) {
    const s = scenarios[idx];
    btns.forEach(b => b.classList.remove('active'));
    btns[idx].classList.add('active');

    if (statusEl) { statusEl.textContent = 'SYNTHESIZING...'; statusEl.style.color = '#00f0ff'; }

    // typewriter
    clearTimeout(typeTimer);
    if (queryEl) {
      queryEl.innerHTML = '';
      const raw = s.query.replace(/&amp;/g, '&');
      let i = 0;
      const type = () => {
        if (i < raw.length) { queryEl.textContent += raw[i++]; typeTimer = setTimeout(type, 22); }
        else if (statusEl) { statusEl.textContent = 'INFERENCE ENGINE: ACTIVE'; statusEl.style.color = '#00ff9d'; }
      };
      type();
    }

    if (node1) node1.textContent = s.nodes[0];
    if (node2) node2.textContent = s.nodes[1];
    if (node3) node3.textContent = s.nodes[2];
    if (confEl) confEl.textContent = `CONFIDENCE: ${s.confidence}`;
    if (srcEl) srcEl.textContent = s.source;
    if (summaryEl) summaryEl.textContent = s.summary;
  }

  btns.forEach(btn => btn.addEventListener('click', () => loadScenario(+btn.dataset.idx)));
}

/* ── Live telemetry jitter ── */
function initTelemetryJitter() {
  const el = document.getElementById('throughputText');
  if (!el) return;
  setInterval(() => {
    const v = (42.8 + (Math.random() * 2.8 - 1.4)).toFixed(1);
    el.textContent = `${v} tok/sec`;
  }, 2500);
}

/* ── Contact form ── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('formToast');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }
    setTimeout(() => {
      form.reset();
      if (toast) toast.classList.add('show');
      if (btn) { btn.textContent = '✓ Message Sent'; }
    }, 900);
  });
}
