import { LitElement, html, css } from 'lit';
import { marked } from 'marked';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { encodeContent, updateURL } from '../url-utils.js';
import { RecentSitesManager } from '../recent-sites-manager.js';
import './header-section.js';
import './footer-section.js';

export class EditMode extends LitElement {
  static properties = {
    content: { type: String },
    _previewMode: { type: Boolean },
    _uploadingImage: { type: Boolean },
    siteId: { type: String },
    _previewSrc: { type: String, state: true }
  };

  static styles = css`
    :host {
      display: block;
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }

    .edit-container {
      background: var(--md-sys-color-surface);
      color: var(--md-sys-color-on-surface);
      padding: 0;
      box-shadow: none;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .toolbar {
      padding: 12px 24px;
      border-bottom: 1px solid var(--md-sys-color-outline);
      margin-bottom: 0;
      background: var(--md-sys-color-surface);
      flex-shrink: 0;
    }

    .editor-area {
      display: flex;
      flex: 1;
      min-height: 0; /* Important for nested scrolling */
    }

    .editor-pane,
    .preview-pane {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      height: 100%;
      overflow: hidden;
    }

    .editor-pane {
      border-right: 1px solid var(--md-sys-color-outline);
    }

    .pane-label {
      display: none; /* Hide labels for cleaner look */
    }

    textarea {
      flex: 1;
      width: 100%;
      padding: 24px;
      border: none;
      font-family: monospace;
      background-color: var(--md-sys-color-surface);
      color: var(--md-sys-color-on-surface);
      resize: none;
      font-size: 14px;
      line-height: 1.6;
      outline: none;
      box-sizing: border-box;
      height: 100%;
      overflow-y: auto;
    }

    .preview-content {
      flex: 1;
      padding: 0;
      border: none;
      overflow-y: auto;
      background: var(--md-sys-color-surface);
      position: relative;
    }

    /* Iframe styles */
    iframe.preview-frame {
      width: 100%;
      height: 100%;
      border: none;
      background: var(--md-sys-color-background);
      display: block;
    }

    .rendered-content {
      display: none; /* Deprecated in favor of iframe */
    }

    /* Fixed positioning removed */
  `;



  constructor() {
    super();
    this.content = '';
    this._previewMode = false;
    this._uploadingImage = false;
    this.siteId = null;
    this._previewSrc = '';
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('content')) {
      this._updatePreviewSrc();
    }
  }

  async _updatePreviewSrc() {
    // Only update if content changed significantly or not set
    // Note: We use the same encoding logic as the URL update to ensure consistency
    const encoded = await encodeContent(this.content);
    // Construct the full URL for the iframe (pointing to root/view mode with current hash)
    // We strictly use the hash without /edit to force View Mode
    const newSrc = `${window.location.origin}/#${encodeURIComponent(encoded)}`;

    // Update state only if changed to avoid unnecessary re-renders
    if (this._previewSrc !== newSrc) {
      this._previewSrc = newSrc;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._initializeSiteId();
    window.addEventListener('insert-link', this._handleInsertLink.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('insert-link', this._handleInsertLink.bind(this));
  }

  _handleInsertLink(e) {
    const { text } = e.detail;
    if (!text) return;

    const textarea = this.shadowRoot.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;

    const newText = currentText.substring(0, start) + text + currentText.substring(end);

    this.content = newText;
    textarea.value = newText;

    // Move cursor to end of inserted text
    const newCursorPos = start + text.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
    textarea.focus();

    this._updateURL();
    this._debouncedSave();
  }

  _initializeSiteId() {
    // Try to find existing site by URL
    const currentUrl = window.location.href;
    const existingSite = RecentSitesManager.findSiteByUrl(currentUrl);
    if (existingSite) {
      this.siteId = existingSite.id;
    }
  }

  _handleInput(e) {
    this.content = e.target.value;
    this._updateURL();
    this._debouncedSave();
  }

  _debouncedSave() {
    if (this._saveTimeout) clearTimeout(this._saveTimeout);
    this._saveTimeout = setTimeout(() => {
      this._saveToRecent();
    }, 1000);
  }

  async _saveToRecent() {
    const encoded = await encodeContent(this.content);
    const newId = RecentSitesManager.saveSite(
      `${window.location.origin}/#${encodeURIComponent(encoded)}`,
      this.content,
      this.siteId
    );
    if (newId) {
      this.siteId = newId;
    }
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

    // Save to recent sites
    const newId = RecentSitesManager.saveSite(
      `${window.location.origin}/#${encodeURIComponent(encoded)}`,
      this.content,
      this.siteId
    );
    if (newId) {
      this.siteId = newId;
    }

    this.dispatchEvent(new CustomEvent('navigate', {
      detail: { path: encodeURIComponent(encoded) },
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

  // _getRenderedContent removed as it is no longer used


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
              <div class="preview-pane">
                 ${this._previewSrc
            ? html`<iframe class="preview-frame" src=${this._previewSrc} title="Preview"></iframe>`
            : ''
          }
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
                     ${this._previewSrc
            ? html`
                            <header-section
                              .url=${this._previewSrc}>
                            </header-section>
                            <iframe class="preview-frame" src=${this._previewSrc} title="Live Preview"></iframe>
                            <footer-section
                              .byteCount=${new Blob([this._previewSrc]).size}>
                            </footer-section>
                          `
            : ''
          }
                  </div>
                </div>
              </div>
            `
      }
      </div>


    `;
  }


}

customElements.define('edit-mode', EditMode);
