import { LitElement, html, css } from 'lit';
import { RecentSitesManager } from '../recent-sites-manager.js';

export class RecentSitesDrawer extends LitElement {
  static properties = {
    isOpen: { type: Boolean },
    sites: { type: Array }
  };

  static styles = css`
    :host {
      display: block;
      width: 250px;
      background: var(--md-sys-color-surface);
      border-left: 1px solid var(--md-sys-color-outline);
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .drawer-header {
      padding: 16px;
      border-bottom: 1px solid var(--md-sys-color-outline);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--md-sys-color-surface-variant);
    }

    .drawer-header {
      padding: 16px;
      border-bottom: 1px solid var(--md-sys-color-outline);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--md-sys-color-surface-variant);
    }

    .drawer-title {
      font-weight: bold;
      font-size: 18px;
      color: var(--md-sys-color-on-surface);
    }

    .close-button {
      display: none;
    }

    .sites-list {
      flex: 1;
      overflow-y: auto;
      padding: 0;
      margin: 0;
      list-style: none;
    }

    .site-item {
      padding: 16px;
      border-bottom: 1px solid var(--md-sys-color-outline);
      cursor: pointer;
      transition: background 0.2s;
      position: relative;
    }

    .site-item:hover {
      background: var(--md-sys-color-surface-variant);
    }

    .site-title {
      font-weight: 600;
      margin-bottom: 4px;
      color: var(--md-sys-color-on-surface);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 24px;
    }

    .site-meta {
      font-size: 12px;
      color: var(--md-sys-color-on-surface-variant);
    }

    .delete-site {
      position: absolute;
      top: 16px;
      right: 16px;
      background: none;
      border: none;
      color: var(--md-sys-color-error);
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s;
      padding: 4px;
    }

    .site-item:hover .delete-site {
      opacity: 1;
    }

    .drawer-footer {
      padding: 16px;
      border-top: 1px solid var(--md-sys-color-outline);
      background: var(--md-sys-color-surface);
    }

    .clear-button {
      width: 100%;
      padding: 8px;
      background: transparent;
      color: var(--md-sys-color-error);
      border: 1px solid var(--md-sys-color-error);
      text-transform: uppercase;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
    }

    .clear-button:hover {
      background: var(--md-sys-color-error);
      color: var(--md-sys-color-on-error);
    }

    .empty-state {
      padding: 32px 16px;
      text-align: center;
      color: var(--md-sys-color-on-surface-variant);
      font-style: italic;
    }
  `;

  constructor() {
    super();
    this.isOpen = false;
    this.sites = [];
    this._handleSitesUpdated = this._handleSitesUpdated.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.sites = RecentSitesManager.getSites();
    window.addEventListener('recent-sites-updated', this._handleSitesUpdated);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('recent-sites-updated', this._handleSitesUpdated);
  }

  _handleSitesUpdated() {
    this.sites = RecentSitesManager.getSites();
  }

  _formatDate(timestamp) {
    return new Date(timestamp).toLocaleString();
  }

  _navigateToSite(url) {
    window.location.hash = url.split('#')[1] || '';
    this.dispatchEvent(new CustomEvent('close-drawer'));
  }

  _deleteSite(e, timestamp) {
    e.stopPropagation();
    if (confirm('Remove this site from history?')) {
      RecentSitesManager.deleteSite(timestamp);
    }
  }

  _clearAll() {
    if (confirm('Clear all recent sites history?')) {
      RecentSitesManager.clearSites();
    }
  }

  _close() {
    this.dispatchEvent(new CustomEvent('close-drawer'));
  }

  render() {
    return html`
      <div class="drawer-header">
        <span class="drawer-title">Recent Sites</span>
      </div>

      <ul class="sites-list">
        ${this.sites.length === 0
        ? html`<div class="empty-state">No recent sites found</div>`
        : this.sites.map(site => html`
              <li class="site-item" @click=${() => this._navigateToSite(site.url)}>
                <div class="site-title" title=${site.title}>${site.title}</div>
                <div class="site-meta">${this._formatDate(site.timestamp)}</div>
                <button class="delete-site" @click=${(e) => this._deleteSite(e, site.timestamp)} title="Remove from history">🗑️</button>
              </li>
            `)
      }
      </ul>

      ${this.sites.length > 0
        ? html`
            <div class="drawer-footer">
              <button class="clear-button" @click=${this._clearAll}>Clear History</button>
            </div>
          `
        : ''
      }
    `;
  }
}

customElements.define('recent-sites-drawer', RecentSitesDrawer);
