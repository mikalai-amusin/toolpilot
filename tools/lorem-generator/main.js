import '../../src/styles.css';
import { getNavHTML, getFooterHTML, initToolPage, copyToClipboard, getShareHTML, getAdSlotHTML } from '../../src/shared.js';

const LOREM_WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ');

function generateWords(count) {
  const words = [];
  for (let i = 0; i < count; i++) words.push(LOREM_WORDS[i % LOREM_WORDS.length]);
  return words.join(' ');
}

function generateSentence(minWords = 6, maxWords = 15) {
  const count = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
  const words = [];
  for (let i = 0; i < count; i++) words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(' ') + '.';
}

function generateParagraph(sentences = 5) {
  return Array.from({ length: sentences }, () => generateSentence()).join(' ');
}

document.querySelector('#app').innerHTML = `
  ${getNavHTML('lorem-generator')}
  <main class="container tool-page">
    <div class="tool-header">
      <div class="tool-icon" style="background: linear-gradient(135deg, #a855f7, #6366f1);">📝</div>
      <h1>Lorem Ipsum Generator</h1>
      <p>Generate placeholder text for your designs and layouts</p>
    </div>

    <div class="tool-layout single-column">
      <div class="glass-card">
        <div class="options-grid" style="margin-bottom: 1.5rem;">
          <div class="option-group">
            <label for="typeSelect">Type</label>
            <select id="typeSelect">
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>
          <div class="option-group">
            <label for="countInput">Count</label>
            <input type="number" id="countInput" value="3" min="1" max="100" />
          </div>
          <div class="option-group" style="justify-content: flex-end;">
            <div class="controls-row">
              <button class="btn btn-primary" id="generateBtn">Generate</button>
              <button class="btn btn-secondary" id="copyBtn">📋 Copy</button>
            </div>
          </div>
        </div>
        <div class="output-display" id="output" style="min-height: 200px; white-space: pre-wrap; word-break: normal; font-family: var(--font-family); line-height: 1.8;">Click "Generate" to create placeholder text...</div>
      </div>
    </div>

    ${getShareHTML('Lorem Ipsum Generator')}
    ${getAdSlotHTML()}
  </main>
  ${getFooterHTML()}
`;

initToolPage('lorem-generator');

function generate() {
  const type = document.getElementById('typeSelect').value;
  const count = parseInt(document.getElementById('countInput').value) || 3;
  let result = '';

  if (type === 'paragraphs') {
    result = Array.from({ length: count }, () => generateParagraph()).join('\n\n');
  } else if (type === 'sentences') {
    result = Array.from({ length: count }, () => generateSentence()).join(' ');
  } else {
    result = generateWords(count);
  }

  document.getElementById('output').textContent = result;
}

document.getElementById('generateBtn').addEventListener('click', generate);
document.getElementById('copyBtn').addEventListener('click', () => copyToClipboard(document.getElementById('output').textContent));

generate();
