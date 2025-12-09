import { LitElement, html, css } from 'lit';
import { RecentSitesManager } from '../recent-sites-manager.js';

export class RecentSitesDrawer extends LitElement {
  static properties = {
    collapsed: { type: Boolean, reflect: true },
    sites: { type: Array },
    searchQuery: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      width: 250px;
      background: var(--md-sys-color-surface);
      border-right: 1px solid var(--md-sys-color-outline);
      display: flex;
      flex-direction: column;
      height: 100%;
      transition: width 0.2s ease-in-out;
      position: relative;
    }

    :host([collapsed]) {
      width: 48px;
    }

    :host([collapsed]) .drawer-header,
    :host([collapsed]) .sites-list,
    :host([collapsed]) .drawer-footer {
      display: none;
    }

    .toggle-button {
      position: absolute;
      top: 50%;
      right: -12px;
      width: 24px;
      height: 24px;
      transform: translateY(-50%);
      background: var(--md-sys-color-surface);
      border: 1px solid var(--md-sys-color-outline);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10;
      font-size: 12px;
      color: var(--md-sys-color-on-surface);
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      transition: all 0.2s;
    }

    .toggle-button:hover {
      background: var(--md-sys-color-surface-variant);
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
      transition: all 0.2s;
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
      transition: all 0.2s;
    }

    .delete-site:hover {
      background: var(--md-sys-color-error);
      color: var(--md-sys-color-on-error);
    }

    .drawer-footer {
      height: 48px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      padding: 0 16px;
      border-top: 1px solid var(--md-sys-color-outline);
      background: var(--md-sys-color-surface);
    }

    .clear-button {
      width: 100%;
      height: 28px;
      padding: 0 8px;
      background: transparent;
      color: var(--md-sys-color-error);
      border: 1px solid var(--md-sys-color-error);
      text-transform: uppercase;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      font-size: 12px;
      border-radius: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
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

    /* Collapsed state icon */
    .collapsed-icon {
      display: none;
      height: 100%;
      width: 100%;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      cursor: pointer;
      color: var(--md-sys-color-on-surface-variant);
      gap: 0;
      padding-top: 0;
      border-bottom: 1px solid transparent;
      box-sizing: border-box;
    }

    .collapsed-header {
      height: 48px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .collapsed-count {
      font-size: 16px;
      font-weight: bold;
      color: var(--md-sys-color-primary);
    }

    :host([collapsed]) .collapsed-icon {
      display: flex;
    }
  `;

  constructor() {
    super();
    this.collapsed = true;
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
    let hash = url.split('#')[1] || '';
    // If we are currently in edit mode, ensure we stay in edit mode
    // unless the target URL specifically handles it differently (though here we just append)
    if (window.location.hash.endsWith('/edit') && !hash.endsWith('/edit')) {
      hash += '/edit';
    }
    window.location.hash = hash;
  }

  async _copyUrl(e, url) {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  }

  _insertLink(e, site) {
    e.stopPropagation();
    let viewUrl = site.url.replace(/\/edit$/, '');
    // Escape parentheses to prevent breaking markdown link syntax
    viewUrl = viewUrl.replace(/\(/g, '%28').replace(/\)/g, '%29');

    const linkText = `[${site.title}](${viewUrl})`;
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

  _toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  render() {
    const sites = this._filteredSites;

    return html`
      <button class="toggle-button" @click=${this._toggleCollapse} title=${this.collapsed ? "Expand" : "Collapse"}>
        ${this.collapsed ? '›' : '‹'}
      </button>

      <div class="collapsed-icon" @click=${this._toggleCollapse} title="Expand Recent Sites">
        <div class="collapsed-header">
          <span class="collapsed-count">${sites.length}</span>
        </div>
      </div>

      <div class="drawer-header">
        <span class="drawer-title">Recent Sites (${sites.length})</span>
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
