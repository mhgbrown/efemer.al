import { LitElement, html, css } from 'lit';

export class HeaderSection extends LitElement {
  static properties = {
    url: { type: String },
  };

  static styles = css`
    .header {
      background: var(--color-background-secondary);
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px var(--shadow-color);
    }
    .header h1 {
      font-size: 24px;
      margin-bottom: 10px;
    }
    .header p {
      color: var(--color-text-secondary);
      font-size: 14px;
    }
    .url-info {
      background: var(--color-background);
      padding: 15px;
      border-radius: 4px;
      margin-top: 15px;
      font-size: 12px;
    }
    .url-info-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      flex-wrap: wrap;
      gap: 10px;
    }
    .url-info-header strong {
      font-size: 13px;
    }
    .url-stats {
      display: flex;
      gap: 10px;
      align-items: center;
      font-size: 11px;
      color: var(--color-text-secondary);
    }
    .byte-count {
      font-weight: 600;
    }
    .url-warning {
      padding: 4px 8px;
      border-radius: 3px;
      font-size: 10px;
      font-weight: 600;
      display: none;
    }
    .url-warning.warning-yellow {
      display: inline-block;
      background: #fff3cd;
      color: #856404;
      border: 1px solid #ffeaa7;
    }
    .url-warning.warning-red {
      display: inline-block;
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
    .url-display {
      background: var(--color-background-secondary);
      padding: 10px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 11px;
      word-break: break-all;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      line-height: 1.4;
      max-height: 4.2em;
      margin-bottom: 10px;
      border: 1px solid var(--color-border);
      min-height: 4.2em;
    }
    .copy-button {
      padding: 8px 16px;
      background: var(--color-primary);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      transition: background 0.2s;
    }
    .copy-button:hover {
      background: var(--color-primary-hover);
    }
    .copy-button.copied {
      background: var(--color-success);
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
