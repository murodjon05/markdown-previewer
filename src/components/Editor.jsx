import { forwardRef, useCallback } from 'react';
import './Editor.css';

const Editor = forwardRef(function Editor({ value, onChange }, ref) {
    const insertFormat = useCallback((before, after = before) => {
        const textarea = document.querySelector('.editor-textarea');
        if (!textarea) return;

        const { selectionStart, selectionEnd } = textarea;
        const selectedText = value.substring(selectionStart, selectionEnd);
        const newValue = 
            value.substring(0, selectionStart) + 
            before + selectedText + after + 
            value.substring(selectionEnd);
        
        onChange(newValue);

        requestAnimationFrame(() => {
            if (selectedText) {
                textarea.selectionStart = selectionStart + before.length;
                textarea.selectionEnd = selectionStart + before.length + selectedText.length;
            } else {
                textarea.selectionStart = selectionStart + before.length;
                textarea.selectionEnd = selectionStart + before.length;
            }
            textarea.focus();
        });
    }, [value, onChange]);

    const handleChange = useCallback((e) => {
        onChange(e.target.value);
    }, [onChange]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const { selectionStart, selectionEnd } = e.target;
            const newValue =
                value.substring(0, selectionStart) +
                '  ' +
                value.substring(selectionEnd);

            onChange(newValue);

            requestAnimationFrame(() => {
                e.target.selectionStart = selectionStart + 2;
                e.target.selectionEnd = selectionStart + 2;
            });
            return;
        }

        if (e.ctrlKey || e.metaKey) {
            const { selectionStart, selectionEnd } = e.target;
            let newValue = value;
            let newCursorPos = selectionStart;
            let selectLength = 0;

            switch (e.key.toLowerCase()) {
                case 'b':
                    e.preventDefault();
                    newValue = value.substring(0, selectionStart) + '**' + value.substring(selectionStart, selectionEnd) + '**' + value.substring(selectionEnd);
                    newCursorPos = selectionStart + 2;
                    selectLength = selectionEnd - selectionStart;
                    break;
                case 'i':
                    e.preventDefault();
                    newValue = value.substring(0, selectionStart) + '_' + value.substring(selectionStart, selectionEnd) + '_' + value.substring(selectionEnd);
                    newCursorPos = selectionStart + 1;
                    selectLength = selectionEnd - selectionStart;
                    break;
                case 'k':
                    e.preventDefault();
                    newValue = value.substring(0, selectionStart) + '[' + value.substring(selectionStart, selectionEnd) + '](url)' + value.substring(selectionEnd);
                    newCursorPos = selectionStart + 1;
                    selectLength = selectionEnd - selectionStart;
                    break;
                default:
                    return;
            }

            onChange(newValue);
            requestAnimationFrame(() => {
                e.target.selectionStart = newCursorPos;
                e.target.selectionEnd = selectLength > 0 ? newCursorPos + selectLength : newCursorPos + 4;
            });
        }
    }, [value, onChange]);

    return (
        <div className="editor-container">
            <div className="editor-toolbar">
                <button type="button" onClick={() => insertFormat('**')} title="Bold (Ctrl+B)">B</button>
                <button type="button" onClick={() => insertFormat('_')} title="Italic (Ctrl+I)"><em>I</em></button>
                <button type="button" onClick={() => insertFormat('~~')} title="Strikethrough">S</button>
                <span className="editor-toolbar-divider" />
                <button type="button" onClick={() => insertFormat('# ', '')} title="Heading">H</button>
                <button type="button" onClick={() => insertFormat('> ', '')} title="Quote">"</button>
                <button type="button" onClick={() => insertFormat('- ', '')} title="List">•</button>
                <button type="button" onClick={() => insertFormat('1. ', '')} title="Numbered List">1.</button>
                <span className="editor-toolbar-divider" />
                <button type="button" onClick={() => insertFormat('[', '](url)')} title="Link (Ctrl+K)">🔗</button>
                <button type="button" onClick={() => insertFormat('`')} title="Inline Code">`</button>
                <button type="button" onClick={() => insertFormat('\n```\n', '\n```\n')} title="Code Block">```</button>
            </div>
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
