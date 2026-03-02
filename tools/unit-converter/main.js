import '../../src/styles.css';
import { getNavHTML, getFooterHTML, initToolPage, copyToClipboard, getShareHTML, getAdSlotHTML } from '../../src/shared.js';

const CATEGORIES = {
    length: {
        label: 'Length',
        units: {
            mm: { name: 'Millimeters', factor: 0.001 },
            cm: { name: 'Centimeters', factor: 0.01 },
            m: { name: 'Meters', factor: 1 },
            km: { name: 'Kilometers', factor: 1000 },
            in: { name: 'Inches', factor: 0.0254 },
            ft: { name: 'Feet', factor: 0.3048 },
            yd: { name: 'Yards', factor: 0.9144 },
            mi: { name: 'Miles', factor: 1609.344 },
        },
    },
    weight: {
        label: 'Weight',
        units: {
            mg: { name: 'Milligrams', factor: 0.000001 },
            g: { name: 'Grams', factor: 0.001 },
            kg: { name: 'Kilograms', factor: 1 },
            t: { name: 'Tonnes', factor: 1000 },
            oz: { name: 'Ounces', factor: 0.0283495 },
            lb: { name: 'Pounds', factor: 0.453592 },
        },
    },
    temperature: {
        label: 'Temperature',
        units: {
            c: { name: 'Celsius' },
            f: { name: 'Fahrenheit' },
            k: { name: 'Kelvin' },
        },
        custom: true,
    },
    speed: {
        label: 'Speed',
        units: {
            'ms': { name: 'Meters/s', factor: 1 },
            'kmh': { name: 'km/h', factor: 0.277778 },
            'mph': { name: 'Miles/h', factor: 0.44704 },
            'kn': { name: 'Knots', factor: 0.514444 },
        },
    },
    data: {
        label: 'Data',
        units: {
            b: { name: 'Bytes', factor: 1 },
            kb: { name: 'Kilobytes', factor: 1024 },
            mb: { name: 'Megabytes', factor: 1048576 },
            gb: { name: 'Gigabytes', factor: 1073741824 },
            tb: { name: 'Terabytes', factor: 1099511627776 },
        },
    },
};

function convertTemp(value, from, to) {
    let celsius;
    if (from === 'c') celsius = value;
    else if (from === 'f') celsius = (value - 32) * 5 / 9;
    else celsius = value - 273.15;

    if (to === 'c') return celsius;
    if (to === 'f') return celsius * 9 / 5 + 32;
    return celsius + 273.15;
}

function convert(value, categoryKey, fromUnit, toUnit) {
    const cat = CATEGORIES[categoryKey];
    if (!cat) return 0;
    if (cat.custom) return convertTemp(value, fromUnit, toUnit);
    const fromFactor = cat.units[fromUnit].factor;
    const toFactor = cat.units[toUnit].factor;
    return (value * fromFactor) / toFactor;
}

function buildUnitOptions(categoryKey) {
    const units = CATEGORIES[categoryKey].units;
    return Object.entries(units).map(([k, v]) => `<option value="${k}">${v.name} (${k})</option>`).join('');
}

function buildCategoryOptions() {
    return Object.entries(CATEGORIES).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join('');
}

document.querySelector('#app').innerHTML = `
  ${getNavHTML('unit-converter')}
  <main class="container tool-page">
    <div class="tool-header">
      <div class="tool-icon" style="background: var(--gradient-fire);">📐</div>
      <h1>Unit Converter</h1>
      <p>Convert between units of length, weight, temperature, speed, and data</p>
    </div>

    <div class="tool-layout single-column">
      <div class="glass-card">
        <div class="option-group" style="margin-bottom: 1.5rem;">
          <label for="category">Category</label>
          <select id="category">${buildCategoryOptions()}</select>
        </div>

        <div class="converter-row" style="margin-bottom: 1.5rem;">
          <div class="converter-group">
            <label for="fromValue">From</label>
            <input type="number" id="fromValue" value="1" step="any" />
            <select id="fromUnit">${buildUnitOptions('length')}</select>
          </div>
          <button class="btn btn-icon btn-secondary swap-btn" id="swapBtn" title="Swap" style="margin-top: 1.5rem; font-size: 1.3rem;">⇄</button>
          <div class="converter-group">
            <label for="toValue">To</label>
            <input type="text" id="toValue" readonly style="font-weight: 700; font-size: 1.1rem; color: var(--accent-primary);" />
            <select id="toUnit">${buildUnitOptions('length')}</select>
          </div>
        </div>

        <button class="btn btn-primary" id="copyResult" style="width: 100%;">📋 Copy Result</button>
      </div>
    </div>

    ${getShareHTML('Unit Converter')}
    ${getAdSlotHTML()}
    <section class="seo-content glass-card" style="margin-top: 2rem;">
      <h2>Universal Unit Converter</h2>
      <p>Whether you are following an international recipe, planning a road trip abroad, or calculating server storage sizes, a <strong>Unit Converter</strong> is indispensable.</p>
      <h3>Supported Conversion Metrics</h3>
      <p>This tool instantly converts metric, imperial, and digital units including Length (meters to feet), Weight (kilograms to pounds), Temperature (Celsius to Fahrenheit), Speed (km/h to mph), and Data (Megabytes to Gigabytes).</p>
    </section>
  </main>
  ${getFooterHTML()}
`;

initToolPage('unit-converter');

const categoryEl = document.getElementById('category');
const fromValueEl = document.getElementById('fromValue');
const toValueEl = document.getElementById('toValue');
const fromUnitEl = document.getElementById('fromUnit');
const toUnitEl = document.getElementById('toUnit');

function updateConversion() {
    const cat = categoryEl.value;
    const value = parseFloat(fromValueEl.value) || 0;
    const from = fromUnitEl.value;
    const to = toUnitEl.value;
    const result = convert(value, cat, from, to);

    // Smart formatting
    const formatted = Math.abs(result) < 0.01 || Math.abs(result) > 999999
        ? result.toExponential(6)
        : parseFloat(result.toFixed(6));

    toValueEl.value = formatted;
}

categoryEl.addEventListener('change', () => {
    const opts = buildUnitOptions(categoryEl.value);
    fromUnitEl.innerHTML = opts;
    toUnitEl.innerHTML = opts;
    if (toUnitEl.options.length > 1) toUnitEl.selectedIndex = 1;
    updateConversion();
});

fromValueEl.addEventListener('input', updateConversion);
fromUnitEl.addEventListener('change', updateConversion);
toUnitEl.addEventListener('change', updateConversion);

document.getElementById('swapBtn').addEventListener('click', () => {
    const tmpUnit = fromUnitEl.value;
    fromUnitEl.value = toUnitEl.value;
    toUnitEl.value = tmpUnit;
    updateConversion();
});

document.getElementById('copyResult').addEventListener('click', () => {
    copyToClipboard(`${fromValueEl.value} ${fromUnitEl.value} = ${toValueEl.value} ${toUnitEl.value}`);
});

// Set default to unit to be different
if (toUnitEl.options.length > 1) toUnitEl.selectedIndex = 1;
updateConversion();
