import { LitElement } from 'lit';
import { extractMetadata } from '../url-utils.js';

export class MetadataManager extends LitElement {
  static properties = {
    content: { type: String }
  };

  constructor() {
    super();
    this.content = '';
  }

  connectedCallback() {
    super.connectedCallback();
    this._updateMetaTags();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._resetMetaTags();
  }

  updated(changedProperties) {
    if (changedProperties.has('content')) {
      if (this.content) {
        this._updateMetaTags();
      } else {
        this._resetMetaTags();
      }
    }
  }

  _updateMetaTags() {
    if (!this.content) return;

    const { title, description } = extractMetadata(this.content);

    // Update Title
    document.title = `${title} | efemer.al`;

    // Update Meta Tags
    this._setMeta('description', description);
    this._setMeta('og:title', title);
    this._setMeta('og:description', description);
    this._setMeta('twitter:title', title);
    this._setMeta('twitter:description', description);

    // Update JSON-LD
    this._updateJsonLd(title, description);
  }

  _resetMetaTags() {
    // Revert to defaults hardcoded here (matching index.html)
    document.title = 'efemer.al';
    const description = 'The minimalist, ephemeral web builder. Create, share, and explore ephemeral sites.';

    this._setMeta('description', description);
    this._setMeta('og:title', 'efemer.al');
    this._setMeta('og:description', description);
    this._setMeta('twitter:title', 'efemer.al');
    this._setMeta('twitter:description', description);

    this._updateJsonLd(null, null);
  }

  _updateJsonLd(title, description) {
    let script = document.getElementById('dynamic-json-ld');

    // If clearing (no title)
    if (!title) {
      if (script) {
        script.remove();
      }
      return;
    }

    // Create if missing
    if (!script) {
      script = document.createElement('script');
      script.id = 'dynamic-json-ld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const schema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": title,
      "description": description,
      "url": window.location.href
    };

    script.textContent = JSON.stringify(schema, null, 2);
  }

  _setMeta(name, content) {
    // Handle both name and property (for OG tags)
    let element = document.querySelector(`meta[name="${name}"]`);
    if (!element) {
      element = document.querySelector(`meta[property="${name}"]`);
    }

    if (element) {
      element.setAttribute('content', content);
    } else {
      // Create if missing
      const meta = document.createElement('meta');
      if (name.startsWith('og:') || name.startsWith('twitter:')) {
        meta.setAttribute('property', name);
      } else {
        meta.setAttribute('name', name);
      }
      meta.setAttribute('content', content);
      document.head.appendChild(meta);
    }
  }

  // No render method needed as this component is headless (or effectively so)
  createRenderRoot() {
    return this; // Render into light DOM if we wanted, but we don't render anything
  }
}

customElements.define('metadata-manager', MetadataManager);
