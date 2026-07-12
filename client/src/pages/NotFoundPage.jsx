import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-start justify-center px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-200">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">Page not found</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
        The page you requested does not exist. Return to the dashboard or start a new interview session.
      </p>
      <div className="mt-8 flex gap-3">
        <Link to="/dashboard"><Button>Dashboard</Button></Link>
        <Link to="/interview/new"><Button variant="secondary">New session</Button></Link>
      </div>
    </div>
  );
}