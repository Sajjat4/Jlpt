import { JLPT_NUMBER_BANK } from '../data/jlptNumbers.js';

const MIN_QUESTIONS = 1;
const MAX_QUESTIONS = 50;

const normalizeAnswer = (answer = '') => String(answer)
  .trim()
  .toLowerCase()
  .replace(/[\s\-ー]/g, '')
  .replace(/ū/g, 'uu')
  .replace(/ō/g, 'ou');

const clampQuestionAmount = (amount) => {
  const parsedAmount = Number.parseInt(amount, 10);

  if (Number.isNaN(parsedAmount)) {
    return 10;
  }

  return Math.max(MIN_QUESTIONS, Math.min(parsedAmount, MAX_QUESTIONS));
};

const shuffleQuestions = (items) => {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
};

export function generateQuestions(amount) {
  const requestedAmount = clampQuestionAmount(amount);
  const shuffled = shuffleQuestions(JLPT_NUMBER_BANK);

  return Array.from({ length: requestedAmount }, (_, index) => {
    const item = shuffled[index % shuffled.length];
    const mode = index % 2 === 0 ? 'reading' : 'kanji';

    return {
      id: `${item.value}-${mode}-${index}`,
      prompt: mode === 'reading'
        ? `Write the Japanese reading for ${item.value} (${item.kanji}).`
        : `Write the kanji for the number ${item.value}.`,
      displayValue: String(item.value),
      kanji: item.kanji,
      readings: item.readings,
      mode,
      acceptedAnswers: mode === 'reading' ? item.readings : [item.kanji, String(item.value)],
    };
  });
}

export function validateAnswer(question, answer) {
  if (!question?.acceptedAnswers?.length) {
    return false;
  }

  const normalizedAnswer = normalizeAnswer(answer);
  return question.acceptedAnswers.some((accepted) => normalizeAnswer(accepted) === normalizedAnswer);
}

export function getAnswerLabel(question) {
  if (!question) {
    return '';
  }

  return question.mode === 'reading' ? question.readings[0] : question.kanji;
}

export function summarizeResults(questions = []) {
  const answered = questions.filter((question) => question.status).length;
  const correct = questions.filter((question) => question.status === 'correct').length;
  const wrong = questions.filter((question) => question.status === 'wrong').length;

  return {
    answered,
    correct,
    wrong,
    total: questions.length,
    score: questions.length ? Math.round((correct / questions.length) * 100) : 0,
  };
}
