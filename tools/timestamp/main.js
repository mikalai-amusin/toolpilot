import { getNavHTML, getFooterHTML, getAdSlotHTML, getShareHTML, initToolPage, copyToClipboard } from '../../src/shared.js';

function getTimezones() {
    const zones = ['UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Kolkata', 'Australia/Sydney'];
    return zones.map(z => `<option value="${z}">${z.replace('_', ' ')}</option>`).join('');
}

document.getElementById('app').innerHTML = `
  ${getNavHTML('timestamp')}
  <main id="main-content" class="container tool-page">
    <div class="tool-header">
      <div class="tool-icon" style="background: var(--gradient-fire);">⏱️</div>
      <h1>Timestamp Converter</h1>
      <p>Convert between Unix timestamps and human-readable dates instantly</p>
    </div>

    <div class="glass-card" style="margin-bottom: 1.5rem; text-align: center; padding: 1.5rem;">
      <p style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 0.5rem;">Current Unix Timestamp</p>
      <div id="live-timestamp" style="font-size: 2.5rem; font-weight: 800; font-family: var(--font-mono); background: var(--gradient-aurora); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;"></div>
      <p id="live-date" style="color: var(--text-secondary); margin-top: 0.25rem;"></p>
      <button class="btn btn-sm btn-secondary" id="btn-use-now" style="margin-top: 0.75rem;">Use Current Time ↓</button>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
      <div class="glass-card">
        <h3 style="margin-bottom: 1rem;">Unix → Date</h3>
        <label for="ts-input">Unix Timestamp</label>
        <input type="text" id="ts-input" placeholder="e.g. 1709148000" style="font-family: var(--font-mono);">
        <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
          <label style="font-size: 0.8rem; display: flex; align-items: center; gap: 0.3rem; cursor: pointer;"><input type="radio" name="ts-unit" value="s" checked> Seconds</label>
          <label style="font-size: 0.8rem; display: flex; align-items: center; gap: 0.3rem; cursor: pointer;"><input type="radio" name="ts-unit" value="ms"> Milliseconds</label>
        </div>
        <div id="ts-result" style="margin-top: 1rem; font-family: var(--font-mono); font-size: 0.85rem;"></div>
      </div>

      <div class="glass-card">
        <h3 style="margin-bottom: 1rem;">Date → Unix</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
          <div><label for="date-input">Date</label><input type="date" id="date-input" style="font-family: var(--font-mono);"></div>
          <div><label for="time-input">Time</label><input type="time" id="time-input" value="00:00" step="1" style="font-family: var(--font-mono);"></div>
        </div>
        <div style="margin-top: 0.75rem;">
          <label for="tz-select">Timezone</label>
          <select id="tz-select">${getTimezones()}</select>
        </div>
        <div id="date-result" style="margin-top: 1rem; font-family: var(--font-mono); font-size: 0.85rem;"></div>
      </div>
    </div>

    <div class="glass-card" style="margin-top: 1.5rem;">
      <h3 style="margin-bottom: 1rem;">Quick Reference</h3>
      <div id="quick-ref" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem;"></div>
    </div>

    ${getShareHTML('Timestamp Converter')}
    ${getAdSlotHTML()}

    <section class="seo-content glass-card" style="margin-top: 2rem;">
      <h2>What is a Unix Timestamp?</h2>
      <p>A <strong>Unix timestamp</strong> (also called Epoch time or POSIX time) is the number of seconds that have elapsed since <strong>January 1, 1970, 00:00:00 UTC</strong>. It's the standard way computers track time internally, used in databases, APIs, log files, and programming languages worldwide.</p>
      <h3>Why Convert Timestamps?</h3>
      <p>Developers frequently need to convert between Unix timestamps and human-readable dates when debugging APIs, reading server logs, working with databases, or setting cookie and token expiration times. This tool makes that conversion instant and supports both seconds and milliseconds precision.</p>
    </section>
  </main>
  ${getFooterHTML()}
`;

initToolPage('timestamp');

// Live clock
function updateLive() {
    const now = Math.floor(Date.now() / 1000);
    document.getElementById('live-timestamp').textContent = now;
    document.getElementById('live-date').textContent = new Date().toLocaleString();
}
updateLive();
setInterval(updateLive, 1000);

document.getElementById('btn-use-now').addEventListener('click', () => {
    document.getElementById('ts-input').value = Math.floor(Date.now() / 1000);
    convertTimestamp();
});

// Unix → Date
function convertTimestamp() {
    const val = document.getElementById('ts-input').value.trim();
    const resultEl = document.getElementById('ts-result');
    if (!val || isNaN(val)) { resultEl.innerHTML = ''; return; }

    const unit = document.querySelector('input[name="ts-unit"]:checked').value;
    const ms = unit === 'ms' ? parseInt(val) : parseInt(val) * 1000;
    const d = new Date(ms);

    if (isNaN(d.getTime())) { resultEl.innerHTML = '<span style="color: var(--error);">Invalid timestamp</span>'; return; }

    resultEl.innerHTML = `
    <div style="background: var(--bg-input); padding: 0.75rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
      <div style="margin-bottom: 0.5rem;"><span style="color: var(--text-muted);">UTC:</span> <span style="color: var(--accent-primary);">${d.toUTCString()}</span></div>
      <div style="margin-bottom: 0.5rem;"><span style="color: var(--text-muted);">Local:</span> <span style="color: var(--accent-primary);">${d.toLocaleString()}</span></div>
      <div style="margin-bottom: 0.5rem;"><span style="color: var(--text-muted);">ISO:</span> <span style="color: var(--accent-tertiary);">${d.toISOString()}</span></div>
      <div><span style="color: var(--text-muted);">Relative:</span> <span>${getRelativeTime(d)}</span></div>
      <button class="btn btn-sm btn-secondary" style="margin-top: 0.5rem;" onclick="navigator.clipboard.writeText('${d.toISOString()}').then(()=>this.textContent='✓ Copied!').catch(()=>{})">📋 Copy ISO</button>
    </div>
  `;
}

function getRelativeTime(d) {
    const now = Date.now();
    const diff = Math.abs(now - d.getTime());
    const past = d.getTime() < now;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    let str;
    if (mins < 1) str = 'just now';
    else if (mins < 60) str = `${mins} minute${mins !== 1 ? 's' : ''}`;
    else if (hours < 24) str = `${hours} hour${hours !== 1 ? 's' : ''}`;
    else if (days < 365) str = `${days} day${days !== 1 ? 's' : ''}`;
    else str = `${Math.floor(days / 365)} year${Math.floor(days / 365) !== 1 ? 's' : ''}`;
    if (str === 'just now') return str;
    return past ? `${str} ago` : `in ${str}`;
}

document.getElementById('ts-input').addEventListener('input', convertTimestamp);
document.querySelectorAll('input[name="ts-unit"]').forEach(r => r.addEventListener('change', convertTimestamp));

// Date → Unix
function convertDate() {
    const dateVal = document.getElementById('date-input').value;
    const timeVal = document.getElementById('time-input').value;
    const resultEl = document.getElementById('date-result');
    if (!dateVal) { resultEl.innerHTML = ''; return; }

    const d = new Date(`${dateVal}T${timeVal || '00:00:00'}`);
    if (isNaN(d.getTime())) { resultEl.innerHTML = '<span style="color: var(--error);">Invalid date</span>'; return; }

    const unix = Math.floor(d.getTime() / 1000);
    const unixMs = d.getTime();

    resultEl.innerHTML = `
    <div style="background: var(--bg-input); padding: 0.75rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
      <div style="margin-bottom: 0.5rem;"><span style="color: var(--text-muted);">Seconds:</span> <span style="color: var(--accent-primary); font-weight: 600;">${unix}</span></div>
      <div style="margin-bottom: 0.5rem;"><span style="color: var(--text-muted);">Milliseconds:</span> <span style="color: var(--accent-tertiary);">${unixMs}</span></div>
      <button class="btn btn-sm btn-secondary" style="margin-top: 0.25rem;" onclick="navigator.clipboard.writeText('${unix}').then(()=>this.textContent='✓ Copied!').catch(()=>{})">📋 Copy Timestamp</button>
    </div>
  `;
}

document.getElementById('date-input').addEventListener('input', convertDate);
document.getElementById('time-input').addEventListener('input', convertDate);
document.getElementById('tz-select').addEventListener('change', convertDate);

// Quick reference
const refs = [
    { label: 'Now', ts: () => Math.floor(Date.now() / 1000) },
    { label: '+1 Hour', ts: () => Math.floor(Date.now() / 1000) + 3600 },
    { label: '+1 Day', ts: () => Math.floor(Date.now() / 1000) + 86400 },
    { label: '+1 Week', ts: () => Math.floor(Date.now() / 1000) + 604800 },
    { label: '+30 Days', ts: () => Math.floor(Date.now() / 1000) + 2592000 },
    { label: 'Start of Today', ts: () => { const d = new Date(); d.setHours(0, 0, 0, 0); return Math.floor(d.getTime() / 1000); } },
];

document.getElementById('quick-ref').innerHTML = refs.map(r => {
    const ts = r.ts();
    return `<div style="background: var(--bg-input); padding: 0.6rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); cursor: pointer;" class="ref-chip" data-ts="${ts}"><div style="font-size: 0.75rem; color: var(--text-muted);">${r.label}</div><div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent-primary);">${ts}</div></div>`;
}).join('');

document.querySelectorAll('.ref-chip').forEach(el => {
    el.addEventListener('click', () => {
        document.getElementById('ts-input').value = el.dataset.ts;
        convertTimestamp();
    });
});

// Set default date
const today = new Date();
document.getElementById('date-input').value = today.toISOString().split('T')[0];
document.getElementById('time-input').value = today.toTimeString().slice(0, 8);

// Responsive + SEO styles
const style = document.createElement('style');
style.textContent = `@media (max-width: 768px) { main > div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; } } .seo-content { font-size: 0.9rem; line-height: 1.7; color: var(--text-secondary); } .seo-content h2 { color: var(--text-primary); margin-bottom: 0.75rem; } .seo-content h3 { color: var(--text-primary); margin: 1rem 0 0.5rem; }`;
document.head.appendChild(style);

convertTimestamp();
convertDate();
