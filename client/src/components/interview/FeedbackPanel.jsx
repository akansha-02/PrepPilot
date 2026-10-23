export default function FeedbackPanel({ evaluation }) {
  const score = evaluation?.score;

  return (
    <section className="sheet p-5 md:p-6" aria-label="Answer feedback">
      <div className="flex items-center gap-3">
        <span className="bg-marker px-3 py-2 font-display text-5xl font-extrabold leading-none tracking-tight text-ink md:text-6xl">
          {score ?? '—'}
        </span>
        <span className="font-mono text-xs text-ink-faint">/ 100</span>
      </div>

      <div className="mt-6 space-y-6">
        {evaluation?.strengths?.length ? (
          <div>
            <h3 className="text-[13px] font-semibold text-ink-soft">What worked</h3>
            <ul className="mt-2 space-y-2">
              {evaluation.strengths.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-6 text-ink-soft">
                  <span aria-hidden="true" className="font-medium text-ink">+</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {evaluation?.weaknesses?.length ? (
          <div>
            <h3 className="text-[13px] font-semibold text-ink-soft">What to improve</h3>
            <ul className="mt-2 space-y-2">
              {evaluation.weaknesses.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-6 text-ink-soft">
                  <span aria-hidden="true" className="font-medium text-ink">–</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {evaluation?.betterAnswer ? (
          <div>
            <h3 className="text-[13px] font-semibold text-ink-soft">Improved answer</h3>
            <blockquote className="mt-2 border-l-2 border-ink pl-4 text-sm leading-6 text-ink-soft">
              {evaluation.betterAnswer}
            </blockquote>
          </div>
        ) : null}

        {evaluation?.tips?.length ? (
          <div>
            <h3 className="text-[13px] font-semibold text-ink-soft">Tips</h3>
            <ol className="mt-2 space-y-1.5">
              {evaluation.tips.map((item, tipIndex) => (
                <li key={item} className="flex gap-3 text-sm leading-5 text-ink-soft">
                  <span className="font-mono text-xs leading-5 text-ink-faint">{tipIndex + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </div>
    </section>
  );
}
