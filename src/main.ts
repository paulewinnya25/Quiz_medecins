import './style.css';
import { questions } from './questions';
import { PlayerResult, LeaderboardEntry } from './types';
import { saveScore, getLeaderboard } from './supabase';

// Variables globales
let currentQuestion = 0;
let score = 0;
let playerAnswers: number[] = [];
let playerName = '';
let startTime: number | null = null;
let timerInterval: number | null = null;
let leaderboard: LeaderboardEntry[] = [];

// Éléments DOM
const qrSection = document.getElementById('qr-section') as HTMLDivElement;
const nameSection = document.getElementById('name-section') as HTMLDivElement;
const quizSection = document.getElementById('quiz-section') as HTMLDivElement;
const resultsSection = document.getElementById('results-section') as HTMLDivElement;
const playerNameInput = document.getElementById('player-name') as HTMLInputElement;
const questionContainer = document.getElementById('question-container') as HTMLDivElement;
const progressFill = document.getElementById('progress') as HTMLDivElement;
const nextBtn = document.getElementById('next-btn') as HTMLButtonElement;
const timerDisplay = document.getElementById('timer') as HTMLDivElement;
const scoreDisplay = document.getElementById('score-display') as HTMLDivElement;
const playerResult = document.getElementById('player-result') as HTMLDivElement;
const messageDisplay = document.getElementById('message') as HTMLParagraphElement;
const leaderboardList = document.getElementById('leaderboard-list') as HTMLDivElement;

// Génération du QR Code
function initializeQRCode(): void {
  // Ajouter un paramètre pour démarrage automatique
  const baseUrl = window.location.origin + window.location.pathname;
  const qrUrl = `${baseUrl}?autostart=1`;
  
  const qrCodeElement = document.getElementById('qrcode');
  
  if (qrCodeElement) {
    // Vider le conteneur
    qrCodeElement.innerHTML = '';
    
    // Vérifier si QRCode est disponible
    if (typeof (window as any).QRCode !== 'undefined') {
      new (window as any).QRCode(qrCodeElement, {
        text: qrUrl,
        width: 200,
        height: 200,
        colorDark: '#0066cc',  // Bleu médical du Centre Diagnostic
        colorLight: '#ffffff',
        correctLevel: (window as any).QRCode.CorrectLevel.H
      });
    } else {
      // Fallback : afficher un lien direct
      qrCodeElement.innerHTML = `
        <div style="text-align: center; padding: 20px;">
          <p style="color: #666; margin-bottom: 15px;">QR Code en cours de chargement...</p>
          <p style="color: #333; font-weight: bold;">Lien direct :</p>
          <p style="color: #0066cc; word-break: break-all; font-size: 14px;">${qrUrl}</p>
        </div>
      `;
    }
  }
}

// Vérifier si on vient d'un scan QR code
function checkAutoStart(): void {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('autostart') === '1') {
    // Démarrer automatiquement le quiz
    startQuiz();
  }
}

// Démarrer le quiz
function startQuiz(): void {
  qrSection.style.display = 'none';
  nameSection.style.display = 'block';
}

// Soumettre le nom
function submitName(): void {
  if (playerNameInput.value.trim() === '') {
    alert('Veuillez entrer votre nom');
    return;
  }
  playerName = playerNameInput.value.trim();
  nameSection.style.display = 'none';
  quizSection.style.display = 'block';
  startTimer();
  showQuestion();
}

// Timer
function startTimer(): void {
  startTime = Date.now();
  timerInterval = window.setInterval(updateTimer, 1000);
}

function updateTimer(): void {
  if (startTime === null) return;
  
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  timerDisplay.textContent = 
    `Temps: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Afficher une question
function showQuestion(): void {
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  
  progressFill.style.width = progress + '%';
  
  questionContainer.innerHTML = `
    <div class="question">
      <h3>Question ${currentQuestion + 1}/${questions.length}: ${question.question}</h3>
      <div class="answers">
        ${question.answers.map((answer, index) => `
          <div class="answer" data-index="${index}">
            ${answer}
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  // Ajouter les event listeners aux réponses
  const answerElements = questionContainer.querySelectorAll('.answer');
  answerElements.forEach((element) => {
    element.addEventListener('click', () => {
      const index = parseInt((element as HTMLElement).dataset.index || '0');
      selectAnswer(index);
    });
  });
  
  nextBtn.style.display = 'none';
}

// Sélectionner une réponse
function selectAnswer(index: number): void {
  const answers = questionContainer.querySelectorAll('.answer');
  answers.forEach(a => a.classList.remove('selected'));
  answers[index].classList.add('selected');
  
  playerAnswers[currentQuestion] = index;
  
  // Vérifier la réponse
  const correct = questions[currentQuestion].correctAnswer;
  if (index === correct) {
    answers[index].classList.add('correct');
    score++;
  } else {
    answers[index].classList.add('incorrect');
    answers[correct].classList.add('correct');
  }
  
  // Désactiver les clics
  answers.forEach(a => {
    (a as HTMLElement).style.pointerEvents = 'none';
  });
  
  // Afficher le bouton suivant
  nextBtn.style.display = 'block';
}

// Question suivante
function nextQuestion(): void {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

// Terminer le quiz
async function endQuiz(): Promise<void> {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
  }
  
  const totalTime = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
  
  // Créer le résultat du joueur
  const playerResultData: PlayerResult = {
    name: playerName,
    score: score,
    totalQuestions: questions.length,
    time: totalTime,
    date: new Date().toISOString()
  };
  
  // Sauvegarder dans Supabase
  await saveScore(playerResultData);
  
  // Récupérer le leaderboard depuis Supabase ou localStorage
  try {
    leaderboard = await getLeaderboard();
  } catch (error) {
    console.error('Erreur lors de la récupération du leaderboard:', error);
    leaderboard = [];
  }
  
  // Toujours sauvegarder dans localStorage comme backup
  const localLeaderboard = JSON.parse(localStorage.getItem('quizLeaderboard') || '[]');
  localLeaderboard.push(playerResultData);
  localLeaderboard.sort((a: PlayerResult, b: PlayerResult) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.time - b.time;
  });
  
  // Si pas de données Supabase, utiliser localStorage
  if (leaderboard.length === 0) {
    leaderboard = localLeaderboard.slice(0, 10);
  }
  
  // Toujours sauvegarder dans localStorage
  localStorage.setItem('quizLeaderboard', JSON.stringify(localLeaderboard.slice(0, 10)));
  
  // Afficher les résultats
  quizSection.style.display = 'none';
  resultsSection.style.display = 'block';
  
  playerResult.textContent = playerName;
  scoreDisplay.textContent = `${score}/${questions.length}`;
  
  // Message personnalisé
  let message = '';
  const percentage = (score / questions.length) * 100;
  if (percentage === 100) {
    message = '🏆 Parfait! Vous êtes un champion!';
  } else if (percentage >= 80) {
    message = '🌟 Excellent travail!';
  } else if (percentage >= 60) {
    message = '👍 Bon travail!';
  } else if (percentage >= 40) {
    message = '💪 Pas mal, continuez!';
  } else {
    message = '📚 Il faut encore s\'entraîner!';
  }
  messageDisplay.textContent = message;
  
  // Afficher le classement
  displayLeaderboard();
}

// Afficher le classement
function displayLeaderboard(): void {
  const currentPlayerIndex = leaderboard.findIndex(p => 
    p.name === playerName && p.score === score
  );
  
  leaderboardList.innerHTML = leaderboard.map((player, index) => {
    const isCurrent = index === currentPlayerIndex;
    const minutes = Math.floor(player.time / 60);
    const seconds = player.time % 60;
    const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    return `
      <div class="leaderboard-entry ${isCurrent ? 'current' : ''}">
        <span class="rank">#${index + 1}</span>
        <span class="player-name">${player.name}</span>
        <span class="player-score">${player.score}/${player.totalQuestions} (${timeStr})</span>
      </div>
    `;
  }).join('');
}

// Recommencer le quiz
function restartQuiz(): void {
  currentQuestion = 0;
  score = 0;
  playerAnswers = [];
  playerName = '';
  startTime = null;
  
  resultsSection.style.display = 'none';
  qrSection.style.display = 'block';
  playerNameInput.value = '';
}

// Event listeners
document.getElementById('start-btn')?.addEventListener('click', startQuiz);
document.getElementById('submit-name-btn')?.addEventListener('click', submitName);
document.getElementById('next-btn')?.addEventListener('click', nextQuestion);
document.getElementById('restart-btn')?.addEventListener('click', restartQuiz);

// Permettre de soumettre le nom avec Enter
playerNameInput?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    submitName();
  }
});

// Initialiser le QR Code au chargement
window.addEventListener('load', () => {
  // Vérifier d'abord si on vient d'un scan QR
  checkAutoStart();
  // Attendre un peu pour que QRCode.js soit complètement chargé
  setTimeout(initializeQRCode, 100);
});

// Initialiser aussi quand le DOM est prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    checkAutoStart();
    setTimeout(initializeQRCode, 100);
  });
} else {
  checkAutoStart();
  setTimeout(initializeQRCode, 100);
}

