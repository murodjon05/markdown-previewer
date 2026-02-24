import { useState, useRef, useCallback, useEffect } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import Toolbar from './components/Toolbar';
import { parseMarkdown, getRenderedHtml } from './utils/markdown';
import { exampleMarkdown } from './data/exampleMarkdown';
import useScrollSync from './hooks/useScrollSync';
import './App.css';

/**
 * Main Application Component
 * Manages the state and layout of the Markdown Previewer
 */
function App() {
    // State for the markdown content
    const [markdown, setMarkdown] = useState(() => {
        const saved = localStorage.getItem('markdown');
        return saved || exampleMarkdown;
    });

    // State for theme (dark/light mode)
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Check for saved preference or system preference
        const saved = localStorage.getItem('theme');
        if (saved) return saved === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // State for copy button feedback
    const [copyStatus, setCopyStatus] = useState('idle'); // 'idle' | 'success' | 'error'
    const [copyMarkdownStatus, setCopyMarkdownStatus] = useState('idle');

    // Refs for scroll synchronization
    const editorRef = useRef(null);
    const previewRef = useRef(null);
    const containerRef = useRef(null);

    // State for split ratio (percentage for editor)
    const [splitRatio, setSplitRatio] = useState(50);

    // State for fullscreen mode: 'none' | 'editor' | 'preview'
    const [fullscreen, setFullscreen] = useState('none');

    // Parse markdown to HTML (memoized for performance)
    const renderedHtml = parseMarkdown(markdown);

    // Set up scroll synchronization between editor and preview
    useScrollSync(editorRef, previewRef);

    // Apply theme to document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    // Auto-save markdown to localStorage
    useEffect(() => {
        localStorage.setItem('markdown', markdown);
    }, [markdown]);

    // Handle theme toggle
    const toggleTheme = useCallback(() => {
        setIsDarkMode(prev => !prev);
    }, []);

    // Handle markdown input changes
    const handleMarkdownChange = useCallback((value) => {
        setMarkdown(value);
    }, []);

    // Clear the editor
    const handleClear = useCallback(() => {
        setMarkdown('');
    }, []);

    // Reset to example markdown
    const handleReset = useCallback(() => {
        setMarkdown(exampleMarkdown);
    }, []);

    // Copy rendered HTML to clipboard
    const handleCopyHtml = useCallback(async () => {
        try {
            const html = getRenderedHtml(markdown);
            await navigator.clipboard.writeText(html);
            setCopyStatus('success');
            setTimeout(() => setCopyStatus('idle'), 2000);
        } catch (err) {
            console.error('Failed to copy HTML:', err);
            setCopyStatus('error');
            setTimeout(() => setCopyStatus('idle'), 2000);
        }
    }, [markdown]);

    // Copy markdown to clipboard
    const handleCopyMarkdown = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(markdown);
            setCopyMarkdownStatus('success');
            setTimeout(() => setCopyMarkdownStatus('idle'), 2000);
        } catch (err) {
            console.error('Failed to copy Markdown:', err);
            setCopyMarkdownStatus('error');
            setTimeout(() => setCopyMarkdownStatus('idle'), 2000);
        }
    }, [markdown]);

    // Download markdown as .md file
    const handleDownloadMarkdown = useCallback(() => {
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.md';
        a.click();
        URL.revokeObjectURL(url);
    }, [markdown]);

    // Download rendered HTML as .html file
    const handleDownloadHtml = useCallback(() => {
        const html = getRenderedHtml(markdown);
        const fullHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Markdown Preview</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; }
        pre { background: #f4f4f4; padding: 1rem; overflow-x: auto; border-radius: 4px; }
        code { background: #f4f4f4; padding: 0.2rem 0.4rem; border-radius: 3px; }
        pre code { padding: 0; }
        blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 1rem; color: #666; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 0.5rem; text-align: left; }
        th { background: #f4f4f4; }
        img { max-width: 100%; }
    </style>
</head>
<body>
${html}
</body>
</html>`;
        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.html';
        a.click();
        URL.revokeObjectURL(url);
    }, [markdown]);

    // Preset split ratios
    const handleSplitLeft = useCallback(() => setSplitRatio(20), []);
    const handleSplitRight = useCallback(() => setSplitRatio(80), []);
    const handleSplitMiddle = useCallback(() => setSplitRatio(50), []);

    // Handle fullscreen toggle
    const handleFullscreenEditor = useCallback(() => {
        setFullscreen(prev => prev === 'editor' ? 'none' : 'editor');
    }, []);

    const handleFullscreenPreview = useCallback(() => {
        setFullscreen(prev => prev === 'preview' ? 'none' : 'preview');
    }, []);

    // Handle divider drag
    const handleDividerMouseDown = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const handleMouseMove = (moveEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const newRatio = ((moveEvent.clientX - rect.left) / rect.width) * 100;
            setSplitRatio(Math.min(Math.max(newRatio, 20), 80));
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, []);

    return (
        <div className="app">
            {/* Toolbar with action buttons */}
            <Toolbar
                onClear={handleClear}
                onReset={handleReset}
                onCopyHtml={handleCopyHtml}
                onCopyMarkdown={handleCopyMarkdown}
                onDownloadMarkdown={handleDownloadMarkdown}
                onDownloadHtml={handleDownloadHtml}
                onFullscreenEditor={handleFullscreenEditor}
                onFullscreenPreview={handleFullscreenPreview}
                copyStatus={copyStatus}
                copyMarkdownStatus={copyMarkdownStatus}
                isEmpty={!markdown.trim()}
                isDarkMode={isDarkMode}
                onToggleTheme={toggleTheme}
                fullscreen={fullscreen}
            />

            {/* Main content area with editor and preview */}
            <main className="main-content">
                <div className="panes-container" ref={containerRef}>
                    {/* Editor pane */}
                    <section 
                        className={`pane editor-pane ${fullscreen === 'editor' ? 'fullscreen' : ''}`}
                        style={{ width: fullscreen !== 'none' ? '100%' : `${splitRatio}%` }}
                    >
                        <div className="pane-header">
                            <span className="pane-title">
                                <span className="pane-icon">✏️</span>
                                Editor
                            </span>
                            <div className="pane-actions">
                                <span className="char-count">{markdown.length} chars</span>
                                <button 
                                    className="pane-fullscreen-btn" 
                                    onClick={handleFullscreenEditor}
                                    title={fullscreen === 'editor' ? 'Exit fullscreen' : 'Fullscreen'}
                                >
                                    {fullscreen === 'editor' ? '⊠' : '⛶'}
                                </button>
                            </div>
                        </div>
                        <Editor
                            ref={editorRef}
                            value={markdown}
                            onChange={handleMarkdownChange}
                        />
                    </section>

                    {/* Divider */}
                    {fullscreen === 'none' && (
                        <div className="divider-container">
                            <div className="divider-buttons">
                                <button 
                                    className="divider-btn" 
                                    onClick={handleSplitLeft} 
                                    onMouseDown={(e) => e.stopPropagation()}
                                    title="Editor 20%"
                                >⟵</button>
                                <button 
                                    className="divider-btn" 
                                    onClick={handleSplitMiddle} 
                                    onMouseDown={(e) => e.stopPropagation()}
                                    title="Equal split"
                                >⎮</button>
                                <button 
                                    className="divider-btn" 
                                    onClick={handleSplitRight} 
                                    onMouseDown={(e) => e.stopPropagation()}
                                    title="Editor 80%"
                                >⟶</button>
                            </div>
                            <div 
                                className="pane-divider" 
                                aria-hidden="true" 
                                onMouseDown={handleDividerMouseDown}
                            />
                        </div>
                    )}

                    {/* Preview pane */}
                    <section 
                        className={`pane preview-pane ${fullscreen === 'preview' ? 'fullscreen' : ''}`}
                        style={{ width: fullscreen !== 'none' ? '100%' : `${100 - splitRatio}%` }}
                    >
                        <div className="pane-header">
                            <span className="pane-title">
                                <span className="pane-icon">👁️</span>
                                Preview
                            </span>
                            <button 
                                className="pane-fullscreen-btn" 
                                onClick={handleFullscreenPreview}
                                title={fullscreen === 'preview' ? 'Exit fullscreen' : 'Fullscreen'}
                            >
                                {fullscreen === 'preview' ? '⊠' : '⛶'}
                            </button>
                        </div>
                        <Preview ref={previewRef} html={renderedHtml} />
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="app-footer">
                <p>
                    Built with React + Vite |
                    <a
                        href="https://www.markdownguide.org/basic-syntax/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Markdown Guide
                    </a>
                </p>
            </footer>
        </div>
    );
}

export default App;