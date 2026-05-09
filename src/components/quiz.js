import { generateQuestions, getAnswerLabel, summarizeResults, validateAnswer } from '../utils/quiz.js';

const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

export function createQuiz(root) {
  if (!root) {
    return;
  }

  let questions = generateQuestions(10).map(addRuntimeState);

  root.innerHTML = `
    <div class="quiz-layout">
      <aside class="glass-card quiz-settings">
        <label class="field-label" for="questionAmount">Number of questions</label>
        <div class="stepper-row">
          <input id="questionAmount" class="number-input" type="number" min="1" max="50" value="10" />
          <button class="button primary" id="generateQuiz" type="button">Generate</button>
        </div>
        <p class="helper-text">Questions are generated from core JLPT-style number readings and kanji, including irregular readings such as 三百, 六百, 八百, 三千, and 八千.</p>

        <div class="score-board" id="scoreBoard"></div>
      </aside>

      <div class="question-column" id="questionColumn"></div>
    </div>
  `;

  const amountInput = root.querySelector('#questionAmount');
  const generateButton = root.querySelector('#generateQuiz');
  const scoreBoard = root.querySelector('#scoreBoard');
  const questionColumn = root.querySelector('#questionColumn');

  function addRuntimeState(question) {
    return {
      ...question,
      userAnswer: '',
      status: null,
      revealed: false,
    };
  }

  function renderScoreBoard() {
    const summary = summarizeResults(questions);
    scoreBoard.innerHTML = `
      <div class="score-ring" aria-label="Score ${summary.score} percent">
        <span>${summary.score}%</span>
      </div>
      <div class="metric-grid">
        <div><strong>${summary.total}</strong><span>Total</span></div>
        <div><strong>${summary.correct}</strong><span>Correct</span></div>
        <div><strong>${summary.wrong}</strong><span>Wrong</span></div>
        <div><strong>${summary.answered}</strong><span>Answered</span></div>
      </div>
    `;
    scoreBoard.style.setProperty('--score-angle', `${summary.score * 3.6}deg`);
  }

  function renderQuestions() {
    questionColumn.innerHTML = questions.map((question, index) => {
      const stateClass = question.status ? `is-${question.status}` : '';
      const statusIcon = question.status === 'correct' ? '✓' : question.status === 'wrong' ? '✕' : '';
      const placeholder = question.mode === 'reading' ? 'Example: いち / ichi' : 'Example: 一';
      const answerLabel = getAnswerLabel(question);

      return `
        <article class="question-card ${stateClass}" data-question-id="${question.id}">
          <div class="question-topline">
            <span class="question-number">Question ${index + 1}</span>
            <span class="question-state" aria-live="polite">${statusIcon}</span>
          </div>
          <h3>${escapeHtml(question.prompt)}</h3>
          <div class="number-chip" aria-label="Number prompt">${escapeHtml(question.displayValue)}</div>
          <div class="answer-row">
            <input class="answer-input" value="${escapeHtml(question.userAnswer)}" data-answer-input="${question.id}" placeholder="${escapeHtml(placeholder)}" autocomplete="off" />
            <button class="button primary check-answer" type="button" data-check-id="${question.id}">Check</button>
          </div>
          <div class="question-actions">
            <button class="button secondary voice-answer" type="button" data-voice-id="${question.id}">Voice</button>
            <button class="button secondary reveal-answer" type="button" data-reveal-id="${question.id}">Answer</button>
          </div>
          <p class="answer-feedback">
            ${question.revealed ? `Accepted answer: <strong>${escapeHtml(answerLabel)}</strong>` : 'Use Voice to hear the answer or tap Answer to reveal it.'}
          </p>
        </article>
      `;
    }).join('');
  }

  function rerender() {
    renderScoreBoard();
    renderQuestions();
  }

  generateButton.addEventListener('click', () => {
    questions = generateQuestions(amountInput.value).map(addRuntimeState);
    amountInput.value = String(questions.length);
    rerender();
  });

  questionColumn.addEventListener('input', (event) => {
    const input = event.target.closest('[data-answer-input]');
    if (!input) return;
    const question = questions.find((item) => item.id === input.dataset.answerInput);
    if (!question) return;
    question.userAnswer = input.value;
  });

  questionColumn.addEventListener('click', (event) => {
    const checkButton = event.target.closest('[data-check-id]');
    const revealButton = event.target.closest('[data-reveal-id]');
    const voiceButton = event.target.closest('[data-voice-id]');

    if (checkButton) {
      const question = questions.find((item) => item.id === checkButton.dataset.checkId);
      if (!question) return;
      question.status = validateAnswer(question, question.userAnswer) ? 'correct' : 'wrong';
      question.revealed = question.status === 'wrong';
      rerender();
      return;
    }

    if (revealButton) {
      const question = questions.find((item) => item.id === revealButton.dataset.revealId);
      if (!question) return;
      question.revealed = true;
      rerender();
      return;
    }

    if (voiceButton) {
      const question = questions.find((item) => item.id === voiceButton.dataset.voiceId);
      if (!question) return;
      if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
        question.revealed = true;
        rerender();
        return;
      }

      const utterance = new window.SpeechSynthesisUtterance(getAnswerLabel(question));
      utterance.lang = 'ja-JP';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  });

  rerender();
}
