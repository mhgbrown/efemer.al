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
      box-shadow: none; /* Flat */
      min-height: 400px;
      position: relative;
    }

    /* Decorative elements removed */
    .view-container::before {
      content: none;
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
      font-weight: bold;
      font-family: inherit;
      font-size: 32px;
      letter-spacing: normal;
      text-transform: none;
    }

    .empty-state p {
      margin-bottom: 32px;
      font-size: 16px;
      line-height: 24px;
      font-family: inherit;
      color: var(--md-sys-color-on-surface);
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
      transition: transform 0.2s;
      cursor: pointer;
      font-size: 24px;
      font-family: inherit;
      text-transform: uppercase;
      letter-spacing: 1px;
      clip-path: none;
      border-radius: 0;
    }

    .button:hover {
      background: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
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
      background: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
      text-decoration: none;
      border: 1px solid var(--md-sys-color-outline);
      cursor: pointer;
      font-size: 24px;
      font-family: inherit;
      box-sizing: border-box;
      z-index: 100;
      border-radius: 0 !important;
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
            <h2>ephemer.al</h2>
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
