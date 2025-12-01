import { LitElement, html, css } from 'lit';
import { parsePath, getCurrentPath, updateURL } from '../url-utils.js';
import './view-mode.js';
import './edit-mode.js';
import './theme-switcher.js';
import './header-section.js';
import './nav-header.js';

export class AppRoot extends LitElement {
  static properties = {
    mode: { type: String },
    content: { type: String },
    theme: { type: String, state: true },
    url: { type: String },
  };

  static styles = css`
    :host {
      display: block;
    }

    :host {
      display: block;
      color: var(--md-sys-color-on-background);
      background-color: var(--md-sys-color-background);
    }

  `;

  constructor() {
    super();
    this.mode = 'view';
    this.content = '';
    this.url = '';
    this.theme = this._getInitialTheme();
    this._handleRouteChange = this._handleRouteChange.bind(this);
    this._applyTheme = this._applyTheme.bind(this);
    this._mediaQuery = null;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('hashchange', this._handleRouteChange);
    this._handleRouteChange();
    this._applyTheme();

    this._mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this._mediaQuery.addEventListener('change', this._applyTheme);

    // Listen for navigation events from children
    this.addEventListener('navigate', (e) => {
      this.navigateTo(e.detail.path);
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('hashchange', this._handleRouteChange);
    this._mediaQuery.removeEventListener('change', this._applyTheme);
  }

  _getInitialTheme() {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme || 'system';
  }

  _handleThemeChange(e) {
    this.theme = e.detail.theme;
    localStorage.setItem('theme', this.theme);
    this._applyTheme();
  }

  _applyTheme() {
    let themeToApply = this.theme;
    if (themeToApply === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      themeToApply = prefersDark ? 'dark' : 'light';
    }
    this.setAttribute('theme', themeToApply);

    // Set the global data-theme attribute so CSS variables update correctly
    document.documentElement.setAttribute('data-theme', themeToApply);
  }

  async _handleRouteChange() {
    const path = getCurrentPath();
    const { mode, content } = await parsePath(path);
    this.mode = mode;
    this.content = content;
    this.url = this._getShareableUrl();

    // Update URL display and stats in header
    this._updateURLDisplay();
  }

  _getShareableUrl() {
    // Get the URL without /edit suffix for sharing
    let url = window.location.href;
    if (url.includes('/edit')) {
      url = url.replace(/\/edit$/, '');
    }
    return url;
  }

  _getByteCount() {
    return new Blob([this.url]).size;
  }

  _updateURLDisplay() {
    // No-op: handled by reactive properties now
  }

  _setupCopyButton() {
    // The copy button is now in header-section, so this is no longer needed here.
  }

  // Method to manually trigger route change (for programmatic navigation)
  navigateTo(path) {
    updateURL(path);
    this._handleRouteChange();
  }

  _handleContentChange(e) {
    this.content = e.detail.content;
    // Update URL will trigger hashchange which updates the component
  }

  render() {
    return html`
      ${this.mode === 'edit' || !this.content ? html`<nav-header></nav-header>` : ''}
      ${this.mode === 'edit'
        ? html` <header-section .url=${this.url} .byteCount=${this._getByteCount()}></header-section>
            <edit-mode
              .content=${this.content}
              @content-change=${this._handleContentChange}
            ></edit-mode>`
        : html`<view-mode .content=${this.content}></view-mode>`}
      <theme-switcher
        .theme=${this.theme}
        @theme-change=${this._handleThemeChange}
      ></theme-switcher>
    `;
  }
}

customElements.define('app-root', AppRoot);
