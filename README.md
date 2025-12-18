# efemer.al

> Most of your site lives in the URL

**efemer.al** is a "vibe coding exercise" built using **Antigravity** and **Gemini Pro 3**. It serves as an experiment in serverless web architecture, exploring the concept of using the URL to store a site's content.

Instead of a traditional database, all your data is encoded directly into the link itself. This means no backend storage is required to share your thoughts, notes, or lists.

## Features

-   **Serverless Data Storage**: content is compressed and stored within the URL hash.
-   **Compression**: Uses `pako` (zlib) and `base85` encoding to drastically reduce URL size, making it practical to share richer content.
-   **Edit & View Modes**: Create content in a focused editor, then switch to view mode to see how it looks.
-   **Markdown Support**: Content is rendered using `marked`, allowing for formatted text.
-   **Privacy Focused**: Since there's no server database, your data exists only where you share the link.
-   **Theming**: Supports system preference for light/dark mode.

## Tech Stack

This project is built with a modern, lightweight web stack:

-   [Lit](https://lit.dev/) - Simple, fast Web Components.
-   [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling.
-   [Marked](https://marked.js.org/) - A low-level compiler for parsing markdown.
-   [Pako](https://github.com/nodeca/pako) - zlib port to javascript (fast!).
-   [@alttiri/base85](https://www.npmjs.com/package/@alttiri/base85) - Binary-to-text encoding for shorter strings.

## Local Development

To run this project locally:

1.  **Clone the repository**

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Start the development server**

    ```bash
    npm run dev
    ```

4.  **Build for production**

    ```bash
    npm run build
    ```
