import { getNavHTML, getFooterHTML, getAdSlotHTML, getShareHTML, initToolPage, copyToClipboard } from '../../src/shared.js';

const SAMPLE_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzA5MTQ4MDAwLCJleHAiOjE3MDkyMzQ0MDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

function base64UrlDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    const pad = str.length % 4;
    if (pad) str += '='.repeat(4 - pad);
    try {
        return JSON.parse(atob(str));
    } catch (e) {
        return null;
    }
}

function formatJSON(obj) {
    return JSON.stringify(obj, null, 2);
}

function getExpStatus(payload) {
    if (!payload || !payload.exp) return { text: 'No expiration set', color: 'var(--text-muted)', icon: '⏳' };
    const expDate = new Date(payload.exp * 1000);
    const now = new Date();
    if (expDate < now) {
        const ago = Math.floor((now - expDate) / 60000);
        const timeStr = ago < 60 ? `${ago}m ago` : ago < 1440 ? `${Math.floor(ago / 60)}h ago` : `${Math.floor(ago / 1440)}d ago`;
        return { text: `Expired ${timeStr} (${expDate.toLocaleString()})`, color: 'var(--error)', icon: '❌' };
    }
    const inMin = Math.floor((expDate - now) / 60000);
    const timeStr = inMin < 60 ? `in ${inMin}m` : inMin < 1440 ? `in ${Math.floor(inMin / 60)}h` : `in ${Math.floor(inMin / 1440)}d`;
    return { text: `Valid — expires ${timeStr} (${expDate.toLocaleString()})`, color: 'var(--success)', icon: '✅' };
}

document.getElementById('app').innerHTML = `
  ${getNavHTML('jwt-decoder')}
  <main id="main-content" class="container tool-page">
    <div class="tool-header">
      <div class="tool-icon" style="background: var(--gradient-sunset);">🎫</div>
      <h1>JWT Decoder</h1>
      <p>Decode and inspect JSON Web Tokens — view header, payload, and expiration status</p>
    </div>

    <div class="glass-card" style="margin-bottom: 1.5rem;">
      <label for="jwt-input">Paste JWT Token</label>
      <textarea id="jwt-input" rows="4" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." style="font-size: 0.8rem; word-break: break-all;">${SAMPLE_JWT}</textarea>
      <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
        <button class="btn btn-primary" id="btn-decode">🔓 Decode</button>
        <button class="btn btn-secondary" id="btn-sample">📄 Sample</button>
        <button class="btn btn-secondary" id="btn-clear">🗑️ Clear</button>
      </div>
    </div>

    <div id="jwt-error" style="display: none; margin-bottom: 1rem;"></div>
    <div id="jwt-expiry" style="display: none; margin-bottom: 1.5rem;"></div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;" id="jwt-results">
      <div class="glass-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <h3 style="margin: 0;">Header</h3>
          <button class="btn btn-sm btn-secondary" id="btn-copy-header">📋 Copy</button>
        </div>
        <pre id="jwt-header" style="font-family: var(--font-mono); font-size: 0.8rem; background: var(--bg-input); padding: 1rem; border-radius: var(--radius-md); overflow-x: auto; line-height: 1.6; border: 1px solid var(--border-color); color: var(--accent-primary); min-height: 80px;"></pre>
      </div>
      <div class="glass-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <h3 style="margin: 0;">Payload</h3>
          <button class="btn btn-sm btn-secondary" id="btn-copy-payload">📋 Copy</button>
        </div>
        <pre id="jwt-payload" style="font-family: var(--font-mono); font-size: 0.8rem; background: var(--bg-input); padding: 1rem; border-radius: var(--radius-md); overflow-x: auto; line-height: 1.6; border: 1px solid var(--border-color); color: var(--accent-primary); min-height: 80px;"></pre>
      </div>
    </div>

    <div class="glass-card" style="margin-top: 1.5rem;" id="jwt-claims" style="display: none;"></div>

    ${getShareHTML('JWT Decoder')}
    ${getAdSlotHTML()}

    <section class="seo-content glass-card" style="margin-top: 2rem;">
      <h2>What is a JWT?</h2>
      <p>A <strong>JSON Web Token (JWT)</strong> is a compact, URL-safe way to represent claims between two parties. JWTs are commonly used for authentication — when a user logs in, the server issues a JWT that the client sends with every subsequent request.</p>
      <p>A JWT has three parts separated by dots: <strong>Header</strong> (algorithm & type), <strong>Payload</strong> (claims like user ID, role, and expiry), and <strong>Signature</strong> (verifies the token hasn't been tampered with). This tool decodes the header and payload — the signature can only be verified with the secret key.</p>
      <h3>Common JWT Claims</h3>
      <ul>
        <li><strong>sub</strong> — Subject (usually user ID)</li>
        <li><strong>iat</strong> — Issued At (Unix timestamp)</li>
        <li><strong>exp</strong> — Expiration Time</li>
        <li><strong>iss</strong> — Issuer</li>
        <li><strong>aud</strong> — Audience</li>
      </ul>
    </section>
  </main>
  ${getFooterHTML()}
`;

initToolPage('jwt-decoder');

function decode() {
    const token = document.getElementById('jwt-input').value.trim();
    const errorEl = document.getElementById('jwt-error');
    const expiryEl = document.getElementById('jwt-expiry');
    const headerEl = document.getElementById('jwt-header');
    const payloadEl = document.getElementById('jwt-payload');
    const claimsEl = document.getElementById('jwt-claims');

    errorEl.style.display = 'none';
    expiryEl.style.display = 'none';

    if (!token) {
        headerEl.textContent = '';
        payloadEl.textContent = '';
        claimsEl.innerHTML = '';
        return;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
        errorEl.innerHTML = '<div class="glass-card" style="border-color: var(--error); color: var(--error);">⚠️ Invalid JWT — must have 3 parts separated by dots (header.payload.signature)</div>';
        errorEl.style.display = 'block';
        headerEl.textContent = '';
        payloadEl.textContent = '';
        return;
    }

    const header = base64UrlDecode(parts[0]);
    const payload = base64UrlDecode(parts[1]);

    if (!header) {
        errorEl.innerHTML = '<div class="glass-card" style="border-color: var(--error); color: var(--error);">⚠️ Could not decode the JWT header</div>';
        errorEl.style.display = 'block';
        return;
    }

    headerEl.textContent = formatJSON(header);
    payloadEl.textContent = payload ? formatJSON(payload) : 'Could not decode payload';

    // Expiry status
    if (payload) {
        const exp = getExpStatus(payload);
        expiryEl.innerHTML = `<div class="glass-card" style="border-left: 4px solid ${exp.color}; display: flex; align-items: center; gap: 0.75rem;"><span style="font-size: 1.3rem;">${exp.icon}</span><span style="font-size: 0.9rem; color: ${exp.color}; font-weight: 600;">${exp.text}</span></div>`;
        expiryEl.style.display = 'block';

        // Claims breakdown
        const claimsList = Object.entries(payload).map(([k, v]) => {
            let label = k;
            const knownClaims = { sub: 'Subject', iat: 'Issued At', exp: 'Expiration', iss: 'Issuer', aud: 'Audience', nbf: 'Not Before', jti: 'JWT ID', name: 'Name', email: 'Email', role: 'Role' };
            if (knownClaims[k]) label = `${k} (${knownClaims[k]})`;
            let display = typeof v === 'object' ? JSON.stringify(v) : String(v);
            if ((k === 'iat' || k === 'exp' || k === 'nbf') && typeof v === 'number') display = `${v} → ${new Date(v * 1000).toLocaleString()}`;
            return `<tr><td style="padding: 0.4rem 0.6rem; color: var(--accent-primary); font-weight: 600;">${label}</td><td style="padding: 0.4rem 0.6rem;">${display}</td></tr>`;
        }).join('');

        claimsEl.innerHTML = `<h3 style="margin-bottom: 0.75rem;">Claims Breakdown</h3><table style="width:100%; border-collapse: collapse; font-size: 0.85rem;"><tbody>${claimsList}</tbody></table>`;
    }
}

document.getElementById('btn-decode').addEventListener('click', decode);
document.getElementById('btn-sample').addEventListener('click', () => { document.getElementById('jwt-input').value = SAMPLE_JWT; decode(); });
document.getElementById('btn-clear').addEventListener('click', () => { document.getElementById('jwt-input').value = ''; decode(); });
document.getElementById('btn-copy-header').addEventListener('click', () => copyToClipboard(document.getElementById('jwt-header').textContent));
document.getElementById('btn-copy-payload').addEventListener('click', () => copyToClipboard(document.getElementById('jwt-payload').textContent));

document.getElementById('jwt-input').addEventListener('input', decode);

// Responsive
const style = document.createElement('style');
style.textContent = `@media (max-width: 768px) { #jwt-results { grid-template-columns: 1fr !important; } } .seo-content { font-size: 0.9rem; line-height: 1.7; color: var(--text-secondary); } .seo-content h2 { color: var(--text-primary); margin-bottom: 0.75rem; } .seo-content h3 { color: var(--text-primary); margin: 1rem 0 0.5rem; } .seo-content ul { padding-left: 1.5rem; } .seo-content li { margin-bottom: 0.3rem; }`;
document.head.appendChild(style);

decode();
