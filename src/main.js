import './styles.css';
import { getNavHTML, getFooterHTML, initToolPage, getAdSlotHTML, getRecentTools } from './shared.js';

const TOOL_MAP = {
  'json-formatter': { name: 'JSON Formatter', icon: '{ }', color: '#667eea', gradient: 'var(--gradient-aurora)' },
  'word-counter': { name: 'Word Counter', icon: '✍️', color: '#8b5cf6', gradient: 'var(--gradient-ocean)' },
  'lorem-generator': { name: 'Lorem Ipsum', icon: '📝', color: '#a855f7', gradient: 'linear-gradient(135deg, #a855f7, #6366f1)' },
  'color-palette': { name: 'Color Palette', icon: '🎨', color: '#ec4899', gradient: 'var(--gradient-sunset)' },
  'password-generator': { name: 'Password Generator', icon: '🔐', color: '#06b6d4', gradient: 'var(--gradient-emerald)' },
  'base64-codec': { name: 'Base64 Codec', icon: '🔄', color: '#10b981', gradient: 'var(--gradient-emerald)' },
  'markdown-preview': { name: 'Markdown Preview', icon: '📋', color: '#f59e0b', gradient: 'var(--gradient-sunset)' },
  'unit-converter': { name: 'Unit Converter', icon: '📐', color: '#ef4444', gradient: 'var(--gradient-fire)' },
  'qr-generator': { name: 'QR Code Generator', icon: '📱', color: '#7c6aef', gradient: 'var(--gradient-aurora)' },
  'gradient-generator': { name: 'CSS Gradient Generator', icon: '🌈', color: '#f472b6', gradient: 'var(--gradient-sunset)' },
};

const tools = [
  { key: 'json-formatter', desc: 'Beautify, minify & validate JSON with syntax highlighting.', tag: 'Popular' },
  { key: 'word-counter', desc: 'Count words, characters, sentences + keyword density analysis.', tag: null },
  { key: 'color-palette', desc: 'Generate stunning color palettes with 5 harmony modes.', tag: 'Trending' },
  { key: 'password-generator', desc: 'Crypto-secure passwords with strength meter & passphrase mode.', tag: 'Essential' },
  { key: 'qr-generator', desc: 'Generate QR codes for URLs, text, WiFi — download as PNG/SVG.', tag: 'New' },
  { key: 'gradient-generator', desc: 'Design beautiful CSS gradients with live preview & code export.', tag: 'New' },
  { key: 'markdown-preview', desc: 'Live markdown editor with real-time rendered preview.', tag: null },
  { key: 'base64-codec', desc: 'Encode & decode Base64 strings with Unicode support.', tag: null },
  { key: 'unit-converter', desc: 'Convert length, weight, temperature, speed & data units.', tag: null },
  { key: 'lorem-generator', desc: 'Generate placeholder text — paragraphs, sentences, or words.', tag: null },
];

function getRecentHTML() {
  const recent = getRecentTools();
  if (recent.length === 0) return '';
  const chips = recent.map(key => {
    const t = TOOL_MAP[key];
    if (!t) return '';
    return `<a href="/tools/${key}/index.html" class="recent-chip">${t.icon} ${t.name}</a>`;
  }).filter(Boolean).join('');

  if (!chips) return '';
  return `
    <section style="margin-bottom: 2rem; text-align: center;">
      <p style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; margin-bottom: 0.75rem;">Recently Used</p>
      <div class="recent-tools" style="justify-content: center;">
        ${chips}
      </div>
    </section>
  `;
}

document.querySelector('#app').innerHTML = `
  ${getNavHTML('home')}

  <main class="container">
    <section class="hero">
      <div class="hero-badge">⚡ 100% Free — No Signup Required</div>
      <h1>
        The Toolkit<br/>
        <span class="gradient-text">You Deserve</span>
      </h1>
      <p class="hero-subtitle">
        Beautiful, blazing-fast, free browser tools. No signup, no limits, no nonsense. Just paste, click, and go.
      </p>
      <div class="hero-cta">
        <a href="#tools" class="btn btn-primary" style="padding: 0.75rem 2rem; font-size: 1rem;">Explore Tools ↓</a>
        <button class="btn btn-secondary" style="padding: 0.75rem 1.5rem;" onclick="window.__toggleTheme()">Toggle Theme</button>
      </div>
      <div class="hero-stats">
        <div class="hero-stat">
          <div class="hero-stat-value">10</div>
          <div class="hero-stat-label">Free Tools</div>
        </div>
        <div class="hero-stat">
          <div class="hero-stat-value">$0</div>
          <div class="hero-stat-label">Forever</div>
        </div>
        <div class="hero-stat">
          <div class="hero-stat-value"><50ms</div>
          <div class="hero-stat-label">Response</div>
        </div>
      </div>
    </section>

    ${getAdSlotHTML()}
    ${getRecentHTML()}

    <section id="tools">
      <div class="section-header">
        <h2>All Tools</h2>
        <p>Click to open — they work instantly, right in your browser</p>
      </div>
      <div class="tools-grid">
        ${tools.map(t => {
  const info = TOOL_MAP[t.key];
  return `
            <a href="/tools/${t.key}/index.html" class="tool-card animate-in" style="--card-gradient: ${info.gradient}; --card-glow-color: ${info.color}22">
              <div class="tool-card-icon" style="background: ${info.gradient}">${info.icon}</div>
              <h3>${info.name}</h3>
              <p>${t.desc}</p>
              <span class="tool-card-arrow">→</span>
              ${t.tag ? `<span class="tool-card-tag">${t.tag}</span>` : ''}
            </a>
          `;
}).join('')}
      </div>
    </section>

    ${getAdSlotHTML()}

    <section style="text-align: center; padding: 3rem 0;">
      <div class="glass-card" style="max-width: 600px; margin: 0 auto; text-align: center;">
        <h3 style="margin-bottom: 0.5rem;">⌨️ Keyboard Shortcuts</h3>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">Power users love shortcuts</p>
        <div style="display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap;">
          <div><span class="kbd">⌘</span> + <span class="kbd">K</span> <span style="color: var(--text-muted); font-size: 0.8rem; margin-left: 0.5rem;">Focus input</span></div>
          <div><span class="kbd">⌘</span> + <span class="kbd">/</span> <span style="color: var(--text-muted); font-size: 0.8rem; margin-left: 0.5rem;">Toggle theme</span></div>
        </div>
      </div>
    </section>
  </main>

  ${getFooterHTML()}
`;

initToolPage('home');
