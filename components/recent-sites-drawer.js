import { LitElement, html, css } from 'lit';
import { RecentSitesManager } from '../recent-sites-manager.js';
import './button.js';

export class RecentSitesDrawer extends LitElement {
  static properties = {
    expanded: { type: Boolean, reflect: true },
    sites: { type: Array },
    searchQuery: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      width: 48px;
      height: 100%;
      position: relative;
      /* Host no longer handles background/border to allow button to stick out */
      z-index: 100;
      transition: width 0.2s ease-in-out;
    }

    /* Desktop Expansion */
    :host([expanded]) {
      width: 250px;
    }

    .drawer-content {
      background: var(--md-sys-color-surface);
      border-right: 1px solid var(--md-sys-color-outline);
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden; /* Clip content for animation cleanliness */
      box-sizing: border-box;
      position: relative;
    }

    /* Elements hidden by default (collapsed state) */
    .drawer-header,
    .sites-list,
    .drawer-footer {
      display: none;
    }

    :host([expanded]) .drawer-header,
    :host([expanded]) .drawer-footer {
      display: flex;
    }

    :host([expanded]) .sites-list {
       display: block;
    }

    /* Elements visible by default */
    .collapsed-icon {
      display: flex;
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
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }

    :host([expanded]) .collapsed-icon {
       display: none;
    }

    .drawer-footer {
      background: var(--md-sys-color-surface-variant);
      color: var(--md-sys-color-on-surface-variant);
      border-top: 1px solid var(--md-sys-color-outline);
      align-items: center;
      justify-content: center;
      padding: 8px 16px;
      height: 48px;
      box-sizing: border-box;
      gap: 16px;
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
      z-index: 101; /* Above content */
      font-size: 12px;
      color: var(--md-sys-color-on-surface);
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      transition: all 0.2s;
    }

    .toggle-button:hover {
      background: var(--md-sys-color-surface-variant);
    }

    /* ... Keep existing internal styles for headers, search, items ... */

    .drawer-header {
      padding: 16px;
      border-bottom: 1px solid var(--md-sys-color-outline);
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

    .empty-state {
      padding: 16px;
      text-align: center;
      color: var(--md-sys-color-on-surface-variant);
    }

    /* Ensure the count is always primary color */
    .collapsed-count {
      font-weight: bold;
      color: var(--md-sys-color-primary) !important;
    }

    @media (max-width: 1000px) {
      :host {
        width: 100% !important;
        height: 48px; /* Collapsed height */
        transition: none; /* User requested to forget transition */
        border-right: none;
        border-bottom: 1px solid var(--md-sys-color-outline);
        overflow: visible; /* Allow toggle button to stick out */
        z-index: 100;
        box-shadow: none;
        display: flex;
        flex-direction: column;
      }

      :host([expanded]) {
        height: auto; /* Allow growth */
        max-height: 50vh; /* Cap at 50vh */
      }

      .drawer-content {
        /* ... */
        height: auto;
        flex: 1; /* Allow taking available space */
        min-height: 0;
        /* ... */
      }

      .drawer-content {
        height: 100%;
        width: 100%;
        border-right: none;
        /* Remove the complex absolute/transition props */
        background: var(--md-sys-color-surface);
        border-bottom: none; /* Use host's border */
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      /* Restore default display behavior for expanded state */
      :host([expanded]) .drawer-content {
         max-height: none; /* Remove animation constraint */
      }

      /* Ensure content is strictly hidden when collapsed to avoid "Stuck open" issues */
      .drawer-header,
      .sites-list,
      .drawer-footer {
        display: none;
      }

      :host([expanded]) .drawer-header,
      :host([expanded]) .drawer-footer {
        display: flex;
      }

      :host([expanded]) .sites-list {
        display: block;
        flex: 1;
        min-height: 0;
        overflow-y: auto;
      }

      /* Collapse Icon Logic - Simple switching */
      .collapsed-icon {
        flex-direction: row;
        justify-content: center;
        padding-top: 0;
        gap: 8px;
        display: flex;
        height: 100%;

        /* Reset absolute positioning from previous attempt */
        position: static;
        background: transparent;
        border-bottom: none;
      }

      :host([expanded]) .collapsed-icon {
        display: none;
      }

      .collapsed-header {
        width: auto;
      }

      .collapsed-header::before {
        content: "Recent Sites";
        margin-right: 8px;
        font-weight: 500;
      }

      /* Ensure the count is always primary color, verifying user request */
      .collapsed-count {
        color: var(--md-sys-color-primary) !important;
      }

      .toggle-button {
        top: auto;
        bottom: -12px;
        left: 50%;
        right: auto;
        transform: translateX(-50%) rotate(90deg);
      }

      .drawer-footer {
        justify-content: flex-start;
      }
    }
  `;

  constructor() {
    super();
    this.expanded = false; // Default to collapsed
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

  _toggleExpanded() {
    this.expanded = !this.expanded;
  }

  render() {
    const sites = this._filteredSites;

    return html`
      <button class="toggle-button" @click=${this._toggleExpanded} title=${this.expanded ? "Collapse" : "Expand"}>
        ${this.expanded ? '‹' : '›'}
      </button>

      <div class="drawer-content">
        <div class="collapsed-icon" @click=${this._toggleExpanded} title="Expand Recent Sites">
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
                      <app-button variant="secondary" size="small" @click=${(e) => this._copyUrl(e, site.url)}>Copy</app-button>
                      <app-button variant="secondary" size="small" @click=${(e) => this._insertLink(e, site)}>Insert</app-button>
                      <app-button variant="danger" size="small" @click=${(e) => this._deleteSite(e, site.timestamp)}>Delete</app-button>
                    </div>
                </li>
              `)
      }
        </ul>

        ${this.sites.length > 0
        ? html`
              <div class="drawer-footer">
                <app-button variant="danger" size="small" @click=${this._clearAll}>Clear History</app-button>
              </div>
            `
        : ''
      }
      </div>
    `;
  }
}

customElements.define('recent-sites-drawer', RecentSitesDrawer);

