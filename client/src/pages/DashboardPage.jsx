import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sessionsApi } from '../lib/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingState from '../components/ui/LoadingState';
import EmptyState from '../components/ui/EmptyState';

function Stat({ label, value }) {
  return (
    <Card>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
    </Card>
  );
}

export default function DashboardPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    sessionsApi.list()
      .then((data) => {
        if (active) setSessions(data.sessions || []);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const completedCount = sessions.filter((session) => session.status === 'completed').length;
  const activeCount = sessions.filter((session) => session.status === 'active').length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="section-title">Dashboard</h2>
          <p className="section-copy">Track interview sessions, review recent progress, and jump back into an active interview.</p>
        </div>
        <Link to="/interview/new">
          <Button>New session</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Total sessions" value={sessions.length} />
        <Stat label="Active sessions" value={activeCount} />
        <Stat label="Completed sessions" value={completedCount} />
      </div>

      <div className="mt-8">
        {loading && <LoadingState />}
        {!loading && error && <EmptyState title="Could not load sessions" description={error} />}
        {!loading && !error && sessions.length === 0 && (
          <EmptyState
            title="No interview sessions yet"
            description="Create your first session, generate questions, and start answering one question at a time."
            action={<Link to="/interview/new"><Button>Start your first session</Button></Link>}
          />
        )}
        {!loading && !error && sessions.length > 0 && (
          <div className="grid gap-4 lg:grid-cols-2">
            {sessions.slice(0, 6).map((session) => (
              <Card key={session._id} className="flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-white">{session.title}</p>
                      <p className="mt-1 text-sm text-slate-400">{session.role} · {session.level}</p>
                    </div>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
                      {session.status}
                    </span>
                  </div>
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-300">{session.sourceText}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.18em] text-slate-500">{session.questions?.length || 0} questions</span>
                  <Link to={`/interview/${session._id}`} className="text-sm font-semibold text-brand-300 hover:text-brand-200">
                    Open session
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}