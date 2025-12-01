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
      border: 1px solid var(--md-sys-color-outline);
      margin-bottom: 24px;
      box-shadow: var(--md-sys-elevation-1);
      transition: box-shadow 0.3s ease;
      border-radius: 0; /* Force sharp corners */
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
      font-size: 48px;
      margin-bottom: 8px;
      font-weight: 600;
      color: var(--md-sys-color-primary);
      font-family: 'Teko', sans-serif;
      text-transform: uppercase;
      letter-spacing: 2px;
      line-height: 0.9;
    }
    .header p {
      color: var(--md-sys-color-on-surface-variant);
      margin-bottom: 16px;
      font-family: 'Share Tech Mono', monospace;
      font-size: 14px;
      letter-spacing: 1px;
    }
    .url-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
      background: var(--md-sys-color-surface-variant);
      padding: 16px;
      border: 1px solid var(--md-sys-color-outline);
    }
    .url-label {
      font-size: 12px;
      font-weight: 500;
      font-weight: 600;
      color: var(--md-sys-color-secondary); /* Blue accent */
      display: flex;
      justify-content: space-between;
      text-transform: uppercase;
      font-family: 'Chakra Petch', sans-serif;
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
      color: var(--md-sys-color-error);
      font-size: 12px;
      margin-top: 0; /* Adjusted from 8px */
      display: flex;
      align-items: center;
      gap: 4px;
      font-weight: 500;
      text-transform: uppercase;
      font-family: 'Chakra Petch', sans-serif;
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
      background: var(--md-sys-color-background);
      color: var(--md-sys-color-on-surface);
      padding: 12px;
      font-family: 'Share Tech Mono', monospace;
      font-size: 14px;
      word-break: break-all;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      line-height: 1.4;
      max-height: 4.2em;
      margin-bottom: 16px;
      border: 1px solid var(--md-sys-color-outline);
      min-height: 4.2em;
      border-radius: 0; /* Ensure sharp corners */
    }
    .copy-button {
      padding: 12px 24px;
      background: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
      border: 1px solid var(--md-sys-color-primary); /* Unified button style */
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;
      font-family: 'Chakra Petch', sans-serif;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      clip-path: none; /* Removed clip-path for hard borders */
      border-radius: 0; /* Ensure sharp corners */
    }
    .copy-button:hover {
      background: var(--md-sys-color-secondary); /* Blue hover */
      color: var(--md-sys-color-on-secondary);
      border-color: var(--md-sys-color-secondary);
      box-shadow: 0 0 15px var(--md-sys-color-secondary);
    }
    .copy-button.copied {
      background: var(--md-sys-color-secondary); /* Blue for copied state */
      color: var(--md-sys-color-on-secondary);
      border: 1px solid var(--md-sys-color-secondary); /* Unified button style */
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
        <h1>ephemer.al</h1>
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
