import { LitElement, html, css } from 'lit';
import './button.js';

export class ThemeSwitcher extends LitElement {
  static properties = {
    theme: { type: String }
  };

  static styles = css`
    .theme-switcher {
      display: flex;
      gap: 8px;
    }

    .button:hover {
      /* background behavior handled by app-button variant */
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
        <app-button
          variant="secondary"
          class="button"
          @click=${this._toggleTheme}
          title=${this._getTooltip()}
        >
          <span class="icon">${this._getIcon()}</span>
        </app-button>
      </div>
    `;
  }
}

customElements.define('theme-switcher', ThemeSwitcher);
