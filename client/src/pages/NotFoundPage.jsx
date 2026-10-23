import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page flex min-h-[70vh] flex-col items-start justify-center">
      <p className="font-mono text-sm text-ink-faint">404</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink md:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-base leading-7 text-ink-muted">
        Nothing lives at this address. Head back to the dashboard or start a new interview.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/dashboard" className="btn-primary">Open dashboard</Link>
        <Link to="/interview/new" className="btn-secondary">New interview</Link>
      </div>
    </div>
  );
}
