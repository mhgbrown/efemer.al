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
      border-radius: 16px;
      box-shadow: var(--md-sys-elevation-1);
      min-height: 400px;
      transition: box-shadow 0.3s ease;
    }

    .view-container:hover {
        box-shadow: var(--md-sys-elevation-2);
    }

    .empty-state {
      text-align: center;
      padding: 64px 24px;
      color: var(--md-sys-color-on-surface-variant);
    }

    .empty-state h2 {
      margin-bottom: 16px;
      color: var(--md-sys-color-on-surface);
      font-weight: 400;
    }

    .empty-state p {
      margin-bottom: 32px;
      font-size: 16px;
      line-height: 24px;
    }

    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 10px 24px;
      background: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
      text-decoration: none;
      border-radius: 20px;
      font-weight: 500;
      transition: background 0.2s, box-shadow 0.2s;
      cursor: pointer;
      border: none;
      font-size: 14px;
    }

    .button:hover {
      opacity: 0.9;
      box-shadow: var(--md-sys-elevation-1);
    }

    .edit-button {
      position: fixed;
      bottom: 32px;
      right: 32px;
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--md-sys-color-primary-container);
      color: var(--md-sys-color-on-primary-container);
      text-decoration: none;
      border-radius: 16px; /* FABs in MD3 are slightly squared */
      box-shadow: var(--md-sys-elevation-3);
      transition: all 0.2s;
      cursor: pointer;
      border: none;
      font-size: 24px;
      box-sizing: border-box;
      z-index: 100;
    }

    .edit-button:hover {
      background: var(--md-sys-color-primary-container); /* Add state layer logic if needed */
      box-shadow: var(--md-sys-elevation-4); /* Assuming elevation 4 exists or fallback */
      transform: scale(1.05);
    }

    .rendered-content {
      line-height: 1.6;
      color: var(--md-sys-color-on-surface);
      font-family: 'DM Sans', sans-serif;
    }

    .rendered-content h1 {
      font-size: 36px;
      margin: 32px 0 16px;
      color: var(--md-sys-color-on-surface);
      border-bottom: 1px solid var(--md-sys-color-outline);
      padding-bottom: 8px;
      font-weight: 700;
      font-family: 'Domine', serif;
    }

    .rendered-content h2 {
      font-size: 28px;
      margin: 24px 0 16px;
      color: var(--md-sys-color-on-surface);
      font-weight: 600;
      font-family: 'Domine', serif;
    }

    .rendered-content h3 {
      font-size: 24px;
      margin: 16px 0 12px;
      color: var(--md-sys-color-on-surface);
      font-weight: 600;
      font-family: 'Domine', serif;
    }

    .rendered-content p {
      margin: 16px 0;
      font-size: 16px;
      line-height: 24px;
    }

    .rendered-content code {
      background: var(--md-sys-color-surface-variant);
      color: var(--md-sys-color-on-surface-variant);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Roboto Mono', monospace;
      font-size: 14px;
    }

    .rendered-content pre {
      background: var(--md-sys-color-surface-variant);
      color: var(--md-sys-color-on-surface-variant);
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 16px 0;
    }

    .rendered-content pre code {
      background: none;
      padding: 0;
      color: inherit;
    }

    .rendered-content ul, .rendered-content ol {
      margin: 16px 0;
      padding-left: 32px;
    }

    .rendered-content li {
      margin: 8px 0;
    }

    .rendered-content blockquote {
      border-left: 4px solid var(--md-sys-color-primary);
      padding-left: 16px;
      margin: 16px 0;
      color: var(--md-sys-color-on-surface-variant);
      font-style: italic;
    }

    .rendered-content a {
      color: var(--md-sys-color-primary);
      text-decoration: none;
      font-weight: 500;
    }

    .rendered-content a:hover {
      text-decoration: underline;
    }

    .rendered-content table {
      border-collapse: collapse;
      width: 100%;
      margin: 16px 0;
    }

    .rendered-content th,
    .rendered-content td {
      border: 1px solid var(--md-sys-color-outline);
      padding: 12px;
      text-align: left;
    }

    .rendered-content th {
      background: var(--md-sys-color-surface-variant);
      color: var(--md-sys-color-on-surface-variant);
      font-weight: 500;
    }

    .rendered-content img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
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
