/**
 * NUV KHELAIYA — GSAP & SCROLLTRIGGER CHOREOGRAPHY
 * Cultural Committee of Navrachana University
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger CDN not loaded. Fallback enabled.');
    initFallbackAnimations();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  initHeroChoreography();
  initStorySequence();
  initHorizontalScroll();
  initGlowingTimeline();
  initSponsorSpotlights();
  initMemoriesVortex();
});

/**
 * 1. HERO 7-STAGE SCROLL CHOREOGRAPHY
 */
function initHeroChoreography() {
  const heroStage = document.querySelector('.hero-stage-container');
  const heroKhelaiya = document.querySelector('.hero-khelaiya');
  const heroBg = document.querySelector('.hero-bg-media img');
  const heroLighting = document.querySelector('.hero-lighting-overlay');
  const heroDetails = document.querySelector('.hero-details-container');
  const heroEyebrow = document.querySelector('.hero-eyebrow-container');
  const heroNuv = document.querySelector('.hero-nuv');
  const khelaiyaLetters = document.querySelectorAll('.hero-khelaiya span');

  if (!heroStage || !heroKhelaiya) return;

  // Master Hero Timeline pinned for intense scroll drama
  const heroTL = gsap.timeline({
    scrollTrigger: {
      trigger: heroStage,
      start: 'top top',
      end: '+=250%',
      pin: true,
      scrub: 1,
      anticipatePin: 1
    }
  });

  // Stage 1 & 2: Scale title and stretch "KHELAIYA" horizontally
  heroTL.to(heroKhelaiya, {
    scale: 1.15,
    letterSpacing: '0.08em',
    duration: 1.5,
    ease: 'power2.inOut'
  }, 0);

  // Stage 3: Individual letters subtly move apart in 3D
  if (khelaiyaLetters.length > 0) {
    khelaiyaLetters.forEach((letter, idx) => {
      const offset = (idx - (khelaiyaLetters.length - 1) / 2) * 15;
      heroTL.to(letter, {
        x: offset,
        y: (idx % 2 === 0 ? -10 : 10),
        duration: 1.5,
        ease: 'power2.out'
      }, 0.5);
    });
  }

  // Stage 4: Background image slow zoom & intensity
  if (heroBg) {
    heroTL.to(heroBg, {
      scale: 1.35,
      filter: 'brightness(0.65) contrast(1.25) saturate(1.3)',
      duration: 2,
      ease: 'power1.inOut'
    }, 0.2);
  }

  // Stage 5: Festival lighting beams begin appearing
  if (heroLighting) {
    heroTL.to(heroLighting, {
      opacity: 0.85,
      scale: 1.2,
      duration: 1.5,
      ease: 'power2.out'
    }, 1);
  }

  // Stage 6: The title shifts upward into horizon
  heroTL.to([heroEyebrow, heroNuv, heroKhelaiya], {
    y: -70,
    scale: 0.88,
    duration: 1.8,
    ease: 'power2.inOut'
  }, 1.5);

  // Stage 7: Event information slides into view (12-14 Sept, NUV Campus, CTA)
  if (heroDetails) {
    heroTL.to(heroDetails, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.out'
    }, 2);
  }
}

/**
 * 2. STORY SECTION — SPLIT & TRANSFORM TRANSITIONS
 */
function initStorySequence() {
  const storySection = document.querySelector('.story-section');
  const storyWords = document.querySelectorAll('.story-word-item');
  if (!storySection || storyWords.length === 0) return;

  storyWords.forEach((word, index) => {
    // Alternate different transition effects for each word
    const effectIndex = index % 5;
    let fromVars = { opacity: 0, y: 60 };

    if (effectIndex === 0) {
      fromVars = { opacity: 0, scale: 0.7, filter: 'blur(12px)' };
    } else if (effectIndex === 1) {
      fromVars = { opacity: 0, x: -80, letterSpacing: '0.3em' };
    } else if (effectIndex === 2) {
      fromVars = { opacity: 0, y: 80, rotateX: 60 };
    } else if (effectIndex === 3) {
      fromVars = { opacity: 0, x: 80, filter: 'brightness(2)' };
    } else if (effectIndex === 4) {
      fromVars = { opacity: 0, scale: 1.4, filter: 'blur(8px)' };
    }

    gsap.from(word, {
      ...fromVars,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: word,
        start: 'top 82%',
        toggleActions: 'play none none reverse'
      }
    });
  });
}

/**
 * 3. HORIZONTAL CULTURAL EXPERIENCE (PINNED SCROLL)
 */
function initHorizontalScroll() {
  const container = document.querySelector('.horizontal-scroll-container');
  const track = document.querySelector('.horizontal-track');
  const panels = document.querySelectorAll('.horizontal-panel');

  if (!container || !track || window.innerWidth <= 768) return;

  const totalScroll = track.scrollWidth - window.innerWidth;

  gsap.to(track, {
    x: () => -totalScroll,
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      pin: true,
      scrub: 1,
      start: 'top top',
      end: () => `+=${totalScroll * 1.2}`,
      invalidateOnRefresh: true
    }
  });

  // Parallax on panel background images during horizontal slide
  panels.forEach((panel) => {
    const bg = panel.querySelector('.panel-bg-image');
    if (bg) {
      gsap.fromTo(bg, {
        scale: 1.15,
        x: '-6%'
      }, {
        scale: 1.05,
        x: '6%',
        ease: 'none',
        scrollTrigger: {
          trigger: panel,
          containerAnimation: gsap.getTweensOf(track)[0],
          start: 'left right',
          end: 'right left',
          scrub: true
        }
      });
    }
  });
}

/**
 * 4. EVENT TIMELINE — ILLUMINATING LASER & PREVIEWS
 */
function initGlowingTimeline() {
  const timelineSection = document.querySelector('.timeline-section');
  const laser = document.querySelector('.timeline-progress-laser');
  const dayCards = document.querySelectorAll('.timeline-day-card');
  const floatingPreview = document.querySelector('.timeline-floating-preview');
  const previewImg = floatingPreview ? floatingPreview.querySelector('img') : null;

  if (!timelineSection) return;

  // Laser illumination linked to vertical scroll depth
  if (laser) {
    ScrollTrigger.create({
      trigger: '.timeline-interactive-wrapper',
      start: 'top 65%',
      end: 'bottom 65%',
      scrub: true,
      onUpdate: (self) => {
        laser.style.height = `${self.progress * 100}%`;
      }
    });
  }

  // Animate cards into place
  dayCards.forEach((card, idx) => {
    const isEven = idx % 2 === 1;
    gsap.from(card, {
      opacity: 0,
      x: isEven ? 60 : -60,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });

    // Floating Image Preview on Hover
    if (floatingPreview && previewImg) {
      const previewSrc = card.getAttribute('data-preview-img');
      card.addEventListener('mouseenter', () => {
        if (previewSrc) previewImg.src = previewSrc;
        floatingPreview.classList.add('active');
      });

      card.addEventListener('mousemove', (e) => {
        floatingPreview.style.left = `${e.clientX + 30}px`;
        floatingPreview.style.top = `${e.clientY - 20}px`;
      });

      card.addEventListener('mouseleave', () => {
        floatingPreview.classList.remove('active');
      });
    }
  });
}

/**
 * 5. TIERED SPONSORS SPOTLIGHT EFFECT
 */
function initSponsorSpotlights() {
  const sponsorBoxes = document.querySelectorAll('.sponsor-logo-box, .title-partner-card');
  sponsorBoxes.forEach((box) => {
    box.addEventListener('mousemove', (e) => {
      const rect = box.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      box.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(223, 203, 159, 0.18) 0%, rgba(18, 22, 27, 0.8) 70%)`;
    });

    box.addEventListener('mouseleave', () => {
      box.style.background = '';
    });
  });
}

/**
 * 6. SIGNATURE "MEMORIES" VORTEX COLLAPSE
 */
function initMemoriesVortex() {
  const section = document.querySelector('.memories-vortex-section');
  const shards = document.querySelectorAll('.memory-shard-item');
  const text1 = document.querySelector('.memories-text-1');
  const text2 = document.querySelector('.memories-text-2');
  const seal = document.querySelector('.vortex-climax-seal');

  if (!section || shards.length === 0) return;

  const vortexTL = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=150%',
      pin: '.memories-pin-viewport',
      scrub: 1
    }
  });

  // Step 1: Fade in text "THE NIGHT ENDS." -> "THE MEMORIES DON'T."
  vortexTL.fromTo(text1, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 });
  vortexTL.fromTo(text2, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.8 }, '+=0.2');

  // Step 2: Floating photographs scatter across viewport
  shards.forEach((shard, i) => {
    const angle = (i / shards.length) * Math.PI * 2;
    const radius = 240 + (i % 3) * 80;
    const targetX = Math.cos(angle) * radius;
    const targetY = Math.sin(angle) * (radius * 0.65);
    const rot = (i % 2 === 0 ? 1 : -1) * (15 + i * 5);

    vortexTL.fromTo(shard, {
      opacity: 0,
      scale: 0.3,
      x: targetX * 1.5,
      y: targetY * 1.5,
      rotation: rot * 2
    }, {
      opacity: 0.9,
      scale: 1,
      x: targetX,
      y: targetY,
      rotation: rot,
      duration: 1.2,
      ease: 'power1.out'
    }, 0.8 + (i * 0.04));
  });

  // Step 3: ALL IMAGES COLLAPSE TOWARD THE CENTER VORTEX
  shards.forEach((shard) => {
    vortexTL.to(shard, {
      x: 0,
      y: 0,
      scale: 0.05,
      opacity: 0,
      rotation: 720,
      duration: 1.5,
      ease: 'power3.in'
    }, 2.5);
  });

  vortexTL.to([text1, text2], {
    opacity: 0,
    scale: 0.8,
    duration: 1,
    ease: 'power2.in'
  }, 2.5);

  // Step 4: Grand Golden Seal Reveal: NUV KHELAIYA
  if (seal) {
    vortexTL.to(seal, {
      scale: 1,
      opacity: 1,
      duration: 1.5,
      ease: 'back.out(1.7)'
    }, 3.2);
  }
}

/**
 * FALLBACK ANIMATION ENGINE IF GSAP IS OFFLINE
 */
function initFallbackAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.manifesto-card, .timeline-day-card, .team-card-editorial, .gallery-item').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}
