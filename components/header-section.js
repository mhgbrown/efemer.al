import { LitElement, html, css } from 'lit';

export class HeaderSection extends LitElement {
  static properties = {
    url: { type: String },
  };

  static styles = css`
    .header {
      background: var(--md-sys-color-surface);
      color: var(--md-sys-color-on-surface);
      padding: 24px;
      margin-bottom: 24px;
      border-radius: 0;
    }
    .header h1 {
      font-size: 32px;
      margin-bottom: 8px;
      font-weight: bold;
      color: var(--md-sys-color-primary);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      text-transform: none;
      letter-spacing: normal;
    }
    .header p {
      color: var(--md-sys-color-on-surface);
      margin-bottom: 16px;
      font-family: inherit;
      font-size: 16px;
    }
    .url-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
      background: var(--md-sys-color-surface-variant);
      padding: 16px;
    }
    .url-info-header {
      font-size: 14px;
      font-weight: bold;
      color: var(--md-sys-color-on-surface);
      display: flex;
      justify-content: space-between;
      font-family: inherit;
      margin-bottom: 16px;
    }
    .url-stats {
      display: flex;
      gap: 10px;
      align-items: center;
      font-size: 14px;
      color: var(--md-sys-color-on-surface);
    }
    .byte-count {
      font-weight: bold;
    }
    .url-warning {
      color: var(--md-sys-color-error);
      font-size: 14px;
      margin-top: 0;
      display: flex;
      align-items: center;
      gap: 4px;
      font-weight: bold;
      font-family: inherit;
    }
    .url-warning.warning-yellow {
      display: inline-block;
      background: yellow;
      color: black;
      border: 1px solid black;
    }
    .url-warning.warning-red {
      display: inline-block;
      background: red;
      color: white;
      border: 1px solid black;
    }
    .url-display {
      background: var(--md-sys-color-background);
      color: var(--md-sys-color-on-background);
      padding: 0;
      font-family: monospace;
      font-size: 14px;
      word-break: break-all;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      line-height: 1.4;
      margin-bottom: 16px;
      border-radius: 0;
    }
    .url-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .copy-button {
      padding: 12px 24px;
      background: transparent;
      color: var(--md-sys-color-primary);
      border: 1px solid var(--md-sys-color-primary);
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      font-family: inherit;
      text-transform: uppercase;
      letter-spacing: 1px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border-radius: 0;
      transition: all 0.2s;
    }
    .copy-button:hover {
      background: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
    }
    .copy-button.copied {
      background: var(--md-sys-color-secondary);
      color: var(--md-sys-color-on-secondary);
      border-color: var(--md-sys-color-on-secondary);
    }
  `;

  _copyUrl() {
    const copyBtn = this.shadowRoot.getElementById('copy-url-btn');
    if (!this.url || !copyBtn) return;

    try {
      navigator.clipboard.writeText(this.url);
      const originalText = copyBtn.textContent;
      copyBtn.textContent = '✓ COPIED!';
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.classList.remove('copied');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
      alert('Failed to copy URL to clipboard');
    }
  }

  render() {
    return html`
      <div class="header">
        <h1>ephemer.al</h1>
        <p>Your entire site lives in the URL. Edit with markdown and share the link!</p>
        <div class="url-info">
          <div class="url-info-header">
            <strong>Current URL:</strong>
          </div>
          <div class="url-display" id="current-url">${this.url}</div>
          <div class="url-actions">
            <button class="copy-button" id="copy-url-btn" @click=${this._copyUrl}>
              COPY URL
            </button>
            <div class="url-stats">
              <span class="byte-count" id="url-bytes">0 bytes</span>
              <span class="url-warning" id="url-warning"></span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('header-section', HeaderSection);
