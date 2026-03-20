/* ============================================================
   POWDER JUNGLE — script.js
   ============================================================ */

// -----------------------------------------------
// Nav: scroll state
// -----------------------------------------------
const nav = document.getElementById('nav');

function updateNav() {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav(); // run on load


// -----------------------------------------------
// Nav: mobile menu
// -----------------------------------------------
const burger = document.getElementById('navBurger');
const mobileNav = document.getElementById('navMobile');
const closeBtn = document.getElementById('navClose');
const mobileLinks = document.querySelectorAll('.mobile-link');

function openMenu() {
  mobileNav.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  mobileNav.classList.remove('open');
  document.body.style.overflow = '';
}

if (burger) burger.addEventListener('click', openMenu);
if (closeBtn) closeBtn.addEventListener('click', closeMenu);

mobileLinks.forEach(link => {
  link.addEventListener('click', closeMenu);
});


// -----------------------------------------------
// Scroll reveal
// -----------------------------------------------
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  }
);

revealEls.forEach(el => revealObserver.observe(el));


// -----------------------------------------------
// FAQ accordion
// -----------------------------------------------
const faqItems = document.querySelectorAll('.faq__item');

faqItems.forEach(item => {
  const btn = item.querySelector('.faq__question');
  const answer = item.querySelector('.faq__answer');

  if (!btn || !answer) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    // Close all
    faqItems.forEach(i => {
      const b = i.querySelector('.faq__question');
      const a = i.querySelector('.faq__answer');
      if (b) b.setAttribute('aria-expanded', 'false');
      if (a) a.classList.remove('open');
    });

    // Open clicked if it was closed
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      answer.classList.add('open');
    }
  });
});


// -----------------------------------------------
// Smooth anchor scroll (for same-page links)
// -----------------------------------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = nav ? nav.offsetHeight : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


// -----------------------------------------------
// Gallery — horizontal scroll with drag, dots, arrows
// -----------------------------------------------
(function () {
  const track = document.querySelector('.gallery__track');
  const dotsContainer = document.getElementById('galleryDots');
  const prevBtn = document.querySelector('.gallery__arrow--prev');
  const nextBtn = document.querySelector('.gallery__arrow--next');
  if (!track) return;

  const slides = track.querySelectorAll('.gallery__slide');
  let isDragging = false;
  let startX = 0;
  let scrollStart = 0;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'gallery__dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to photo ' + (i + 1));
    dot.addEventListener('click', () => scrollToSlide(i));
    if (dotsContainer) dotsContainer.appendChild(dot);
  });

  function getActiveDotIndex() {
    const trackRect = track.parentElement.getBoundingClientRect();
    let closest = 0;
    let closestDist = Infinity;
    slides.forEach((slide, i) => {
      const dist = Math.abs(slide.getBoundingClientRect().left - trackRect.left);
      if (dist < closestDist) { closestDist = dist; closest = i; }
    });
    return closest;
  }

  function updateDots() {
    const active = getActiveDotIndex();
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.gallery__dot').forEach((d, i) => {
      d.classList.toggle('active', i === active);
    });
    if (prevBtn) prevBtn.classList.toggle('hidden', active === 0);
    if (nextBtn) nextBtn.classList.toggle('hidden', active === slides.length - 1);
  }

  function scrollToSlide(index) {
    const slide = slides[index];
    if (!slide) return;
    const trackLeft = track.getBoundingClientRect().left;
    const slideLeft = slide.getBoundingClientRect().left;
    track.scrollBy({ left: slideLeft - trackLeft, behavior: 'smooth' });
  }

  track.addEventListener('scroll', updateDots, { passive: true });

  // Arrow buttons
  if (prevBtn) prevBtn.addEventListener('click', () => {
    scrollToSlide(Math.max(0, getActiveDotIndex() - 1));
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    scrollToSlide(Math.min(slides.length - 1, getActiveDotIndex() + 1));
  });

  // Mouse drag to scroll
  track.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.pageX;
    scrollStart = track.scrollLeft;
    track.style.cursor = 'grabbing';
  });
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    track.scrollLeft = scrollStart - (e.pageX - startX);
  });
  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    track.style.cursor = 'grab';
  });

  // Init
  updateDots();
  if (prevBtn) prevBtn.classList.add('hidden');
})();
