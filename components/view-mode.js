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
      background: var(--color-background-secondary);
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px var(--shadow-color);
      min-height: 400px;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: var(--color-text-secondary);
    }

    .empty-state h2 {
      margin-bottom: 20px;
      color: var(--color-text);
    }

    .empty-state p {
      margin-bottom: 30px;
      font-size: 16px;
    }

    .button {
      display: inline-block;
      padding: 12px 24px;
      background: var(--color-primary);
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 500;
      transition: background 0.2s;
      cursor: pointer;
      border: none;
      font-size: 16px;
    }

    .button:hover {
      background: var(--color-primary-hover);
    }

    .edit-button {
      position: fixed;
      bottom: 30px;
      right: 90px; /* Positioned next to the theme switcher */
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-success);
      color: var(--color-background-secondary);
      text-decoration: none;
      border-radius: 50%;
      box-shadow: 0 2px 8px var(--shadow-color);
      transition: all 0.2s;
      cursor: pointer;
      border: none;
      font-size: 24px;
      box-sizing: border-box;
    }

    .edit-button:hover {
      background: var(--color-success-hover);
      transform: scale(1.1);
      box-shadow: 0 4px 12px var(--shadow-color);
    }

    .rendered-content {
      line-height: 1.8;
      color: var(--color-text);
    }

    .rendered-content h1 {
      font-size: 32px;
      margin: 24px 0 16px;
      color: var(--color-text);
      border-bottom: 2px solid var(--color-border);
      padding-bottom: 8px;
    }

    .rendered-content h2 {
      font-size: 26px;
      margin: 20px 0 12px;
      color: var(--color-text);
    }

    .rendered-content h3 {
      font-size: 22px;
      margin: 16px 0 10px;
      color: var(--color-text);
    }

    .rendered-content p {
      margin: 12px 0;
    }

    .rendered-content code {
      background: var(--color-background);
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 14px;
    }

    .rendered-content pre {
      background: var(--color-background);
      padding: 16px;
      border-radius: 4px;
      overflow-x: auto;
      margin: 16px 0;
    }

    .rendered-content pre code {
      background: none;
      padding: 0;
    }

    .rendered-content ul, .rendered-content ol {
      margin: 12px 0;
      padding-left: 30px;
    }

    .rendered-content li {
      margin: 6px 0;
    }

    .rendered-content blockquote {
      border-left: 4px solid var(--color-border);
      padding-left: 16px;
      margin: 16px 0;
      color: var(--color-text-secondary);
      font-style: italic;
    }

    .rendered-content a {
      color: var(--color-primary);
      text-decoration: none;
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
      border: 1px solid var(--color-border);
      padding: 10px;
      text-align: left;
    }

    .rendered-content th {
      background: var(--color-background);
      font-weight: 600;
    }

    .rendered-content img {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
      margin: 16px 0;
      box-shadow: 0 2px 8px var(--shadow-color);
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
    const appRoot = document.querySelector('app-root');
    if (appRoot) {
      appRoot.navigateTo(editPath);
    }
  }

  async _handleCreateNew() {
    const defaultContent = '# Welcome!\n\nStart editing to create your site.';
    const encoded = await encodeContent(defaultContent);
    const appRoot = document.querySelector('app-root');
    if (appRoot) {
      appRoot.navigateTo(`${encodeURIComponent(encoded)}/edit`);
    }
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
