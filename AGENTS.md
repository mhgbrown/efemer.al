# Project Context for AI Agents

## Project Overview
**efemer.al** is a serverless, client-side-only website builder where the entire content of the site is stored in the URL hash. It allows users to create simple sites with Markdown support, preview them instantly, and share them via URL.

## Tech Stack
- **Framework**: [Lit](https://lit.dev/) (Web Components)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: Vanilla JavaScript (ES Modules)
- **Styling**: Vanilla CSS (inside Lit `css` tag), Material Design 3 variables
- **Compression**: [pako](https://github.com/nodeca/pako) (Deflate/Inflate Raw)
- **Encoding**: [@alttiri/base85](https://www.npmjs.com/package/@alttiri/base85) (Z85 variant)

## Architecture
### 1. State Management (URL-First)
- **Single Source of Truth**: The URL hash (`window.location.hash`).
- **Format**: `https://efemer.al/#<Z85_ENCODED_COMPRESSED_CONTENT>`
- **Logic**:
  - `src/url-utils.js` handles all encoding, decoding, and path parsing.
  - Content is optimized -> Deflated (raw) -> Base85 encoded.

### 2. Component Structure
- Components are located in `src/components/`.
- All components extend `LitElement`.
- **Naming**: Kebab-case filenames (`url-bar.js`) match custom element tags (`<url-bar>`).
- **Styling**:
  - Scoped styles using Lit's `static styles = css\``...`\``.
  - Relies on CSS variables (tokens) for theming (e.g., `var(--md-sys-color-surface)`).

### 3. File Structure
- `src/`: Source code
  - `components/`: Reusable UI elements (Buttons, Header, Drawer)
  - `views/`: Logic for specific views (although currently simple)
  - `url-utils.js`: Core compression/encoding logic
  - `recent-sites-manager.js`: LocalStorage handling for history
- `index.html`: Entry point

## Development Workflow
- **Run Locally**: `npm run dev` (starts Vite server on port 5173)
- **Build**: `npm run build`
- **Lint/Check**: Standard JS linting (no TypeScript currently enforced, but types are inferred).

## Key Conventions
- **No Backend**: Do not propose backend APIs. Everything must run in the browser.
- **Compression**: Crucial. URLs have length limits, so content is aggressively compressed.
- **Markdown**: The sites act as Markdown renderers.
- **Design**: "Vibe coding" aesthetic. Use animations, glassmorphism, and Material Design tokens.

## Common Tasks
- **New Component**: Create file in `src/components/`, import in `app-root.js` or parent component.
- **State Change**: Update URL hash; do not store persistent state in JS variables (except for volatile UI state).
