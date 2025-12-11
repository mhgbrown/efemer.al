import { LitElement, html, css } from 'lit';
import './button.js';

export class HeaderSection extends LitElement {
  static properties = {
    url: { type: String },
    showEditButton: { type: Boolean },
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    .header {
      background: var(--md-sys-color-surface-variant);
      color: var(--md-sys-color-on-surface-variant);
      border-bottom: 1px solid var(--md-sys-color-outline);
      display: flex;
      flex-direction: column;
      height: 48px;
      box-sizing: border-box;
    }
    .main-bar {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      gap: 16px;
      flex: 1;
    }
    .url-display {
      flex: 1;
      font-family: monospace;
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--md-sys-color-on-surface-variant);
      opacity: 0.8;
      background: transparent;
      padding: 0;
      margin: 0;
      border: none;
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }

    @media (max-width: 600px) {
      .main-bar {
        padding: 8px;
        gap: 8px;
      }
      .url-display {
        font-size: 11px;
      }
      .actions {
        gap: 8px;
      }
    }
    /* Old button styles removed */
  `;

  _copyUrl() {
    const copyBtn = this.shadowRoot.getElementById('copy-url-btn');
    if (!this.url || !copyBtn) return;

    try {
      navigator.clipboard.writeText(this.url);
      copyBtn.innerText = 'COPIED';
      // We can directly style or use variants if we supported a "success" variant,
      // but for now we'll rely on text update or inline style change if needed,
      // or we can add a transient class to app-button if it supports it.
      // Assuming app-button just passes through content.

      // Let's toggle variant temporarily if possible or just text
      const oldVariant = copyBtn.getAttribute('variant');
      // copyBtn.setAttribute('variant', 'primary'); // Optional: visual feedback

      setTimeout(() => {
        copyBtn.innerText = 'COPY URL';
        // copyBtn.setAttribute('variant', oldVariant);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
      alert('Failed to copy URL to clipboard');
    }
  }

  _emit(event) {
    this.dispatchEvent(new CustomEvent(event, {
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="header">
        <div class="main-bar">
          <div class="url-display" title="${this.url}">
            ${this.url}
          </div>
          <div class="actions">
            ${this.showEditButton ? html`
              <app-button variant="secondary" size="small" @click=${() => this._emit('edit')}>
                Show Editor
              </app-button>
            ` : ''}
            <app-button id="copy-url-btn" variant="secondary" size="small" @click=${this._copyUrl}>
              COPY URL
            </app-button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('header-section', HeaderSection);
