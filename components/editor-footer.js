import { LitElement, html, css } from 'lit';

export class EditorFooter extends LitElement {
  static properties = {
    previewMode: { type: Boolean }
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
      padding: 8px 16px;
      height: 48px;
      box-sizing: border-box;
      gap: 16px;
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    button {
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
      gap: 6px;
      height: 28px;
      transition: all 0.2s;
    }
    button:hover {
      background: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
    }
  `;

  _emit(event) {
    this.dispatchEvent(new CustomEvent(event, {
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="footer">
        <button class="button-success" @click=${() => this._emit('save')}>
          Save & View
        </button>
        <button class="button-secondary" @click=${() => this._emit('toggle-preview')}>
          ${this.previewMode ? 'Show Editor' : 'Preview Only'}
        </button>
      </div>
    `;
  }
}

customElements.define('editor-footer', EditorFooter);
