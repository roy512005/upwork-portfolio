/* ============================================================
   ANUPAM ROY PORTFOLIO — MAIN.JS
   ============================================================ */

'use strict';

/* ── NAV: SCROLL BEHAVIOUR ────────────────────────────────── */
const nav = document.getElementById('nav');
const scrollThreshold = 60;

function handleNavScroll() {
  if (window.scrollY > scrollThreshold) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll(); // run on load

/* ── MOBILE NAV ───────────────────────────────────────────── */
const hamburger = document.getElementById('nav-hamburger');
const mobileNav = document.getElementById('nav-mobile');

function toggleMobileNav() {
  const isOpen = hamburger.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(isOpen));

  if (isOpen) {
    mobileNav.classList.add('open');
    mobileNav.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  } else {
    closeMobileNav();
  }
}

function closeMobileNav() {
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileNav.classList.remove('open');
  document.body.style.overflow = '';
  // Hide after transition
  setTimeout(() => {
    if (!mobileNav.classList.contains('open')) {
      mobileNav.style.display = '';
    }
  }, 400);
}

if (hamburger) hamburger.addEventListener('click', toggleMobileNav);

// Close mobile nav on link click
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', closeMobileNav);
});

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
    closeMobileNav();
  }
});

/* ── SMOOTH SCROLL ────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── SCROLL REVEAL ────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── CONTACT FORM ─────────────────────────────────────────── */
const form = document.getElementById('contact-form');
const successMsg = document.getElementById('form-success');
const submitBtn = document.getElementById('contact-submit-btn');

if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    const data = new FormData(form);
    const payload = {
      name: data.get('name'),
      email: data.get('email'),
      project_type: data.get('project_type'),
      budget: data.get('budget'),
      message: data.get('message'),
    };

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        form.style.display = 'none';
        if (successMsg) successMsg.style.display = 'block';
      } else {
        // Fallback: open mailto
        fallbackMailto(payload);
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    } catch {
      // Network error: open mailto
      fallbackMailto(payload);
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

function fallbackMailto(payload) {
  const subject = encodeURIComponent(`[Portfolio] Project Inquiry — ${payload.project_type || 'New Project'}`);
  const body = encodeURIComponent(
    `Name: ${payload.name}\nEmail: ${payload.email}\nProject Type: ${payload.project_type}\nBudget: ${payload.budget}\n\nMessage:\n${payload.message}`
  );
  window.location.href = `mailto:hello@anupamroy.dev?subject=${subject}&body=${body}`;
}

/* ── TECH PILL HOVER RIPPLE ───────────────────────────────── */
document.querySelectorAll('.tech-pill').forEach(pill => {
  pill.addEventListener('mouseenter', function () {
    this.style.transform = 'scale(1.05)';
  });
  pill.addEventListener('mouseleave', function () {
    this.style.transform = '';
  });
});

/* ── ACTIVE NAV HIGHLIGHT ─────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(section => sectionObserver.observe(section));

// Add active style
const styleEl = document.createElement('style');
styleEl.textContent = '.nav-links a.active { color: var(--text-primary) !important; }';
document.head.appendChild(styleEl);

/* ── MORE PROJECTS TOGGLE ─────────────────────────────────── */
function toggleMoreProjects() {
  const grid = document.getElementById('more-projects-grid');
  const label = document.getElementById('more-btn-label');
  const isHidden = grid.style.display === 'none';

  if (isHidden) {
    grid.style.display = 'grid';
    label.textContent = '− Show Less';
    // Animate cards in
    grid.querySelectorAll('.project-card').forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(24px)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 80);
    });
  } else {
    grid.style.display = 'none';
    label.textContent = '+ Show More Projects (5)';
  }
}

/* ── PAGE LOAD ANIMATION ──────────────────────────────────── */
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  // Trigger first reveal elements immediately
  document.querySelectorAll('.hero .reveal').forEach(el => {
    el.classList.add('visible');
  });
});
