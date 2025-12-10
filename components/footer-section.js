import { LitElement, html, css } from 'lit';

export class FooterSection extends LitElement {
  static properties = {
    byteCount: { type: Number },
    contentByteCount: { type: Number },
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    .footer {
      background: var(--md-sys-color-surface-variant);
      color: var(--md-sys-color-on-surface-variant);
      border-top: 1px solid var(--md-sys-color-outline);
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 16px;
      padding: 8px 16px;
      height: 48px; /* Standard bar height */
      box-sizing: border-box;
      font-size: 13px;
    }
    .footer-section {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .warning-container {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .stat-item {
      font-family: monospace;
      font-weight: 600;
      opacity: 0.8;
      flex-shrink: 0;
    }
    .warning-text {
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .warning-yellow {
      color: #8B8000; /* Darker yellow for text visibility */
    }
    .warning-red {
      color: var(--md-sys-color-error);
    }
  `;

  _renderWarning() {
    if (!this.byteCount) return html`<span></span>`;

    if (this.byteCount >= 65536) {
      return html`
        <span class="warning-text warning-red" title="URL exceeds 64KB">
          <span>⚠️</span> URL > 64KB (may not work in some apps)
        </span>
      `;
    } else if (this.byteCount >= 2083) {
      return html`
        <span class="warning-text warning-yellow" title="URL exceeds 2KB">
          <span>⚠️</span> URL > 2KB (legacy browser issues)
        </span>
      `;
    }
    return html`<span></span>`;
  }

  _getCompressionRatio() {
    if (!this.byteCount || !this.contentByteCount) return null;
    return (this.contentByteCount / this.byteCount).toFixed(2);
  }

  render() {
    const ratio = this._getCompressionRatio();

    return html`
      <div class="footer">
        <div class="footer-section">
          <div class="stat-item" title="URL Size">
            ${this.byteCount ? this.byteCount.toLocaleString() : 0} bytes
          </div>
          ${ratio ? html`
            <div class="stat-item" title="Content Size / URL Size">
              Ratio: ${ratio}x
            </div>
          ` : ''}
        </div>
        <div class="warning-container">
          ${this._renderWarning()}
        </div>
      </div>
    `;
  }
}

customElements.define('footer-section', FooterSection);
