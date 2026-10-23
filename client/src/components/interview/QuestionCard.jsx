import clsx from 'clsx';

export default function QuestionCard({ question, index, total }) {
  return (
    <section className="sheet p-5 md:p-7">
      <div className="grid gap-4 md:grid-cols-[6.5rem_1fr] md:gap-0">
        <div className="flex items-center justify-between border-b border-line pb-4 md:mr-8 md:block md:border-b-0 md:border-r md:pb-0 md:pr-8">
          <p className="font-mono text-4xl font-medium leading-none tracking-tight text-ink md:text-5xl">
            {String(index + 1).padStart(2, '0')}
          </p>
          <p className="font-mono text-xs text-ink-faint md:mt-2">of {total}</p>
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold leading-snug tracking-tight text-ink sm:text-3xl">
            {question.question}
          </h2>
          <div className="mt-5 flex items-center gap-2">
            <span
              className={clsx(
                'chip capitalize',
                question.difficulty === 'hard' && 'border-ink text-ink'
              )}
            >
              {question.difficulty}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
