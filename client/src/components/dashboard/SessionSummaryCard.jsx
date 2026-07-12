import Card from '../ui/Card';

export default function SessionSummaryCard({ session, actions }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{session.role} · {session.level}</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{session.title}</h3>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">{session.status}</span>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300 line-clamp-3">{session.sourceText}</p>
      {actions ? <div className="mt-5">{actions}</div> : null}
    </Card>
  );
}