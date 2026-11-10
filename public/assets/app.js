const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#navigation');
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.textContent = open ? 'Cerrar' : 'Menú';
  menu.classList.toggle('is-open', open);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
    toggle.click();
    toggle.focus();
  }
});

if (toggle && menu) document.documentElement.classList.add('navigation-enhanced');

// Department links highlight the relevant email; the visitor sends from their own account.
const selectedDepartment = new URLSearchParams(window.location.search).get('departamento');
document.querySelectorAll('[data-department]').forEach(card => {
  if (card.dataset.department === selectedDepartment) card.classList.add('is-selected');
});

// One entrance per element. Content stays visible if animation support is absent.
function setupMotion() {
  if (typeof window.IntersectionObserver !== 'function' || typeof Element.prototype.animate !== 'function') return;

  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const targets = new Map();
  const seen = new WeakSet();
  const animations = new Map();
  let observer;

  const groups = [
    '.hero-copy', '.page-hero > .container', '.cards', '.steps',
    '.section.two-col', '.dark-section .two-col', '.section-head', '.cta'
  ];
  for (const selector of groups) {
    document.querySelectorAll(selector).forEach(group => {
      [...group.children].forEach((element, index) => {
        // Steps animate individually; do not animate their container as well.
        if (!element.matches('.steps')) targets.set(element, Math.min(index * 45, 135));
      });
    });
  }
  document.querySelectorAll('.hero-art').forEach(element => targets.set(element, 90));

  const cancelAnimations = () => {
    animations.forEach(animation => animation.cancel());
    animations.clear();
  };

  const configure = () => {
    observer?.disconnect();
    cancelAnimations();
    if (preference.matches) return;

    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting || preference.matches) continue;
        const element = entry.target;
        observer.unobserve(element);
        seen.add(element);
        if (element.contains(document.activeElement)) continue;

        const animation = element.animate([
          { opacity: 0, translate: '0 18px' },
          { opacity: 1, translate: '0 0' }
        ], {
          duration: 560,
          delay: targets.get(element),
          easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
          fill: 'backwards'
        });
        animations.set(element, animation);
        animation.finished.then(
          () => animations.delete(element),
          () => animations.delete(element)
        );
      }
    }, { threshold: 0.02 });

    targets.forEach((delay, element) => {
      if (!seen.has(element)) observer.observe(element);
    });
  };

  // Keyboard users can focus controls immediately, even during an entrance.
  document.addEventListener('focusin', event => {
    targets.forEach((delay, element) => {
      if (!element.contains(event.target)) return;
      seen.add(element);
      observer?.unobserve(element);
      animations.get(element)?.cancel();
      animations.delete(element);
    });
  });
  preference.addEventListener('change', configure);
  window.addEventListener('beforeprint', () => {
    observer?.disconnect();
    cancelAnimations();
  });
  window.addEventListener('afterprint', configure);
  configure();
}

setupMotion();
