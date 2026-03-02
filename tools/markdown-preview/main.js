import '../../src/styles.css';
import { getNavHTML, getFooterHTML, initToolPage, copyToClipboard, debounce, getShareHTML, getAdSlotHTML } from '../../src/shared.js';

// Simple markdown parser (no dependencies)
function parseMarkdown(md) {
  let html = md;
  // Escape HTML
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Headers
  html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');
  // Bold & Italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');
  // Blockquote
  html = html.replace(/^&gt;\s+(.+)$/gm, '<blockquote>$1</blockquote>');
  // Unordered list
  html = html.replace(/^[\-\*]\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  // Ordered list
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:8px;" />');
  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr style="border: none; border-top: 1px solid var(--border-color); margin: 1rem 0;" />');
  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  html = html.replace(/<p><(h[1-6]|ul|ol|pre|blockquote|hr)/g, '<$1');
  html = html.replace(/<\/(h[1-6]|ul|ol|pre|blockquote)><\/p>/g, '</$1>');
  html = html.replace(/<p><\/p>/g, '');
  // Line breaks
  html = html.replace(/\n/g, '<br>');

  return html;
}

const sampleMd = `# Welcome to Markdown Preview

## Features

This is a **live** markdown editor with *instant* preview.

### Supported Syntax

- **Bold text** with double asterisks
- *Italic text* with single asterisks
- ~~Strikethrough~~ with tildes
- \`Inline code\` with backticks

### Code Block

\`\`\`javascript
function hello() {
  console.log("Hello, ToolPilot!");
}
\`\`\`

### Links & Media

[Visit ToolPilot](/) — your free online toolkit.

> "The best tools are the ones that just work." — ToolPilot

---

Start editing on the left to see your changes rendered here in real time! ✨`;

document.querySelector('#app').innerHTML = `
  ${getNavHTML('markdown-preview')}
  <main class="container tool-page">
    <div class="tool-header">
      <div class="tool-icon" style="background: var(--gradient-sunset);">📋</div>
      <h1>Markdown Preview</h1>
      <p>Write markdown on the left, see rendered HTML on the right — in real time</p>
    </div>

    <div class="tool-layout">
      <div class="tool-panel">
        <div class="tool-panel-header">
          <h3>Markdown</h3>
          <button class="btn btn-sm btn-ghost" id="clearBtn">Clear</button>
        </div>
        <div class="glass-card" style="height: calc(100% - 40px);">
          <textarea id="mdInput" style="min-height: 400px; font-size: 0.85rem;">${sampleMd}</textarea>
        </div>
      </div>

      <div class="tool-panel">
        <div class="tool-panel-header">
          <h3>Preview</h3>
          <button class="btn btn-sm btn-ghost" id="copyHtml">Copy HTML</button>
        </div>
        <div class="glass-card" style="height: calc(100% - 40px);">
          <div class="markdown-output" id="preview" style="min-height: 400px;"></div>
        </div>
      </div>
    </div>

    ${getShareHTML('Markdown Preview')}
    ${getAdSlotHTML()}
  </main>
  ${getFooterHTML()}
`;

initToolPage('markdown-preview');

const mdInput = document.getElementById('mdInput');
const preview = document.getElementById('preview');

function render() {
  preview.innerHTML = parseMarkdown(mdInput.value);
}

mdInput.addEventListener('input', debounce(render, 100));
document.getElementById('clearBtn').addEventListener('click', () => {
  mdInput.value = '';
  preview.innerHTML = '';
});
document.getElementById('copyHtml').addEventListener('click', () => {
  copyToClipboard(preview.innerHTML);
});

render();
