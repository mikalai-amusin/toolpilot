import '../../src/styles.css';
import { getNavHTML, getFooterHTML, initToolPage, copyToClipboard, getShareHTML, getAdSlotHTML } from '../../src/shared.js';

const PRESETS = [
    { name: 'Aurora', colors: ['#667eea', '#764ba2'], angle: 135 },
    { name: 'Sunset', colors: ['#f093fb', '#f5576c'], angle: 135 },
    { name: 'Ocean', colors: ['#0ea5e9', '#6366f1'], angle: 135 },
    { name: 'Emerald', colors: ['#10b981', '#06b6d4'], angle: 135 },
    { name: 'Fire', colors: ['#ef4444', '#f97316', '#fbbf24'], angle: 135 },
    { name: 'Neon', colors: ['#a855f7', '#ec4899'], angle: 135 },
    { name: 'Midnight', colors: ['#0c0c1d', '#1e1b4b', '#4338ca'], angle: 180 },
    { name: 'Peach', colors: ['#fbbf24', '#f472b6', '#a855f7'], angle: 135 },
    { name: 'Ice', colors: ['#e0f2fe', '#7dd3fc', '#0ea5e9'], angle: 180 },
    { name: 'Forest', colors: ['#064e3b', '#065f46', '#10b981'], angle: 180 },
];

document.querySelector('#app').innerHTML = `
  ${getNavHTML('gradient-generator')}
  <main class="container tool-page">
    <div class="tool-header">
      <div class="tool-icon" style="background: var(--gradient-sunset);">🌈</div>
      <h1>CSS Gradient Generator</h1>
      <p>Pick colors, adjust direction, and grab the CSS — it's that easy</p>
    </div>

    <div class="tool-layout single-column" style="max-width: 900px;">
      <!-- Live Preview -->
      <div class="glass-card" style="padding: 0; overflow: hidden; border-radius: var(--radius-xl);">
        <div id="preview" style="height: 250px; border-radius: var(--radius-xl); transition: all 0.3s ease;"></div>
      </div>

      <div class="glass-card">
        <!-- Controls -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
          <div class="option-group">
            <label for="gradType">Type</label>
            <select id="gradType">
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
              <option value="conic">Conic</option>
            </select>
          </div>
          <div class="option-group" id="angleGroup">
            <label for="angle">Angle: <span id="angleLabel">135</span>°</label>
            <input type="range" id="angle" min="0" max="360" value="135" />
          </div>
          <div class="option-group">
            <label>Colors</label>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <input type="color" id="color1" value="#667eea" style="width: 48px; height: 36px; border: none; border-radius: 8px; cursor: pointer; padding: 0;" />
              <input type="color" id="color2" value="#764ba2" style="width: 48px; height: 36px; border: none; border-radius: 8px; cursor: pointer; padding: 0;" />
              <input type="color" id="color3" value="#f093fb" style="width: 48px; height: 36px; border: none; border-radius: 8px; cursor: pointer; padding: 0; opacity: 0.3;" disabled />
              <button class="btn btn-sm btn-ghost" id="addColor" title="Add 3rd color">+ Color</button>
            </div>
          </div>
        </div>

        <!-- Presets -->
        <div style="margin-bottom: 1.5rem;">
          <label style="margin-bottom: 0.5rem;">Presets</label>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            ${PRESETS.map((p, i) => `
              <button class="btn btn-sm btn-ghost preset-btn" data-idx="${i}" style="padding: 0; width: 40px; height: 28px; border-radius: 8px; background: linear-gradient(135deg, ${p.colors.join(', ')}); border: 2px solid var(--border-color);" title="${p.name}"></button>
            `).join('')}
          </div>
        </div>

        <!-- CSS Output -->
        <div style="position: relative;">
          <label>CSS Code</label>
          <div class="output-display" id="cssOutput" style="font-size: 0.85rem; min-height: 60px;"></div>
          <button class="btn btn-primary btn-sm" id="copyBtn" style="position: absolute; top: 30px; right: 12px;">📋 Copy CSS</button>
        </div>
      </div>
    </div>

    ${getShareHTML('CSS Gradient Generator')}
    ${getAdSlotHTML()}
  </main>
  ${getFooterHTML()}
`;

initToolPage('gradient-generator');

let useThreeColors = false;
const preview = document.getElementById('preview');
const cssOutput = document.getElementById('cssOutput');
const gradType = document.getElementById('gradType');
const angle = document.getElementById('angle');
const angleLabel = document.getElementById('angleLabel');
const color1 = document.getElementById('color1');
const color2 = document.getElementById('color2');
const color3 = document.getElementById('color3');

function updateGradient() {
    const type = gradType.value;
    const a = angle.value;
    const colors = useThreeColors
        ? [color1.value, color2.value, color3.value]
        : [color1.value, color2.value];
    const colorStr = colors.join(', ');

    let css;
    if (type === 'linear') {
        css = `background: linear-gradient(${a}deg, ${colorStr});`;
        preview.style.background = `linear-gradient(${a}deg, ${colorStr})`;
    } else if (type === 'radial') {
        css = `background: radial-gradient(circle, ${colorStr});`;
        preview.style.background = `radial-gradient(circle, ${colorStr})`;
    } else {
        css = `background: conic-gradient(from ${a}deg, ${colorStr});`;
        preview.style.background = `conic-gradient(from ${a}deg, ${colorStr})`;
    }

    cssOutput.textContent = css;
}

[gradType, angle, color1, color2, color3].forEach(el => {
    el.addEventListener('input', updateGradient);
});

angle.addEventListener('input', (e) => {
    angleLabel.textContent = e.target.value;
});

document.getElementById('addColor').addEventListener('click', () => {
    useThreeColors = !useThreeColors;
    color3.disabled = !useThreeColors;
    color3.style.opacity = useThreeColors ? '1' : '0.3';
    document.getElementById('addColor').textContent = useThreeColors ? '− Color' : '+ Color';
    updateGradient();
});

document.getElementById('copyBtn').addEventListener('click', () => {
    copyToClipboard(cssOutput.textContent);
});

// Presets
document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx);
        const p = PRESETS[idx];
        color1.value = p.colors[0];
        color2.value = p.colors[1];
        if (p.colors[2]) {
            useThreeColors = true;
            color3.value = p.colors[2];
            color3.disabled = false;
            color3.style.opacity = '1';
            document.getElementById('addColor').textContent = '− Color';
        } else {
            useThreeColors = false;
            color3.disabled = true;
            color3.style.opacity = '0.3';
            document.getElementById('addColor').textContent = '+ Color';
        }
        angle.value = p.angle;
        angleLabel.textContent = p.angle;
        updateGradient();
    });
});

updateGradient();
