export default function LoadingState({ label = 'Loading your interview experience...' }) {
  return (
    <div className="flex min-h-[280px] items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300">
      <div className="flex items-center gap-3">
        <span className="h-3 w-3 animate-pulse rounded-full bg-brand-400" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}