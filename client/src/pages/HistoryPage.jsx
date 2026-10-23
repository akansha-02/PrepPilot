import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sessionsApi } from '../lib/api';
import LoadingState from '../components/ui/LoadingState';
import EmptyState from '../components/ui/EmptyState';
import StatusChip from '../components/ui/StatusChip';

function averageScore(session) {
  const scores = (session.questions || [])
    .map((question) => question.evaluation?.score)
    .filter((score) => typeof score === 'number');

  if (!scores.length) return null;
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  const loadSessions = async () => {
    try {
      const data = await sessionsApi.list();
      setSessions(data.sessions || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (!pendingDelete) return undefined;
    const timer = setTimeout(() => setPendingDelete(null), 5000);
    return () => clearTimeout(timer);
  }, [pendingDelete]);

  const deleteSession = async (sessionId) => {
    if (pendingDelete !== sessionId) {
      setPendingDelete(sessionId);
      return;
    }

    try {
      await sessionsApi.remove(sessionId);
      setSessions((current) => current.filter((session) => session._id !== sessionId));
    } catch (err) {
      setError(err.message);
    } finally {
      setPendingDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <LoadingState label="Loading your sessions…" />
      </div>
    );
  }

  if (error && sessions.length === 0) {
    return (
      <div className="page">
        <EmptyState
          title="Could not load history"
          description={error}
          action={<button type="button" onClick={loadSessions} className="btn-primary">Retry</button>}
        />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="page-title">History</h2>
          <p className="mt-1 text-sm text-ink-muted">Every interview you have run.</p>
        </div>
        <Link to="/interview/new" className="btn-primary">New interview</Link>
      </div>

      {error ? (
        <p role="alert" className="mt-6 text-sm font-medium text-danger">{error}</p>
      ) : null}

      {sessions.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No saved sessions"
            description="Completed interviews land here for later review."
            action={<Link to="/interview/new" className="btn-primary">New interview</Link>}
          />
        </div>
      ) : (
        <ul className="sheet mt-8 divide-y divide-line">
          {sessions.map((session) => {
            const isPending = pendingDelete === session._id;
            const score = averageScore(session);

            return (
              <li
                key={session._id}
                className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">
                    {session.title || 'Untitled session'}
                  </p>
                  <p className="mt-0.5 text-[13px] text-ink-muted">
                    {session.role}, {session.level}
                  </p>
                  <p className="mt-1 font-mono text-xs text-ink-faint">
                    {new Date(session.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                    {' — '}
                    {session.questions?.length || 0} questions
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 md:justify-end">
                  {session.status === 'completed' && typeof score === 'number' ? (
                    <span className="bg-marker px-2 py-0.5 font-mono text-xs font-medium text-ink">
                      {score}
                    </span>
                  ) : (
                    <StatusChip status={session.status} />
                  )}
                  <Link
                    to={`/interview/${session._id}`}
                    className="btn-secondary h-8 px-3 py-1.5 text-xs"
                  >
                    Open
                  </Link>
                  {isPending ? (
                    <>
                      <button
                        type="button"
                        onClick={() => deleteSession(session._id)}
                        className="btn-danger h-8 px-3 py-1.5 text-xs"
                      >
                        Confirm delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(null)}
                        className="btn-ghost h-8 px-3 py-1.5 text-xs"
                      >
                        Keep
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => deleteSession(session._id)}
                      className="rounded-md px-2 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:text-danger"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
