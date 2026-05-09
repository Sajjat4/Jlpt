const capabilityScores = [
  { label: 'Speed', score: 96 },
  { label: 'Accuracy', score: 92 },
  { label: 'Creativity', score: 95 },
  { label: 'Coding', score: 94 },
  { label: 'Research', score: 91 },
  { label: 'Automation', score: 89 },
];

const navLinks = document.querySelectorAll('.nav-link');
const sections = [...navLinks].map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('#navMenu');
const scoreGrid = document.querySelector('#scoreGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const featureCards = document.querySelectorAll('.feature-card');
const revealElements = document.querySelectorAll('.reveal');

function renderScores() {
  scoreGrid.innerHTML = capabilityScores.map(({ label, score }) => `
    <article class="score-card">
      <div class="score-top"><span>${label}</span><span>${score}%</span></div>
      <div class="progress-track" aria-label="${label} score ${score} percent">
        <div class="progress-bar" data-score="${score}"></div>
      </div>
    </article>
  `).join('');
}

function setActiveLink() {
  const scrollPosition = window.scrollY + 160;
  let currentId = 'home';

  sections.forEach((section) => {
    if (section.offsetTop <= scrollPosition) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
  });
}

function closeMobileMenu() {
  navMenu.classList.remove('open');
  document.body.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}

function initParticles() {
  const canvas = document.querySelector('#particleCanvas');
  const context = canvas.getContext('2d');
  const particles = Array.from({ length: 90 }, () => ({
    x: Math.random(),
    y: Math.random(),
    radius: Math.random() * 1.7 + 0.4,
    speed: Math.random() * 0.18 + 0.05,
    alpha: Math.random() * 0.5 + 0.2,
  }));

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function animateParticles() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle) => {
      particle.y -= particle.speed / canvas.height;
      if (particle.y < -0.02) {
        particle.y = 1.02;
        particle.x = Math.random();
      }
      context.beginPath();
      context.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
      context.arc(particle.x * canvas.width, particle.y * canvas.height, particle.radius, 0, Math.PI * 2);
      context.fill();
    });
    requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  animateParticles();
  window.addEventListener('resize', resizeCanvas);
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

const scoreObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.progress-bar').forEach((bar) => {
        bar.style.width = `${bar.dataset.score}%`;
      });
      scoreObserver.disconnect();
    }
  });
}, { threshold: 0.35 });

renderScores();
initParticles();
revealElements.forEach((element) => revealObserver.observe(element));
scoreObserver.observe(document.querySelector('#scoring'));
setActiveLink();

menuToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  document.body.classList.toggle('menu-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener('click', closeMobileMenu);
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    featureCards.forEach((card) => {
      card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  });
});

window.addEventListener('scroll', setActiveLink, { passive: true });
