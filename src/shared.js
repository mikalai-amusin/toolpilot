// ToolPilot — Shared Utilities v2
// Aurora background, star particles, sharing, favorites, keyboard shortcuts

// ===== THEME =====
export function initTheme() {
  const saved = localStorage.getItem('toolpilot-theme');
  const theme = saved || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  return theme;
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('toolpilot-theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const btn = document.querySelector('.theme-toggle');
  if (btn) btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
}

// ===== CLIPBOARD =====
export function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => showCopyFeedback());
}

function showCopyFeedback() {
  let el = document.querySelector('.copy-feedback');
  if (!el) {
    el = document.createElement('div');
    el.className = 'copy-feedback';
    el.textContent = '✓ Copied to clipboard!';
    document.body.appendChild(el);
  }
  el.classList.add('visible');
  setTimeout(() => el.classList.remove('visible'), 2000);
}

// ===== DEBOUNCE =====
export function debounce(fn, delay = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ===== RECENTLY USED =====
function trackToolUsage(toolName) {
  if (!toolName || toolName === 'home') return;
  try {
    let recent = JSON.parse(localStorage.getItem('toolpilot-recent') || '[]');
    recent = recent.filter(t => t !== toolName);
    recent.unshift(toolName);
    recent = recent.slice(0, 5);
    localStorage.setItem('toolpilot-recent', JSON.stringify(recent));
  } catch (e) { /* ignore */ }
}

export function getRecentTools() {
  try {
    return JSON.parse(localStorage.getItem('toolpilot-recent') || '[]');
  } catch { return []; }
}

// ===== AURORA BACKGROUND =====
function createAuroraBackground() {
  if (document.querySelector('.aurora-bg')) return;
  const aurora = document.createElement('div');
  aurora.className = 'aurora-bg';
  aurora.innerHTML = '<div class="orb"></div><div class="orb"></div><div class="orb"></div><div class="orb"></div>';
  document.body.prepend(aurora);
}

// ===== STAR FIELD =====
function createStarField() {
  if (document.querySelector('.star-field')) return;
  const field = document.createElement('div');
  field.className = 'star-field';
  const count = 40;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = (Math.random() * 5) + 's';
    star.style.animationDuration = (2 + Math.random() * 4) + 's';
    star.style.width = (1 + Math.random() * 2) + 'px';
    star.style.height = star.style.width;
    field.appendChild(star);
  }
  document.body.prepend(field);
}

// ===== CONFIG =====
const GITHUB_REPO = 'https://github.com/mikalai-amusin/toolpilot';

// ===== NAVIGATION =====
export function getNavHTML(currentPage = '') {
  const isHome = currentPage === 'home';
  const basePath = isHome ? '.' : '../..';

  return `
    <a href="#main-content" class="skip-link">Skip to content</a>
    <nav class="nav" role="navigation" aria-label="Main navigation">
      <div class="nav-container">
        <a href="${basePath}/index.html" class="nav-logo">
          <div class="nav-logo-icon">⚡</div>
          ToolPilot
        </a>
        <button class="nav-menu-btn" onclick="document.querySelector('.nav-links').classList.toggle('active')" aria-label="Toggle menu">☰</button>
        <ul class="nav-links">
          <li><a href="${basePath}/index.html">All Tools</a></li>
          <li><a href="${basePath}/tools/json-formatter/index.html">JSON</a></li>
          <li><a href="${basePath}/tools/word-counter/index.html">Words</a></li>
          <li><a href="${basePath}/tools/color-palette/index.html">Colors</a></li>
          <li><a href="${basePath}/tools/password-generator/index.html">Password</a></li>
          <li><a href="${basePath}/tools/qr-generator/index.html">QR Code</a></li>
          <li><button class="theme-toggle" onclick="window.__toggleTheme()" aria-label="Toggle dark/light mode">☀️</button></li>
        </ul>
      </div>
    </nav>
  `;
}

// ===== FOOTER =====
export function getFooterHTML() {
  return `
    <footer class="footer" role="contentinfo">
      <div class="footer-content">
        <div class="footer-brand">
          <span>ToolPilot</span>
          <span style="color: var(--text-muted);">— Free tools for everyone</span>
        </div>
        <ul class="footer-links">
          <li><a href="/">All Tools</a></li>
          <li><a href="${GITHUB_REPO}/issues/new?template=feedback.md" target="_blank" rel="noopener">💬 Feedback</a></li>
          <li><a href="${GITHUB_REPO}/issues/new?template=bug_report.md" target="_blank" rel="noopener">🐛 Report Bug</a></li>
          <li><a href="${GITHUB_REPO}/issues/new?template=feature_request.md" target="_blank" rel="noopener">💡 Request Feature</a></li>
          <li><a href="${GITHUB_REPO}" target="_blank" rel="noopener">GitHub</a></li>
        </ul>
        <p style="margin-top: 0.75rem;">© ${new Date().getFullYear()} ToolPilot. Made with ⚡ for the community.</p>
        <p style="margin-top: 0.25rem; font-size: 0.7rem; color: var(--text-muted);">Something missing? <a href="${GITHUB_REPO}/issues" target="_blank" rel="noopener" style="color: var(--accent-primary);">Let us know</a> — we ship fast.</p>
      </div>
    </footer>
  `;
}

// ===== AD SLOT =====
export function getAdSlotHTML() {
  return `
    <div class="ad-slot">
      <small>Sponsored</small>
      <p style="margin-top: 0.25rem; font-size: 0.65rem; opacity: 0.6;">Ad space — Google AdSense will be placed here</p>
    </div>
  `;
}

// ===== SHARE BUTTONS =====
export function getShareHTML(toolName, toolUrl) {
  const text = encodeURIComponent(`Check out this free ${toolName} tool! 🚀`);
  const url = encodeURIComponent(toolUrl || window.location.href);
  return `
    <div class="share-section">
      <span class="share-section-label">Share</span>
      <a class="btn btn-sm btn-share" href="https://twitter.com/intent/tweet?text=${text}&url=${url}" target="_blank" rel="noopener" title="Share on X/Twitter">𝕏 Tweet</a>
      <button class="btn btn-sm btn-secondary" onclick="navigator.clipboard.writeText(window.location.href).then(()=>{this.textContent='✓ Copied!';setTimeout(()=>this.textContent='🔗 Copy Link',1500)})">🔗 Copy Link</button>
    </div>
  `;
}

// ===== KEYBOARD SHORTCUTS =====
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K → Focus search/first input
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const textarea = document.querySelector('textarea');
      const input = document.querySelector('input[type="text"], input[type="number"]');
      (textarea || input)?.focus();
    }
    // Ctrl/Cmd + / → Toggle theme
    if ((e.metaKey || e.ctrlKey) && e.key === '/') {
      e.preventDefault();
      toggleTheme();
    }
  });
}

// ===== SMOOTH CARD ENTRANCE =====
function initIntersectionObserver() {
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.tool-card, .glass-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

// ===== INIT ALL =====
export function initToolPage(pageName = '') {
  const theme = initTheme();
  updateThemeIcon(theme);
  window.__toggleTheme = toggleTheme;

  createAuroraBackground();
  createStarField();
  initKeyboardShortcuts();
  trackToolUsage(pageName);

  // Defer animations to avoid blocking first paint
  requestAnimationFrame(() => {
    initIntersectionObserver();
  });
}
