import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { marked } from 'marked';
import { githubMarkdownStyles } from './github-markdown-css.js';
import { encodeContent, updateURL } from '../url-utils.js';
import './button.js';
import { RecentSitesManager } from '../recent-sites-manager.js';

export class ViewMode extends LitElement {
  static properties = {
    content: { type: String },
    sites: { type: Array },
    theme: { type: String, reflect: true },
    /**
     * Whether to allow execution of <script> tags in the rendered content.
     * Defaults to false for security.
     */
    allowScripts: { type: Boolean }
  };

  static styles = [
    githubMarkdownStyles,
    css`
    :host {
      display: block;
    }

    .view-container {
      background: var(--md-sys-color-surface);
      color: var(--md-sys-color-on-surface);
      padding: 0;
      min-height: 100vh;
      box-sizing: border-box;
    }

    .view-container:hover {
        border-color: var(--md-sys-color-primary);
    }

    .dashboard-container {
      padding: 24px;
      padding: 24px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .dashboard-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--md-sys-color-on-surface);
      margin: 0;
    }

    .sites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }

    .site-card {
      background: var(--md-sys-color-surface);
      border: 1px solid var(--md-sys-color-outline);
      padding: 16px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      flex-direction: column;
      height: 160px;
      position: relative;
    }

    .site-card:hover {
      background: var(--md-sys-color-surface-variant);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .card-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 8px;
      color: var(--md-sys-color-on-surface);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-preview {
      font-size: 14px;
      color: var(--md-sys-color-on-surface-variant);
      margin-bottom: 16px;
      flex: 1;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      opacity: 0.8;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: var(--md-sys-color-on-surface-variant);
      margin-top: auto;
    }

    .card-actions {
      display: flex;
      gap: 8px;
      opacity: 1; /* Always visible */
    }

    /* Hover effect removed as buttons are always visible now */

    .empty-dashboard {
      text-align: center;
      padding: 64px 24px;
      color: var(--md-sys-color-on-surface-variant);
    }

    .empty-dashboard h2 {
      margin-bottom: 16px;
      color: var(--md-sys-color-primary);
      font-size: 24px;
    }

    .edit-fab {
      position: fixed;
      bottom: 32px;
      right: 32px;
      z-index: 100;
    }

    .rendered-content {
      line-height: initial;
      color: initial;
      font-family: inherit;
      padding: 24px;
      box-sizing: border-box;
      min-width: 200px;
      max-width: 980px;
      margin: 0 auto;
    }

    @media (max-width: 767px) {
      .rendered-content {
        padding: 15px;
      }
    }
  `];

  constructor() {
    super();
    this.content = '';
    this.sites = [];
    this.allowScripts = false;
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

  _navigateToEdit(url) {
    let hash = url.split('#')[1] || '';
    if (!hash.endsWith('/edit')) {
      hash += '/edit';
    }
    window.location.hash = hash;
  }

  _navigateToView(e, url) {
    e.stopPropagation();
    let hash = url.split('#')[1] || '';
    if (hash.endsWith('/edit')) {
      hash = hash.replace(/\/edit$/, '');
    }
    window.location.hash = hash;
  }

  async _copyUrl(e, url) {
    e.stopPropagation();
    // Ensure we copy the view URL (without /edit)
    let copyUrl = url;
    if (copyUrl.includes('/edit')) {
      copyUrl = copyUrl.replace(/\/edit$/, '');
    }

    try {
      await navigator.clipboard.writeText(copyUrl);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  }

  _deleteSite(e, timestamp) {
    e.stopPropagation();
    if (confirm('Remove this site from history?')) {
      RecentSitesManager.deleteSite(timestamp);
    }
  }

  _formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString();
  }

  render() {
    if (!this.content) {
      // Dashboard Mode
      return html`
        <div class="view-container">
          <div class="dashboard-container">
            <div class="dashboard-header">
              <h2 class="dashboard-title">Recent Sites</h2>
              <span style="color: var(--md-sys-color-primary); font-size: 20px; font-weight: bold;">${this.sites.length}</span>
            </div>

            ${this.sites.length === 0
          ? html`
                  <div class="empty-dashboard" @click=${this._handleCreateNew} style="cursor: pointer;">
                    <h2>Welcome to efemer.al</h2>
                    <p>Create your first site to get started.</p>
                  </div>
                `
          : html`
                  <div class="sites-grid">
                    ${this.sites.map(site => html`
                      <div class="site-card" @click=${() => this._navigateToEdit(site.url)}>
                        <div class="card-title" title=${site.title}>${site.title}</div>
                        <div class="card-preview">${site.preview || 'No preview available'}</div>
                        <div class="card-footer">
                          <span>${this._formatDate(site.timestamp)}</span>
                          <div class="card-actions">
                            <app-button variant="secondary" size="small" @click=${(e) => this._navigateToView(e, site.url)}>View</app-button>
                            <app-button variant="secondary" size="small" @click=${(e) => this._copyUrl(e, site.url)}>Copy</app-button>
                            <app-button variant="danger" size="small" @click=${(e) => this._deleteSite(e, site.timestamp)}>Delete</app-button>
                          </div>
                        </div>
                      </div>
                    `)}
                  </div>
                `
        }
          </div>
        </div>
      `;
    }

    // View Mode
    return html`
      <div class="view-container">
        <div class="rendered-content markdown-body">
          ${unsafeHTML(this._getRenderedContent())}
        </div>
      </div>
      ${window.self === window.top ? html`
      <app-button class="edit-fab" size="fab" variant="primary" @click=${this._handleEdit} title="Edit">
        <span style="font-size: 24px;">✏️</span>
      </app-button>` : ''}
    `;
  }

  updated(changedProperties) {
    if (changedProperties.has('content') || changedProperties.has('sites') || changedProperties.has('allowScripts')) {
      this._executeScripts();
    }
  }

  _executeScripts() {
    if (!this.allowScripts) return;

    const container = this.shadowRoot.querySelector('.rendered-content');
    if (!container) return;

    const scripts = container.querySelectorAll('script');
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }
}

customElements.define('view-mode', ViewMode);
