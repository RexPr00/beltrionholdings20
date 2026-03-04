(() => {
  const body = document.body;
  const focusables = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

  let activeTrap = null;
  const trapFocus = (container) => {
    const items = Array.from(container.querySelectorAll(focusables));
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    activeTrap = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    container.addEventListener('keydown', activeTrap);
    first.focus();
  };

  const releaseFocus = (container) => {
    if (activeTrap) container.removeEventListener('keydown', activeTrap);
    activeTrap = null;
  };

  const langBtn = document.querySelector('.lang-btn');
  const langMenu = document.querySelector('.lang-menu');
  if (langBtn && langMenu) {
    langBtn.addEventListener('click', () => {
      langMenu.classList.toggle('open');
      langBtn.setAttribute('aria-expanded', String(langMenu.classList.contains('open')));
    });
    document.addEventListener('click', (e) => {
      if (!langMenu.contains(e.target) && !langBtn.contains(e.target)) {
        langMenu.classList.remove('open');
        langBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const drawer = document.querySelector('.mobile-drawer');
  const openBtn = document.querySelector('.menu-btn');
  const closeBtn = document.querySelector('.drawer-close');
  const drawerBackdrop = document.querySelector('.drawer-backdrop');
  const openDrawer = () => {
    drawer.classList.add('open');
    body.classList.add('no-scroll');
    trapFocus(drawer.querySelector('.drawer-panel'));
  };
  const closeDrawer = () => {
    drawer.classList.remove('open');
    body.classList.remove('no-scroll');
    releaseFocus(drawer.querySelector('.drawer-panel'));
    openBtn.focus();
  };
  if (openBtn && closeBtn && drawer && drawerBackdrop) {
    openBtn.addEventListener('click', openDrawer);
    closeBtn.addEventListener('click', closeDrawer);
    drawerBackdrop.addEventListener('click', closeDrawer);
    drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeDrawer));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
    });
  }

  const faqItems = Array.from(document.querySelectorAll('.faq-item'));
  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-btn');
    btn.addEventListener('click', () => {
      faqItems.forEach((i) => {
        if (i !== item) i.classList.remove('open');
      });
      item.classList.toggle('open');
    });
  });

  const modal = document.querySelector('.modal');
  const modalOpen = document.querySelectorAll('[data-open-privacy]');
  const modalClose = document.querySelectorAll('[data-close-privacy]');
  const modalPanel = document.querySelector('.modal-panel');

  const openModal = () => {
    modal.classList.add('open');
    body.classList.add('no-scroll');
    trapFocus(modalPanel);
  };
  const closeModal = () => {
    modal.classList.remove('open');
    body.classList.remove('no-scroll');
    releaseFocus(modalPanel);
  };
  if (modal) {
    modalOpen.forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); openModal(); }));
    modalClose.forEach((b) => b.addEventListener('click', closeModal));
    modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.section').forEach((s) => observer.observe(s));
})();
