import './style.css';
import { questions } from './questions';
import { getLeaderboard, cleanSupabaseDuplicates } from './supabase';
import { LeaderboardEntry } from './types';

// Mot de passe admin (à changer en production - devrait être dans variables d'environnement)
const ADMIN_PASSWORD = 'admin2025';

// Éléments DOM
const authContainer = document.getElementById('auth-container') as HTMLDivElement;
const dashboard = document.getElementById('dashboard') as HTMLDivElement;
const passwordInput = document.getElementById('admin-password') as HTMLInputElement;
const loginBtn = document.getElementById('login-btn') as HTMLButtonElement;
const logoutBtn = document.getElementById('logout-btn') as HTMLButtonElement;
const authError = document.getElementById('auth-error') as HTMLParagraphElement;
const authForm = document.getElementById('auth-form') as HTMLFormElement;
const headerActions = document.getElementById('header-actions') as HTMLDivElement;

// Statistiques
const totalParticipants = document.getElementById('total-participants') as HTMLDivElement;
const avgScore = document.getElementById('avg-score') as HTMLDivElement;
const avgTime = document.getElementById('avg-time') as HTMLDivElement;
const bestScore = document.getElementById('best-score') as HTMLDivElement;

// Tables
const leaderboardTable = document.getElementById('leaderboard-body') as HTMLTableSectionElement;
const questionsList = document.getElementById('questions-list') as HTMLDivElement;

// Vérifier si l'admin est déjà connecté
function checkAuth(): void {
  const isAuth = sessionStorage.getItem('adminAuth');
  if (isAuth === 'true') {
    showDashboard();
  }
}

// Login
function login(): void {
  const password = passwordInput.value;
  
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem('adminAuth', 'true');
    showDashboard();
    authError.style.display = 'none';
  } else {
    authError.style.display = 'block';
    passwordInput.value = '';
    passwordInput.focus();
  }
}

// Logout
function logout(): void {
  sessionStorage.removeItem('adminAuth');
  showAuth();
}

// Afficher l'auth
function showAuth(): void {
  authContainer.style.display = 'flex';
  dashboard.classList.remove('active');
  headerActions.style.display = 'none';
  passwordInput.value = '';
  authError.style.display = 'none';
}

// Charger les données du dashboard
async function loadDashboardData(): Promise<void> {
  try {
    console.log('🔄 Début du chargement des données admin...');
    
    // Essayer d'abord localStorage directement
    let data: any[] = [];
    const localData = localStorage.getItem('quizLeaderboard');
    
    if (localData) {
      console.log('📦 Données trouvées dans localStorage:', localData.length, 'caractères');
      console.log('📦 Contenu localStorage:', localData);
      try {
        data = JSON.parse(localData);
        console.log('📦 Données localStorage parsées:', data.length, 'participants');
        console.log('📦 Participants:', data.map(p => p.name));
      } catch (e) {
        console.error('❌ Erreur parsing localStorage:', e);
        data = [];
      }
    } else {
      console.log('📦 Aucune donnée dans localStorage');
    }
    
    // Essayer aussi Supabase pour vérifier
    console.log('🔄 Tentative de chargement depuis Supabase...');
    const leaderboardData = await getLeaderboard();
    console.log('🔄 Données Supabase:', leaderboardData.length, 'participants');
    console.log('🔄 Participants Supabase:', leaderboardData.map(p => ({ name: p.name, score: p.score, date: p.date })));
    
    // Prendre la source avec le plus de données
    if (leaderboardData.length > data.length) {
      console.log('📊 Utilisation des données Supabase (plus récentes)');
      data = leaderboardData;
    } else {
      console.log('📊 Utilisation des données localStorage');
    }
    
    console.log('📊 Données finales chargées:', data.length, 'participants');
    
    // Calculer les statistiques
    if (data.length > 0) {
      // Total participants
      totalParticipants.textContent = data.length.toString();
      
      // Score moyen
      const avgScoreValue = data.reduce((sum, p) => sum + p.score, 0) / data.length;
      const avgScorePercent = (avgScoreValue / 10) * 100;
      avgScore.textContent = Math.round(avgScorePercent) + '%';
      
      // Temps moyen
      const avgTimeValue = Math.floor(data.reduce((sum, p) => sum + p.time, 0) / data.length);
      const minutes = Math.floor(avgTimeValue / 60);
      const seconds = avgTimeValue % 60;
      avgTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      // Meilleur score
      const best = data[0]; // Déjà trié
      bestScore.textContent = `${best.score}/10`;
    } else {
      // Pas de données - afficher valeurs par défaut
      console.log('⚠️ Aucune donnée trouvée');
      totalParticipants.textContent = '0';
      avgScore.textContent = '0%';
      avgTime.textContent = '0:00';
      bestScore.textContent = '0/10';
    }
    
    // Afficher le classement
    displayLeaderboard(data);
    
    // Afficher les questions
    displayQuestions();
    
  } catch (error) {
    console.error('❌ Erreur lors du chargement des données:', error);
    leaderboardTable.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #f44336;">Erreur de chargement. Vérifiez la console.</td></tr>';
  }
}

// Afficher le classement
function displayLeaderboard(data: LeaderboardEntry[]): void {
  if (data.length === 0) {
    leaderboardTable.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: #666;">Aucun participant pour le moment</td></tr>';
    return;
  }
  
  leaderboardTable.innerHTML = data.map((player, index) => {
    const minutes = Math.floor(player.time / 60);
    const seconds = player.time % 60;
    const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    let rankBadgeClass = 'rank-badge';
    if (index === 0) rankBadgeClass += ' gold';
    else if (index === 1) rankBadgeClass += ' silver';
    else if (index === 2) rankBadgeClass += ' bronze';
    else rankBadgeClass += ' default';
    
    const date = new Date(player.date);
    const dateStr = date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return `
      <tr data-player-index="${index}" onclick="showPlayerDetails(${index})">
        <td><span class="${rankBadgeClass}">${index + 1}</span></td>
        <td><strong>${player.name}</strong></td>
        <td>${player.score}/${player.totalQuestions} (${Math.round((player.score / player.totalQuestions) * 100)}%)</td>
        <td>${timeStr}</td>
        <td>${dateStr}</td>
      </tr>
    `;
  }).join('');
}

// Afficher les questions et réponses
function displayQuestions(): void {
  questionsList.innerHTML = `
    <div class="questions-grid">
      ${questions.map((q, index) => `
        <div class="question-card">
          <div class="question-header">
            <div class="question-number">Question ${index + 1}</div>
            <div class="question-text">${q.question}</div>
          </div>
          <div class="question-body">
            <ul class="answer-list">
              ${q.answers.map((answer, ansIndex) => {
                const isCorrect = ansIndex === q.correctAnswer;
                return `
                  <li class="answer-item">
                    <div class="answer-icon ${isCorrect ? 'correct' : 'incorrect'}">
                      ${isCorrect ? '✓' : '✗'}
                    </div>
                    <span class="${isCorrect ? 'answer-text correct' : 'answer-text'}">${answer}</span>
                  </li>
                `;
              }).join('')}
            </ul>
            ${q.explanation ? `
              <div class="question-explanation">
                <strong>💬 Explication :</strong> ${q.explanation}
              </div>
            ` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Sauvegarder les données pour les utiliser dans la modal
async function loadDashboardDataWithModal(): Promise<void> {
  await loadDashboardData();
  // Mettre à jour la variable globale après le chargement
  try {
    let data: any[] = [];
    const localData = localStorage.getItem('quizLeaderboard');
    
    if (localData) {
      try {
        data = JSON.parse(localData);
      } catch (e) {
        data = [];
      }
    }
    
    const leaderboardData = await getLeaderboard();
    
    if (leaderboardData.length > data.length) {
      data = leaderboardData;
    }
    
    currentLeaderboardData = data;
  } catch (error) {
    console.error('Erreur lors du chargement des données pour la modal:', error);
  }
}

// Afficher le dashboard
function showDashboard(): void {
  authContainer.style.display = 'none';
  dashboard.classList.add('active');
  headerActions.style.display = 'flex';
  loadDashboardDataWithModal();
}

// Event listeners
authForm.addEventListener('submit', (e) => {
  e.preventDefault();
  login();
});

loginBtn.addEventListener('click', login);
logoutBtn.addEventListener('click', logout);
document.getElementById('refresh-btn')?.addEventListener('click', loadDashboardDataWithModal);

// Fonction de debug
function debugData(): void {
  console.log('🔍 === DEBUG DONNÉES ===');
  
  // Vérifier localStorage
  const localData = localStorage.getItem('quizLeaderboard');
  console.log('📦 localStorage:', localData);
  
  // Vérifier les données Supabase
  getLeaderboard().then(data => {
    console.log('🗄️ Supabase données:', data);
    console.log('🗄️ Participants trouvés:', data.map(p => p.name));
    
    // Chercher Vanessa spécifiquement
    const vanessa = data.find(p => p.name.toLowerCase().includes('vanessa'));
    if (vanessa) {
      console.log('✅ Vanessa trouvée:', vanessa);
    } else {
      console.log('❌ Vanessa non trouvée dans Supabase');
    }
  });
  
  // Vérifier les données actuelles affichées
  console.log('📊 Données actuelles affichées:', currentLeaderboardData);
  const vanessaCurrent = currentLeaderboardData.find(p => p.name.toLowerCase().includes('vanessa'));
  if (vanessaCurrent) {
    console.log('✅ Vanessa dans données actuelles:', vanessaCurrent);
  } else {
    console.log('❌ Vanessa non trouvée dans données actuelles');
  }
  
  alert('Debug terminé - Vérifiez la console (F12)');
}

// Fonction pour nettoyer les doublons
async function cleanDuplicates(): Promise<void> {
  console.log('🧹 === NETTOYAGE DES DOUBLONS ===');
  
  // Nettoyer Supabase d'abord
  await cleanSupabaseDuplicates();
  
  // Nettoyer localStorage
  const localData = localStorage.getItem('quizLeaderboard');
  if (localData) {
    try {
      const localLeaderboard = JSON.parse(localData);
      console.log('📦 localStorage avant nettoyage:', localLeaderboard.length, 'participants');
      
      // Supprimer les doublons basés sur nom + date
      const uniqueParticipants = localLeaderboard.filter((participant: any, index: number, arr: any[]) => {
        return arr.findIndex(p => p.name === participant.name && p.date === participant.date) === index;
      });
      
      localStorage.setItem('quizLeaderboard', JSON.stringify(uniqueParticipants));
      console.log('📦 localStorage après nettoyage:', uniqueParticipants.length, 'participants');
    } catch (e) {
      console.error('❌ Erreur nettoyage localStorage:', e);
    }
  }
  
  // Recharger les données depuis Supabase
  await loadDashboardDataWithModal();
  
  alert('Nettoyage terminé - Les doublons ont été supprimés');
}

document.getElementById('debug-btn')?.addEventListener('click', debugData);
document.getElementById('clean-duplicates-btn')?.addEventListener('click', cleanDuplicates);

passwordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    login();
  }
});

// Vérifier l'auth au chargement
checkAuth();

// Variables globales pour la modal
let currentLeaderboardData: LeaderboardEntry[] = [];

// Fonction pour afficher les détails d'un participant
(window as any).showPlayerDetails = function(index: number): void {
  const player = currentLeaderboardData[index];
  if (!player) {
    alert('Participant non trouvé.');
    return;
  }
  
  if (!player.answers || player.answers.length === 0) {
    alert('Les réponses de ce participant ne sont pas disponibles. Ce participant a probablement terminé le quiz avant l\'ajout de cette fonctionnalité.');
    return;
  }

  const modal = document.getElementById('player-details-modal') as HTMLDivElement;
  const modalBody = document.getElementById('modal-body-content') as HTMLDivElement;

  // Calculer les statistiques
  const minutes = Math.floor(player.time / 60);
  const seconds = player.time % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  const percentage = Math.round((player.score / player.totalQuestions) * 100);
  
  const date = new Date(player.date);
  const dateStr = date.toLocaleDateString('fr-FR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Générer le contenu de la modal
  let modalContent = `
    <div class="player-info">
      <h3 style="margin-bottom: 1rem; color: var(--accent-green); font-size: 1.5rem;">
        ${player.name}
      </h3>
      <div class="player-info-grid">
        <div class="player-info-item">
          <span class="player-info-label">Score</span>
          <span class="player-info-value">${player.score}/${player.totalQuestions}</span>
        </div>
        <div class="player-info-item">
          <span class="player-info-label">Pourcentage</span>
          <span class="player-info-value">${percentage}%</span>
        </div>
        <div class="player-info-item">
          <span class="player-info-label">Temps</span>
          <span class="player-info-value">${timeStr}</span>
        </div>
        <div class="player-info-item">
          <span class="player-info-label">Date</span>
          <span class="player-info-value" style="font-size: 1rem;">${dateStr}</span>
        </div>
      </div>
    </div>

    <h4 style="margin-bottom: 1.5rem; color: var(--gray-700); font-size: 1.125rem; font-weight: 700;">
      📋 Détail des réponses
    </h4>
  `;

  // Générer les cartes de questions
  questions.forEach((question, qIndex) => {
    const playerAnswer = player.answers![qIndex];

    modalContent += `
      <div class="modal-question-card">
        <div class="modal-question-header">
          <div class="modal-question-number">${qIndex + 1}</div>
          <div class="modal-question-text">${question.question}</div>
        </div>

        <ul class="modal-answers-list">
          ${question.answers.map((answer, aIndex) => {
            const isPlayerAnswer = aIndex === playerAnswer;
            const isCorrectAnswer = aIndex === question.correctAnswer;
            
            let itemClass = 'modal-answer-item';
            let badgeClass = 'modal-answer-badge neutral';
            let badgeIcon = '';
            let labelHtml = '';

            if (isPlayerAnswer) {
              itemClass += ' player-answer';
              labelHtml = '<span class="player-answer-label">Votre réponse</span>';
              
              if (isCorrectAnswer) {
                itemClass += ' correct';
                badgeClass = 'modal-answer-badge correct';
                badgeIcon = '✓';
              } else {
                itemClass += ' incorrect';
                badgeClass = 'modal-answer-badge incorrect';
                badgeIcon = '✗';
              }
            } else if (isCorrectAnswer) {
              itemClass += ' correct';
              badgeClass = 'modal-answer-badge correct';
              badgeIcon = '✓';
            } else {
              badgeIcon = '—';
            }

            return `
              <li class="${itemClass}">
                <div class="${badgeClass}">${badgeIcon}</div>
                <div class="modal-answer-text">${answer}</div>
                ${labelHtml}
              </li>
            `;
          }).join('')}
        </ul>

        ${question.explanation ? `
          <div class="modal-explanation">
            <strong>💬 Explication :</strong> ${question.explanation}
          </div>
        ` : ''}
      </div>
    `;
  });

  modalBody.innerHTML = modalContent;
  modal.classList.add('active');
};

// Fermer la modal
function closeModal(): void {
  const modal = document.getElementById('player-details-modal') as HTMLDivElement;
  modal.classList.remove('active');
}

// Event listeners pour la modal
document.getElementById('close-modal')?.addEventListener('click', closeModal);
document.getElementById('player-details-modal')?.addEventListener('click', (e) => {
  if ((e.target as HTMLElement).id === 'player-details-modal') {
    closeModal();
  }
});

