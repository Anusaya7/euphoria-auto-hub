import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="status-screen">
      <div className="label-text">Euphoria Auto Hub</div>
      <h1>Page not found</h1>
      <p>The page you requested is not available.</p>
      <Link href="/" className="btn-primary"><span>Back to home</span></Link>
    </div>
  );
}
