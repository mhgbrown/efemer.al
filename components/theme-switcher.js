import { LitElement, html, css } from 'lit';

export class ThemeSwitcher extends LitElement {
  static properties = {
    theme: { type: String }
  };

  static styles = css`
    .theme-switcher {
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 1001;
    }

    .button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      background: var(--color-background-secondary);
      color: var(--color-text);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.2s;
    }

    .button:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .button:active {
      transform: scale(1);
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
