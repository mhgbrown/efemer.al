import { LitElement, html, css } from 'lit';

export class AboutPage extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
      font-family: inherit;
      line-height: 1.6;
      color: var(--md-sys-color-on-background);
    }

    h1 {
      font-size: 2.5rem;
      margin-bottom: 24px;
      color: var(--md-sys-color-primary);
    }

    p {
      margin-bottom: 16px;
      font-size: 1.1rem;
    }

    .highlight {
      color: var(--md-sys-color-tertiary);
      font-weight: bold;
    }
  `;

  render() {
    return html`
      <h1>About efemer.al</h1>
      <p>
        This project is a <span class="highlight">vibe coding exercise</span> built using <span class="highlight">Antigravity</span> and
        <span class="highlight">Gemini Pro 3</span>.
      </p>
      <p>
        It serves as an experiment in serverless web architecture, exploring the concept of
        <span class="highlight">using the URL to store a site's content</span>.
        Instead of a traditional database, all your data is encoded directly into the link itself.
      </p>
      <p>
        To make this "practical", we're experimenting with <span class="highlight">compression techniques</span>
        to drastically reduce the size of the URL. This ensures that the generated links remain acceptable
        to more browsers and platforms, while allowing you to fit more content into your ephemeral sites.
      </p>

      <h2>Philosophy</h2>
      <p>
        We live in an era of <span class="highlight">opaque, maximalist URLs</span>. Links are often bloated with tracking metadata,
        while modern browsers increasingly hide this complexity behind a simple origin.
      </p>
      <p>
        <code>efemer.al</code> embraces this. If the link is already an indecipherable data carrier, why not use it to store <span class="highlight">everything</span>?
      </p>
      <p>
        This architecture also explores the boundaries of <span class="highlight">censorship resistance</span>.
        When content exists solely within the link, traditional takedowns fail. The user is the host.
      </p>
    `;
  }
}

customElements.define('about-page', AboutPage);
