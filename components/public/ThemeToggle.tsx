'use client';

export default function ThemeToggle() {
  const toggle = () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('euphoria-theme', next);
    } catch {
      /* storage can be unavailable */
    }
  };

  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-label="Switch color theme">
      <span className="theme-icon theme-icon-sun" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
      </span>
      <span className="theme-icon theme-icon-moon" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z" /></svg>
      </span>
    </button>
  );
}
