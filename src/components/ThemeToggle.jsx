import './ThemeToggle.css';

/**
 * ThemeToggle Component
 * A toggle switch for dark/light mode
 */
function ThemeToggle({ isDark, onToggle }) {
    return (
        <button
            className="theme-toggle"
            onClick={onToggle}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
      <span className="theme-toggle-icon">
        {isDark ? '☀️' : '🌙'}
      </span>
            <span className="theme-toggle-text">
        {isDark ? 'Light' : 'Dark'}
      </span>
        </button>
    );
}

export default ThemeToggle;