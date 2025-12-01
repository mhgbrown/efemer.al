import { LitElement, html, css } from 'lit';
import { parsePath, getCurrentPath, updateURL } from '../url-utils.js';
import './view-mode.js';
import './edit-mode.js';
import './theme-switcher.js';
import './header-section.js';

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

    :host([theme='dark']) {
      --color-background: #121212;
      --color-background-secondary: #1e1e1e;
      --color-text: #e0e0e0;
      --color-text-secondary: #b0b0b0;
      --color-border: #333;
      --color-primary: #bb86fc;
      --color-primary-hover: #a76ef4;
      --color-success: #03dac6;
      --color-success-hover: #01bfa5;
      --color-secondary: #373737;
      --color-secondary-hover: #444;
      --shadow-color: rgba(255, 255, 255, 0.1);
    }

    :host([theme='light']) {
      --color-background: #f0f2f5;
      --color-background-secondary: #ffffff;
      --color-text: #333;
      --color-text-secondary: #666;
      --color-border: #ddd;
      --color-primary: #007bff;
      --color-primary-hover: #0056b3;
      --color-success: #28a745;
      --color-success-hover: #218838;
      --color-secondary: #6c757d;
      --color-secondary-hover: #545b62;
      --shadow-color: rgba(0, 0, 0, 0.1);
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

    // Apply background color to the body
    if (themeToApply === 'dark') {
      document.body.style.backgroundColor = '#121212';
    } else {
      document.body.style.backgroundColor = '#f0f2f5';
    }
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

  _updateURLDisplay() {
    // Calculate and update byte count (UTF-8) based on shareable URL
    const byteCount = new Blob([this.url]).size;
    const header = this.shadowRoot.querySelector('header-section');
    if (!header) return;

    const urlBytes = header.shadowRoot.querySelector('#url-bytes');
    if (urlBytes) {
      urlBytes.textContent = `${byteCount.toLocaleString()} bytes`;
    }

    // Update warning based on byte count
    // Since we're using hash fragments (#), server limits don't apply
    // Fragment-specific browser limits:
    // - Chrome/Edge: ~2MB (very safe)
    // - Firefox: ~65K characters (~65KB)
    // - Safari: Generally handles long fragments well
    // - IE/Old Edge: 2083 characters total URL limit
    const urlWarning = header.shadowRoot.querySelector('#url-warning');
    if (urlWarning) {
      // Clear existing classes and reset display
      urlWarning.className = 'url-warning';
      urlWarning.style.display = '';

      if (byteCount >= 65536) {
        // Red warning - exceeding Firefox limit
        urlWarning.className = 'url-warning warning-red';
        urlWarning.textContent = '⚠️ URL TOO LONG';
        urlWarning.title = 'URL exceeds 64KB - may not work in Firefox and older browsers';
      } else if (byteCount >= 2083) {
        // Yellow warning - exceeding IE/legacy browsers
        urlWarning.className = 'url-warning warning-yellow';
        urlWarning.textContent = '⚠️ TOO LONG FOR IE/LEGACY BROWSERS';
        urlWarning.title = 'URL exceeds 2KB - won\'t work in Internet Explorer and older browsers';
      } else {
        // No warning
        urlWarning.style.display = 'none';
      }
    }
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
      <theme-switcher
        .theme=${this.theme}
        @theme-change=${this._handleThemeChange}
      ></theme-switcher>
      ${this.mode === 'edit'
        ? html` <header-section .url=${this.url}></header-section>
            <edit-mode
              .content=${this.content}
              @content-change=${this._handleContentChange}
            ></edit-mode>`
        : html`<view-mode .content=${this.content}></view-mode>`}
    `;
  }
}

customElements.define('app-root', AppRoot);
