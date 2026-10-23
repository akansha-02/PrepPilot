import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sessionsApi } from '../lib/api';
import LoadingState from '../components/ui/LoadingState';
import EmptyState from '../components/ui/EmptyState';
import StatusChip from '../components/ui/StatusChip';

function Stat({ label, value }) {
  return (
    <div className="px-5 py-5 md:px-6 md:py-6">
      <p className="font-mono text-xs text-ink-muted">{label}</p>
      <p className="mt-1.5 font-display text-3xl font-bold tracking-tight text-ink md:text-5xl">
        {value}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await sessionsApi.list();
      setSessions(data.sessions || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const completedCount = sessions.filter((session) => session.status === 'completed').length;
  const activeCount = sessions.filter((session) => session.status === 'active').length;
  const visibleSessions = sessions.slice(0, 6);

  if (loading) {
    return (
      <div className="page">
        <LoadingState label="Loading your sessions…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <EmptyState
          title="Could not load sessions"
          description={error}
          action={<button type="button" onClick={load} className="btn-primary">Retry</button>}
        />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="page-title">Dashboard</h2>
          <p className="mt-1 text-sm text-ink-muted">Your sessions and progress.</p>
        </div>
        <Link to="/interview/new" className="btn-primary">New interview</Link>
      </div>

      {sessions.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No interviews yet"
            description="Create your first session and answer questions one at a time."
            action={<Link to="/interview/new" className="btn-primary">New interview</Link>}
          />
        </div>
      ) : (
        <>
          <div className="sheet mt-8 grid grid-cols-3 divide-x divide-line">
            <Stat label="Sessions" value={sessions.length} />
            <Stat label="In progress" value={activeCount} />
            <Stat label="Completed" value={completedCount} />
          </div>

          <div className="sheet mt-4 divide-y divide-line">
            {visibleSessions.map((session) => (
              <Link
                key={session._id}
                to={`/interview/${session._id}`}
                className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-paper-deep sm:flex-row sm:items-center md:px-6"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{session.title || 'Untitled session'}</p>
                  <p className="mt-0.5 text-[13px] text-ink-muted">{session.role}, {session.level}</p>
                </div>
                <div className="flex items-center gap-3 sm:justify-end">
                  <StatusChip status={session.status} />
                  <span className="font-mono text-xs text-ink-faint md:hidden">
                    {session.questions?.length || 0} questions
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {sessions.length > visibleSessions.length ? (
            <Link
              to="/history"
              className="mt-3 inline-block text-sm font-medium text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              See all {sessions.length} sessions in history
            </Link>
          ) : null}
        </>
      )}
    </div>
  );
}
