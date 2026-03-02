import { getNavHTML, getFooterHTML, getAdSlotHTML, getShareHTML, initToolPage, copyToClipboard } from '../../src/shared.js';

const FLEX_PROPS = {
    direction: ['row', 'row-reverse', 'column', 'column-reverse'],
    wrap: ['nowrap', 'wrap', 'wrap-reverse'],
    justifyContent: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
    alignItems: ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'],
    alignContent: ['stretch', 'flex-start', 'flex-end', 'center', 'space-between', 'space-around'],
    gap: ['0px', '8px', '16px', '24px', '32px'],
};

let itemCount = 4;
let containerProps = { direction: 'row', wrap: 'nowrap', justifyContent: 'flex-start', alignItems: 'stretch', alignContent: 'stretch', gap: '16px' };

function makeSelect(label, prop, options) {
    return `
    <div>
      <label style="font-size: 0.75rem;">${label}</label>
      <select class="flex-prop" data-prop="${prop}">
        ${options.map(o => `<option value="${o}" ${containerProps[prop] === o ? 'selected' : ''}>${o}</option>`).join('')}
      </select>
    </div>
  `;
}

document.getElementById('app').innerHTML = `
  ${getNavHTML('flexbox')}
  <main id="main-content" class="container tool-page">
    <div class="tool-header">
      <div class="tool-icon" style="background: var(--gradient-aurora);">📦</div>
      <h1>CSS Flexbox Playground</h1>
      <p>Learn and experiment with Flexbox properties visually in real-time</p>
    </div>

    <div style="display: grid; grid-template-columns: 300px 1fr; gap: 1.5rem;">
      <div>
        <div class="glass-card" style="margin-bottom: 1.5rem;">
          <h3 style="margin-bottom: 1rem;">Container Properties</h3>
          <div style="display: grid; gap: 0.75rem;">
            ${makeSelect('flex-direction', 'direction', FLEX_PROPS.direction)}
            ${makeSelect('flex-wrap', 'wrap', FLEX_PROPS.wrap)}
            ${makeSelect('justify-content', 'justifyContent', FLEX_PROPS.justifyContent)}
            ${makeSelect('align-items', 'alignItems', FLEX_PROPS.alignItems)}
            ${makeSelect('align-content', 'alignContent', FLEX_PROPS.alignContent)}
            ${makeSelect('gap', 'gap', FLEX_PROPS.gap)}
          </div>
        </div>

        <div class="glass-card" style="margin-bottom: 1.5rem;">
          <h3 style="margin-bottom: 0.75rem;">Items (${itemCount})</h3>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-sm btn-primary" id="btn-add-item">+ Add</button>
            <button class="btn btn-sm btn-secondary" id="btn-remove-item">− Remove</button>
            <button class="btn btn-sm btn-secondary" id="btn-reset">↻ Reset</button>
          </div>
        </div>

        <div class="glass-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <h3 style="margin: 0;">CSS Code</h3>
            <button class="btn btn-sm btn-secondary" id="btn-copy-css">📋 Copy</button>
          </div>
          <pre id="css-output" style="font-family: var(--font-mono); font-size: 0.78rem; background: var(--bg-input); padding: 0.75rem; border-radius: var(--radius-md); overflow-x: auto; line-height: 1.6; border: 1px solid var(--border-color); white-space: pre-wrap;"></pre>
        </div>
      </div>

      <div class="glass-card">
        <h3 style="margin-bottom: 1rem;">Preview</h3>
        <div id="flex-preview" style="min-height: 400px; background: var(--bg-input); border-radius: var(--radius-md); border: 2px dashed var(--border-color); padding: 16px; transition: all 0.3s;"></div>
      </div>
    </div>

    ${getShareHTML('CSS Flexbox Playground')}
    ${getAdSlotHTML()}

    <section class="seo-content glass-card" style="margin-top: 2rem;">
      <h2>What is CSS Flexbox?</h2>
      <p><strong>CSS Flexbox</strong> (Flexible Box Layout) is a one-dimensional layout method for arranging items in rows or columns. It makes it easy to distribute space and align content within a container, even when item sizes are unknown or dynamic.</p>
      <h3>Key Flexbox Properties</h3>
      <ul>
        <li><strong>flex-direction</strong> — Sets the main axis: row (horizontal) or column (vertical)</li>
        <li><strong>justify-content</strong> — Aligns items along the main axis (e.g., center, space-between)</li>
        <li><strong>align-items</strong> — Aligns items along the cross axis (e.g., stretch, center)</li>
        <li><strong>flex-wrap</strong> — Controls whether items wrap to new lines</li>
        <li><strong>gap</strong> — Adds spacing between flex items</li>
      </ul>
      <p>This playground lets you experiment with every property and see the effect in real-time, making it the fastest way to learn Flexbox.</p>
    </section>
  </main>
  ${getFooterHTML()}
`;

initToolPage('flexbox');

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#0ea5e9', '#14b8a6', '#f97316'];

function renderPreview() {
    const preview = document.getElementById('flex-preview');
    preview.style.display = 'flex';
    preview.style.flexDirection = containerProps.direction;
    preview.style.flexWrap = containerProps.wrap;
    preview.style.justifyContent = containerProps.justifyContent;
    preview.style.alignItems = containerProps.alignItems;
    preview.style.alignContent = containerProps.alignContent;
    preview.style.gap = containerProps.gap;

    preview.innerHTML = '';
    for (let i = 0; i < itemCount; i++) {
        const item = document.createElement('div');
        const isColumn = containerProps.direction.includes('column');
        const w = isColumn ? '80%' : (60 + Math.random() * 60) + 'px';
        const h = isColumn ? (40 + Math.random() * 30) + 'px' : (50 + Math.random() * 50) + 'px';
        item.style.cssText = `min-width: ${w}; min-height: ${h}; background: ${COLORS[i % COLORS.length]}; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.9rem; opacity: 0.9; transition: all 0.3s;`;
        item.textContent = i + 1;
        preview.appendChild(item);
    }

    updateCSS();
}

function updateCSS() {
    const css = `.container {
  display: flex;
  flex-direction: ${containerProps.direction};
  flex-wrap: ${containerProps.wrap};
  justify-content: ${containerProps.justifyContent};
  align-items: ${containerProps.alignItems};
  align-content: ${containerProps.alignContent};
  gap: ${containerProps.gap};
}`;
    document.getElementById('css-output').textContent = css;
}

document.querySelectorAll('.flex-prop').forEach(sel => {
    sel.addEventListener('change', () => {
        containerProps[sel.dataset.prop] = sel.value;
        renderPreview();
    });
});

document.getElementById('btn-add-item').addEventListener('click', () => { if (itemCount < 20) { itemCount++; renderPreview(); } });
document.getElementById('btn-remove-item').addEventListener('click', () => { if (itemCount > 1) { itemCount--; renderPreview(); } });
document.getElementById('btn-reset').addEventListener('click', () => {
    itemCount = 4;
    containerProps = { direction: 'row', wrap: 'nowrap', justifyContent: 'flex-start', alignItems: 'stretch', alignContent: 'stretch', gap: '16px' };
    document.querySelectorAll('.flex-prop').forEach(sel => { sel.value = containerProps[sel.dataset.prop]; });
    renderPreview();
});

document.getElementById('btn-copy-css').addEventListener('click', () => copyToClipboard(document.getElementById('css-output').textContent));

// Responsive + SEO styles
const style = document.createElement('style');
style.textContent = `@media (max-width: 768px) { main > div[style*="grid-template-columns: 300px"] { grid-template-columns: 1fr !important; } } .seo-content { font-size: 0.9rem; line-height: 1.7; color: var(--text-secondary); } .seo-content h2 { color: var(--text-primary); margin-bottom: 0.75rem; } .seo-content h3 { color: var(--text-primary); margin: 1rem 0 0.5rem; } .seo-content ul { padding-left: 1.5rem; } .seo-content li { margin-bottom: 0.3rem; }`;
document.head.appendChild(style);

renderPreview();
