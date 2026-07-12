import Session from '../models/Session.js';
import { buildEvaluationPrompt } from '../services/prompts.js';
import { evaluateAnswerPrompt } from '../services/aiService.js';

export async function submitAnswer(req, res, next) {
  try {
    const { answerText, questionIndex } = req.body;

    if (typeof answerText !== 'string' || !answerText.trim()) {
      return res.status(400).json({ message: 'answerText is required.' });
    }

    const session = await Session.findOne({ _id: req.params.sessionId, deletedAt: null });

    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }

    const currentIndex = Number.isInteger(questionIndex) ? questionIndex : session.currentQuestionIndex;
    const question = session.questions[currentIndex];

    if (!question) {
      return res.status(400).json({ message: 'No active question is available for this session.' });
    }

    const prompt = buildEvaluationPrompt(session, question.question, answerText);
    const evaluation = await evaluateAnswerPrompt(prompt);

    session.questions[currentIndex] = {
      ...question.toObject?.() || question,
      answerText,
      evaluation,
      answeredAt: new Date()
    };

    const nextIndex = currentIndex + 1;
    session.currentQuestionIndex = nextIndex;
    if (nextIndex >= session.questions.length) {
      session.status = 'completed';
      session.completedAt = new Date();
    }

    await session.save();

    return res.json({ session, evaluation });
  } catch (error) {
    return next(error);
  }
}