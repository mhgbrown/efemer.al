import { defineConfig } from 'vite';

export default defineConfig({
  base: '',
  server: {
    // Configure the dev server to fall back to index.html for client-side routing
    historyApiFallback: true
  }
});
