# Contributing to ToolPilot

Thanks for your interest in improving ToolPilot! 🎉

## Ways to Contribute

### 🐛 Report a Bug
Found something broken? [Open a bug report](../../issues/new?template=bug_report.md) with:
- Steps to reproduce
- What you expected vs. what happened
- Browser and OS info
- Screenshots if applicable

### 💡 Suggest a Feature
Have an idea for a new tool or improvement? [Open a feature request](../../issues/new?template=feature_request.md) describing:
- The problem you're trying to solve
- Your proposed solution
- Why this would benefit other users

### 💬 General Feedback
Love it? Hate it? [Leave feedback](../../issues/new?template=feedback.md) — we read everything.

### 🔧 Submit Code
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-new-tool`
3. Make your changes
4. Test locally: `npm run dev`
5. Commit: `git commit -m "Add: my new tool"`
6. Push: `git push origin feature/my-new-tool`
7. Open a Pull Request

## Adding a New Tool

Each tool lives in `tools/<tool-name>/` with two files:

```
tools/my-tool/
  ├── index.html    ← HTML shell (copy from any existing tool)
  └── main.js       ← Tool logic + UI
```

**Steps:**
1. Copy an existing tool folder as a template
2. Update `vite.config.js` to add your tool's entry point
3. Update `src/main.js` to add your tool to the landing page grid
4. Import shared utilities: `import { getNavHTML, getFooterHTML, initToolPage, ... } from '../../src/shared.js'`

## Code Style
- Vanilla JS — no frameworks
- Use shared utilities from `src/shared.js`
- Follow the existing CSS design system in `src/styles.css`
- Keep tools self-contained and dependency-free

## Questions?
Open an issue — we'll respond quickly!
