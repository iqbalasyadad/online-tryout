// Minimal JS glue for the old UI, adapted to HTMX navigation.

(function () {
  const qs = (s, el=document) => el.querySelector(s);
  const qsa = (s, el=document) => Array.from(el.querySelectorAll(s));

  // Sidebar (mobile)
  function openSidebar() {
    qs('#sidebar-left')?.classList.add('open');
    qs('#sidebar-overlay')?.classList.add('open');
  }
  function closeSidebar() {
    qs('#sidebar-left')?.classList.remove('open');
    qs('#sidebar-overlay')?.classList.remove('open');
  }
  function toggleSidebar() {
    const sidebar = qs('#sidebar-left');
    if (!sidebar) return;
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  }

  // Dropdowns
  function closeAllDropdowns() {
    qsa('.nav-dropdown').forEach(d => d.classList.remove('open'));
    qs('#dropdown-backdrop')?.classList.remove('open');
  }
  function toggleDropdown(name) {
    const dd = qs(`#dropdown-${name}`);
    const backdrop = qs('#dropdown-backdrop');
    if (!dd || !backdrop) return;

    const willOpen = !dd.classList.contains('open');
    closeAllDropdowns();
    if (willOpen) {
      dd.classList.add('open');
      backdrop.classList.add('open');
    }
  }

  function selectMode(mode) {
    const label = qs('#mode-label');
    const account = qs('#account-mode-display');
    if (label) label.textContent = mode;
    if (account) account.textContent = mode;

    qsa('#dropdown-mode .nav-dropdown-item').forEach(item => {
      item.classList.toggle('selected', item.getAttribute('data-value') === mode);
    });
    closeAllDropdowns();
  }

  function selectLanguage(lang) {
    const label = qs('#lang-label');
    if (label) label.textContent = lang;

    qsa('#dropdown-lang .nav-dropdown-item').forEach(item => {
      item.classList.toggle('selected', item.getAttribute('data-value') === lang);
    });
    closeAllDropdowns();
  }

  // // Tabs (Activity/Purchase) - purely client-side inside swapped content
  // function wireTabs(root) {
  //   qsa('.tab-nav', root).forEach(nav => {
  //     nav.addEventListener('click', (e) => {
  //       const btn = e.target.closest('.tab-btn');
  //       if (!btn) return;

  //       const tab = btn.getAttribute('data-tab');
  //       if (!tab) return;

  //       // activate btn
  //       qsa('.tab-btn', nav).forEach(b => b.classList.toggle('active', b === btn));

  //       // panels are siblings within same page container
  //       const page = nav.closest('.page-content--navmenu');
  //       if (!page) return;
  //       qsa('.tab-panel', page).forEach(p => {
  //         p.classList.toggle('active', p.getAttribute('data-panel') === tab);
  //       });
  //     }, { passive: true });
  //   });
  // }

  // Slider (home)
  let sliderInterval = null;
  function wireSlider(root) {
    const track = qs('#slider-track', root);
    const dots  = qsa('#slider-dots .slider-dot', root);
    if (!track || dots.length === 0) return;

    const slideCount = dots.length;
    let currentSlide = 0;

    function goToSlide(index) {
      currentSlide = (index + slideCount) % slideCount;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    }
    function nextSlide() { goToSlide(currentSlide + 1); }

    dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));

    // reset interval
    if (sliderInterval) clearInterval(sliderInterval);
    sliderInterval = setInterval(nextSlide, 4000);

    const wrapper = track.parentElement;
    wrapper?.addEventListener('mouseenter', () => sliderInterval && clearInterval(sliderInterval));
    wrapper?.addEventListener('mouseleave', () => sliderInterval = setInterval(nextSlide, 4000));
  }

  // Active states based on current URL path
  function setActiveNav() {
    const path = window.location.pathname;

    // Top nav
    qsa('.nav-link').forEach(a => a.classList.remove('active'));
    if (path === '/' ) qs('.nav-link[data-nav="home"]')?.classList.add('active');
    else if (path.startsWith('/activity')) qs('.nav-link[data-nav="activity"]')?.classList.add('active');
    else if (path.startsWith('/purchase')) qs('.nav-link[data-nav="purchase"]')?.classList.add('active');
    else if (path.startsWith('/account')) qs('.nav-link[data-nav="account"]')?.classList.add('active');

    // Side nav
    qsa('.sidebar-item').forEach(a => a.classList.remove('active'));
    if (path.startsWith('/journey')) qs('.sidebar-item[data-side="journey"]')?.classList.add('active');
    else if (path.startsWith('/practice')) qs('.sidebar-item[data-side="practice"]')?.classList.add('active');
    else if (path.startsWith('/materials')) qs('.sidebar-item[data-side="materials"]')?.classList.add('active');
    else if (path.startsWith('/tryout')) qs('.sidebar-item[data-side="tryout"]')?.classList.add('active');

    // Mobile
    qsa('.mobile-tab').forEach(a => a.classList.remove('active'));
    if (path === '/' ) qs('.mobile-tab[data-mobile="home"]')?.classList.add('active');
    else if (path.startsWith('/activity')) qs('.mobile-tab[data-mobile="activity"]')?.classList.add('active');
    else if (path.startsWith('/purchase')) qs('.mobile-tab[data-mobile="purchase"]')?.classList.add('active');
    else if (path.startsWith('/account')) qs('.mobile-tab[data-mobile="account"]')?.classList.add('active');
  }

  // Global click delegation for data-action
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;

    const action = el.getAttribute('data-action');
    if (!action) return;

    if (action === 'toggleSidebar') {
      e.preventDefault();
      toggleSidebar();
    } else if (action === 'toggleDropdown') {
      e.preventDefault();
      toggleDropdown(el.getAttribute('data-dropdown'));
    } else if (action === 'selectMode') {
      e.preventDefault();
      selectMode(el.getAttribute('data-value') || 'CPNS');
    } else if (action === 'selectLanguage') {
      e.preventDefault();
      selectLanguage(el.getAttribute('data-value') || 'Indonesia');
    }
  }, { passive: false });

  qs('#sidebar-overlay')?.addEventListener('click', toggleSidebar, { passive: true });
  qs('#dropdown-backdrop')?.addEventListener('click', closeAllDropdowns, { passive: true });

  // HTMX hooks: after swap, re-wire local widgets
  document.body.addEventListener('htmx:afterSwap', (evt) => {
    // content swapped into main-content
    if (evt.detail?.target?.id === 'main-content') {
      closeSidebar();
      closeAllDropdowns();
      setActiveNav();
      // wireTabs(evt.detail.target);
      wireSlider(evt.detail.target);
    }
  });

  // Initial wire
  setActiveNav();
  // wireTabs(document);
  wireSlider(document);
})();
