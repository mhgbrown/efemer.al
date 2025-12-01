import { LitElement, html, css } from 'lit';
import { encodeContent } from '../url-utils.js';

export class NavHeader extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin-bottom: 24px;
    }

    .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 0;
      border-bottom: 1px solid var(--md-sys-color-outline);
    }

    .brand {
      font-size: 24px;
      font-weight: bold;
      color: var(--md-sys-color-primary);
      text-decoration: none;
      font-family: inherit;
      font-style: italic;
    }

    .create-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 8px 16px;
      background: transparent;
      color: var(--md-sys-color-primary);
      text-decoration: none;
      border: 1px solid var(--md-sys-color-primary);
      font-weight: 600;
      cursor: pointer;
      font-size: 14px;
      font-family: inherit;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-radius: 0;
      transition: all 0.2s;
    }

    .create-button:hover {
      background: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
    }
  `;

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
    return html`
      <nav class="nav">
        <a href="#" class="brand">ephemer.al</a>
        <button class="create-button" @click=${this._handleCreateNew}>
          Create New Site
        </button>
      </nav>
    `;
  }
}

customElements.define('nav-header', NavHeader);
