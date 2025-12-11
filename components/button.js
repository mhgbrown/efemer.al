import { LitElement, html, css } from 'lit';

export class AppButton extends LitElement {
  static properties = {
    variant: { type: String }, // primary, secondary, danger, ghost, icon
    size: { type: String }, // small, medium, large
    disabled: { type: Boolean },
    type: { type: String }, // submit, button, reset
  };

  static styles = css`
    :host {
      display: inline-block;
    }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      font-family: inherit;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-radius: 4px; /* Slight rounding for modern feel, or 0 for strict rectangle */
      border-width: 1px;
      border-style: solid;
      transition: all 0.2s ease-in-out;
      box-sizing: border-box;
      white-space: nowrap;
    }

    /* Sizes */
    .medium {
      padding: 8px 16px;
      font-size: 14px;
      height: 36px;
    }

    .small {
      padding: 4px 8px;
      font-size: 12px;
      height: 28px;
    }

    .large {
      padding: 12px 24px;
      font-size: 16px;
      height: 48px;
    }

    .icon-only {
      padding: 8px;
      width: 36px;
      height: 36px;
      border-radius: 50%; /* Circular for icon buttons */
    }

    .icon-only.small {
      width: 24px;
      height: 24px;
      padding: 4px;
    }

    .fab {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        padding: 0;
        z-index: 10;
    }

    /* Variants */

    /* Primary: Filled color */
    .primary {
      background: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
      border-color: var(--md-sys-color-primary);
    }

    .primary:hover:not(:disabled) {
      background: var(--md-sys-color-primary-container); /* Check if this var exists, otherwise darken/lighten */
      /* Fallback if container vars aren't reliable in this system: opacity or filter */
      filter: brightness(110%);
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    /* Secondary: Outlined (Default style seen in app) */
    .secondary {
      background: transparent;
      color: var(--md-sys-color-primary);
      border-color: var(--md-sys-color-primary);
    }

    .secondary:hover:not(:disabled) {
      background: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
    }

    /* Danger: Red outline/text by default, fill on hover? Or filled?
       Based on 'Delete' buttons seen: transparent background, error color text/border.
    */
    .danger {
      background: transparent;
      color: var(--md-sys-color-error);
      border-color: var(--md-sys-color-error);
    }

    .danger:hover:not(:disabled) {
      background: var(--md-sys-color-error);
      color: var(--md-sys-color-on-error);
    }

    /* Ghost: No border, just text/icon */
    .ghost {
      background: transparent;
      color: var(--md-sys-color-on-surface);
      border-color: transparent;
    }

    .ghost:hover:not(:disabled) {
      background: var(--md-sys-color-surface-variant);
    }

    /* Disabled State */
    button:disabled {
      cursor: not-allowed;
      opacity: 0.5;
      filter: grayscale(100%);
    }
  `;

  constructor() {
    super();
    this.variant = 'secondary';
    this.size = 'medium';
    this.disabled = false;
    this.type = 'button';
  }

  render() {
    return html`
      <button
        class="${this.variant} ${this.size}"
        ?disabled=${this.disabled}
        type=${this.type}
      >
        <slot name="icon"></slot>
        <slot></slot>
      </button>
    `;
  }
}

customElements.define('app-button', AppButton);
