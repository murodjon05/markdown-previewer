import { forwardRef, useCallback } from 'react';
import './Editor.css';

/**
 * Editor Component
 * A textarea for editing Markdown with monospace font
 * Forwards ref for scroll synchronization
 */
const Editor = forwardRef(function Editor({ value, onChange }, ref) {
    // Handle textarea changes
    const handleChange = useCallback((e) => {
        onChange(e.target.value);
    }, [onChange]);

    // Handle tab key to insert spaces instead of changing focus
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const { selectionStart, selectionEnd } = e.target;
            const newValue =
                value.substring(0, selectionStart) +
                '  ' + // Insert 2 spaces
                value.substring(selectionEnd);

            onChange(newValue);

            // Move cursor after the inserted spaces
            requestAnimationFrame(() => {
                e.target.selectionStart = selectionStart + 2;
                e.target.selectionEnd = selectionStart + 2;
            });
        }
    }, [value, onChange]);

    return (
        <div className="editor-container">
      <textarea
          ref={ref}
          className="editor-textarea"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Write your Markdown here..."
          spellCheck="false"
          aria-label="Markdown editor"
      />
        </div>
    );
});

export default Editor;