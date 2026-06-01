/* ═══════════════════════════════════════════
   LUXURY PORTFOLIO JS — Seif Abas
   Full animation engine
═══════════════════════════════════════════ */

/* ── LOADER ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('done');
  }, 1350);
});

/* ── CUSTOM CURSOR ── */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function animateCursor() {
  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  dot.style.left  = mx + 'px';
  dot.style.top   = my + 'px';
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

/* ── NAV SCROLL ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
  highlightNavLink();
}, { passive: true });

/* ── MOBILE MENU ── */
const burger     = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ── NAV ACTIVE HIGHLIGHT ── */
function highlightNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.id;
  });
  links.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

/* ── HERO CANVAS PARTICLES ── */
(function () {
  const canvas = document.getElementById('heroCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  const GOLD = [105, 73, 8];
  const N    = 90;

  class Particle {
    reset() {
      this.x   = Math.random() * W;
      this.y   = Math.random() * H;
      this.r   = Math.random() * 1.8 + 0.3;
      this.vx  = (Math.random() - 0.5) * 0.35;
      this.vy  = (Math.random() - 0.5) * 0.35;
      this.a   = Math.random() * 0.55 + 0.3;
      this.da  = (Math.random() - 0.5) * 0.005;
    }
    constructor() { this.reset(); }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.a += this.da;
      if (this.a < 0.2 || this.a > 0.9) this.da *= -1;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${GOLD},${this.a})`;
      ctx.fill();
    }
  }

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function drawConnections() {
    const D = 145;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < D) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${GOLD},${0.48 * (1 - d / D)})`;
          ctx.lineWidth   = 0.7;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  resize();
  particles = Array.from({ length: N }, () => new Particle());
  window.addEventListener('resize', resize);
  loop();
})();

/* ── TYPEWRITER ── */
(function () {
  const words  = ['unforgettable experiences.', 'entertainment programs.', 'digital platforms.', 'happy guests.', 'memories that last.'];
  const el     = document.getElementById('typeText');
  let wi = 0, ci = 0, deleting = false, wait = 0;

  function type() {
    const word = words[wi];
    if (wait > 0) { wait--; setTimeout(type, 60); return; }
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { wait = 36; deleting = true; }
      setTimeout(type, 95);
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
      setTimeout(type, 48);
    }
  }
  setTimeout(type, 2000);
})();

/* ── AOS (scroll reveal) ── */
(function () {
  const items = document.querySelectorAll('[data-aos]');
  const delays = { '100': 100, '150': 150, '200': 200, '300': 300, '400': 400, '500': 500, '700': 700, '900': 900, '1100': 1100 };

  items.forEach(el => {
    const d = el.dataset.aosDelay;
    if (d) el.style.transitionDelay = (delays[d] || parseInt(d)) + 'ms';
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('aos-animate');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  items.forEach(el => obs.observe(el));
})();

/* ── SKILL BARS ── */
(function () {
  const bars = document.querySelectorAll('.skill-bar-item');
  const obs  = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const pct  = e.target.dataset.percent;
        const fill = e.target.querySelector('.skill-fill');
        setTimeout(() => { fill.style.width = pct + '%'; }, 200);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(b => obs.observe(b));
})();

/* ── COUNTER ANIMATION ── */
(function () {
  const nums = document.querySelectorAll('.stat-num');
  const obs  = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const target = +e.target.dataset.target;
      let cur = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        cur = Math.min(cur + step, target);
        e.target.textContent = cur;
        if (cur >= target) clearInterval(timer);
      }, 40);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.5 });
  nums.forEach(n => obs.observe(n));
})();

/* ── MAGNETIC BUTTONS ── */
document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r  = el.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    const dx = (e.clientX - cx) * 0.25;
    const dy = (e.clientY - cy) * 0.25;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
    el.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)';
    setTimeout(() => el.style.transition = '', 500);
  });
});

/* ── PARALLAX HERO SHAPES ── */
(function () {
  const shapes = document.querySelectorAll('.shape');
  window.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    shapes.forEach((s, i) => {
      const factor = (i + 1) * 12;
      s.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  }, { passive: true });
})();

/* ── CARD 3D TILT ── */
document.querySelectorAll('.project-card:not(.project-empty), .contact-card, .skill-tech-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    const dx = (e.clientX - cx) / (r.width  / 2);
    const dy = (e.clientY - cy) / (r.height / 2);
    card.style.transform = `perspective(800px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
    setTimeout(() => card.style.transition = '', 500);
  });
});

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── GOLD TRAIL on hero ── */
(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  hero.addEventListener('mousemove', e => {
    const spark = document.createElement('div');
    spark.style.cssText = `
      position:fixed; left:${e.clientX}px; top:${e.clientY}px;
      width:6px; height:6px; border-radius:50%;
      background:rgba(160,120,28,0.6);
      pointer-events:none; z-index:9998;
      transform:translate(-50%,-50%);
      transition:all 0.8s ease;
    `;
    document.body.appendChild(spark);
    requestAnimationFrame(() => {
      spark.style.transform = `translate(-50%,-50%) scale(0)`;
      spark.style.opacity   = '0';
    });
    setTimeout(() => spark.remove(), 800);
  });
})();
