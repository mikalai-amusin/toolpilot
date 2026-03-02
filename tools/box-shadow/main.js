import { getNavHTML, getFooterHTML, getAdSlotHTML, getShareHTML, initToolPage, copyToClipboard } from '../../src/shared.js';

const PRESETS = [
    { name: 'Soft Lift', shadows: [{ x: 0, y: 4, blur: 15, spread: 0, color: '#0000001a', inset: false }] },
    { name: 'Hard Edge', shadows: [{ x: 8, y: 8, blur: 0, spread: 0, color: '#00000040', inset: false }] },
    { name: 'Dreamy', shadows: [{ x: 0, y: 20, blur: 60, spread: -12, color: '#0000004d', inset: false }] },
    { name: 'Neumorphism', shadows: [{ x: 6, y: 6, blur: 12, spread: 0, color: '#00000033', inset: false }, { x: -6, y: -6, blur: 12, spread: 0, color: '#ffffff1a', inset: false }] },
    { name: 'Layered', shadows: [{ x: 0, y: 1, blur: 3, spread: 0, color: '#0000001a', inset: false }, { x: 0, y: 8, blur: 24, spread: 0, color: '#00000026', inset: false }] },
    { name: 'Glow Purple', shadows: [{ x: 0, y: 0, blur: 30, spread: 5, color: '#7c6aef40', inset: false }] },
    { name: 'Glow Blue', shadows: [{ x: 0, y: 0, blur: 30, spread: 5, color: '#06b6d440', inset: false }] },
    { name: 'Inner Shadow', shadows: [{ x: 0, y: 4, blur: 12, spread: 0, color: '#00000033', inset: true }] },
];

let shadows = [{ x: 0, y: 8, blur: 24, spread: 0, color: '#00000040', inset: false }];
let bgColor = '#1a1a2e';
let boxColor = '#262640';
let borderRadius = 16;

document.getElementById('app').innerHTML = `
  ${getNavHTML('box-shadow')}
  <main id="main-content" class="container tool-page">
    <div class="tool-header">
      <div class="tool-icon" style="background: var(--gradient-ocean);">🖼️</div>
      <h1>CSS Box Shadow Generator</h1>
      <p>Design beautiful box shadows visually with live preview and CSS export</p>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
      <div>
        <div class="glass-card" style="margin-bottom: 1.5rem;">
          <h3 style="margin-bottom: 1rem;">Presets</h3>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            ${PRESETS.map((p, i) => `<button class="btn btn-sm btn-secondary preset-btn" data-idx="${i}">${p.name}</button>`).join('')}
          </div>
        </div>

        <div id="shadow-layers" class="glass-card" style="margin-bottom: 1.5rem;"></div>

        <button class="btn btn-sm btn-primary" id="btn-add-layer" style="margin-bottom: 1.5rem;">+ Add Shadow Layer</button>

        <div class="glass-card" style="margin-bottom: 1.5rem;">
          <h3 style="margin-bottom: 1rem;">Box Style</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem;">
            <div>
              <label for="bg-color">Background</label>
              <input type="color" id="bg-color" value="${bgColor}" style="width: 100%; height: 36px; cursor: pointer;">
            </div>
            <div>
              <label for="box-color">Box Color</label>
              <input type="color" id="box-color" value="${boxColor}" style="width: 100%; height: 36px; cursor: pointer;">
            </div>
            <div>
              <label for="border-radius">Radius (${borderRadius}px)</label>
              <input type="range" id="border-radius" min="0" max="80" value="${borderRadius}" style="width:100%; margin-top: 8px;">
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="glass-card" style="margin-bottom: 1.5rem;">
          <h3 style="margin-bottom: 1rem;">Preview</h3>
          <div id="preview-area" style="width: 100%; height: 300px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; transition: background 0.3s;">
            <div id="preview-box" style="width: 180px; height: 180px; transition: all 0.3s;"></div>
          </div>
        </div>

        <div class="glass-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <h3 style="margin: 0;">CSS Code</h3>
            <button class="btn btn-sm btn-primary" id="btn-copy-css">📋 Copy CSS</button>
          </div>
          <pre id="css-output" style="font-family: var(--font-mono); font-size: 0.8rem; background: var(--bg-input); padding: 1rem; border-radius: var(--radius-md); overflow-x: auto; line-height: 1.6; white-space: pre-wrap; border: 1px solid var(--border-color);"></pre>
        </div>
      </div>
    </div>

    ${getShareHTML('CSS Box Shadow Generator')}
    ${getAdSlotHTML()}
  </main>
  ${getFooterHTML()}
`;

initToolPage('box-shadow');

function renderLayers() {
    const container = document.getElementById('shadow-layers');
    container.innerHTML = `
    <h3 style="margin-bottom: 1rem;">Shadow Layers (${shadows.length})</h3>
    ${shadows.map((s, i) => `
      <div style="padding: 0.75rem; background: var(--bg-input); border-radius: var(--radius-md); margin-bottom: 0.75rem; border: 1px solid var(--border-color);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);">Layer ${i + 1}</span>
          <div style="display: flex; gap: 0.4rem; align-items: center;">
            <label style="font-size: 0.7rem; margin: 0; display: flex; align-items: center; gap: 0.3rem; cursor: pointer;">
              <input type="checkbox" class="shadow-inset" data-idx="${i}" ${s.inset ? 'checked' : ''}> Inset
            </label>
            ${shadows.length > 1 ? `<button class="btn btn-sm btn-ghost remove-layer" data-idx="${i}" style="padding: 0.2rem 0.4rem; font-size: 0.75rem;">✕</button>` : ''}
          </div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.5rem;">
          <div><label style="font-size: 0.65rem;">X</label><input type="range" class="shadow-x" data-idx="${i}" min="-60" max="60" value="${s.x}" style="width:100%;"></div>
          <div><label style="font-size: 0.65rem;">Y</label><input type="range" class="shadow-y" data-idx="${i}" min="-60" max="60" value="${s.y}" style="width:100%;"></div>
          <div><label style="font-size: 0.65rem;">Blur</label><input type="range" class="shadow-blur" data-idx="${i}" min="0" max="100" value="${s.blur}" style="width:100%;"></div>
          <div><label style="font-size: 0.65rem;">Spread</label><input type="range" class="shadow-spread" data-idx="${i}" min="-30" max="30" value="${s.spread}" style="width:100%;"></div>
          <div><label style="font-size: 0.65rem;">Color</label><input type="color" class="shadow-color" data-idx="${i}" value="${s.color.slice(0, 7)}" style="width:100%; height:28px; cursor:pointer;"></div>
        </div>
      </div>
    `).join('')}
  `;
    attachLayerEvents();
}

function attachLayerEvents() {
    document.querySelectorAll('.shadow-x, .shadow-y, .shadow-blur, .shadow-spread').forEach(el => {
        el.addEventListener('input', () => {
            const i = parseInt(el.dataset.idx);
            const prop = el.className.split(' ').find(c => c.startsWith('shadow-')).replace('shadow-', '');
            shadows[i][prop] = parseInt(el.value);
            updatePreview();
        });
    });
    document.querySelectorAll('.shadow-color').forEach(el => {
        el.addEventListener('input', () => {
            shadows[parseInt(el.dataset.idx)].color = el.value + '66';
            updatePreview();
        });
    });
    document.querySelectorAll('.shadow-inset').forEach(el => {
        el.addEventListener('change', () => {
            shadows[parseInt(el.dataset.idx)].inset = el.checked;
            updatePreview();
        });
    });
    document.querySelectorAll('.remove-layer').forEach(el => {
        el.addEventListener('click', () => {
            shadows.splice(parseInt(el.dataset.idx), 1);
            renderLayers();
            updatePreview();
        });
    });
}

function getShadowCSS() {
    return shadows.map(s => `${s.inset ? 'inset ' : ''}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}`).join(',\n        ');
}

function updatePreview() {
    const previewArea = document.getElementById('preview-area');
    const previewBox = document.getElementById('preview-box');
    const cssOutput = document.getElementById('css-output');

    const shadowCSS = getShadowCSS();
    previewArea.style.background = bgColor;
    previewBox.style.background = boxColor;
    previewBox.style.borderRadius = borderRadius + 'px';
    previewBox.style.boxShadow = shadows.map(s => `${s.inset ? 'inset ' : ''}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}`).join(', ');

    cssOutput.textContent = `.element {
    box-shadow: ${shadowCSS};
    border-radius: ${borderRadius}px;
    background: ${boxColor};
}`;
}

document.getElementById('btn-add-layer').addEventListener('click', () => {
    shadows.push({ x: 0, y: 4, blur: 16, spread: 0, color: '#00000033', inset: false });
    renderLayers();
    updatePreview();
});

document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const preset = PRESETS[parseInt(btn.dataset.idx)];
        shadows = JSON.parse(JSON.stringify(preset.shadows));
        renderLayers();
        updatePreview();
    });
});

document.getElementById('bg-color').addEventListener('input', (e) => { bgColor = e.target.value; updatePreview(); });
document.getElementById('box-color').addEventListener('input', (e) => { boxColor = e.target.value; updatePreview(); });
document.getElementById('border-radius').addEventListener('input', (e) => {
    borderRadius = parseInt(e.target.value);
    e.target.previousElementSibling.textContent = `Radius (${borderRadius}px)`;
    updatePreview();
});

document.getElementById('btn-copy-css').addEventListener('click', () => {
    copyToClipboard(document.getElementById('css-output').textContent);
});

// Responsive: stack columns on mobile
const style = document.createElement('style');
style.textContent = `@media (max-width: 768px) { main > div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; } }`;
document.head.appendChild(style);

renderLayers();
updatePreview();
