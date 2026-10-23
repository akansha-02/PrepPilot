export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-line-strong bg-sheet px-6 py-14 text-center">
      <h3 className="font-display text-xl font-bold text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-ink-muted">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
