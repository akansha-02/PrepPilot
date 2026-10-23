import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import LoadingState from '../components/ui/LoadingState';
import EmptyState from '../components/ui/EmptyState';
import { Textarea } from '../components/ui/Field';
import { sessionsApi } from '../lib/api';
import QuestionCard from '../components/interview/QuestionCard';
import FeedbackPanel from '../components/interview/FeedbackPanel';

function sourceLabel(sourceType) {
  return sourceType === 'job-description' ? 'Job description' : 'Resume';
}

export default function InterviewPage() {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState(null);

  const loadSession = async () => {
    try {
      const data = await sessionsApi.get(sessionId);
      setSession(data.session);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const currentQuestion = session?.questions?.[session.currentQuestionIndex] || null;
  const progress = useMemo(() => {
    if (!session?.questions?.length) return 0;
    return Math.round((session.currentQuestionIndex / session.questions.length) * 100);
  }, [session]);

  const submitAnswer = async (event) => {
    event.preventDefault();
    if (!currentQuestion) return;

    setSaving(true);
    setError('');

    try {
      const data = await sessionsApi.answer(sessionId, {
        answerText: answer,
        questionIndex: session.currentQuestionIndex
      });
      setSession(data.session);
      setFeedback(data.evaluation);
      setAnswer('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAnswerKeyDown = (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      if (answer.trim() && !saving && currentQuestion) {
        submitAnswer(event);
      }
    }
  };

  if (loading) {
    return (
      <div className="page">
        <LoadingState label="Loading your session…" />
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="page max-w-3xl">
        <EmptyState
          title="Could not open this session"
          description={error}
          action={<Link to="/dashboard" className="btn-primary">Back to dashboard</Link>}
        />
      </div>
    );
  }

  if (!session) return null;

  const isCompleted = session.status === 'completed';

  const answeredScores = (session.questions || [])
    .map((question) => question.evaluation?.score)
    .filter((score) => typeof score === 'number');
  const averageScore = answeredScores.length
    ? Math.round(answeredScores.reduce((sum, score) => sum + score, 0) / answeredScores.length)
    : null;

  return (
    <div className="page">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-xs text-ink-muted">
            {session.role}, {session.level} — {sourceLabel(session.sourceType)}
          </p>
          <h1 className="page-title mt-1.5 truncate">{session.title || 'Untitled session'}</h1>
        </div>
        <Link
          to="/history"
          className="text-sm font-medium text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
        >
          All sessions
        </Link>
      </div>

      <div className="mt-6 md:mt-8">
        {session.questions?.length ? (
          <span className="font-mono text-xs text-ink-muted">
            {isCompleted
              ? 'Session complete'
              : `Question ${session.currentQuestionIndex + 1} of ${session.questions.length}`}
          </span>
        ) : null}
        {progress > 0 ? (
          <div className="mt-2 h-1.5 w-full overflow-hidden bg-line">
            <div
              className="h-full bg-ink transition-[width] duration-300 motion-reduce:transition-none"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        ) : null}
      </div>

      {isCompleted ? (
        <div className="mt-8">
          <div className="sheet divide-y divide-line">
            <div className="flex flex-wrap items-end justify-between gap-4 px-5 py-5 md:px-7">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
                  Interview complete
                </h2>
                <p className="mt-1 text-sm text-ink-muted">Your answers, scored and recorded.</p>
              </div>
              {averageScore !== null ? (
                <div className="flex items-center gap-3">
                  <span className="bg-marker px-3 py-2 font-display text-4xl font-extrabold leading-none tracking-tight text-ink">
                    {averageScore}
                  </span>
                  <span className="font-mono text-xs text-ink-faint">avg. score</span>
                </div>
              ) : null}
            </div>

            <ol>
              {session.questions.map((questionItem, index) => (
                <li key={index}>
                  <details className="group">
                    <summary className="flex cursor-pointer items-start gap-4 px-5 py-4 transition-colors hover:bg-paper-deep md:px-7">
                      <span className="relative top-[3px] font-mono text-sm text-ink-faint">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="min-w-0 flex-1 text-sm font-medium text-ink">
                        {questionItem.question}
                      </span>
                      <span className="relative top-[3px] font-mono text-sm text-ink-soft">
                        {questionItem.evaluation?.score ?? '—'}
                      </span>
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        className="relative top-[2px] h-3.5 w-3.5 shrink-0 text-ink-muted transition-transform group-open:rotate-90 motion-reduce:transition-none"
                        fill="none"
                      >
                        <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </summary>
                    <div className="border-t border-line px-5 py-4 md:px-7">
                      <p className="text-[13px] font-semibold text-ink-soft">Improved answer</p>
                      <blockquote className="mt-2 border-l-2 border-ink pl-4 text-sm leading-6 text-ink-soft">
                        {questionItem.evaluation?.betterAnswer ??
                          'No evaluation was recorded for this question.'}
                      </blockquote>
                    </div>
                  </details>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/interview/new" className="btn-primary">New interview</Link>
            <Link to="/dashboard" className="btn-secondary">Back to dashboard</Link>
          </div>
        </div>
      ) : !currentQuestion ? (
        <div className="mt-8">
          <EmptyState
            title="No questions yet"
            description="This session has no generated questions. Create a fresh session to start interviewing."
            action={<Link to="/interview/new" className="btn-primary">New interview</Link>}
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_0.9fr]">
          <div className="grid content-start gap-4">
            <QuestionCard
              question={currentQuestion}
              index={session.currentQuestionIndex}
              total={session.questions.length}
            />

            <form onSubmit={submitAnswer} className="sheet p-5 md:p-6">
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor="answer" className="field-label">Your answer</label>
                <span className="font-mono text-xs text-ink-faint">Ctrl+Enter to submit</span>
              </div>
              <Textarea
                id="answer"
                className="mt-2"
                rows={8}
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                onKeyDown={handleAnswerKeyDown}
                placeholder="Answer as if the interviewer is in the room…"
                required
              />
              {error ? (
                <p role="alert" className="mt-3 text-sm font-medium text-danger">{error}</p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2">
                <Button type="submit" disabled={saving || !answer.trim()}>
                  {saving ? 'Evaluating…' : 'Submit answer'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setAnswer('')} disabled={saving}>
                  Discard
                </Button>
              </div>
            </form>
          </div>

          <div className="grid content-start gap-4">
            {feedback ? (
              <FeedbackPanel evaluation={feedback} />
            ) : (
              <section className="sheet p-5 md:p-6" aria-label="Answer feedback">
                <p className="text-sm leading-6 text-ink-muted">
                  Submit an answer to get a scored review: what worked, what to change, and one
                  improved answer.
                </p>
              </section>
            )}

            <section className="sheet p-5 md:p-6">
              <p className="field-label">Session source</p>
              <p className="mt-1 text-[13px] text-ink-muted">
                {sourceLabel(session.sourceType)} — {session.sourceText?.length || 0} characters
              </p>
              <details className="mt-3 border-t border-line pt-3">
                <summary className="cursor-pointer text-sm font-medium text-ink">
                  Read the full text
                </summary>
                <p className="mt-2 max-h-72 overflow-y-auto break-words whitespace-pre-wrap text-[13px] leading-6 text-ink-soft">
                  {session.sourceText}
                </p>
              </details>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
