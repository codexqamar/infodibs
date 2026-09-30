const navToggle = document.querySelector('[data-nav-toggle]');
const navLinks = document.querySelector('[data-nav-links]');

const closeMenu = () => {
  if (!navLinks || !navToggle) return;
  navLinks.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  navToggle.setAttribute('aria-expanded', 'false');
};

const toggleMenu = () => {
  if (!navLinks || !navToggle) return;
  const isOpen = navLinks.classList.toggle('is-open');
  document.body.classList.toggle('menu-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
};

if (navToggle && navLinks) {
  navToggle.addEventListener('click', toggleMenu);
}

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-nav-toggle]');
  if (!trigger || trigger !== navToggle) return;
  if (event.defaultPrevented) return;
  if (navLinks.classList.contains('is-open') === (navToggle.getAttribute('aria-expanded') === 'true')) return;
  toggleMenu();
});

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 })
  : null;

revealItems.forEach((item) => {
  if (revealObserver) {
    revealObserver.observe(item);
  } else {
    item.classList.add('is-visible');
  }
});

const contactForm = document.querySelector('[data-contact-form]');
const formStatus = document.querySelector('[data-form-status]');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const name = data.get('name') || 'DIBS website visitor';
    const email = data.get('email') || '';
    const message = data.get('message') || '';
    const subject = encodeURIComponent(`DIBS inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\nReply to: ${email}`);
    formStatus.textContent = 'Opening your email app with the message ready.';
    window.location.href = `mailto:support@dibsapp.com?subject=${subject}&body=${body}`;
  });
}

const footerForm = document.querySelector('[data-footer-form]');
const footerStatus = document.querySelector('[data-footer-status]');

if (footerForm && footerStatus) {
  footerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    footerStatus.textContent = 'Subscribed for DIBS updates.';
    footerForm.reset();
  });
}

let lastScrolledState = null;
const updateScrolledHeader = () => {
  const isScrolled = window.scrollY > 72;
  document.body.classList.toggle('is-scrolled', isScrolled);
  if (lastScrolledState !== isScrolled && navLinks && navToggle) {
    closeMenu();
  }
  lastScrolledState = isScrolled;
};

window.addEventListener('scroll', updateScrolledHeader, { passive: true });
window.addEventListener('resize', updateScrolledHeader);
updateScrolledHeader();
if (navLinks && navToggle) {
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}

let lastObservedScrollY = -1;
const monitorScrolledHeader = () => {
  if (window.scrollY !== lastObservedScrollY) {
    lastObservedScrollY = window.scrollY;
    updateScrolledHeader();
  }
  window.requestAnimationFrame(monitorScrolledHeader);
};
monitorScrolledHeader();


window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

