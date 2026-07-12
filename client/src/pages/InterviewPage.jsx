import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingState from '../components/ui/LoadingState';
import EmptyState from '../components/ui/EmptyState';
import { Input, Textarea } from '../components/ui/Field';
import { sessionsApi } from '../lib/api';
import QuestionCard from '../components/interview/QuestionCard';
import FeedbackPanel from '../components/interview/FeedbackPanel';

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

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <LoadingState label="Loading your interview session..." />
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <EmptyState
          title="Could not open this session"
          description={error}
          action={<Link to="/dashboard"><Button>Back to dashboard</Button></Link>}
        />
      </div>
    );
  }

  if (!session) return null;

  const isCompleted = session.status === 'completed';

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="section-title">{session.title}</h2>
          <p className="section-copy">{session.role} · {session.level} · {session.questions?.length || 0} questions</p>
        </div>
        <Link to="/history" className="text-sm font-semibold text-brand-300 hover:text-brand-200">Review all sessions</Link>
      </div>

      <div className="mb-6 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-accent-400 transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
      </div>

      {isCompleted ? (
        <Card>
          <h3 className="text-xl font-semibold text-white">Interview completed</h3>
          <p className="mt-2 text-slate-300">You finished all questions for this session. Review the feedback below and revisit earlier answers anytime.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {session.questions.map((questionItem, index) => (
              <Card key={index} className="bg-white/5">
                <p className="text-sm font-semibold text-white">Q{index + 1}. {questionItem.question}</p>
                <p className="mt-2 text-sm text-slate-400">Score: {questionItem.evaluation?.score ?? '—'}</p>
                <p className="mt-2 text-sm text-slate-300">{questionItem.evaluation?.betterAnswer}</p>
              </Card>
            ))}
          </div>
        </Card>
      ) : !currentQuestion ? (
        <EmptyState title="Waiting for questions" description="This session does not have generated questions yet. Go back to the dashboard and create a fresh session." action={<Link to="/interview/new"><Button>Start a new session</Button></Link>} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <Card>
            <QuestionCard question={currentQuestion} index={session.currentQuestionIndex} total={session.questions.length} />

            <form onSubmit={submitAnswer} className="mt-6 grid gap-4">
              <Textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Type your answer here..."
                required
              />
              {error && <p className="text-sm font-medium text-red-300">{error}</p>}
              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={saving || !answer.trim()}>
                  {saving ? 'Evaluating answer...' : 'Submit answer'}
                </Button>
                <Button type="button" variant="secondary" onClick={() => setAnswer('')}>
                  Clear
                </Button>
              </div>
            </form>
          </Card>

          <div className="grid gap-6">
            <Card>
              <h4 className="text-lg font-semibold text-white">Session context</h4>
              <p className="mt-3 text-sm leading-6 text-slate-300">Source type: {session.sourceType}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{session.sourceText}</p>
            </Card>

            {feedback ? <FeedbackPanel evaluation={feedback} /> : <EmptyState title="AI feedback will appear here" description="Submit your answer to see a score, strengths, weaknesses, and an improved sample response." />}
          </div>
        </div>
      )}
    </div>
  );
}