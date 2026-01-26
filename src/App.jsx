import { useState, useRef, useCallback, useEffect } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import Toolbar from './components/Toolbar';
import ThemeToggle from './components/ThemeToggle';
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
    const [markdown, setMarkdown] = useState(exampleMarkdown);

    // State for theme (dark/light mode)
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Check for saved preference or system preference
        const saved = localStorage.getItem('theme');
        if (saved) return saved === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // State for copy button feedback
    const [copyStatus, setCopyStatus] = useState('idle'); // 'idle' | 'success' | 'error'

    // Refs for scroll synchronization
    const editorRef = useRef(null);
    const previewRef = useRef(null);

    // Parse markdown to HTML (memoized for performance)
    const renderedHtml = parseMarkdown(markdown);

    // Set up scroll synchronization between editor and preview
    useScrollSync(editorRef, previewRef);

    // Apply theme to document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

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

    return (
        <div className="app">
            {/* Header with title and theme toggle */}
            <header className="app-header">
                <div className="header-content">
                    <h1 className="app-title">
                        <span className="title-icon">📝</span>
                        Markdown Previewer
                    </h1>
                    <ThemeToggle isDark={isDarkMode} onToggle={toggleTheme} />
                </div>
            </header>

            {/* Toolbar with action buttons */}
            <Toolbar
                onClear={handleClear}
                onReset={handleReset}
                onCopyHtml={handleCopyHtml}
                copyStatus={copyStatus}
                isEmpty={!markdown.trim()}
            />

            {/* Main content area with editor and preview */}
            <main className="main-content">
                <div className="panes-container">
                    {/* Editor pane */}
                    <section className="pane editor-pane">
                        <div className="pane-header">
              <span className="pane-title">
                <span className="pane-icon">✏️</span>
                Editor
              </span>
                            <span className="char-count">{markdown.length} chars</span>
                        </div>
                        <Editor
                            ref={editorRef}
                            value={markdown}
                            onChange={handleMarkdownChange}
                        />
                    </section>

                    {/* Divider */}
                    <div className="pane-divider" aria-hidden="true" />

                    {/* Preview pane */}
                    <section className="pane preview-pane">
                        <div className="pane-header">
              <span className="pane-title">
                <span className="pane-icon">👁️</span>
                Preview
              </span>
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