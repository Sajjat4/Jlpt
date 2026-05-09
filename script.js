import { createQuiz } from './src/components/quiz.js';
import { createScanner } from './src/components/scanner.js';

const scannerRoot = document.querySelector('#scannerApp');
const quizRoot = document.querySelector('#quizApp');

createScanner(scannerRoot);
createQuiz(quizRoot);

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
