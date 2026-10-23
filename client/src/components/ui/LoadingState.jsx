export default function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="sheet flex min-h-64 flex-col items-center justify-center gap-4 p-10" role="status">
      <div className="flex gap-1.5" aria-hidden="true">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink motion-reduce:animate-none"
            style={{ animationDelay: `${dot * 160}ms` }}
          />
        ))}
      </div>
      <p className="text-sm text-ink-muted">{label}</p>
    </div>
  );
}
