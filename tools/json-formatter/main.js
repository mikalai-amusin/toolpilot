import '../../src/styles.css';
import { getNavHTML, getFooterHTML, initToolPage, copyToClipboard, getShareHTML, getAdSlotHTML } from '../../src/shared.js';

function syntaxHighlight(json) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = 'number';
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? 'key' : 'string';
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return `<span class="json-${cls}">${match}</span>`;
    }
  );
}

document.querySelector('#app').innerHTML = `
  ${getNavHTML('json-formatter')}
  <main class="container tool-page">
    <div class="tool-header">
      <div class="tool-icon" style="background: var(--gradient-aurora);">{ }</div>
      <h1>JSON Formatter & Validator</h1>
      <p>Beautify, minify, and validate your JSON data with syntax highlighting</p>
    </div>

    <div class="tool-layout">
      <div class="tool-panel animate-slide-left">
        <div class="tool-panel-header">
          <h3>Input</h3>
          <div class="controls-row">
            <button class="btn btn-sm btn-secondary" id="sampleBtn">Load Sample</button>
            <button class="btn btn-sm btn-ghost" id="clearBtn">Clear</button>
          </div>
        </div>
        <div class="glass-card">
          <textarea id="jsonInput" placeholder='Paste your JSON here...&#10;&#10;{"name": "ToolPilot", "version": 1}' style="min-height: 300px;"></textarea>
        </div>
      </div>

      <div class="tool-panel animate-slide-right">
        <div class="tool-panel-header">
          <h3>Output</h3>
          <div class="controls-row">
            <button class="btn btn-sm btn-primary" id="formatBtn">✨ Beautify</button>
            <button class="btn btn-sm btn-secondary" id="minifyBtn">Minify</button>
            <button class="btn btn-sm btn-ghost" id="copyBtn">📋 Copy</button>
          </div>
        </div>
        <div class="glass-card">
          <div id="status" style="margin-bottom: 0.5rem; font-size: 0.8rem; font-weight: 700;"></div>
          <div id="jsonOutput" style="padding: 1rem; background: var(--bg-input); border: 1px solid var(--border-color); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: 0.82rem; line-height: 1.7; min-height: 260px; max-height: 500px; overflow-y: auto; white-space: pre-wrap; word-break: break-all;">
            <span style="color: var(--text-muted);">Formatted JSON will appear here...</span>
          </div>
        </div>
      </div>
    </div>

    ${getShareHTML('JSON Formatter')}
    ${getAdSlotHTML()}
  </main>
  ${getFooterHTML()}

  <style>
    .json-key { color: #7c6aef; }
    .json-string { color: #10b981; }
    .json-number { color: #06b6d4; }
    .json-boolean { color: #f59e0b; }
    .json-null { color: #ef4444; }
  </style>
`;

initToolPage('json-formatter');

const input = document.getElementById('jsonInput');
const output = document.getElementById('jsonOutput');
const status = document.getElementById('status');
let lastFormatted = '';

function formatJSON(indent = 2) {
  try {
    const parsed = JSON.parse(input.value);
    const formatted = JSON.stringify(parsed, null, indent);
    lastFormatted = formatted;
    if (indent > 0) {
      output.innerHTML = syntaxHighlight(formatted);
    } else {
      output.textContent = formatted;
    }
    const keys = Object.keys(parsed).length || (Array.isArray(parsed) ? parsed.length : 0);
    status.innerHTML = `<span style="color: var(--success)">✅ Valid JSON</span> <span style="color: var(--text-muted); margin-left: 0.5rem;">${keys} top-level entries • ${formatted.length} chars</span>`;
  } catch (e) {
    output.innerHTML = '';
    lastFormatted = '';
    status.innerHTML = `<span style="color: var(--error)">❌ ${e.message}</span>`;
  }
}

document.getElementById('formatBtn').addEventListener('click', () => formatJSON(2));
document.getElementById('minifyBtn').addEventListener('click', () => formatJSON(0));
document.getElementById('copyBtn').addEventListener('click', () => copyToClipboard(lastFormatted));
document.getElementById('clearBtn').addEventListener('click', () => {
  input.value = '';
  output.innerHTML = '<span style="color: var(--text-muted);">Formatted JSON will appear here...</span>';
  lastFormatted = '';
  status.textContent = '';
});

document.getElementById('sampleBtn').addEventListener('click', () => {
  input.value = JSON.stringify({
    name: "ToolPilot",
    version: 2,
    tools: ["JSON Formatter", "Password Generator", "QR Code", "Gradient CSS"],
    settings: { theme: "dark", language: "en", premium: false },
    stats: { tools: 10, users: null, cost: 0 },
    features: { free: true, signupRequired: false, adsEnabled: true }
  });
  formatJSON(2);
});

input.addEventListener('input', () => {
  if (input.value.trim()) formatJSON(2);
});
