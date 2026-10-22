import { env } from '../config/env.js';
import { safeJsonParse, ensureArray } from '../utils/json.js';
import { HttpError } from '../utils/httpError.js';

function normalizeQuestionPayload(payload) {
  const questions = ensureArray(payload?.questions)
    .map((item) => ({
      question: String(item?.question || '').trim(),
      difficulty: ['easy', 'medium', 'hard'].includes(item?.difficulty) ? item.difficulty : 'medium'
    }))
    .filter((item) => item.question);

  if (!questions.length) {
    throw new Error('AI returned an invalid question set.');
  }

  return { questions };
}

function normalizeEvaluationPayload(payload) {
  const score = Number(payload?.score);
  const strengths = ensureArray(payload?.strengths).map(String).filter(Boolean);
  const weaknesses = ensureArray(payload?.weaknesses).map(String).filter(Boolean);
  const tips = ensureArray(payload?.tips).map(String).filter(Boolean);
  const betterAnswer = String(payload?.betterAnswer || '').trim();

  if (!Number.isFinite(score) || !betterAnswer) {
    throw new Error('AI returned an invalid evaluation payload.');
  }

  return {
    score,
    strengths,
    weaknesses,
    betterAnswer,
    tips,
    rawResponse: payload
  };
}

async function callOpenAI({ systemPrompt, userPrompt }) {
  if (!env.openAiApiKey) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.openAiApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: env.openAiModel,
      temperature: 0.4,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new HttpError(503, 'The OpenAI account has reached its rate or usage limit. Add billing/credits or use another AI provider.');
    }

    throw new Error(`OpenAI request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || '';
}

async function callGemini({ systemPrompt, userPrompt }) {
  if (!env.geminiApiKey) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${env.geminiModel}:generateContent?key=${env.geminiApiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
        }
      ]
    })
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new HttpError(503, 'The Gemini account has reached its rate or usage limit. Check the API quota or use another AI provider.');
    }

    throw new Error(`Gemini request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.map((part) => part.text).join('') || '';
}

async function callModel(prompt) {
  if (env.aiProvider === 'gemini') {
    return callGemini(prompt);
  }

  return callOpenAI(prompt);
}

export async function generateQuestionsPrompt(prompt) {
  const content = await callModel(prompt);
  const parsed = safeJsonParse(content);
  return normalizeQuestionPayload(parsed);
}

export async function evaluateAnswerPrompt(prompt) {
  const content = await callModel(prompt);
  const parsed = safeJsonParse(content);
  return normalizeEvaluationPayload(parsed);
}