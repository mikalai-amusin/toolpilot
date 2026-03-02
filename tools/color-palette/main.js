import '../../src/styles.css';
import { getNavHTML, getFooterHTML, initToolPage, copyToClipboard, getShareHTML, getAdSlotHTML } from '../../src/shared.js';

function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = n => { const k = (n + h / 30) % 12; const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1); return Math.round(255 * color).toString(16).padStart(2, '0'); };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToRGB(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

function generatePalette(mode = 'random') {
  const colors = [];
  const baseHue = Math.floor(Math.random() * 360);

  if (mode === 'analogous') {
    for (let i = 0; i < 5; i++) {
      const h = (baseHue + i * 30) % 360;
      const s = 60 + Math.random() * 25;
      const l = 40 + Math.random() * 30;
      colors.push({ hex: hslToHex(h, s, l), h, s: Math.round(s), l: Math.round(l) });
    }
  } else if (mode === 'complementary') {
    for (let i = 0; i < 5; i++) {
      const h = (baseHue + (i < 3 ? i * 15 : 180 + (i - 3) * 15)) % 360;
      const s = 55 + Math.random() * 30;
      const l = 35 + Math.random() * 35;
      colors.push({ hex: hslToHex(h, s, l), h, s: Math.round(s), l: Math.round(l) });
    }
  } else if (mode === 'triadic') {
    for (let i = 0; i < 5; i++) {
      const h = (baseHue + Math.floor(i / 2) * 120 + (i % 2) * 20) % 360;
      const s = 55 + Math.random() * 30;
      const l = 35 + Math.random() * 35;
      colors.push({ hex: hslToHex(h, s, l), h, s: Math.round(s), l: Math.round(l) });
    }
  } else if (mode === 'monochromatic') {
    for (let i = 0; i < 5; i++) {
      const s = 50 + Math.random() * 30;
      const l = 20 + i * 15;
      colors.push({ hex: hslToHex(baseHue, s, l), h: baseHue, s: Math.round(s), l: Math.round(l) });
    }
  } else {
    for (let i = 0; i < 5; i++) {
      const h = Math.floor(Math.random() * 360);
      const s = 50 + Math.random() * 40;
      const l = 30 + Math.random() * 40;
      colors.push({ hex: hslToHex(h, s, l), h, s: Math.round(s), l: Math.round(l) });
    }
  }

  return colors;
}

document.querySelector('#app').innerHTML = `
  ${getNavHTML('color-palette')}
  <main class="container tool-page">
    <div class="tool-header">
      <div class="tool-icon" style="background: var(--gradient-sunset);">🎨</div>
      <h1>Color Palette Generator</h1>
      <p>Generate beautiful harmonious color palettes — click any swatch to copy</p>
    </div>

    <div class="tool-layout single-column">
      <div class="glass-card">
        <div class="controls-row" style="margin-bottom: 1.5rem;">
          <select id="modeSelect" style="max-width: 200px;">
            <option value="random">Random</option>
            <option value="analogous">Analogous</option>
            <option value="complementary">Complementary</option>
            <option value="triadic">Triadic</option>
            <option value="monochromatic">Monochromatic</option>
          </select>
          <button class="btn btn-primary" id="generateBtn">🎲 Generate New</button>
          <span class="spacer"></span>
          <button class="btn btn-sm btn-secondary" id="exportBtn">Export CSS</button>
        </div>
        <div class="color-grid" id="palette"></div>
      </div>
    </div>

    ${getShareHTML('Color Palette Generator')}
    ${getAdSlotHTML()}
    <section class="seo-content glass-card" style="margin-top: 2rem;">
      <h2>Color Palette Generator</h2>
      <p>Creating a beautiful UI starts with cohesive colors. A <strong>Color Palette Generator</strong> helps designers and developers construct visually appealing themes based on color theory principles.</p>
      <h3>Color Harmonies</h3>
      <ul>
        <li><strong>Analogous:</strong> Colors next to each other on the color wheel. (Calm, cohesive)</li>
        <li><strong>Complementary:</strong> Opposite colors on the wheel. (High contrast, vibrant)</li>
        <li><strong>Triadic:</strong> Three evenly spaced colors. (Balanced but lively)</li>
        <li><strong>Monochromatic:</strong> Variations in lightness of a single hue.</li>
      </ul>
    </section>
  </main>
  ${getFooterHTML()}
`;

initToolPage('color-palette');

let currentColors = [];

function renderPalette() {
  const mode = document.getElementById('modeSelect').value;
  currentColors = generatePalette(mode);
  const grid = document.getElementById('palette');
  grid.innerHTML = currentColors.map((c, i) => `
    <div class="color-swatch" onclick="window.__copyColor('${c.hex}')" title="Click to copy ${c.hex}">
      <div class="color-swatch-preview" style="background: ${c.hex}"></div>
      <div class="color-swatch-info">
        <div style="font-weight: 600; font-size: 0.85rem;">${c.hex.toUpperCase()}</div>
        <div style="opacity: 0.7;">${hexToRGB(c.hex)}</div>
        <div style="opacity: 0.7;">hsl(${c.h}, ${c.s}%, ${c.l}%)</div>
      </div>
    </div>
  `).join('');
}

window.__copyColor = (hex) => copyToClipboard(hex);

document.getElementById('generateBtn').addEventListener('click', renderPalette);
document.getElementById('modeSelect').addEventListener('change', renderPalette);
document.getElementById('exportBtn').addEventListener('click', () => {
  const css = `:root {\n${currentColors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n')}\n}`;
  copyToClipboard(css);
});

renderPalette();
