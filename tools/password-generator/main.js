import '../../src/styles.css';
import { getNavHTML, getFooterHTML, initToolPage, copyToClipboard, getShareHTML, getAdSlotHTML } from '../../src/shared.js';

const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function generatePassword(length, options) {
  let chars = '';
  if (options.uppercase) chars += CHAR_SETS.uppercase;
  if (options.lowercase) chars += CHAR_SETS.lowercase;
  if (options.numbers) chars += CHAR_SETS.numbers;
  if (options.symbols) chars += CHAR_SETS.symbols;
  if (!chars) chars = CHAR_SETS.lowercase;

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, x => chars[x % chars.length]).join('');
}

function getStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 20) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return { label: 'Weak', color: 'var(--error)', width: '25%' };
  if (score <= 3) return { label: 'Fair', color: 'var(--warning)', width: '50%' };
  if (score <= 4) return { label: 'Good', color: '#60a5fa', width: '75%' };
  return { label: 'Strong', color: 'var(--success)', width: '100%' };
}

document.querySelector('#app').innerHTML = `
  ${getNavHTML('password-generator')}
  <main class="container tool-page">
    <div class="tool-header">
      <div class="tool-icon" style="background: var(--gradient-emerald);">🔐</div>
      <h1>Password Generator</h1>
      <p>Generate ultra-secure random passwords with fine-grained control</p>
    </div>

    <div class="tool-layout single-column">
      <div class="glass-card">
        <div style="background: var(--bg-input); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.5rem; text-align: center; margin-bottom: 1.5rem; position: relative;">
          <div id="passwordDisplay" style="font-family: var(--font-mono); font-size: 1.4rem; font-weight: 600; word-break: break-all; letter-spacing: 0.05em; min-height: 2em; display: flex; align-items: center; justify-content: center;"></div>
          <div class="strength-bar" style="margin-top: 1rem;">
            <div class="strength-bar-fill" id="strengthFill"></div>
          </div>
          <div class="strength-label" id="strengthLabel" style="text-align: left;"></div>
        </div>

        <div class="controls-row" style="margin-bottom: 1.5rem;">
          <button class="btn btn-primary" id="generateBtn" style="flex: 1;">🔄 Generate New</button>
          <button class="btn btn-secondary" id="copyBtn">📋 Copy</button>
        </div>

        <div style="margin-bottom: 1rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <label>Length</label>
            <span id="lengthValue" style="font-weight: 700; color: var(--accent-primary);">16</span>
          </div>
          <input type="range" id="lengthSlider" min="4" max="64" value="16" />
        </div>

        <div class="options-grid" style="margin-top: 1.5rem;">
          <label class="toggle-label"><input type="checkbox" id="uppercase" checked /> Uppercase (A-Z)</label>
          <label class="toggle-label"><input type="checkbox" id="lowercase" checked /> Lowercase (a-z)</label>
          <label class="toggle-label"><input type="checkbox" id="numbers" checked /> Numbers (0-9)</label>
          <label class="toggle-label"><input type="checkbox" id="symbols" checked /> Symbols (!@#$)</label>
        </div>
      </div>
    </div>

    ${getShareHTML('Password Generator')}
    ${getAdSlotHTML()}
    <section class="seo-content glass-card" style="margin-top: 2rem;">
      <h2>How to generate secure passwords?</h2>
      <p>A secure password should be at least 16 characters long, unique for every account, and impossible to guess. Humans are notoriously bad at creating random passwords, often relying on predictable patterns.</p>
      <h3>Is this Password Generator safe?</h3>
      <p>Yes. This tool runs entirely in your browser using the <strong>Web Crypto API</strong> (specifically <code>crypto.getRandomValues()</code>), which provides true cryptographic randomness. No passwords are ever sent over the internet or saved to a server.</p>
    </section>
  </main>
  ${getFooterHTML()}
`;

initToolPage('password-generator');

let currentPassword = '';

function generate() {
  const length = parseInt(document.getElementById('lengthSlider').value);
  const options = {
    uppercase: document.getElementById('uppercase').checked,
    lowercase: document.getElementById('lowercase').checked,
    numbers: document.getElementById('numbers').checked,
    symbols: document.getElementById('symbols').checked,
  };
  currentPassword = generatePassword(length, options);
  document.getElementById('passwordDisplay').textContent = currentPassword;

  const strength = getStrength(currentPassword);
  const fill = document.getElementById('strengthFill');
  fill.style.width = strength.width;
  fill.style.background = strength.color;
  const label = document.getElementById('strengthLabel');
  label.textContent = strength.label;
  label.style.color = strength.color;
}

document.getElementById('generateBtn').addEventListener('click', generate);
document.getElementById('copyBtn').addEventListener('click', () => copyToClipboard(currentPassword));
document.getElementById('lengthSlider').addEventListener('input', (e) => {
  document.getElementById('lengthValue').textContent = e.target.value;
  generate();
});
document.querySelectorAll('#uppercase, #lowercase, #numbers, #symbols').forEach(el => {
  el.addEventListener('change', generate);
});

generate();
