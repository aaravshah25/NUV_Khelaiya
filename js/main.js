/**
 * NUV KHELAIYA — CORE SCRIPTS & INTERACTIONS
 * Cultural Committee of Navrachana University
 */

document.addEventListener('DOMContentLoaded', () => {
  initLenisSmoothScroll();
  initCustomCursor();
  initFloatingNavbar();
  initMobileMenu();
  initScrollProgress();
  initHolographicPass();
});

/**
 * 1. LENIS SMOOTH SCROLL INITIALIZATION
 */
let lenisInstance = null;

function initLenisSmoothScroll() {
  if (typeof Lenis !== 'undefined') {
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync with GSAP ScrollTrigger if available
    if (typeof ScrollTrigger !== 'undefined') {
      lenisInstance.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }
}

/**
 * 2. LUXURY CUSTOM CURSOR ENGINE
 */
function initCustomCursor() {
  // Disable on touch devices
  if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 768) {
    return;
  }

  const cursorFollower = document.querySelector('.cursor-follower');
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorText = document.querySelector('.cursor-text');

  if (!cursorFollower || !cursorDot) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;

    cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    requestAnimationFrame(renderFollower);
  }
  requestAnimationFrame(renderFollower);

  // Magnetic & Contextual Cursor States
  const interactiveLinks = document.querySelectorAll('a, button, .interactive-cursor');
  interactiveLinks.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });

  const viewElements = document.querySelectorAll('[data-cursor="view"], .gallery-item');
  viewElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-view');
      if (cursorText) cursorText.textContent = 'VIEW';
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-view');
      if (cursorText) cursorText.textContent = '';
    });
  });

  const exploreElements = document.querySelectorAll('[data-cursor="explore"], .horizontal-panel');
  exploreElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-explore');
      if (cursorText) cursorText.textContent = 'EXPLORE';
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-explore');
      if (cursorText) cursorText.textContent = '';
    });
  });
}

/**
 * 3. INTELLIGENT FLOATING NAVBAR
 */
function initFloatingNavbar() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let lastScrollY = window.scrollY;
  const scrollThreshold = 100;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Background blur pill activation
    if (currentScrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Intelligent Hide/Show on scroll direction
    if (currentScrollY > scrollThreshold && currentScrollY > lastScrollY) {
      // Scrolling down -> hide navbar
      header.classList.add('nav-hidden');
    } else {
      // Scrolling up -> show navbar
      header.classList.remove('nav-hidden');
    }

    lastScrollY = currentScrollY;
  }, { passive: true });
}

/**
 * 4. MOBILE NAVIGATION DRAWER
 */
function initMobileMenu() {
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

  if (!hamburger || !mobileOverlay) return;

  function toggleMenu() {
    hamburger.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  }

  hamburger.addEventListener('click', toggleMenu);

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (mobileOverlay.classList.contains('active')) {
        toggleMenu();
      }
    });
  });
}

/**
 * 5. SCROLL PROGRESS INDICATOR
 */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }, { passive: true });
}

/**
 * 6. 3D HOLOGRAPHIC PASS MOUSE TILT & REFLECTION
 */
function initHolographicPass() {
  const passCard = document.querySelector('.pass-card-3d');
  const stage = document.querySelector('.pass-card-3d-stage');

  if (!passCard || !stage) return;

  stage.addEventListener('mousemove', (e) => {
    const rect = passCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -14;
    const rotateY = ((x - centerX) / centerX) * 14;

    passCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

    // Holographic sheen position
    const sheenX = (x / rect.width) * 100;
    const sheenY = (y / rect.height) * 100;
    passCard.style.setProperty('--sheen-pos', `${sheenX}% ${sheenY}%`);
  });

  stage.addEventListener('mouseleave', () => {
    passCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/**
 * PROCEDURAL WEB AUDIO API SYNTHESIZER
 */
const SoundFX = {
  ctx: null,
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  },
  playClick() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch(e) {}
  }
};
