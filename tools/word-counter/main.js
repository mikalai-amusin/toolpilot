import '../../src/styles.css';
import { getNavHTML, getFooterHTML, initToolPage, getShareHTML, getAdSlotHTML } from '../../src/shared.js';

document.querySelector('#app').innerHTML = `
  ${getNavHTML('word-counter')}
  <main class="container tool-page">
    <div class="tool-header">
      <div class="tool-icon" style="background: var(--gradient-ocean);">✍️</div>
      <h1>Word & Character Counter</h1>
      <p>Count words, characters, sentences, paragraphs — plus keyword density analysis</p>
    </div>

    <div class="tool-layout single-column">
      <div class="glass-card">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem;">
          <div class="stat-card">
            <div class="stat-card-value" id="wordCount" style="background: var(--gradient-aurora); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">0</div>
            <div class="stat-card-label">Words</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-value" id="charCount" style="background: var(--gradient-ocean); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">0</div>
            <div class="stat-card-label">Characters</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-value" id="charNoSpaceCount" style="background: var(--gradient-sunset); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">0</div>
            <div class="stat-card-label">No Spaces</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-value" id="sentenceCount" style="color: var(--accent-tertiary);">0</div>
            <div class="stat-card-label">Sentences</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-value" id="paragraphCount" style="color: var(--warning);">0</div>
            <div class="stat-card-label">Paragraphs</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-value" id="readingTime" style="color: var(--success);">0s</div>
            <div class="stat-card-label">Read Time</div>
          </div>
        </div>
        <textarea id="textInput" style="min-height: 200px; font-family: var(--font-family);" placeholder="Start typing or paste your text here..."></textarea>

        <!-- Keyword Density -->
        <div id="keywordSection" style="margin-top: 1.5rem; display: none;">
          <label>Top Keywords</label>
          <div id="keywords" style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.5rem;"></div>
        </div>
      </div>
    </div>

    ${getShareHTML('Word Counter')}
    ${getAdSlotHTML()}
  </main>
  ${getFooterHTML()}
`;

initToolPage('word-counter');

const textInput = document.getElementById('textInput');
const keywordSection = document.getElementById('keywordSection');
const keywordsEl = document.getElementById('keywords');

function updateCounts() {
  const text = textInput.value;
  const trimmed = text.trim();

  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, '').length;
  const sentences = trimmed ? (trimmed.match(/[.!?]+/g) || []).length || (trimmed.length > 0 ? 1 : 0) : 0;
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
  const readMins = Math.ceil(words / 200);
  const readTime = words === 0 ? '0s' : readMins < 1 ? `${Math.ceil(words / 3.3)}s` : `${readMins}m`;

  document.getElementById('wordCount').textContent = words.toLocaleString();
  document.getElementById('charCount').textContent = chars.toLocaleString();
  document.getElementById('charNoSpaceCount').textContent = charsNoSpace.toLocaleString();
  document.getElementById('sentenceCount').textContent = sentences;
  document.getElementById('paragraphCount').textContent = paragraphs || (trimmed ? 1 : 0);
  document.getElementById('readingTime').textContent = readTime;

  // Keyword density
  if (words >= 5) {
    const wordList = trimmed.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'is', 'it', 'that', 'this', 'with', 'as', 'by', 'from', 'be', 'are', 'was', 'were', 'has', 'had', 'have', 'not', 'no', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'can', 'may', 'might', 'its', 'i', 'you', 'he', 'she', 'we', 'they', 'me', 'my', 'your', 'his', 'her', 'our', 'their']);
    const freq = {};
    wordList.forEach(w => { if (w.length > 2 && !stopWords.has(w)) freq[w] = (freq[w] || 0) + 1; });
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8);

    if (sorted.length > 0) {
      keywordSection.style.display = 'block';
      keywordsEl.innerHTML = sorted.map(([word, count]) => {
        const pct = ((count / words) * 100).toFixed(1);
        return `<span class="recent-chip" style="cursor: default;">${word} <span style="opacity:0.6; margin-left:2px;">${pct}%</span></span>`;
      }).join('');
    } else {
      keywordSection.style.display = 'none';
    }
  } else {
    keywordSection.style.display = 'none';
  }
}

textInput.addEventListener('input', updateCounts);
