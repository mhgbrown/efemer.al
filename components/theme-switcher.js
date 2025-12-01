import { LitElement, html, css } from 'lit';

export class ThemeSwitcher extends LitElement {
  static properties = {
    theme: { type: String }
  };

  static styles = css`
    .theme-switcher {
      position: fixed;
      bottom: 32px;
      right: 104px; /* Positioned next to the FAB */
      z-index: 1001;
    }

    .button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 16px; /* Squared corners for MD3 */
      border: none;
      cursor: pointer;
      background: var(--md-sys-color-secondary-container);
      color: var(--md-sys-color-on-secondary-container);
      box-shadow: var(--md-sys-elevation-2);
      transition: all 0.2s;
    }

    .button:hover {
      transform: scale(1.05);
      box-shadow: var(--md-sys-elevation-3);
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
