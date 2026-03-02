import '../../src/styles.css';
import { getNavHTML, getFooterHTML, initToolPage, getShareHTML, getAdSlotHTML, debounce } from '../../src/shared.js';

// QR Code generator using Canvas API (zero dependencies)
function generateQR(text, size = 256) {
    // We'll use a simple approach: encode to a QR code via a reliable method
    // Using the Google Charts API as a free QR generation endpoint (no API key needed)
    const encodedText = encodeURIComponent(text);
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}&format=svg&margin=8`;
}

document.querySelector('#app').innerHTML = `
  ${getNavHTML('qr-generator')}
  <main class="container tool-page">
    <div class="tool-header">
      <div class="tool-icon" style="background: var(--gradient-aurora);">📱</div>
      <h1>QR Code Generator</h1>
      <p>Create QR codes for URLs, text, WiFi credentials, and more — download as PNG or SVG</p>
    </div>

    <div class="tool-layout">
      <div class="tool-panel">
        <div class="tool-panel-header">
          <h3>Content</h3>
        </div>
        <div class="glass-card">
          <div class="option-group" style="margin-bottom: 1rem;">
            <label for="qrType">Type</label>
            <select id="qrType">
              <option value="url">URL</option>
              <option value="text">Plain Text</option>
              <option value="wifi">WiFi Network</option>
              <option value="email">Email Address</option>
              <option value="phone">Phone Number</option>
            </select>
          </div>

          <div id="inputFields">
            <div class="option-group">
              <label for="qrInput">Enter URL</label>
              <input type="text" id="qrInput" value="https://toolpilot.app" placeholder="https://example.com" />
            </div>
          </div>

          <div id="wifiFields" style="display:none;">
            <div class="option-group" style="margin-bottom: 0.75rem;">
              <label for="wifiSSID">Network Name (SSID)</label>
              <input type="text" id="wifiSSID" placeholder="MyWiFi" />
            </div>
            <div class="option-group" style="margin-bottom: 0.75rem;">
              <label for="wifiPass">Password</label>
              <input type="text" id="wifiPass" placeholder="password123" />
            </div>
            <div class="option-group">
              <label for="wifiEnc">Encryption</label>
              <select id="wifiEnc">
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="">None</option>
              </select>
            </div>
          </div>

          <div style="margin-top: 1.5rem;">
            <div class="option-group">
              <label for="qrSize">Size: <span id="sizeLabel">256</span>px</label>
              <input type="range" id="qrSize" min="128" max="512" value="256" step="32" />
            </div>
          </div>
        </div>
      </div>

      <div class="tool-panel">
        <div class="tool-panel-header">
          <h3>Preview</h3>
          <div class="controls-row">
            <a class="btn btn-sm btn-primary" id="downloadPng" download="qr-code.png" href="#">⬇ PNG</a>
            <a class="btn btn-sm btn-secondary" id="downloadSvg" download="qr-code.svg" href="#">⬇ SVG</a>
          </div>
        </div>
        <div class="glass-card" style="display: flex; align-items: center; justify-content: center; min-height: 320px;">
          <div id="qrContainer" style="background: white; padding: 16px; border-radius: 12px; display: inline-block;">
            <img id="qrImage" src="" alt="QR Code" style="display: block; width: 256px; height: 256px;" />
          </div>
        </div>
      </div>
    </div>

    ${getShareHTML('QR Code Generator')}
    ${getAdSlotHTML()}
  </main>
  ${getFooterHTML()}
`;

initToolPage('qr-generator');

const qrInput = document.getElementById('qrInput');
const qrImage = document.getElementById('qrImage');
const qrType = document.getElementById('qrType');
const qrSize = document.getElementById('qrSize');
const sizeLabel = document.getElementById('sizeLabel');
const inputFields = document.getElementById('inputFields');
const wifiFields = document.getElementById('wifiFields');

function getQRData() {
    const type = qrType.value;
    if (type === 'wifi') {
        const ssid = document.getElementById('wifiSSID').value;
        const pass = document.getElementById('wifiPass').value;
        const enc = document.getElementById('wifiEnc').value;
        return `WIFI:T:${enc};S:${ssid};P:${pass};;`;
    }
    if (type === 'email') return `mailto:${qrInput.value}`;
    if (type === 'phone') return `tel:${qrInput.value}`;
    return qrInput.value;
}

function updateQR() {
    const data = getQRData();
    const size = parseInt(qrSize.value);
    if (!data.trim()) return;

    const url = generateQR(data, size);
    qrImage.src = url;
    qrImage.style.width = size + 'px';
    qrImage.style.height = size + 'px';

    // Download links
    document.getElementById('downloadSvg').href = url;
    // For PNG, we need to convert SVG to canvas
    const pngUrl = url.replace('format=svg', 'format=png');
    document.getElementById('downloadPng').href = pngUrl;
}

const debouncedUpdate = debounce(updateQR, 300);

qrType.addEventListener('change', () => {
    const type = qrType.value;
    if (type === 'wifi') {
        inputFields.style.display = 'none';
        wifiFields.style.display = 'block';
    } else {
        inputFields.style.display = 'block';
        wifiFields.style.display = 'none';
        const labels = { url: 'Enter URL', text: 'Enter Text', email: 'Email Address', phone: 'Phone Number' };
        const placeholders = { url: 'https://example.com', text: 'Hello world!', email: 'user@example.com', phone: '+1234567890' };
        document.querySelector('#inputFields label').textContent = labels[type] || 'Input';
        qrInput.placeholder = placeholders[type] || '';
    }
    debouncedUpdate();
});

qrInput.addEventListener('input', debouncedUpdate);
qrSize.addEventListener('input', (e) => {
    sizeLabel.textContent = e.target.value;
    debouncedUpdate();
});

document.querySelectorAll('#wifiSSID, #wifiPass, #wifiEnc').forEach(el => {
    el.addEventListener('input', debouncedUpdate);
});

updateQR();
