import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { marked } from 'marked';
import { encodeContent, updateURL } from '../url-utils.js';

export class ViewMode extends LitElement {
  static properties = {
    content: { type: String }
  };

  static styles = css`
    :host {
      display: block;
    }

    .view-container {
      background: var(--md-sys-color-surface);
      color: var(--md-sys-color-on-surface);
      padding: 32px;
      border: 1px solid var(--md-sys-color-outline);
      box-shadow: none; /* Flat */
      min-height: 400px;
      position: relative;
    }

    /* Decorative elements */
    .view-container::before {
      content: 'VIEW_MODE // READ_ONLY';
      position: absolute;
      top: 10px;
      left: 10px;
      font-family: 'Share Tech Mono', monospace;
      font-size: 10px;
      color: var(--md-sys-color-outline);
      letter-spacing: 2px;
    }

    .view-container:hover {
        border-color: var(--md-sys-color-primary); /* Highlight border instead of shadow */
    }

    .empty-state {
      text-align: center;
      padding: 64px 24px;
      color: var(--md-sys-color-on-surface-variant);
    }

    .empty-state h2 {
      margin-bottom: 16px;
      color: var(--md-sys-color-primary);
      font-weight: 600;
      font-family: 'Chakra Petch', sans-serif;
      font-size: 32px;
      letter-spacing: 1px;
    }

    .empty-state p {
      margin-bottom: 32px;
      font-size: 16px;
      line-height: 24px;
      font-family: 'Share Tech Mono', monospace;
    }

    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 12px 24px;
      background: transparent;
      color: var(--md-sys-color-primary);
      text-decoration: none;
      border: 1px solid var(--md-sys-color-primary);
      font-weight: 600;
      transition: all 0.2s;
      cursor: pointer;
      font-size: 16px;
      font-family: 'Chakra Petch', sans-serif;
      text-transform: uppercase;
      letter-spacing: 1px;
      clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
    }

    .button:hover {
      background: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
      box-shadow: 0 0 10px var(--md-sys-color-primary);
    }

    .edit-button {
      position: fixed;
      bottom: 32px;
      right: 32px;
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--md-sys-color-secondary); /* Blue accent */
      color: var(--md-sys-color-on-secondary);
      text-decoration: none;
      border: none;
      box-shadow: none;
      transition: all 0.2s;
      cursor: pointer;
      font-size: 24px;
      box-sizing: border-box;
      z-index: 100;
      clip-path: polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%);
    }

    .edit-button:hover {
      transform: scale(1.1);
      box-shadow: 0 0 20px var(--md-sys-color-secondary);
    }

    .rendered-content {
      line-height: 1.6;
      color: var(--md-sys-color-on-surface);
      font-family: 'Share Tech Mono', monospace;
    }

    .rendered-content h1 {
      font-size: 42px;
      margin: 32px 0 16px;
      color: var(--md-sys-color-primary);
      border-bottom: 2px solid var(--md-sys-color-secondary); /* Blue accent */
      padding-bottom: 8px;
      font-weight: 600;
      font-family: 'Chakra Petch', sans-serif;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .rendered-content h2 {
      font-size: 32px;
      margin: 24px 0 16px;
      color: var(--md-sys-color-on-surface);
      font-weight: 500;
      font-family: 'Chakra Petch', sans-serif;
      text-transform: uppercase;
      border-left: 4px solid var(--md-sys-color-secondary); /* Blue accent */
      padding-left: 12px;
    }

    .rendered-content h3 {
      font-size: 24px;
      margin: 16px 0 12px;
      color: var(--md-sys-color-on-surface);
      font-weight: 500;
      font-family: 'Chakra Petch', sans-serif;
      text-transform: uppercase;
    }

    .rendered-content p {
      margin: 16px 0;
      font-size: 16px;
      line-height: 1.6;
    }

    .rendered-content code {
      background: var(--md-sys-color-surface-variant);
      color: var(--md-sys-color-secondary); /* Blue accent */
      padding: 2px 6px;
      border: 1px solid var(--md-sys-color-outline);
      font-family: 'Share Tech Mono', monospace;
      font-size: 14px;
    }

    .rendered-content pre {
      background: #000000;
      color: var(--md-sys-color-secondary); /* Blue accent */
      padding: 16px;
      border: 1px solid var(--md-sys-color-secondary); /* Blue accent */
      overflow-x: auto;
      margin: 16px 0;
    }

    .rendered-content pre code {
      background: none;
      padding: 0;
      color: inherit;
      border: none;
    }

    .rendered-content ul, .rendered-content ol {
      margin: 16px 0;
      padding-left: 32px;
    }

    .rendered-content li {
      margin: 8px 0;
    }

    .rendered-content li::marker {
      color: var(--md-sys-color-secondary); /* Blue accent */
    }

    .rendered-content blockquote {
      border-left: 4px solid var(--md-sys-color-secondary); /* Blue accent */
      padding-left: 16px;
      margin: 16px 0;
      color: var(--md-sys-color-on-surface-variant);
      font-style: italic;
      background: var(--md-sys-color-surface-variant);
      padding: 16px;
    }

    .rendered-content a {
      color: var(--md-sys-color-secondary); /* Blue accent */
      text-decoration: none;
      font-weight: 500;
      border-bottom: 1px dashed var(--md-sys-color-secondary);
    }

    .rendered-content a:hover {
      background: var(--md-sys-color-secondary);
      color: var(--md-sys-color-on-secondary);
    }

    .rendered-content table {
      border-collapse: collapse;
      width: 100%;
      margin: 16px 0;
      border: 1px solid var(--md-sys-color-outline);
    }

    .rendered-content th,
    .rendered-content td {
      border: 1px solid var(--md-sys-color-outline);
      padding: 12px;
      text-align: left;
    }

    .rendered-content th {
      background: var(--md-sys-color-surface-variant);
      color: var(--md-sys-color-secondary); /* Blue accent */
      font-weight: 500;
      font-family: 'Chakra Petch', sans-serif;
      text-transform: uppercase;
      font-size: 18px;
    }

    .rendered-content img {
      max-width: 100%;
      height: auto;
      border: 1px solid var(--md-sys-color-outline);
      margin: 16px 0;
      box-shadow: var(--md-sys-elevation-1);
    }
  `;

  constructor() {
    super();
    this.content = '';
  }

  _getRenderedContent() {
    if (!this.content) {
      return '';
    }
    return marked.parse(this.content);
  }

  _handleEdit() {
    const currentHash = window.location.hash.slice(1);
    const editPath = currentHash ? `${currentHash}/edit` : 'edit';
    this.dispatchEvent(new CustomEvent('navigate', {
      detail: { path: editPath },
      bubbles: true,
      composed: true
    }));
  }

  async _handleCreateNew() {
    const defaultContent = '# Welcome!\n\nStart editing to create your site.';
    const encoded = await encodeContent(defaultContent);
    this.dispatchEvent(new CustomEvent('navigate', {
      detail: { path: `${encodeURIComponent(encoded)}/edit` },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    if (!this.content) {
      return html`
        <div class="view-container">
          <div class="empty-state">
            <h2>Welcome to URL Site</h2>
            <p>Your entire website lives in the URL. Create content and share the link!</p>
            <button class="button" @click=${this._handleCreateNew}>
              Create New Site
            </button>
          </div>
        </div>
      `;
    }

    return html`
      <div class="view-container">
        <div class="rendered-content">
          ${unsafeHTML(this._getRenderedContent())}
        </div>
      </div>
      <button class="edit-button" @click=${this._handleEdit} title="Edit">
        ✏️
      </button>
    `;
  }
}

customElements.define('view-mode', ViewMode);
