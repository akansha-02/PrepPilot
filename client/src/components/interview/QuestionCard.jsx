import Card from '../ui/Card';

export default function QuestionCard({ question, index, total }) {
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-200">
        Question {index + 1} of {total}
      </p>
      <h3 className="mt-3 text-2xl font-semibold text-white">{question.question}</h3>
      <div className="mt-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
        {question.difficulty}
      </div>
    </Card>
  );
}