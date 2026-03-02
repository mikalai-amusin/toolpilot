import { getNavHTML, getFooterHTML, getAdSlotHTML, getShareHTML, initToolPage, copyToClipboard } from '../../src/shared.js';

document.getElementById('app').innerHTML = `
  ${getNavHTML('hash-generator')}
  <main id="main-content" class="container tool-page">
    <div class="tool-header">
      <div class="tool-icon" style="background: var(--gradient-emerald);">🔐</div>
      <h1>Hash Generator</h1>
      <p>Generate MD5, SHA-1, SHA-256, and SHA-512 hashes instantly using the Web Crypto API</p>
    </div>

    <div class="glass-card" style="margin-bottom: 1.5rem;">
      <label for="hash-input">Input Text</label>
      <textarea id="hash-input" rows="5" placeholder="Type or paste text to hash..."></textarea>
      <div style="display: flex; gap: 0.75rem; margin-top: 1rem; flex-wrap: wrap;">
        <button class="btn btn-primary" id="btn-hash">🔐 Generate Hashes</button>
        <button class="btn btn-secondary" id="btn-clear">🗑️ Clear</button>
        <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; color: var(--text-secondary); margin-left: auto; cursor: pointer;">
          <input type="checkbox" id="auto-hash" checked> Auto-generate
        </label>
      </div>
    </div>

    <div id="hash-results" style="display: grid; gap: 1rem;"></div>

    <div class="glass-card" style="margin-top: 1.5rem;">
      <h3 style="margin-bottom: 1rem;">🔎 Compare Hashes</h3>
      <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">Paste two hashes below to check if they match.</p>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
        <div>
          <label for="compare-a">Hash A</label>
          <input type="text" id="compare-a" placeholder="Paste first hash..." style="font-family: var(--font-mono); font-size: 0.8rem;">
        </div>
        <div>
          <label for="compare-b">Hash B</label>
          <input type="text" id="compare-b" placeholder="Paste second hash..." style="font-family: var(--font-mono); font-size: 0.8rem;">
        </div>
      </div>
      <div id="compare-result" style="margin-top: 0.75rem; font-weight: 600; font-size: 0.9rem;"></div>
    </div>

    ${getShareHTML('Hash Generator')}
    ${getAdSlotHTML()}
  </main>
  ${getFooterHTML()}
`;

initToolPage('hash-generator');

const ALGORITHMS = [
    { name: 'MD5', id: 'md5' },
    { name: 'SHA-1', id: 'SHA-1' },
    { name: 'SHA-256', id: 'SHA-256' },
    { name: 'SHA-512', id: 'SHA-512' },
];

// Lightweight MD5 implementation (Web Crypto doesn't support MD5)
function md5(string) {
    function md5cycle(x, k) {
        let a = x[0], b = x[1], c = x[2], d = x[3];
        a = ff(a, b, c, d, k[0], 7, -680876936); d = ff(d, a, b, c, k[1], 12, -389564586);
        c = ff(c, d, a, b, k[2], 17, 606105819); b = ff(b, c, d, a, k[3], 22, -1044525330);
        a = ff(a, b, c, d, k[4], 7, -176418897); d = ff(d, a, b, c, k[5], 12, 1200080426);
        c = ff(c, d, a, b, k[6], 17, -1473231341); b = ff(b, c, d, a, k[7], 22, -45705983);
        a = ff(a, b, c, d, k[8], 7, 1770035416); d = ff(d, a, b, c, k[9], 12, -1958414417);
        c = ff(c, d, a, b, k[10], 17, -42063); b = ff(b, c, d, a, k[11], 22, -1990404162);
        a = ff(a, b, c, d, k[12], 7, 1804603682); d = ff(d, a, b, c, k[13], 12, -40341101);
        c = ff(c, d, a, b, k[14], 17, -1502002290); b = ff(b, c, d, a, k[15], 22, 1236535329);
        a = gg(a, b, c, d, k[1], 5, -165796510); d = gg(d, a, b, c, k[6], 9, -1069501632);
        c = gg(c, d, a, b, k[11], 14, 643717713); b = gg(b, c, d, a, k[0], 20, -373897302);
        a = gg(a, b, c, d, k[5], 5, -701558691); d = gg(d, a, b, c, k[10], 9, 38016083);
        c = gg(c, d, a, b, k[15], 14, -660478335); b = gg(b, c, d, a, k[4], 20, -405537848);
        a = gg(a, b, c, d, k[9], 5, 568446438); d = gg(d, a, b, c, k[14], 9, -1019803690);
        c = gg(c, d, a, b, k[3], 14, -187363961); b = gg(b, c, d, a, k[8], 20, 1163531501);
        a = gg(a, b, c, d, k[13], 5, -1444681467); d = gg(d, a, b, c, k[2], 9, -51403784);
        c = gg(c, d, a, b, k[7], 14, 1735328473); b = gg(b, c, d, a, k[12], 20, -1926607734);
        a = hh(a, b, c, d, k[5], 4, -378558); d = hh(d, a, b, c, k[8], 11, -2022574463);
        c = hh(c, d, a, b, k[11], 16, 1839030562); b = hh(b, c, d, a, k[14], 23, -35309556);
        a = hh(a, b, c, d, k[1], 4, -1530992060); d = hh(d, a, b, c, k[4], 11, 1272893353);
        c = hh(c, d, a, b, k[7], 16, -155497632); b = hh(b, c, d, a, k[10], 23, -1094730640);
        a = hh(a, b, c, d, k[13], 4, 681279174); d = hh(d, a, b, c, k[0], 11, -358537222);
        c = hh(c, d, a, b, k[3], 16, -722521979); b = hh(b, c, d, a, k[6], 23, 76029189);
        a = hh(a, b, c, d, k[9], 4, -640364487); d = hh(d, a, b, c, k[12], 11, -421815835);
        c = hh(c, d, a, b, k[15], 16, 530742520); b = hh(b, c, d, a, k[2], 23, -995338651);
        a = ii(a, b, c, d, k[0], 6, -198630844); d = ii(d, a, b, c, k[7], 10, 1126891415);
        c = ii(c, d, a, b, k[14], 15, -1416354905); b = ii(b, c, d, a, k[5], 21, -57434055);
        a = ii(a, b, c, d, k[12], 6, 1700485571); d = ii(d, a, b, c, k[3], 10, -1894986606);
        c = ii(c, d, a, b, k[10], 15, -1051523); b = ii(b, c, d, a, k[1], 21, -2054922799);
        a = ii(a, b, c, d, k[8], 6, 1873313359); d = ii(d, a, b, c, k[15], 10, -30611744);
        c = ii(c, d, a, b, k[6], 15, -1560198380); b = ii(b, c, d, a, k[13], 21, 1309151649);
        a = ii(a, b, c, d, k[4], 6, -145523070); d = ii(d, a, b, c, k[11], 10, -1120210379);
        c = ii(c, d, a, b, k[2], 15, 718787259); b = ii(b, c, d, a, k[9], 21, -343485551);
        x[0] = add32(a, x[0]); x[1] = add32(b, x[1]); x[2] = add32(c, x[2]); x[3] = add32(d, x[3]);
    }
    function cmn(q, a, b, x, s, t) { a = add32(add32(a, q), add32(x, t)); return add32((a << s) | (a >>> (32 - s)), b); }
    function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
    function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
    function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
    function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
    function md5blk(s) {
        const md5blks = []; let i;
        for (i = 0; i < 64; i += 4) md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
        return md5blks;
    }
    const hex_chr = '0123456789abcdef'.split('');
    function rhex(n) { let s = '', j = 0; for (; j < 4; j++) s += hex_chr[(n >> (j * 8 + 4)) & 0x0f] + hex_chr[(n >> (j * 8)) & 0x0f]; return s; }
    function hex(x) { for (let i = 0; i < x.length; i++) x[i] = rhex(x[i]); return x.join(''); }
    function add32(a, b) { return (a + b) & 0xffffffff; }

    let n = string.length, state = [1732584193, -271733879, -1732584194, 271733878], i;
    for (i = 64; i <= n; i += 64) md5cycle(state, md5blk(string.substring(i - 64, i)));
    string = string.substring(i - 64);
    const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; let sl = string.length;
    for (i = 0; i < sl; i++) tail[i >> 2] |= string.charCodeAt(i) << ((i % 4) << 3);
    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
    if (i > 55) { md5cycle(state, tail); for (i = 0; i < 16; i++) tail[i] = 0; }
    tail[14] = n * 8;
    md5cycle(state, tail);
    return hex(state);
}

async function hashWithCrypto(algorithm, text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function generateAllHashes(text) {
    const results = [];
    // MD5 (custom implementation)
    results.push({ name: 'MD5', hash: md5(text), length: 32 });
    // SHA algorithms via Web Crypto API
    for (const algo of ['SHA-1', 'SHA-256', 'SHA-512']) {
        const hash = await hashWithCrypto(algo, text);
        results.push({ name: algo, hash, length: hash.length });
    }
    return results;
}

const hashResults = document.getElementById('hash-results');
const hashInput = document.getElementById('hash-input');
const autoHash = document.getElementById('auto-hash');

function renderResults(results) {
    if (!results.length) {
        hashResults.innerHTML = '<div class="glass-card" style="text-align:center; color: var(--text-muted);">Enter some text and click "Generate Hashes" to see results.</div>';
        return;
    }
    hashResults.innerHTML = results.map(r => `
    <div class="glass-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
        <h3 style="margin: 0; font-size: 1rem;">${r.name} <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 400;">(${r.length} chars)</span></h3>
        <button class="btn btn-sm btn-secondary copy-hash-btn" data-hash="${r.hash}">📋 Copy</button>
      </div>
      <div style="font-family: var(--font-mono); font-size: 0.78rem; background: var(--bg-input); padding: 0.75rem; border-radius: var(--radius-md); word-break: break-all; color: var(--accent-primary); border: 1px solid var(--border-color); line-height: 1.6; user-select: all;">${r.hash}</div>
    </div>
  `).join('');

    document.querySelectorAll('.copy-hash-btn').forEach(btn => {
        btn.addEventListener('click', () => copyToClipboard(btn.dataset.hash));
    });
}

async function doHash() {
    const text = hashInput.value;
    if (!text) { renderResults([]); return; }
    const results = await generateAllHashes(text);
    renderResults(results);
}

document.getElementById('btn-hash').addEventListener('click', doHash);
document.getElementById('btn-clear').addEventListener('click', () => {
    hashInput.value = '';
    renderResults([]);
});

let hashTimeout;
hashInput.addEventListener('input', () => {
    if (!autoHash.checked) return;
    clearTimeout(hashTimeout);
    hashTimeout = setTimeout(doHash, 200);
});

// Compare hashes
const compareA = document.getElementById('compare-a');
const compareB = document.getElementById('compare-b');
const compareResult = document.getElementById('compare-result');

function compareHashes() {
    const a = compareA.value.trim().toLowerCase();
    const b = compareB.value.trim().toLowerCase();
    if (!a || !b) { compareResult.innerHTML = ''; return; }
    if (a === b) {
        compareResult.innerHTML = '<span style="color: var(--success);">✅ Hashes match!</span>';
    } else {
        compareResult.innerHTML = '<span style="color: var(--error);">❌ Hashes do NOT match.</span>';
    }
}
compareA.addEventListener('input', compareHashes);
compareB.addEventListener('input', compareHashes);

// Responsive
const style = document.createElement('style');
style.textContent = `@media (max-width: 768px) { #hash-results > div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; } .glass-card > div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; } }`;
document.head.appendChild(style);

renderResults([]);
