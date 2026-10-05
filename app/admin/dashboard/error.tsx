'use client';

export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="admin-card">
      <h1 style={{ color: 'var(--white)', marginBottom: 8 }}>Something went wrong.</h1>
      <p style={{ color: 'var(--soft-grey)', marginBottom: 16 }}>The admin page could not load. Please try again.</p>
      <button className="admin-btn admin-btn-primary" type="button" onClick={reset}>Try again</button>
    </div>
  );
}
