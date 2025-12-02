import { LitElement, html, css } from 'lit';
import { RecentSitesManager } from '../recent-sites-manager.js';

export class RecentSitesDrawer extends LitElement {
  static properties = {
    isOpen: { type: Boolean },
    sites: { type: Array },
    searchQuery: { type: String }
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
      flex-direction: column;
      gap: 12px;
      background: var(--md-sys-color-surface-variant);
    }

    .search-input {
      width: 100%;
      padding: 8px;
      border: 1px solid var(--md-sys-color-outline);
      background: var(--md-sys-color-surface);
      color: var(--md-sys-color-on-surface);
      font-family: inherit;
      font-size: 14px;
      box-sizing: border-box;
      border-radius: 0;
    }

    .search-input:focus {
      outline: 1px solid var(--md-sys-color-primary);
      border-color: var(--md-sys-color-primary);
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

    .site-preview {
      font-size: 13px;
      color: var(--md-sys-color-on-surface-variant);
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      opacity: 0.8;
    }

    .site-meta {
      font-size: 12px;
      color: var(--md-sys-color-on-surface-variant);
    }

    .site-actions {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }

    .action-button {
      background: transparent;
      border: 1px solid var(--md-sys-color-outline);
      color: var(--md-sys-color-primary);
      cursor: pointer;
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 0;
      font-family: inherit;
      text-transform: uppercase;
      font-weight: 600;
    }

    .action-button:hover {
      background: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
    }

    .delete-site {
      background: transparent;
      border: 1px solid var(--md-sys-color-error);
      color: var(--md-sys-color-error);
      cursor: pointer;
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 0;
      font-family: inherit;
      text-transform: uppercase;
      font-weight: 600;
    }

    .delete-site:hover {
      background: var(--md-sys-color-error);
      color: var(--md-sys-color-on-error);
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
    this.searchQuery = '';
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

  _handleSearch(e) {
    this.searchQuery = e.target.value.toLowerCase();
  }

  get _filteredSites() {
    if (!this.searchQuery) return this.sites;
    return this.sites.filter(site =>
      site.title.toLowerCase().includes(this.searchQuery)
    );
  }

  _navigateToSite(url) {
    window.location.hash = url.split('#')[1] || '';
  }

  async _copyUrl(e, url) {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      // Optional: Show a brief "Copied!" feedback if needed,
      // but keeping it minimal for now.
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  }

  _insertLink(e, site) {
    e.stopPropagation();
    const linkText = `[${site.title}](${site.url})`;
    window.dispatchEvent(new CustomEvent('insert-link', {
      detail: { text: linkText },
      bubbles: true,
      composed: true
    }));
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
    const sites = this._filteredSites;

    return html`
      <div class="drawer-header">
        <span class="drawer-title">Recent Sites</span>
        <input
          type="text"
          class="search-input"
          placeholder="Filter sites..."
          .value=${this.searchQuery}
          @input=${this._handleSearch}
        >
      </div>

      <ul class="sites-list">
        ${sites.length === 0
        ? html`<div class="empty-state">No sites found</div>`
        : sites.map(site => html`
              <li class="site-item" @click=${() => this._navigateToSite(site.url)}>
                <div class="site-title" title=${site.title}>${site.title}</div>
                ${site.preview ? html`<div class="site-preview">${site.preview}</div>` : ''}
                <div class="site-meta">${this._formatDate(site.timestamp)}</div>
                <div class="site-actions">
                  <button class="action-button" @click=${(e) => this._copyUrl(e, site.url)}>Copy</button>
                  <button class="action-button" @click=${(e) => this._insertLink(e, site)}>Insert</button>
                  <button class="delete-site" @click=${(e) => this._deleteSite(e, site.timestamp)}>Delete</button>
                </div>
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
