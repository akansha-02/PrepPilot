import Card from '../ui/Card';

export default function FeedbackPanel({ evaluation }) {
  if (!evaluation) {
    return (
      <Card>
        <h4 className="text-lg font-semibold text-white">Feedback</h4>
        <p className="mt-3 text-sm text-slate-300">Submit an answer to see structured AI feedback.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h4 className="text-lg font-semibold text-white">Feedback</h4>
      <div className="mt-4 space-y-4 text-sm text-slate-300">
        <p><span className="font-semibold text-white">Score:</span> {evaluation.score}</p>
        <div>
          <p className="font-semibold text-white">Strengths</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {evaluation.strengths?.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Weaknesses</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {evaluation.weaknesses?.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Better answer</p>
          <p className="mt-2 leading-6 text-slate-200">{evaluation.betterAnswer}</p>
        </div>
        <div>
          <p className="font-semibold text-white">Tips</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {evaluation.tips?.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>
    </Card>
  );
}