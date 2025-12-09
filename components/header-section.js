import { LitElement, html, css } from 'lit';

export class HeaderSection extends LitElement {
  static properties = {
    url: { type: String },
    byteCount: { type: Number },
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
      font-size: 11px;
      padding: 4px 8px;
      border-radius: 4px;
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
    .byte-count {
      font-size: 11px;
      font-family: monospace;
      color: var(--md-sys-color-on-surface-variant);
      opacity: 0.7;
    }
    .warning-bar {
      background: var(--md-sys-color-error-container);
      color: var(--md-sys-color-on-error-container);
      padding: 8px 16px;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      border-top: 1px solid rgba(0,0,0,0.1);
    }
    .warning-icon {
      font-size: 14px;
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

  render() {
    let warning = null;
    if (this.byteCount >= 65536) {
      warning = html`
        <div class="warning-bar">
          <span class="warning-icon">⚠️</span>
          <span><strong>This site is very large (>64KB).</strong> It may not work in some browsers or chat apps due to URL length limits.</span>
        </div>
      `;
    } else if (this.byteCount >= 2083) {
      warning = html`
        <div class="warning-bar" style="background-color: var(--md-sys-color-secondary-container); color: var(--md-sys-color-on-secondary-container);">
          <span class="warning-icon">⚠️</span>
          <span><strong>This site is large (>2KB).</strong> It might not work in older browsers like Internet Explorer.</span>
        </div>
      `;
    }

    return html`
      <div class="header">
        <div class="main-bar">
          <div class="url-display" title="${this.url}">
            ${this.url}
          </div>
          <div class="actions">
            <span class="byte-count">${this.byteCount ? this.byteCount.toLocaleString() : 0} bytes</span>
            <button class="copy-button" id="copy-url-btn" @click=${this._copyUrl}>
              COPY URL
            </button>
          </div>
        </div>
        ${warning}
      </div>
    `;
  }
}

customElements.define('header-section', HeaderSection);
