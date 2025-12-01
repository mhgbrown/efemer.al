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
      background: var(--color-background-secondary);
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px var(--shadow-color);
      min-height: 400px;
    }

    .toolbar {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid var(--color-border);
      flex-wrap: wrap;
    }

    .button {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .button-primary {
      background: var(--color-primary);
      color: white;
    }

    .button-primary:hover {
      background: var(--color-primary-hover);
    }

    .button-secondary {
      background: var(--color-secondary);
      color: white;
    }

    .button-secondary:hover {
      background: var(--color-secondary-hover);
    }

    .button-success {
      background: var(--color-success);
      color: white;
    }

    .button-success:hover {
      background: var(--color-success-hover);
    }

    .editor-area {
      display: flex;
      gap: 20px;
      height: 500px;
    }

    .editor-pane {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .pane-label {
      font-weight: 600;
      margin-bottom: 10px;
      color: var(--color-text);
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    textarea {
      flex: 1;
      width: 100%;
      padding: 15px;
      border: 2px solid var(--color-border);
      border-radius: 4px;
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 14px;
      line-height: 1.6;
      resize: vertical;
      transition: border-color 0.2s;
      background-color: var(--color-background);
      color: var(--color-text);
    }

    textarea:focus {
      outline: none;
      border-color: var(--color-primary);
    }

    .preview-pane {
      flex: 1;
      border: 2px solid var(--color-border);
      border-radius: 4px;
      padding: 15px;
      overflow-y: auto;
      background: var(--color-background);
    }

    .rendered-content {
      line-height: 1.8;
      color: var(--color-text);
    }

    .rendered-content h1 {
      font-size: 28px;
      margin: 20px 0 12px;
      color: var(--color-text);
      border-bottom: 2px solid var(--color-border);
      padding-bottom: 6px;
    }

    .rendered-content h2 {
      font-size: 24px;
      margin: 18px 0 10px;
      color: var(--color-text);
    }

    .rendered-content h3 {
      font-size: 20px;
      margin: 16px 0 8px;
      color: var(--color-text);
    }

    .rendered-content p {
      margin: 10px 0;
    }

    .rendered-content code {
      background: var(--color-background);
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 13px;
    }

    .rendered-content pre {
      background: var(--color-background);
      padding: 12px;
      border-radius: 4px;
      overflow-x: auto;
      margin: 12px 0;
    }

    .rendered-content pre code {
      background: none;
      padding: 0;
    }

    .rendered-content ul, .rendered-content ol {
      margin: 10px 0;
      padding-left: 25px;
    }

    .rendered-content li {
      margin: 4px 0;
    }

    .rendered-content blockquote {
      border-left: 4px solid var(--color-border);
      padding-left: 12px;
      margin: 12px 0;
      color: var(--color-text-secondary);
      font-style: italic;
    }

    .rendered-content a {
      color: var(--color-primary);
      text-decoration: none;
    }

    .rendered-content a:hover {
      text-decoration: underline;
    }

    .rendered-content img {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
      margin: 12px 0;
      box-shadow: 0 2px 8px var(--shadow-color);
    }

    .help-text {
      margin-top: 15px;
      padding: 12px;
      background: var(--color-background);
      border-radius: 4px;
      font-size: 13px;
      color: var(--color-text-secondary);
    }

    .url-warning {
      font-weight: bold;
      padding: 5px 10px;
      border-radius: 4px;
      margin-left: 10px;
    }

    .warning-yellow {
      background: #fff3cd;
      color: #856404;
      border: 1px solid #ffeaa7;
    }

    .warning-red {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
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
        height: 300px;
      }

      .toolbar {
        flex-direction: column;
      }

      .button {
        width: 100%;
      }
    }

    .save-button {
      position: fixed;
      bottom: 30px;
      right: 90px; /* Positioned next to the theme switcher */
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-success);
      color: var(--color-background-secondary);
      text-decoration: none;
      border-radius: 50%;
      box-shadow: 0 2px 8px var(--shadow-color);
      transition: all 0.2s;
      cursor: pointer;
      border: none;
      font-size: 24px;
      box-sizing: border-box;
    }

    .save-button:hover {
      background: var(--color-success-hover);
      transform: scale(1.1);
      box-shadow: 0 4px 12px var(--shadow-color);
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
    const appRoot = document.querySelector('app-root');
    if (appRoot) {
      appRoot.navigateTo(encodeURIComponent(encoded));
    }
  }

  async _handleNewSite() {
    if (this.content && this.content.trim()) {
      const confirmed = confirm('Start a new site? Your current content will not be saved unless you copy the URL first.');
      if (!confirmed) return;
    }

    const defaultContent = '# Welcome!\n\nStart editing to create your site.';
    const encoded = await encodeContent(defaultContent);
    const appRoot = document.querySelector('app-root');
    if (appRoot) {
      appRoot.navigateTo(`${encodeURIComponent(encoded)}/edit`);
    }
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
