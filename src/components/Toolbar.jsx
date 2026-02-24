import './Toolbar.css';

/**
 * Toolbar Component
 * Provides action buttons for the editor
 */
function Toolbar({ 
    onClear, 
    onReset, 
    onCopyHtml, 
    onCopyMarkdown, 
    onDownloadMarkdown,
    onDownloadHtml,
    onFullscreenEditor,
    onFullscreenPreview,
    copyStatus, 
    copyMarkdownStatus, 
    isEmpty,
    isDarkMode,
    onToggleTheme,
    fullscreen
}) {
    return (
        <div className="toolbar">
            <div className="toolbar-content">
                <div className="toolbar-left">
                    <h1 className="app-title">
                        <span className="title-icon">📝</span>
                        <span className="title-text">Markdown Previewer</span>
                    </h1>
                    <div className="toolbar-group">
                        <button
                            className="toolbar-button button-danger"
                            onClick={onClear}
                            disabled={isEmpty}
                            title="Clear all content"
                        >
                            <span className="button-icon">🗑️</span>
                            <span className="button-text">Clear</span>
                        </button>
                        <button
                            className="toolbar-button button-secondary"
                            onClick={onReset}
                            title="Reset to example markdown"
                        >
                            <span className="button-icon">🔄</span>
                            <span className="button-text">Reset</span>
                        </button>
                    </div>
                </div>

                <div className="toolbar-right">
                    <div className="toolbar-group">
                        <button
                            className={`toolbar-button button-primary ${copyMarkdownStatus === 'success' ? 'success' : ''}`}
                            onClick={onCopyMarkdown}
                            disabled={isEmpty}
                            title="Copy markdown to clipboard"
                        >
                            <span className="button-icon">
                                {copyMarkdownStatus === 'success' ? '✅' : copyMarkdownStatus === 'error' ? '❌' : '📄'}
                            </span>
                            <span className="button-text">
                                {copyMarkdownStatus === 'success' ? 'Copied!' : copyMarkdownStatus === 'error' ? 'Failed' : 'Copy MD'}
                            </span>
                        </button>
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
                        <button
                            className="toolbar-button button-secondary"
                            onClick={onDownloadMarkdown}
                            disabled={isEmpty}
                            title="Download as .md file"
                        >
                            <span className="button-icon">📥</span>
                            <span className="button-text">Download MD</span>
                        </button>
                        <button
                            className="toolbar-button button-secondary"
                            onClick={onDownloadHtml}
                            disabled={isEmpty}
                            title="Download as .html file"
                        >
                            <span className="button-icon">📄</span>
                            <span className="button-text">Download HTML</span>
                        </button>
                    </div>
                    <button
                        className="toolbar-button theme-toggle"
                        onClick={onToggleTheme}
                        title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Toolbar;