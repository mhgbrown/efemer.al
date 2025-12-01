import { LitElement, html, css } from 'lit';

export class ThemeSwitcher extends LitElement {
  static properties = {
    theme: { type: String }
  };

  static styles = css`
    .theme-switcher {
      position: fixed;
      bottom: 32px;
      right: 112px;
      z-index: 100;
      display: flex;
      gap: 8px;
    }

    .button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border: 1px solid var(--md-sys-color-primary);
      background: transparent;
      color: var(--md-sys-color-primary);
      cursor: pointer;
      font-size: 20px;
      font-family: inherit;
      border-radius: 0;
      transition: all 0.2s;
    }

    .button:hover {
      background: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
    }

    .icon {
      font-size: 24px;
    }
  `;

  constructor() {
    super();
    this.theme = 'system';
  }

  _getIcon() {
    switch (this.theme) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      default:
        return '💻';
    }
  }

  _getTooltip() {
    switch (this.theme) {
      case 'light':
        return 'Switch to Dark Mode';
      case 'dark':
        return 'Switch to System Preference';
      default:
        return 'Switch to Light Mode';
    }
  }

  _toggleTheme() {
    let newTheme;
    if (this.theme === 'light') {
      newTheme = 'dark';
    } else if (this.theme === 'dark') {
      newTheme = 'system';
    } else {
      newTheme = 'light';
    }

    this.dispatchEvent(new CustomEvent('theme-change', {
      detail: { theme: newTheme },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="theme-switcher">
        <button
          class="button"
          @click=${this._toggleTheme}
          title=${this._getTooltip()}
        >
          <span class="icon">${this._getIcon()}</span>
        </button>
      </div>
    `;
  }
}

customElements.define('theme-switcher', ThemeSwitcher);
