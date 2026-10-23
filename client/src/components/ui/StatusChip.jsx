export default function StatusChip({ status }) {
  if (status === 'completed') {
    return <span className="chip">Completed</span>;
  }

  if (status === 'active') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-sm bg-marker px-2 py-0.5 text-xs font-semibold text-ink">
        <span className="h-1.5 w-1.5 rounded-full bg-ink/70" aria-hidden="true" />
        In progress
      </span>
    );
  }

  return <span className="chip">Draft</span>;
}
