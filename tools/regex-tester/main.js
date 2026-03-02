import { getNavHTML, getFooterHTML, getAdSlotHTML, getShareHTML, initToolPage, copyToClipboard, debounce } from '../../src/shared.js';

const COMMON_PATTERNS = [
    { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', flags: 'g' },
    { name: 'URL', pattern: 'https?://[^\\s/$.?#].[^\\s]*', flags: 'gi' },
    { name: 'Phone (US)', pattern: '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}', flags: 'g' },
    { name: 'IPv4', pattern: '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b', flags: 'g' },
    { name: 'Hex Color', pattern: '#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\\b', flags: 'g' },
    { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])', flags: 'g' },
    { name: 'HTML Tags', pattern: '<[^>]+>', flags: 'g' },
    { name: 'Numbers Only', pattern: '\\d+', flags: 'g' },
];

const SAMPLE_TEXT = `Hello World!
Contact us at support@toolpilot.app or admin@example.com
Visit https://toolpilot-mu.vercel.app for more info.
Call us: (555) 123-4567 or 555.987.6543
Server IPs: 192.168.1.1 and 10.0.0.255
Colors: #ff6600 and #333
Dates: 2026-03-02 and 2025-12-25`;

document.getElementById('app').innerHTML = `
  ${getNavHTML('regex-tester')}
  <main id="main-content" class="container tool-page">
    <div class="tool-header">
      <div class="tool-icon" style="background: var(--gradient-fire);">🔍</div>
      <h1>Regex Tester</h1>
      <p>Test regular expressions with live match highlighting and group capture</p>
    </div>

    <div class="glass-card" style="margin-bottom: 1.5rem;">
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: flex-end; margin-bottom: 1.25rem;">
        <div style="flex: 1; min-width: 200px;">
          <label for="regex-input">Regular Expression</label>
          <input type="text" id="regex-input" placeholder="Enter regex pattern..." value="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" style="font-family: var(--font-mono);">
        </div>
        <div style="width: 100px;">
          <label for="regex-flags">Flags</label>
          <input type="text" id="regex-flags" placeholder="gi" value="g" maxlength="6" style="font-family: var(--font-mono); text-align: center;">
        </div>
      </div>

      <label>Common Patterns</label>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
        ${COMMON_PATTERNS.map(p => `<button class="btn btn-sm btn-secondary pattern-btn" data-pattern="${p.pattern}" data-flags="${p.flags}">${p.name}</button>`).join('')}
      </div>

      <div style="display: flex; gap: 0.75rem; margin-bottom: 1.25rem; flex-wrap: wrap;">
        <button class="btn btn-sm btn-secondary" id="btn-sample">📄 Load Sample</button>
        <button class="btn btn-sm btn-secondary" id="btn-clear">🗑️ Clear</button>
      </div>

      <label for="test-string">Test String</label>
      <textarea id="test-string" rows="8" placeholder="Enter text to test against...">${SAMPLE_TEXT}</textarea>
    </div>

    <div class="glass-card" style="margin-bottom: 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h3 style="margin: 0;">Results</h3>
        <div id="match-count" style="font-size: 0.85rem; color: var(--text-secondary);"></div>
      </div>
      <div id="result-highlight" style="font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.8; white-space: pre-wrap; word-break: break-word; padding: 1rem; background: var(--bg-input); border-radius: var(--radius-md); min-height: 80px; border: 1px solid var(--border-color);"></div>
    </div>

    <div class="glass-card" style="margin-bottom: 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h3 style="margin: 0;">Match Details</h3>
        <button class="btn btn-sm btn-secondary" id="btn-copy-matches">📋 Copy Matches</button>
      </div>
      <div id="match-details" style="font-family: var(--font-mono); font-size: 0.8rem; max-height: 300px; overflow-y: auto;"></div>
    </div>

    ${getShareHTML('Regex Tester')}
    ${getAdSlotHTML()}
  </main>
  ${getFooterHTML()}
`;

initToolPage('regex-tester');

const regexInput = document.getElementById('regex-input');
const flagsInput = document.getElementById('regex-flags');
const testString = document.getElementById('test-string');
const resultHighlight = document.getElementById('result-highlight');
const matchCount = document.getElementById('match-count');
const matchDetails = document.getElementById('match-details');

function escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function testRegex() {
    const pattern = regexInput.value;
    const flags = flagsInput.value;
    const text = testString.value;

    if (!pattern || !text) {
        resultHighlight.innerHTML = escapeHTML(text || '');
        matchCount.textContent = '';
        matchDetails.innerHTML = '<span style="color: var(--text-muted);">Enter a pattern and test string to see matches.</span>';
        return;
    }

    let regex;
    try {
        regex = new RegExp(pattern, flags);
    } catch (e) {
        resultHighlight.innerHTML = `<span style="color: var(--error);">⚠️ Invalid regex: ${escapeHTML(e.message)}</span>`;
        matchCount.textContent = '';
        matchDetails.innerHTML = '';
        return;
    }

    // Highlight matches
    const matches = [];
    let highlighted = '';
    let lastIndex = 0;
    const globalRegex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
    let match;

    while ((match = globalRegex.exec(text)) !== null) {
        matches.push({ value: match[0], index: match.index, groups: match.slice(1) });
        highlighted += escapeHTML(text.slice(lastIndex, match.index));
        highlighted += `<mark style="background: rgba(124, 106, 239, 0.3); color: var(--text-primary); padding: 1px 3px; border-radius: 3px; border-bottom: 2px solid var(--accent-primary);">${escapeHTML(match[0])}</mark>`;
        lastIndex = match.index + match[0].length;
        if (match[0].length === 0) { globalRegex.lastIndex++; }
        if (matches.length > 500) break;
    }
    highlighted += escapeHTML(text.slice(lastIndex));

    resultHighlight.innerHTML = highlighted || escapeHTML(text);
    matchCount.textContent = `${matches.length} match${matches.length !== 1 ? 'es' : ''} found`;
    matchCount.style.color = matches.length > 0 ? 'var(--success)' : 'var(--text-muted)';

    // Match details table
    if (matches.length === 0) {
        matchDetails.innerHTML = '<span style="color: var(--text-muted);">No matches found.</span>';
    } else {
        matchDetails.innerHTML = `
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 1px solid var(--border-color);">
            <th style="text-align: left; padding: 0.4rem 0.6rem; color: var(--text-secondary); font-size: 0.75rem;">#</th>
            <th style="text-align: left; padding: 0.4rem 0.6rem; color: var(--text-secondary); font-size: 0.75rem;">Match</th>
            <th style="text-align: left; padding: 0.4rem 0.6rem; color: var(--text-secondary); font-size: 0.75rem;">Index</th>
            ${matches.some(m => m.groups.length) ? '<th style="text-align: left; padding: 0.4rem 0.6rem; color: var(--text-secondary); font-size: 0.75rem;">Groups</th>' : ''}
          </tr>
        </thead>
        <tbody>
          ${matches.slice(0, 100).map((m, i) => `
            <tr style="border-bottom: 1px solid rgba(120,120,255,0.05);">
              <td style="padding: 0.4rem 0.6rem; color: var(--text-muted);">${i + 1}</td>
              <td style="padding: 0.4rem 0.6rem; color: var(--accent-primary);">"${escapeHTML(m.value)}"</td>
              <td style="padding: 0.4rem 0.6rem; color: var(--text-secondary);">${m.index}</td>
              ${m.groups.length ? `<td style="padding: 0.4rem 0.6rem; color: var(--text-secondary);">${m.groups.map((g, j) => `<span style="color: var(--accent-tertiary);">$${j + 1}:</span> "${escapeHTML(g || '')}"`).join(', ')}</td>` : ''}
            </tr>
          `).join('')}
        </tbody>
      </table>
      ${matches.length > 100 ? `<p style="margin-top: 0.5rem; color: var(--text-muted); font-size: 0.75rem;">Showing first 100 of ${matches.length} matches.</p>` : ''}
    `;
    }
}

const debouncedTest = debounce(testRegex, 150);
regexInput.addEventListener('input', debouncedTest);
flagsInput.addEventListener('input', debouncedTest);
testString.addEventListener('input', debouncedTest);

document.querySelectorAll('.pattern-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        regexInput.value = btn.dataset.pattern;
        flagsInput.value = btn.dataset.flags;
        testRegex();
    });
});

document.getElementById('btn-sample').addEventListener('click', () => {
    testString.value = SAMPLE_TEXT;
    testRegex();
});

document.getElementById('btn-clear').addEventListener('click', () => {
    regexInput.value = '';
    flagsInput.value = 'g';
    testString.value = '';
    testRegex();
});

document.getElementById('btn-copy-matches').addEventListener('click', () => {
    const pattern = regexInput.value;
    const flags = flagsInput.value;
    const text = testString.value;
    if (!pattern || !text) return;
    try {
        const regex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
        const matches = [...text.matchAll(regex)].map(m => m[0]);
        copyToClipboard(matches.join('\n'));
    } catch { /* ignore */ }
});

// Run initial test
testRegex();
