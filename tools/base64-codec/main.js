import '../../src/styles.css';
import { getNavHTML, getFooterHTML, initToolPage, copyToClipboard, getShareHTML, getAdSlotHTML } from '../../src/shared.js';

document.querySelector('#app').innerHTML = `
  ${getNavHTML('base64-codec')}
  <main class="container tool-page">
    <div class="tool-header">
      <div class="tool-icon" style="background: var(--gradient-emerald);">🔄</div>
      <h1>Base64 Encoder & Decoder</h1>
      <p>Encode and decode Base64 strings instantly in your browser</p>
    </div>

    <div class="tool-layout">
      <div class="tool-panel">
        <div class="tool-panel-header">
          <h3>Text / Input</h3>
          <button class="btn btn-sm btn-ghost" id="clearInput">Clear</button>
        </div>
        <div class="glass-card">
          <textarea id="textInput" placeholder="Enter text to encode, or Base64 to decode..." style="min-height: 200px;"></textarea>
        </div>
      </div>

      <div class="tool-panel">
        <div class="tool-panel-header">
          <h3>Result</h3>
          <button class="btn btn-sm btn-ghost" id="copyBtn">📋 Copy</button>
        </div>
        <div class="glass-card">
          <div class="output-display" id="output" style="min-height: 200px;">Result will appear here...</div>
        </div>
      </div>
    </div>

    <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 1.5rem;">
      <button class="btn btn-primary" id="encodeBtn">⬇️ Encode to Base64</button>
      <button class="btn btn-secondary" id="decodeBtn">⬆️ Decode from Base64</button>
    </div>

    <div id="error" style="text-align: center; margin-top: 1rem; color: var(--error); font-size: 0.85rem; font-weight: 600;"></div>

    ${getShareHTML('Base64 Encoder')}
    ${getAdSlotHTML()}
    <section class="seo-content glass-card" style="margin-top: 2rem;">
      <h2>What is Base64 Encoding?</h2>
      <p><strong>Base64</strong> is an encoding scheme used to convert binary data (like images or encrypted keys) into an ASCII string format. This ensures that the data remains intact when transported across channels that only reliably support text, such as email (MIME) or JSON payloads.</p>
      <h3>Decoding Base64 to Text</h3>
      <p>Developers frequently need to decode Base64 strings to inspect the underlying data, read email contents, or reverse simple text obfuscation. This tool supports UTF-8 Unicode characters unconditionally.</p>
    </section>
  </main>
  ${getFooterHTML()}
`;

initToolPage('base64-codec');

const input = document.getElementById('textInput');
const output = document.getElementById('output');
const error = document.getElementById('error');

function encode() {
  try {
    error.textContent = '';
    const encoded = btoa(unescape(encodeURIComponent(input.value)));
    output.textContent = encoded;
  } catch (e) {
    error.textContent = '❌ Encoding failed: ' + e.message;
  }
}

function decode() {
  try {
    error.textContent = '';
    const decoded = decodeURIComponent(escape(atob(input.value.trim())));
    output.textContent = decoded;
  } catch (e) {
    error.textContent = '❌ Invalid Base64 string: ' + e.message;
  }
}

document.getElementById('encodeBtn').addEventListener('click', encode);
document.getElementById('decodeBtn').addEventListener('click', decode);
document.getElementById('copyBtn').addEventListener('click', () => copyToClipboard(output.textContent));
document.getElementById('clearInput').addEventListener('click', () => {
  input.value = '';
  output.textContent = '';
  error.textContent = '';
});
