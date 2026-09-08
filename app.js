document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavbar();
  initMobileMenu();
  initReveal();
  initConsole();
  initTelemetry();
  initForm();
});

/* ── Particle Canvas ── */
function initParticles() {
  const canvas = document.getElementById('radarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const count = Math.min(Math.floor(window.innerWidth / 30), 48);
  const pts = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 1.5 + 0.5,
    c: Math.random() > 0.4 ? '#00e5ff' : '#00f5a0'
  }));

  (function tick() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d = Math.hypot(dx, dy);
        if (d < 130) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,229,255,${0.1 * (1 - d / 130)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
      const p = pts[i];
      p.x = (p.x + p.vx + W) % W;
      p.y = (p.y + p.vy + H) % H;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c + '66';
      ctx.fill();
    }
    requestAnimationFrame(tick);
  })();
}

/* ── Navbar scroll state ── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ── Mobile menu ── */
function initMobileMenu() {
  const btn = document.getElementById('mobileToggle');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
}

/* ── Scroll reveal with staggered delay ── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in'), i * 90);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
}

/* ── Tactical Console Scenario Switcher ── */
function initConsole() {
  const scenarios = [
    {
      query: 'India-China Border Tensions & LAC Patrol Signals 2024',
      nodes: ['Sector 4 Patrol', 'Disengagement Pact', 'Satellite Feed #892'],
      confidence: '98.4%',
      source: 'Army Archive #104',
      latency: '0.94s',
      summary: 'Correlated 14 patrol logs with automated OCR claim verification. Satellite infrared telemetry confirms structural pullback along Sector 4 matching bilateral disengagement parameters.'
    },
    {
      query: 'Indian Ocean Maritime OSINT Dark Vessel Tracking',
      nodes: ['AIS Dark Vessel #44', 'Naval Radar Track 09', 'Port Radar Vizag'],
      confidence: '96.8%',
      source: 'Naval OSINT DB #22',
      latency: '1.08s',
      summary: 'Spoofed AIS transponder detected 84nm off coastal corridor. Cross-referenced SAR satellite imaging confirms unflagged vessel rendezvous at restricted coordinates.'
    },
    {
      query: 'CERT-In Critical Power Grid Cyber Attack Vector',
      nodes: ['C2 Server 185.x', 'SCADA Telemetry', 'Malware Signature Q3'],
      confidence: '99.2%',
      source: 'CERT-In Archive #81',
      latency: '0.78s',
      summary: 'Coordinated spear-phishing payload targeting sub-station PLC firmware identified. Affected endpoints quarantined. Zero telemetry egress. Integrity hashes verified.'
    }
  ];

  const btns = document.querySelectorAll('.sc-btn');
  const qEl   = document.getElementById('activeQueryText');
  const stEl  = document.getElementById('queryStatus');
  const cfEl  = document.getElementById('confidenceBadge');
  const srcEl = document.getElementById('sourceDocText');
  const latEl = document.getElementById('latencyText');
  const sumEl = document.getElementById('intelSummaryText');
  const n1    = document.getElementById('node1');
  const n2    = document.getElementById('node2');
  const n3    = document.getElementById('node3');

  let timer;

  function activate(idx) {
    const s = scenarios[idx];
    btns.forEach(b => b.classList.remove('active'));
    btns[idx].classList.add('active');

    if (stEl) { stEl.textContent = 'SYNTHESIZING...'; stEl.className = 'st syn'; }

    // Typewriter
    clearTimeout(timer);
    if (qEl) {
      qEl.textContent = '';
      let i = 0;
      function type() {
        if (i < s.query.length) {
          qEl.textContent += s.query[i++];
          timer = setTimeout(type, 24);
        } else if (stEl) {
          stEl.textContent = 'INFERENCE ENGINE: ACTIVE';
          stEl.className = 'st rdy';
        }
      }
      type();
    }

    if (n1) n1.textContent = s.nodes[0];
    if (n2) n2.textContent = s.nodes[1];
    if (n3) n3.textContent = s.nodes[2];
    if (cfEl)  cfEl.textContent  = `CONFIDENCE: ${s.confidence}`;
    if (srcEl) srcEl.textContent = s.source;
    if (latEl) latEl.textContent = s.latency;
    if (sumEl) sumEl.textContent = s.summary;
  }

  btns.forEach(btn => btn.addEventListener('click', () => activate(+btn.dataset.idx)));
}

/* ── Throughput live jitter ── */
function initTelemetry() {
  const el = document.getElementById('throughputText');
  if (!el) return;
  setInterval(() => {
    el.textContent = (42.8 + (Math.random() * 3 - 1.5)).toFixed(1) + ' tok/sec';
  }, 2400);
}

/* ── Contact form ── */
function initForm() {
  const form  = document.getElementById('contactForm');
  const toast = document.getElementById('formToast');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.f-submit');
    if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }
    setTimeout(() => {
      form.reset();
      if (toast) toast.classList.add('show');
      if (btn)  { btn.textContent = '✓ Sent'; }
    }, 900);
  });
}
