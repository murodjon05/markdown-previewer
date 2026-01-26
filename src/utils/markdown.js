import { marked } from 'marked';
import DOMPurify from 'dompurify';

/**
 * Configure marked options for better rendering
 */
marked.setOptions({
    // Enable GitHub Flavored Markdown
    gfm: true,
    // Enable line breaks (converts \n to <br>)
    breaks: true,
    // Enable smart lists
    smartLists: true,
    // Disable pedantic mode for more lenient parsing
    pedantic: false,
    // Sanitize output (we also use DOMPurify for extra security)
    mangle: false,
    headerIds: true,
});

/**
 * Configure DOMPurify to allow safe HTML elements
 */
const purifyConfig = {
    // Allow common HTML elements needed for markdown rendering
    ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'hr',
        'ul', 'ol', 'li',
        'blockquote',
        'pre', 'code',
        'em', 'strong', 'del', 's',
        'a', 'img',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'div', 'span',
        'input', // For task lists
    ],
    // Allow necessary attributes
    ALLOWED_ATTR: [
        'href', 'target', 'rel',
        'src', 'alt', 'title',
        'class', 'id',
        'type', 'checked', 'disabled', // For task lists
    ],
    // Force links to open in new tab and add security attributes
    ADD_ATTR: ['target', 'rel'],
    // Transform links for security
    ALLOW_DATA_ATTR: false,
};

/**
 * Post-process HTML to add security attributes to links
 */
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
    }
});

/**
 * Parse Markdown to sanitized HTML
 *
 * @param {string} markdown - The markdown string to parse
 * @returns {string} Sanitized HTML string
 */
export function parseMarkdown(markdown) {
    if (!markdown || typeof markdown !== 'string') {
        return '';
    }

    try {
        // Parse markdown to HTML
        const rawHtml = marked.parse(markdown);

        // Sanitize HTML to prevent XSS attacks
        const cleanHtml = DOMPurify.sanitize(rawHtml, purifyConfig);

        return cleanHtml;
    } catch (error) {
        console.error('Error parsing markdown:', error);
        return '<p>Error rendering markdown</p>';
    }
}

/**
 * Get raw rendered HTML (for copying to clipboard)
 *
 * @param {string} markdown - The markdown string to parse
 * @returns {string} Rendered HTML string (sanitized)
 */
export function getRenderedHtml(markdown) {
    return parseMarkdown(markdown);
}

/**
 * Export default for convenience
 */
export default {
    parseMarkdown,
    getRenderedHtml,
};