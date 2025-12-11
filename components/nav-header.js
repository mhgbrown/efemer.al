import { LitElement, html, css } from 'lit';
import { encodeContent } from '../url-utils.js';
import { RecentSitesManager } from '../recent-sites-manager.js';
import './theme-switcher.js';
import './button.js';

export class NavHeader extends LitElement {
  static properties = {
    theme: { type: String },
    isMobile: { type: Boolean, state: true }
  };

  static styles = css`
    :host {
      display: block;
      margin-bottom: 0;
    }

    .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
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

    /* .create-button styles removed */

    .actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .nav-left {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    @media (max-width: 768px) {
      .nav {
        padding: 12px 16px;
      }

      .brand {
        font-size: 20px;
      }

      .nav-left {
        gap: 8px;
      }

      .actions {
        gap: 8px;
      }
    }
  `;

  constructor() {
    super();
    this.isMobile = false;
    this._handleResize = this._handleResize.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this._handleResize);
    this._handleResize();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this._handleResize);
  }

  _handleResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  async _handleCreateNew() {
    const defaultContent = '# Welcome!\n\nStart editing to create your site.';
    const encoded = await encodeContent(defaultContent);

    // Save immediately
    RecentSitesManager.saveSite(
      `${window.location.origin}/#${encodeURIComponent(encoded)}`,
      defaultContent
    );

    this.dispatchEvent(new CustomEvent('navigate', {
      detail: { path: `${encodeURIComponent(encoded)}/edit` },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <nav class="nav">
        <div class="nav-left">
          <a href="#" class="brand">efemer.al</a>
          <app-button
            variant="secondary"
            size=${this.isMobile ? 'small' : 'medium'}
            @click=${this._handleCreateNew}
          >
            ${this.isMobile ? 'Create' : 'Create New Site'}
          </app-button>
          <app-button
            variant="secondary"
            size=${this.isMobile ? 'small' : 'medium'}
            @click=${() => window.location.hash = 'about'}
          >
            About
          </app-button>
        </div>
        <div class="actions">
          <theme-switcher
            .theme=${this.theme}
            size=${this.isMobile ? 'small' : 'medium'}
          ></theme-switcher>
        </div>
      </nav>
    `;
  }
}

customElements.define('nav-header', NavHeader);
