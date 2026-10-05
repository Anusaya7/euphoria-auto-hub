'use client';

export default function ErrorState({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="status-screen">
      <div className="label-text">Euphoria Auto Hub</div>
      <h1>Something went wrong.</h1>
      <p>Please try again. If this continues, call the studio.</p>
      <button className="btn-primary" type="button" onClick={reset}><span>Try again</span></button>
    </div>
  );
}
