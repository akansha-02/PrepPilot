import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sessionsApi } from '../lib/api';
import Button from '../components/ui/Button';
import LoadingState from '../components/ui/LoadingState';
import EmptyState from '../components/ui/EmptyState';
import SessionSummaryCard from '../components/dashboard/SessionSummaryCard';

export default function HistoryPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const deleteSession = async (sessionId) => {
    const confirmed = window.confirm('Delete this interview session?');
    if (!confirmed) return;

    await sessionsApi.remove(sessionId);
    setSessions((current) => current.filter((session) => session._id !== sessionId));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="section-title">Session history</h2>
          <p className="section-copy">Revisit past interviews, inspect feedback, and delete sessions you no longer need.</p>
        </div>
        <Link to="/interview/new"><Button>New session</Button></Link>
      </div>

      {loading && <LoadingState />}
      {!loading && error && <EmptyState title="Could not load history" description={error} />}
      {!loading && !error && sessions.length === 0 && (
        <EmptyState
          title="No saved sessions"
          description="Once you create and complete a mock interview, it will appear here for later review."
          action={<Link to="/interview/new"><Button>Create a session</Button></Link>}
        />
      )}
      {!loading && !error && sessions.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          {sessions.map((session) => (
            <SessionSummaryCard
              key={session._id}
              session={session}
              actions={(
                <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  {session.questions?.length || 0} questions · {new Date(session.createdAt).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <Link to={`/interview/${session._id}`} className="text-sm font-semibold text-brand-300 hover:text-brand-200">Open</Link>
                  <button className="text-sm font-semibold text-red-300 hover:text-red-200" onClick={() => deleteSession(session._id)}>
                    Delete
                  </button>
                </div>
                </div>
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}