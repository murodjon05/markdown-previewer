import { forwardRef } from 'react';
import './Preview.css';

/**
 * Preview Component
 * Renders sanitized HTML from parsed Markdown
 * Forwards ref for scroll synchronization
 */
const Preview = forwardRef(function Preview({ html }, ref) {
    return (
        <div
            ref={ref}
            className="preview-container"
            aria-label="Markdown preview"
            role="region"
        >
            <div
                className="preview-content markdown-body"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </div>
    );
});

export default Preview;