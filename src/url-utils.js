import pako from 'pako';
import { encode, decode } from '@alttiri/base85';

/**
 * Optimizes content before compression by removing unnecessary whitespace
 */
function optimizeContent(content) {
  if (!content) return content;

  // Remove HTML comments, which are invisible in markdown
  content = content.replace(/<!--[\s\S]*?-->/g, '');

  // Split into lines for processing
  let lines = content.split('\n');

  // Track if we're inside a code block
  let inCodeBlock = false;
  let optimizedLines = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Check for code block markers
    if (line.trimStart().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      optimizedLines.push(line);
      continue;
    }

    // If inside code block, preserve the line as-is
    if (inCodeBlock) {
      optimizedLines.push(line);
      continue;
    }

    // For non-code lines, remove trailing whitespace
    // (except for double-space markdown line breaks)
    if (line.endsWith('  ') && line.trim().length > 2) {
      // Keep the double-space line break
      line = line.trimEnd() + '  ';
    } else {
      line = line.trimEnd();
    }

    optimizedLines.push(line);
  }

  // Join lines back together
  let optimized = optimizedLines.join('\n');

  // Collapse 3+ consecutive newlines into 2 newlines (preserve paragraph breaks)
  optimized = optimized.replace(/\n{3,}/g, '\n\n');

  // Trim leading and trailing whitespace from the entire content
  optimized = optimized.trim();

  return optimized;
}

/**
 * Encodes content to a URL-safe base64 string with compression
 */
export async function encodeContent(content) {
  try {
    // Optimize content before compression
    const optimized = optimizeContent(content);

    // Use pako for consistent compression, with raw deflate
    const compressed = pako.deflate(optimized, { level: 9, raw: true });

    // Convert to Z85 for a more compact URL-safe string
    return encode(compressed, 'z85');
  } catch (error) {
    console.error('Encoding error:', error);
    return '';
  }
}

/**
 * Decodes a URL-safe base64 string back to original content
 */
export async function decodeContent(encoded) {
  try {
    if (!encoded) return '';

    // Decode Z85 string back to bytes
    const bytes = decode(encoded, 'z85');

    // Use pako for consistent decompression, with raw inflate
    const decompressed = pako.inflate(bytes, { to: 'string', raw: true });

    return decompressed;
  } catch (error) {
    console.error('Decoding error:', error);
    return '';
  }
}

/**
 * Gets the current path from the URL hash
 */
export function getCurrentPath() {
  const hash = window.location.hash.slice(1); // Remove leading #
  return hash || '';
}

/**
 * Updates the URL hash without triggering a page reload
 */
export function updateURL(path) {
  window.location.hash = path || '';
}

/**
 * Parses the hash to determine mode and content
 */
export async function parsePath(hash) {
  if (!hash) {
    return { mode: 'view', content: '' };
  }

  // Check if hash ends with /edit
  if (hash.endsWith('/edit')) {
    const encodedContent = hash.slice(0, -5); // Remove '/edit'
    return {
      mode: 'edit',
      content: await decodeContent(decodeURIComponent(encodedContent))
    };
  }

  // Check for about page
  if (hash === 'about') {
    return { mode: 'about', content: '' };
  }

  return {
    mode: 'view',
    content: await decodeContent(decodeURIComponent(hash))
  };
}

/**
 * Generates default content for a new site
 * Includes a random color style and a unique timestamp-based header
 */
export function generateDefaultContent() {
  const now = Date.now();

  // Generate a short ID: 3 random chars + last 3 chars of timestamp
  // Max 6 chars, with random start as requested
  const timeHex = now.toString(16);
  const randomPart = Math.floor(Math.random() * 0x1000).toString(16).padStart(3, '0');
  const timestampHex = (randomPart + timeHex.slice(-3)).toUpperCase();

  // Generate a color based on the timestamp
  // Use the timestamp to determine the hue (0-360)
  const hue = now % 360;
  const timestampColor = `hsl(${hue}, 70%, 45%)`;

  return `<style>
h1 { color: ${timestampColor}; }
</style>

# Site ${timestampHex}

Start editing to create your site.

## Features
- **Markdown** support
- _Live_ preview
- Custom [styles](https://developer.mozilla.org/en-US/docs/Web/CSS)

> "Simplicity is the ultimate sophistication."

\`\`\`javascript
console.log('Hello World');
\`\`\``;
}

/**
 * Extracts title and description from markdown content
 * @param {string} content
 * @returns {{title: string, description: string}}
 */
export function extractMetadata(content) {
  if (!content) return { title: 'Untitled Site', description: '' };

  const lines = content.split('\n');
  let title = 'Untitled Site';
  let description = '';
  let titleFound = false;

  // Find Title (H1 or first non-empty line)
  const h1Index = lines.findIndex(line => line.trim().startsWith('# '));
  let titleLineIndex = -1;

  if (h1Index !== -1) {
    title = lines[h1Index].replace(/^#+\s*/, '').trim();
    titleLineIndex = h1Index;
    titleFound = true;
  } else {
    const firstNonEmptyIndex = lines.findIndex(line => line.trim().length > 0);
    if (firstNonEmptyIndex !== -1) {
      title = lines[firstNonEmptyIndex].replace(/^#+\s*/, '').trim();
      titleLineIndex = firstNonEmptyIndex;
      titleFound = true;
    }
  }

  // Find Description (next non-empty line after title)
  if (titleFound) {
    for (let i = titleLineIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.length > 0 && !line.startsWith('#') && !line.startsWith('```') && !line.startsWith('<style')) {
        description = line;
        break;
      }
    }
  }

  // Fallbacks and cleanup
  title = title.substring(0, 50) || 'Untitled Site';
  description = description.substring(0, 160); // Standard meta description length

  return { title, description };
}
