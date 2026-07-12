export function buildQuestionPrompt(session) {
  return {
    systemPrompt: [
      'You are an interview coach generating concise and realistic mock interview questions.',
      'Return valid JSON only. Do not add markdown, backticks, or commentary.',
      'The output must match this exact format: {"questions":[{"question":"...","difficulty":"easy|medium|hard"}]}'
    ].join(' '),
    userPrompt: JSON.stringify({
      role: session.role,
      level: session.level,
      sourceType: session.sourceType,
      sourceText: session.sourceText
    })
  };
}

export function buildEvaluationPrompt(session, question, answerText) {
  return {
    systemPrompt: [
      'You are an interviewer evaluating a candidate answer.',
      'Return valid JSON only. Do not add markdown, backticks, or commentary.',
      'The output must match this exact format: {"score":number,"strengths":["..."],"weaknesses":["..."],"betterAnswer":"...","tips":["..."]}'
    ].join(' '),
    userPrompt: JSON.stringify({
      role: session.role,
      level: session.level,
      question,
      answerText,
      sourceText: session.sourceText
    })
  };
}