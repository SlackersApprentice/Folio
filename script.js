const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const yearNode = document.querySelector('#year');

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const homepage = document.querySelector('main#top');
const workPage = document.querySelector('main#work-page');
const revealTargets = (homepage || workPage)?.querySelectorAll(
  '.hero-copy, .logo-strip, .section-heading, .page-header, .case-study-grid, .project-card, .section-cta-row, .service-card, .timeline-item, .about-copy, .cv-card, .contact-box'
);

if (revealTargets?.length) {
  document.body.classList.add('reveal-ready');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealTargets.forEach((target) => target.classList.add('scroll-reveal', 'is-visible'));
  } else {
    revealTargets.forEach((target, index) => {
      target.classList.add('scroll-reveal');
      target.style.transitionDelay = `${Math.min(index % 3, 2) * 90}ms`;
    });

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-visible', entry.isIntersecting);
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -6% 0px' }
    );

    revealTargets.forEach((target) => revealObserver.observe(target));
  }
}

const galleryImages = document.querySelectorAll('.project-hero img, .project-gallery img');

if (galleryImages.length) {
  const lightbox = document.createElement('div');
  const lightboxImage = document.createElement('img');
  const closeButton = document.createElement('button');
  let lastFocusedImage;

  lightbox.className = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Expanded project image');
  lightbox.hidden = true;

  lightboxImage.className = 'lightbox-image';
  lightboxImage.alt = '';

  closeButton.className = 'lightbox-close';
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', 'Close expanded image');
  closeButton.innerHTML = '&times;';

  lightbox.append(lightboxImage, closeButton);
  document.body.append(lightbox);

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.classList.remove('lightbox-open');
    lightboxImage.removeAttribute('src');
    lastFocusedImage?.focus();
  };

  const openLightbox = (image) => {
    lastFocusedImage = image;
    lightboxImage.src = image.dataset.largeSrc || image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    closeButton.focus();
  };

  galleryImages.forEach((image) => {
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', `Open larger version of ${image.alt}`);

    image.addEventListener('click', () => openLightbox(image));
    image.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(image);
      }
    });
  });

  closeButton.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (!lightbox.hidden && event.key === 'Escape') {
      closeLightbox();
    }
  });
}
