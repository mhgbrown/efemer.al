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
      border-radius: 16px;
      margin-bottom: 24px;
      box-shadow: var(--md-sys-elevation-1);
      transition: box-shadow 0.3s ease;
    }
    .header:hover {
        box-shadow: var(--md-sys-elevation-2);
    }
    .header h1 {
      font-size: 28px;
      margin-bottom: 8px;
      font-weight: 700;
      color: var(--md-sys-color-on-surface);
      font-family: 'Domine', serif;
    }
    .header p {
      color: var(--md-sys-color-on-surface-variant);
      font-size: 14px;
      line-height: 20px;
    }
    .url-info {
      background: var(--md-sys-color-surface-variant);
      color: var(--md-sys-color-on-surface-variant);
      padding: 16px;
      border-radius: 12px;
      margin-top: 24px;
      font-size: 12px;
    }
    .url-info-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      flex-wrap: wrap;
      gap: 10px;
    }
    .url-info-header strong {
      font-size: 14px;
      font-weight: 500;
      color: var(--md-sys-color-on-surface-variant);
    }
    .url-stats {
      display: flex;
      gap: 10px;
      align-items: center;
      font-size: 12px;
      color: var(--md-sys-color-on-surface-variant);
    }
    .byte-count {
      font-weight: 500;
    }
    .url-warning {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 500;
      display: none;
    }
    .url-warning.warning-yellow {
      display: inline-block;
      background: var(--md-sys-color-error-container);
      color: var(--md-sys-color-on-error-container);
      border: none;
    }
    .url-warning.warning-red {
      display: inline-block;
      background: var(--md-sys-color-error);
      color: var(--md-sys-color-on-error);
      border: none;
    }
    .url-display {
      background: var(--md-sys-color-surface);
      color: var(--md-sys-color-on-surface);
      padding: 12px;
      border-radius: 8px;
      font-family: 'Roboto Mono', monospace; /* Keep monospace for URL */
      font-size: 12px;
      word-break: break-all;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      line-height: 1.5;
      max-height: 4.5em;
      margin-bottom: 16px;
      border: 1px solid var(--md-sys-color-outline);
      min-height: 4.5em;
    }
    .copy-button {
      padding: 10px 24px;
      background: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
      border: none;
      border-radius: 20px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: background 0.2s, box-shadow 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .copy-button:hover {
      background: var(--md-sys-color-primary); /* Darken slightly or add overlay */
      box-shadow: var(--md-sys-elevation-1);
      opacity: 0.9;
    }
    .copy-button.copied {
      background: var(--md-sys-color-tertiary);
      color: var(--md-sys-color-on-tertiary);
    }
  `;

  _copyUrl() {
    const copyBtn = this.shadowRoot.getElementById('copy-url-btn');
    if (!this.url || !copyBtn) return;

    try {
      navigator.clipboard.writeText(this.url);
      const originalText = copyBtn.textContent;
      copyBtn.textContent = '✓ Copied!';
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
        <h1>URL-Based Web App</h1>
        <p>Your entire site lives in the URL. Edit with markdown and share the link!</p>
        <div class="url-info">
          <div class="url-info-header">
            <strong>Current URL:</strong>
            <div class="url-stats">
              <span class="byte-count" id="url-bytes">0 bytes</span>
              <span class="url-warning" id="url-warning"></span>
            </div>
          </div>
          <div class="url-display" id="current-url">${this.url}</div>
          <button class="copy-button" id="copy-url-btn" @click=${this._copyUrl}>
            📋 Copy URL
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('header-section', HeaderSection);
