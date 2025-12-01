import { LitElement, html, css } from 'lit';
import { marked } from 'marked';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { encodeContent, updateURL } from '../url-utils.js';

export class EditMode extends LitElement {
  static properties = {
    content: { type: String },
    _previewMode: { type: Boolean },
    _uploadingImage: { type: Boolean }
  };

  static styles = css`
    :host {
      display: block;
    }

    .edit-container {
      background: var(--md-sys-color-surface);
      color: var(--md-sys-color-on-surface);
      padding: 24px;
      border-radius: 16px;
      box-shadow: var(--md-sys-elevation-1);
      min-height: 400px;
      transition: box-shadow 0.3s ease;
    }

    .edit-container:hover {
        box-shadow: var(--md-sys-elevation-2);
    }

    .toolbar {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--md-sys-color-outline);
      flex-wrap: wrap;
    }

    .button {
      padding: 10px 24px;
      border: none;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .button-primary {
      background: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
    }

    .button-primary:hover {
      opacity: 0.9;
      box-shadow: var(--md-sys-elevation-1);
    }

    .button-secondary {
      background: var(--md-sys-color-secondary-container);
      color: var(--md-sys-color-on-secondary-container);
    }

    .button-secondary:hover {
      opacity: 0.9;
      box-shadow: var(--md-sys-elevation-1);
    }

    .button-success {
      background: var(--md-sys-color-primary-container); /* Using primary container for save action to fit theme */
      color: var(--md-sys-color-on-primary-container);
    }

    .button-success:hover {
      opacity: 0.9;
      box-shadow: var(--md-sys-elevation-1);
    }

    .editor-area {
      display: flex;
      gap: 24px;
      height: 600px;
    }

    .editor-pane {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .pane-label {
      font-weight: 500;
      margin-bottom: 12px;
      color: var(--md-sys-color-on-surface);
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    textarea {
      flex: 1;
      width: 100%;
      padding: 16px;
      border: 1px solid var(--md-sys-color-outline);
      border-radius: 8px;
      font-family: 'Roboto Mono', monospace;
      font-size: 14px;
      line-height: 1.6;
      resize: vertical;
      transition: border-color 0.2s;
      background-color: var(--md-sys-color-surface-variant);
      color: var(--md-sys-color-on-surface-variant);
    }

    textarea:focus {
      outline: none;
      border-color: var(--md-sys-color-primary);
      border-width: 2px;
      padding: 15px; /* Adjust for border width change */
    }

    .preview-pane {
      flex: 1;
      border: 1px solid var(--md-sys-color-outline);
      border-radius: 8px;
      padding: 16px;
      overflow-y: auto;
      background: var(--md-sys-color-surface);
      color: var(--md-sys-color-on-surface);
    }

    .rendered-content {
      line-height: 1.6;
      color: var(--md-sys-color-on-surface);
      font-family: 'DM Sans', sans-serif;
    }

    .rendered-content h1 {
      font-size: 32px;
      margin: 24px 0 16px;
      color: var(--md-sys-color-on-surface);
      border-bottom: 1px solid var(--md-sys-color-outline);
      padding-bottom: 8px;
      font-weight: 700;
      font-family: 'Domine', serif;
    }

    .rendered-content h2 {
      font-size: 26px;
      margin: 20px 0 12px;
      color: var(--md-sys-color-on-surface);
      font-weight: 600;
      font-family: 'Domine', serif;
    }

    .rendered-content h3 {
      font-size: 22px;
      margin: 16px 0 10px;
      color: var(--md-sys-color-on-surface);
      font-weight: 600;
      font-family: 'Domine', serif;
    }

    .rendered-content p {
      margin: 16px 0;
    }

    .rendered-content code {
      background: var(--md-sys-color-surface-variant);
      color: var(--md-sys-color-on-surface-variant);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Roboto Mono', monospace;
      font-size: 13px;
    }

    .rendered-content pre {
      background: var(--md-sys-color-surface-variant);
      color: var(--md-sys-color-on-surface-variant);
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 16px 0;
    }

    .rendered-content pre code {
      background: none;
      padding: 0;
      color: inherit;
    }

    .rendered-content ul, .rendered-content ol {
      margin: 16px 0;
      padding-left: 32px;
    }

    .rendered-content li {
      margin: 8px 0;
    }

    .rendered-content blockquote {
      border-left: 4px solid var(--md-sys-color-primary);
      padding-left: 16px;
      margin: 16px 0;
      color: var(--md-sys-color-on-surface-variant);
      font-style: italic;
    }

    .rendered-content a {
      color: var(--md-sys-color-primary);
      text-decoration: none;
      font-weight: 500;
    }

    .rendered-content a:hover {
      text-decoration: underline;
    }

    .rendered-content img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 16px 0;
      box-shadow: var(--md-sys-elevation-1);
    }

    .help-text {
      margin-top: 24px;
      padding: 16px;
      background: var(--md-sys-color-surface-variant);
      color: var(--md-sys-color-on-surface-variant);
      border-radius: 8px;
      font-size: 14px;
      line-height: 20px;
    }

    .url-warning {
      font-weight: 500;
      padding: 4px 8px;
      border-radius: 4px;
      margin-left: 12px;
      font-size: 12px;
    }

    .warning-yellow {
      background: var(--md-sys-color-error-container);
      color: var(--md-sys-color-on-error-container);
      border: none;
    }

    .warning-red {
      background: var(--md-sys-color-error);
      color: var(--md-sys-color-on-error);
      border: none;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
    }

    @media (max-width: 768px) {
      .editor-area {
        flex-direction: column;
        height: auto;
      }

      .editor-pane,
      .preview-pane {
        height: 400px;
      }

      .toolbar {
        flex-direction: column;
        align-items: stretch;
      }

      .button {
        width: 100%;
      }
    }

    .save-button {
      position: fixed;
      bottom: 32px;
      right: 32px;
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--md-sys-color-primary-container);
      color: var(--md-sys-color-on-primary-container);
      text-decoration: none;
      border-radius: 16px;
      box-shadow: var(--md-sys-elevation-3);
      transition: all 0.2s;
      cursor: pointer;
      border: none;
      font-size: 24px;
      box-sizing: border-box;
      z-index: 100;
    }

    .save-button:hover {
      background: var(--md-sys-color-primary-container);
      transform: scale(1.05);
      box-shadow: var(--md-sys-elevation-4);
    }
  `;

  constructor() {
    super();
    this.content = '';
    this._previewMode = false;
    this._uploadingImage = false;
  }

  _handleInput(e) {
    this.content = e.target.value;
    this._updateURL();
  }

  async _updateURL() {
    const encoded = await encodeContent(this.content);
    updateURL(`${encodeURIComponent(encoded)}/edit`);
    this.dispatchEvent(new CustomEvent('content-change', {
      detail: { content: this.content },
      bubbles: true,
      composed: true
    }));
    // Update URL display and stats
  }

  async _handleSave() {
    const encoded = await encodeContent(this.content);
    this.dispatchEvent(new CustomEvent('navigate', {
      detail: { path: encodeURIComponent(encoded) },
      bubbles: true,
      composed: true
    }));
  }

  async _handleNewSite() {
    if (this.content && this.content.trim()) {
      const confirmed = confirm('Start a new site? Your current content will not be saved unless you copy the URL first.');
      if (!confirmed) return;
    }

    const defaultContent = '# Welcome!\n\nStart editing to create your site.';
    const encoded = await encodeContent(defaultContent);
    this.dispatchEvent(new CustomEvent('navigate', {
      detail: { path: `${encodeURIComponent(encoded)}/edit` },
      bubbles: true,
      composed: true
    }));
  }

  _togglePreview() {
    this._previewMode = !this._previewMode;
  }

  _triggerImageUpload() {
    const input = this.shadowRoot.querySelector('#image-upload');
    if (input) {
      input.click();
    }
  }

  async _handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    this._uploadingImage = true;

    // Force update to show loading state
    this.requestUpdate();

    try {
      console.log('Starting image compression for:', file.name, file.size, 'bytes');

      // Compress and convert image to optimized base64
      const base64 = await this._compressImage(file);

      console.log('Image compressed, base64 length:', base64.length);

      // Create markdown image syntax with data URI
      const imageMarkdown = `![${file.name}](${base64})`;

      // Insert at cursor position or append
      const textarea = this.shadowRoot.querySelector('textarea');
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const textBefore = this.content.substring(0, start);
        const textAfter = this.content.substring(end);

        // Add newlines around the image for better formatting
        const newContent = textBefore + '\n\n' + imageMarkdown + '\n\n' + textAfter;
        this.content = newContent;

        // Update URL and trigger re-render
        this._updateURL();

        // Set cursor position after the inserted image
        await this.updateComplete;
        const newPosition = start + imageMarkdown.length + 4;
        textarea.focus();
        textarea.setSelectionRange(newPosition, newPosition);
      } else {
        // If no textarea (shouldn't happen), just append
        this.content += '\n\n' + imageMarkdown + '\n\n';
        this._updateURL();
      }

      console.log('Image inserted successfully');

      // Clear the file input
      const input = this.shadowRoot.querySelector('#image-upload');
      if (input) {
        input.value = '';
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`Failed to upload image: ${error.message}`);
    } finally {
      console.log('Resetting upload state');
      this._uploadingImage = false;
      this.requestUpdate();

      // Also clear the input
      const input = this.shadowRoot.querySelector('#image-upload');
      if (input) {
        input.value = '';
      }
    }
  }

  async _compressImage(file) {
    return new Promise((resolve, reject) => {
      // Use createObjectURL for more reliable loading
      const objectUrl = URL.createObjectURL(file);
      console.log('Created object URL, loading image');

      const img = new Image();

      img.onload = () => {
        try {
          console.log('Image loaded, original size:', img.width, 'x', img.height);

          // Clean up object URL
          URL.revokeObjectURL(objectUrl);

          // Create canvas for compression
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Calculate new dimensions (max width/height: 1200px)
          const MAX_SIZE = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height = (height * MAX_SIZE) / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = (width * MAX_SIZE) / height;
              height = MAX_SIZE;
            }
          }

          console.log('Resizing to:', width, 'x', height);

          canvas.width = width;
          canvas.height = height;

          // Draw image with high quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          console.log('Image drawn to canvas, converting to data URL');

          // Convert to WebP with quality 0.8 (or fallback to JPEG)
          let dataUrl;
          try {
            dataUrl = canvas.toDataURL('image/webp', 0.8);
            if (!dataUrl.startsWith('data:image/webp')) {
              throw new Error('WebP not supported');
            }
            console.log('Converted to WebP');
          } catch (e) {
            console.log('WebP not supported, using JPEG');
            dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          }

          resolve(dataUrl);
        } catch (error) {
          URL.revokeObjectURL(objectUrl);
          reject(error);
        }
      };

      img.onerror = (error) => {
        URL.revokeObjectURL(objectUrl);
        console.error('Image element error:', error);
        reject(new Error('Failed to load image'));
      };

      img.src = objectUrl;
    });
  }

  _getRenderedContent() {
    if (!this.content) {
      return '<p style="color: #999; font-style: italic;">Start typing markdown to see preview...</p>';
    }
    return marked.parse(this.content);
  }

  render() {
    return html`
      <div class="edit-container">
        <div class="toolbar">
          <button class="button button-success" @click=${this._handleSave}>
            💾 Save & View
          </button>
          <button class="button button-secondary" @click=${this._togglePreview}>
            ${this._previewMode ? '✏️ Show Editor' : '👁️ Preview Only'}
          </button>
          <button
            class="button button-primary"
            @click=${this._triggerImageUpload}
            ?disabled=${this._uploadingImage}
          >
            ${this._uploadingImage ? '⏳ Uploading...' : '🖼️ Add Image'}
          </button>
          <button class="button button-secondary" @click=${this._handleNewSite}>
            🆕 New Site
          </button>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            @change=${this._handleImageUpload}
            style="display: none;"
          />
        </div>

        ${this._previewMode
        ? html`
              <div class="preview-pane" style="height: 500px;">
                <div class="rendered-content">
                  ${unsafeHTML(this._getRenderedContent())}
                </div>
              </div>
            `
        : html`
              <div class="editor-area">
                <div class="editor-pane">
                  <div class="pane-label">Markdown Editor</div>
                  <textarea
                    .value=${this.content}
                    @input=${this._handleInput}
                    placeholder="# Start typing your markdown here...

## This is a heading

Write your content using markdown syntax.

- Bullet points
- **Bold text**
- *Italic text*
- [Links](https://example.com)
- \`code\`

Your content is automatically saved to the URL!"
                    spellcheck="true"
                  ></textarea>
                </div>

                <div class="editor-pane">
                  <div class="pane-label">Live Preview</div>
                  <div class="preview-pane">
                    <div class="rendered-content">
                      ${unsafeHTML(this._getRenderedContent())}
                    </div>
                  </div>
                </div>
              </div>
            `
      }

        <div class="help-text">
          💡 <strong>Tip:</strong> Your content is automatically encoded into the URL as you type.
          Images are automatically compressed and optimized (max 1200px, WebP/JPEG format) to minimize URL length.
          Share the URL to share your site! Click "Save & View" to see the final result.
        </div>
      </div>
      <button class="save-button" @click=${this._handleSave} title="Save & View">
        💾
      </button>
    `;
  }
}

customElements.define('edit-mode', EditMode);
