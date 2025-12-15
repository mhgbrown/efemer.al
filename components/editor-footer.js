import { LitElement, html, css } from 'lit';
import './app-button.js';

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
    /* Old button styles removed */
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
        <app-button variant="primary" size="small" @click=${() => this._emit('save')}>
          Save & View
        </app-button>
        <app-button variant="secondary" size="small" @click=${() => this._emit('toggle-preview')}>
          ${this.previewMode ? 'Show Editor' : 'Preview Only'}
        </app-button>
      </div>
    `;
  }
}

customElements.define('editor-footer', EditorFooter);
