/* ==========================================================================
   ENERSIT LABS — SOVEREIGN DEFENSE AI
   Interactive Tactical Console & Dynamic Animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initRadarCanvas();
  initMobileMenu();
  initTacticalScenarioSwitcher();
  initTelemetryJitter();
  initContactForm();
});

/* --------------------------------------------------------------------------
   1. Tactical Radar & Particle Canvas
   -------------------------------------------------------------------------- */
function initRadarCanvas() {
  const canvas = document.getElementById('radarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(width > 768 ? 45 : 20, 50);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 0.8,
      color: Math.random() > 0.3 ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 255, 157, 0.4)'
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Update & draw particles
    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }

    requestAnimationFrame(render);
  }

  render();
}

/* --------------------------------------------------------------------------
   2. Mobile Menu Toggle
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });

  const links = menu.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
    });
  });
}

/* --------------------------------------------------------------------------
   3. Interactive Tactical Scenario Switcher (Tactical Console Demo)
   -------------------------------------------------------------------------- */
function initTacticalScenarioSwitcher() {
  const scenarioButtons = document.querySelectorAll('.scenario-btn');
  const activeQueryText = document.getElementById('activeQueryText');
  const queryStatus = document.getElementById('queryStatus');
  const confidenceBadge = document.getElementById('confidenceBadge');
  const sourceDocText = document.getElementById('sourceDocText');
  const intelSummaryText = document.getElementById('intelSummaryText');
  const node1 = document.getElementById('node1');
  const node2 = document.getElementById('node2');
  const node3 = document.getElementById('node3');

  const scenarioData = {
    0: {
      query: "India-China Border Tensions & LAC Patrol Signals 2024",
      nodes: ["Sector 4 Patrol", "Disengagement Pact", "Satellite Feed #892"],
      source: "Army Intelligence Archive #104",
      confidence: "98.4%",
      vram: "3.6 GB / 4.0 GB (90%)",
      summary: "Correlated 14 patrol logs with automated OCR claim verification. Satellite infrared telemetry confirms structural pullback along Sector 4 perimeter matching bilateral disengagement parameters."
    },
    1: {
      query: "Indian Ocean Maritime OSINT Vessel Dark Tracking",
      nodes: ["AIS Dark Vessel #44", "Naval Radar Track 09", "Port Radar Vizag"],
      source: "Naval OSINT Database #22",
      confidence: "96.8%",
      vram: "3.4 GB / 4.0 GB (85%)",
      summary: "Detected spoofed AIS transponder signal 84 nautical miles off coastal corridor. Cross-referenced with commercial satellite SAR imaging confirming unflagged vessel rendezvous."
    },
    2: {
      query: "CERT-In Critical National Power Grid Cyber Attack Vector",
      nodes: ["C2 Server 185.x", "SCADA Telemetry", "Malware Signature Q3"],
      source: "CERT-In Security Archive #81",
      confidence: "99.2%",
      vram: "3.8 GB / 4.0 GB (95%)",
      summary: "Identified coordinated spear-phishing payload targeting sub-station control PLC firmware. Quarantined infected endpoints with zero egress telemetry and verified integrity hashes."
    }
  };

  let typingTimeout;

  scenarioButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      scenarioButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const data = scenarioData[index];
      if (!data) return;

      if (queryStatus) {
        queryStatus.innerText = "SYNTHESIZING VECTORS...";
        queryStatus.className = "text-cyan font-mono text-[10px]";
      }

      // Typewriter effect for query
      if (activeQueryText) {
        clearTimeout(typingTimeout);
        activeQueryText.innerText = "";
        let charIndex = 0;
        const text = data.query;

        function typeChar() {
          if (charIndex < text.length) {
            activeQueryText.innerText += text.charAt(charIndex);
            charIndex++;
            typingTimeout = setTimeout(typeChar, 25);
          } else {
            if (queryStatus) {
              queryStatus.innerText = "INFERENCE ENGINE: ACTIVE";
              queryStatus.className = "text-emerald font-mono text-[10px]";
            }
          }
        }
        typeChar();
      }

      // Update Node labels
      if (node1 && data.nodes[0]) node1.innerText = data.nodes[0];
      if (node2 && data.nodes[1]) node2.innerText = data.nodes[1];
      if (node3 && data.nodes[2]) node3.innerText = data.nodes[2];

      if (confidenceBadge) confidenceBadge.innerText = `CONFIDENCE: ${data.confidence}`;
      if (sourceDocText) sourceDocText.innerText = data.source;
      if (intelSummaryText) intelSummaryText.innerText = data.summary;

      const vramText = document.getElementById('vramText');
      if (vramText) vramText.innerText = data.vram;
    });
  });
}

/* --------------------------------------------------------------------------
   4. Live Telemetry Jitter (Hardware Activity Simulation)
   -------------------------------------------------------------------------- */
function initTelemetryJitter() {
  const throughputText = document.getElementById('throughputText');
  if (!throughputText) return;

  setInterval(() => {
    // fluctuate throughput slightly between 41.2 and 44.5 tok/sec
    const base = 42.8;
    const variation = (Math.random() * 3 - 1.5).toFixed(1);
    const val = (parseFloat(base) + parseFloat(variation)).toFixed(1);
    throughputText.innerText = `${val} tok/sec`;
  }, 2200);
}

/* --------------------------------------------------------------------------
   5. Contact Form Submission
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('formSuccessToast');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.innerHTML = '<span>Transmitting...</span>';
      btn.disabled = true;
    }

    setTimeout(() => {
      form.reset();
      if (toast) {
        toast.classList.remove('hidden');
      }
      if (btn) {
        btn.innerHTML = '<span>Request Transmitted &check;</span>';
        btn.classList.add('bg-emerald', 'text-black');
      }
    }, 900);
  });
}
