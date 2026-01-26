import './Toolbar.css';

/**
 * Toolbar Component
 * Provides action buttons for the editor
 */
function Toolbar({ onClear, onReset, onCopyHtml, copyStatus, isEmpty }) {
    return (
        <div className="toolbar">
            <div className="toolbar-content">
                <div className="toolbar-group">
                    {/* Clear button */}
                    <button
                        className="toolbar-button button-danger"
                        onClick={onClear}
                        disabled={isEmpty}
                        title="Clear all content"
                    >
                        <span className="button-icon">🗑️</span>
                        <span className="button-text">Clear</span>
                    </button>

                    {/* Reset button */}
                    <button
                        className="toolbar-button button-secondary"
                        onClick={onReset}
                        title="Reset to example markdown"
                    >
                        <span className="button-icon">🔄</span>
                        <span className="button-text">Reset</span>
                    </button>
                </div>

                <div className="toolbar-group">
                    {/* Copy HTML button */}
                    <button
                        className={`toolbar-button button-primary ${copyStatus === 'success' ? 'success' : ''}`}
                        onClick={onCopyHtml}
                        disabled={isEmpty}
                        title="Copy rendered HTML to clipboard"
                    >
            <span className="button-icon">
              {copyStatus === 'success' ? '✅' : copyStatus === 'error' ? '❌' : '📋'}
            </span>
                        <span className="button-text">
              {copyStatus === 'success' ? 'Copied!' : copyStatus === 'error' ? 'Failed' : 'Copy HTML'}
            </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Toolbar;