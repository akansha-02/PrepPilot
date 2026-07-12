import Session from '../models/Session.js';
import { buildQuestionPrompt } from '../services/prompts.js';
import { generateQuestionsPrompt } from '../services/aiService.js';
import { extractTextFromResumeFile } from '../utils/resumeText.js';
import { normalizeSourceText } from '../utils/sourceText.js';

function buildTitle({ title, role, level }) {
  if (title && title.trim()) {
    return title.trim();
  }

  return `${role} · ${level} interview prep`;
}

export async function createSession(req, res, next) {
  try {
    const { role, level, sourceType, sourceText = '', title } = req.body;
    const uploadedFile = req.file;

    if (!role || !level || !sourceType) {
      return res.status(400).json({ message: 'role, level, and sourceType are required.' });
    }

    if (sourceType === 'job-description' && !String(sourceText).trim()) {
      return res.status(400).json({ message: 'sourceText is required for job description sessions.' });
    }

    if (sourceType === 'resume' && !uploadedFile && !String(sourceText).trim()) {
      return res.status(400).json({ message: 'Upload a resume file or paste resume text.' });
    }

    const extractedText = uploadedFile
      ? await extractTextFromResumeFile(uploadedFile)
      : normalizeSourceText(sourceText);

    if (!extractedText) {
      return res.status(400).json({ message: 'Could not extract any text from the uploaded source.' });
    }

    const session = await Session.create({
      title: buildTitle({ title, role, level }),
      role,
      level,
      sourceType,
      sourceText: extractedText,
      sourceFileName: uploadedFile?.originalname || '',
      sourceFileType: uploadedFile?.mimetype || '',
      status: 'draft'
    });

    return res.status(201).json({ session });
  } catch (error) {
    return next(error);
  }
}

export async function listSessions(_req, res, next) {
  try {
    const sessions = await Session.find({ deletedAt: null }).sort({ createdAt: -1 }).lean();
    return res.json({ sessions });
  } catch (error) {
    return next(error);
  }
}

export async function getSession(req, res, next) {
  try {
    const session = await Session.findOne({ _id: req.params.sessionId, deletedAt: null }).lean();

    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }

    return res.json({ session });
  } catch (error) {
    return next(error);
  }
}

export async function deleteSession(req, res, next) {
  try {
    const session = await Session.findOneAndUpdate(
      { _id: req.params.sessionId, deletedAt: null },
      { deletedAt: new Date(), status: 'deleted' },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }

    return res.json({ session });
  } catch (error) {
    return next(error);
  }
}

export async function generateQuestions(req, res, next) {
  try {
    const session = await Session.findOne({ _id: req.params.sessionId, deletedAt: null });

    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }

    const prompt = buildQuestionPrompt(session);
    const payload = await generateQuestionsPrompt(prompt);

    session.questions = payload.questions;
    session.currentQuestionIndex = 0;
    session.status = 'active';
    session.completedAt = null;
    await session.save();

    return res.json({ session, questions: payload.questions });
  } catch (error) {
    return next(error);
  }
}