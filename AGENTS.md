# Agent Instructions

This project uses **bd** (beads) for issue tracking. Run `bd onboard` to get started.

## Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Sync with git
```

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds (see below)
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show \"up to date with origin\"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say \"ready to push when you are\" - YOU must push
- If push fails, resolve and retry until it succeeds

## Build, Lint, and Test Commands

This is a static HTML/CSS/JS website (Mobirise-generated, hosted on GitHub Pages). No Node.js, npm, or build system detected (no package.json). Deploy: `git push` publishes to GH Pages.

### Build
- None required. Changes are live after `git push`.
- For production minification: Manual (use online tools) or add build step later.

### Lint
- **HTML**: No automated. Use browser devtools or W3C validator (https://validator.w3.org).
  - Agent tip: Use `playwright_browser_snapshot` to inspect DOM.
- **CSS**: No linter. Check `assets/theme/css/style.css` for specificity issues.
  - Suggest: `npx stylelint \"assets/**/*.css\"` (if init npm).
- **JS**: No ESLint. Custom JS in `assets/theme/js/script.js`, `assets/mobirise-gallery/script.js`.
  - Suggest: `npx eslint \"assets/**/*.js\"` (standard config).

### Tests
- **Unit/Integration**: None.
- **E2E/Manual**: Test in browser (Chrome devtools). Interactions: sliders, galleries, forms.
  - Single test: Use Playwright tools (e.g., `playwright_browser_navigate`, `playwright_browser_click`).
  - Full suite: Add Playwright config later via `npm init playwright@latest`.
- **Run all**: N/A. Visual regression: Compare screenshots with `playwright_browser_take_screenshot`.
- **Quality Gates** (for beads workflow):
  ```bash
  # Manual checklist
  git status          # Verify changes
  # Browser test index.html
  # Validate HTML/CSS online
  ```

To enable automation: Run `npm init -y; npm i -D eslint stylelint html-validate playwright`. Add scripts to package.json.

## Code Style Guidelines

Follow existing patterns. Mimic Mobirise conventions. No TypeScript/ES6+ (vanilla JS/jQuery).

### General
- **Line length**: 100 chars max.
- **Indent**: 4 spaces (JS/CSS), 2 spaces (HTML).
- **Quotes**: Double (`\"`) for HTML/JS attrs/strings; single (`'`) optional in JS.
- **Trailing commas**: Avoid (legacy browsers).
- **Comments**: Minimal, none in prod JS/CSS. Use `//` for JS, `/* */` for CSS.
- **Files**: Edit `index.html`, `assets/theme/{css/style.css,js/script.js}` for custom. Avoid minified libs.

### HTML (index.html)
- **Structure**: Mobirise sections (`<section class=\"mbr-section\">`, `data-form-type=\"...\"`).
- **Semantics**: Use `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`, `<article>`.
- **Classes**: Prefix `mbr-` (e.g., `mbr-gallery`, `mbr-testimonial`). Custom: descriptive (e.g., `hero-section`).
- **Attributes**: `data-` for Mobirise (e.g., `data-jarallax`). ARIA for accessibility.
- **Imports/Scripts**: Local assets first; CDNs last (e.g., jQuery).
- **Forms**: Validate client-side; Mobirise formoid.
- **Example**:
  ```html
  <section class=\"mbr-section mbr-gallery\">
    <div class=\"mbr-gallery-layout-default\">
      <!-- Images via data-src -->
    </div>
  </section>
  ```
- **Avoid**: Inline styles/scripts (move to theme files).

### CSS (assets/theme/css/style.css, etc.)
- **Methodology**: Utility + semantic (Bootstrap + custom).
- **Selectors**: Low specificity (`.class > child`). Avoid IDs/tags.
- **Naming**: Kebab-case, descriptive (`.hero-bg`, `.gallery-item`).
- **Properties**: Alphabetical order. Shorthand (e.g., `margin: 0 0 10px;`).
- **Media Queries**: Mobile-first (`@media (min-width: 992px) {}`).
- **Vendor Prefixes**: Minimal (Bootstrap handles).
- **Example**:
  ```css
  .gallery-item {
    display: block;
    margin-bottom: 1rem;
  }
  @media (min-width: 768px) {
    .gallery-item { margin: 0 0.5rem; }
  }
  ```
- **Avoid**: `!important`; deep nesting.

### JavaScript (assets/theme/js/script.js)
- **Style**: jQuery + vanilla. No frameworks/modules (global scope).
- **Naming**:
  | Item | Convention | Example |
  |------|------------|---------|
  | Vars | camelCase | `var isBuilder = $('html').hasClass('is-builder');` |
  | Functions | camelCase | `function initGallery() { ... }` |
  | Constants | UPPER_SNAKE | `const SELECTORS = { hero: '.hero' };` (avoid const if legacy) |
  | jQuery | $camelCase | `var $elements = $('.mbr-section');` |
- **Formatting**: 4-space indent. Braces on new line.
  ```js
  $('.selector').each(function() {
    var $this = $(this);
    if ($this.hasClass('active')) {
      $this.fadeOut();
    }
  });
  ```
- **Imports**: Global jQuery. No imports.
- **Error Handling**: `try { ... } catch (e) { console.error(e); }`. Graceful fallbacks.
- **Patterns**:
  - Document ready: `$(function() { ... });`
  - Events: `.on('click', handler)`
  - Animations: `.addClass('animated')`
- **Performance**: Debounce scrolls; imagesLoaded for galleries.
- **Avoid**: Global vars (use `window.myApp = {}`); blocking code.

### Security & Best Practices
- **No secrets**: Hardcode none.
- **XSS**: Sanitize user input (forms).
- **Accessibility**: Alt texts, keyboard nav.
- **Browser Support**: IE11+ (no modern features).
- **Verify Changes**: `git diff`; browser refresh; mobile test.

When editing, `grep` for patterns, mimic neighbors. Run quality gates before `bd close`.

(152 lines)