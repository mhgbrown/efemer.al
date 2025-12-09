import { LitElement, html, css } from 'lit';

export class MarkdownToolbar extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    .toolbar {
      background: var(--md-sys-color-surface-variant);
      color: var(--md-sys-color-on-surface-variant);
      border-bottom: 1px solid var(--md-sys-color-outline);
      display: flex;
      align-items: center;
      padding: 0 8px;
      height: 48px;
      box-sizing: border-box;
      gap: 12px;
      overflow-x: auto;
    }
    .group {
      display: flex;
      align-items: center;
      gap: 4px;
      padding-right: 12px;
      border-right: 1px solid var(--md-sys-color-outline);
    }
    .group:last-child {
      border-right: none;
    }
    button {
      background: transparent;
      border: none;
      color: var(--md-sys-color-on-surface-variant);
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 28px;
      width: 28px;
      transition: background-color 0.2s;
    }
    button:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    button:active {
      background-color: rgba(255, 255, 255, 0.2);
    }
    svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }
  `;

  _emit(action) {
    this.dispatchEvent(new CustomEvent('action', {
      detail: { action },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="toolbar">
        <!-- Formatting Group -->
        <div class="group">
          <button title="Bold" @click=${() => this._emit('bold')}>
            <svg viewBox="0 0 24 24"><path d="M15.6 11.8c1-.7 1.6-1.8 1.6-2.8a4 4 0 0 0-4-4H7v14h8.7c2.1 0 3.8-1.7 3.8-3.8 0-1.4-.6-2.6-1.9-3.4zM10 7.5h3c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5z"/></svg>
          </button>
          <button title="Italic" @click=${() => this._emit('italic')}>
            <svg viewBox="0 0 24 24"><path d="M10 4v3h2.2l-3.4 10H6v3h8v-3h-2.2l3.4-10H18V4z"/></svg>
          </button>
          <button title="Strikethrough" @click=${() => this._emit('strike')}>
            <svg viewBox="0 0 24 24"><path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"/></svg>
          </button>
          <button title="Heading" @click=${() => this._emit('heading')}>
             <svg viewBox="0 0 24 24"><path d="M5 4v3h5.5v10H5v3h14v-3h-5.5V7H19V4z"/></svg>
          </button>
        </div>

        <!-- Block Group -->
        <div class="group">
           <button title="Code" @click=${() => this._emit('code')}>
            <svg viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>
          </button>
          <button title="Quote" @click=${() => this._emit('quote')}>
            <svg viewBox="0 0 24 24"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>
          </button>
        </div>

        <!-- List Group -->
        <div class="group">
          <button title="Bullet List" @click=${() => this._emit('list-ul')}>
            <svg viewBox="0 0 24 24"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>
          </button>
           <button title="Numbered List" @click=${() => this._emit('list-ol')}>
            <svg viewBox="0 0 24 24"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>
          </button>
          <button title="Task List" @click=${() => this._emit('checklist')}>
             <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.4-1.4 3.6 3.6 7.6-7.6L19 8l-9 9z"/></svg>
          </button>
        </div>

         <!-- Media Group -->
        <div class="group">
          <button title="Link" @click=${() => this._emit('link')}>
            <svg viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
          </button>
           <button title="Image" @click=${() => this._emit('image')}>
            <svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
          </button>
           <button title="Table" @click=${() => this._emit('table')}>
            <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 20H4v-4h4v4zm0-6H4v-4h4v4zm0-6H4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4z"/></svg>
          </button>
          <button title="Horizontal Rule" @click=${() => this._emit('hr')}>
            <svg viewBox="0 0 24 24"><path d="M4 11h16v2H4z"/></svg>
          </button>
             <button title="Comment" @click=${() => this._emit('comment')}>
            <svg viewBox="0 0 24 24"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('markdown-toolbar', MarkdownToolbar);
