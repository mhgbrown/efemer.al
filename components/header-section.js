import { LitElement, html, css } from 'lit';

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
    }
    .main-bar {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      gap: 16px;
      height: 48px;
      box-sizing: border-box;
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
    .copy-button {
      background: transparent;
      border: 1px solid var(--md-sys-color-outline);
      color: var(--md-sys-color-primary);
      cursor: pointer;
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 0;
      font-weight: 600;
      text-transform: uppercase;
      font-family: inherit;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: all 0.2s;
    }
    .copy-button:hover {
      background: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
      border-color: var(--md-sys-color-primary);
    }
    .copy-button.copied {
      background: var(--md-sys-color-secondary);
      color: var(--md-sys-color-on-secondary);
      border-color: var(--md-sys-color-on-secondary);
    }
    .edit-button {
      background: transparent;
      border: 1px solid var(--md-sys-color-outline);
      color: var(--md-sys-color-primary);
      cursor: pointer;
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 0;
      font-weight: 600;
      text-transform: uppercase;
      font-family: inherit;
      height: 28px;
      display: flex;
      align-items: center;
    }
    .edit-button:hover {
      background: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
    }
  `;

  _copyUrl() {
    const copyBtn = this.shadowRoot.getElementById('copy-url-btn');
    if (!this.url || !copyBtn) return;

    try {
      navigator.clipboard.writeText(this.url);
      const originalText = copyBtn.innerText;
      copyBtn.innerText = 'COPIED';
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyBtn.innerText = 'COPY URL';
        copyBtn.classList.remove('copied');
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
              <button class="edit-button" @click=${() => this._emit('edit')}>
                Show Editor
              </button>
            ` : ''}
            <button class="copy-button" id="copy-url-btn" @click=${this._copyUrl}>
              COPY URL
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('header-section', HeaderSection);
