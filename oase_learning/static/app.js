/* ════════════════════════════════════════════════════════════
   app.js — Oase Learning
   Handles: navbar dropdown, mobile sidebar, slider, active state
════════════════════════════════════════════════════════════ */

// ── APP STATE ──────────────────────────────────────────────
const appState = {
  currentMode:     'CPNS',
  currentLanguage: 'Indonesia',
  currentSlide:    0,
  slideCount:      4,
  sliderInterval:  null,
};

// ── ACTIVE STATE HELPERS ───────────────────────────────────

/**
 * Dipanggil saat nav-link diklik.
 * Hapus .active dari semua nav-link & mobile-tab,
 * pasang .active ke yang diklik.
 */
function setActiveNav(el) {
  document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
  document.querySelectorAll('.mobile-tab').forEach(a => a.classList.remove('active'));
  document.querySelectorAll('.sidebar-item').forEach(a => a.classList.remove('active'));
  el.classList.add('active');
}

/**
 * Dipanggil saat sidebar-item diklik.
 */
function setSidebarActive(el) {
  document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
  document.querySelectorAll('.mobile-tab').forEach(a => a.classList.remove('active'));
  document.querySelectorAll('.sidebar-item').forEach(a => a.classList.remove('active'));
  el.classList.add('active');
  closeSidebar();
}

/**
 * Dipanggil saat tab-btn di halaman diklik.
 */
function setTabActive(el) {
  el.closest('.tab-bar')
    .querySelectorAll('.tab-btn')
    .forEach(btn => btn.classList.remove('active'));
  el.classList.add('active');
}

// ── HTMX: sync active state setelah back/forward ──────────
//  Ketika HTMX restore dari history, active class perlu
//  di-sync ulang berdasarkan URL saat ini.
document.addEventListener('htmx:historyRestore', syncActiveFromUrl);
document.addEventListener('htmx:afterSwap', function(evt) {
  // Re-init slider kalau ada slider di konten baru
  if (document.getElementById('slider-track')) {
    initSlider();
  }
});

function syncActiveFromUrl() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const map = {
    '/':           '[data-nav="home"], [data-mobile="home"]',
    '/activity':   '[data-nav="activity"], [data-mobile="activity"]',
    '/purchase':   '[data-nav="purchase"], [data-mobile="purchase"]',
    '/account':    '[data-nav="account"], [data-mobile="account"]',
    '/journey':    '[data-side="journey"]',
    '/practice':   '[data-side="practice"]',
    '/materials':  '[data-side="materials"]',
    '/tryout':     '[data-side="tryout"]',
  };
  document.querySelectorAll('.nav-link, .mobile-tab, .sidebar-item')
    .forEach(el => el.classList.remove('active'));

  const selector = map[path];
  if (selector) {
    document.querySelectorAll(selector).forEach(el => el.classList.add('active'));
  }
}

// ── MOBILE SIDEBAR DRAWER ──────────────────────────────────
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar-left');
  const overlay = document.getElementById('sidebar-overlay');
  const isOpen  = sidebar.classList.contains('open');
  if (isOpen) { closeSidebar(); }
  else {
    sidebar.classList.add('open');
    overlay.classList.add('open');
  }
}

function closeSidebar() {
  document.getElementById('sidebar-left').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('open');
}

// ── NAVBAR DROPDOWNS ──────────────────────────────────────
function toggleDropdown(name) {
  const dropdown = document.getElementById(`dropdown-${name}`);
  const backdrop = document.getElementById('dropdown-backdrop');
  const isOpen   = dropdown.classList.contains('open');
  closeAllDropdowns();
  if (!isOpen) {
    dropdown.classList.add('open');
    backdrop.classList.add('open');
  }
}

function closeAllDropdowns() {
  document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
  document.getElementById('dropdown-backdrop').classList.remove('open');
}

function selectMode(mode) {
  appState.currentMode = mode;
  document.getElementById('mode-label').textContent = mode;
  document.querySelectorAll('#dropdown-mode .nav-dropdown-item')
    .forEach(item => item.classList.toggle('selected', item.textContent.trim() === mode));
  closeAllDropdowns();
}

function selectLanguage(lang) {
  appState.currentLanguage = lang;
  document.getElementById('lang-label').textContent = lang;
  document.querySelectorAll('#dropdown-lang .nav-dropdown-item')
    .forEach(item => item.classList.toggle('selected', item.textContent.trim().includes(lang)));
  closeAllDropdowns();
}

function handleLogout() {
  if (confirm('Apakah kamu yakin ingin keluar?')) {
    window.location.href = '/logout/';
  }
}

// ── BANNER SLIDER ─────────────────────────────────────────
function initSlider() {
  const track = document.getElementById('slider-track');
  const dots  = document.querySelectorAll('.slider-dot');
  if (!track) return;

  // Bersihkan interval lama
  if (appState.sliderInterval) clearInterval(appState.sliderInterval);
  appState.currentSlide = 0;
  appState.slideCount   = track.children.length;

  function goTo(index) {
    appState.currentSlide = (index + appState.slideCount) % appState.slideCount;
    track.style.transform = `translateX(-${appState.currentSlide * 100}%)`;
    dots.forEach((dot, i) =>
      dot.classList.toggle('active', i === appState.currentSlide)
    );
  }

  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  appState.sliderInterval = setInterval(() => goTo(appState.currentSlide + 1), 4000);
}

// Init pertama kali
initSlider();
