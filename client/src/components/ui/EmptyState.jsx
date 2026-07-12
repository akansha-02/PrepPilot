import Card from './Card';

export default function EmptyState({ title, description, action }) {
  return (
    <Card className="flex flex-col items-start gap-4 border-dashed border-white/15 bg-white/5">
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{description}</p>
      </div>
      {action}
    </Card>
  );
}