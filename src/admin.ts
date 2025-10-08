import './style.css';
import { questions } from './questions';
import { getLeaderboard } from './supabase';
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

// Afficher le dashboard
function showDashboard(): void {
  authContainer.style.display = 'none';
  dashboard.classList.add('active');
  headerActions.style.display = 'flex';
  loadDashboardData();
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
      try {
        data = JSON.parse(localData);
        console.log('📦 Données localStorage parsées:', data.length, 'participants');
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
    
    const date = new Date(player.date);
    const dateStr = date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return `
      <tr>
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
                    <span>${answer}</span>
                  </li>
                `;
              }).join('')}
            </ul>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Event listeners
authForm.addEventListener('submit', (e) => {
  e.preventDefault();
  login();
});

loginBtn.addEventListener('click', login);
logoutBtn.addEventListener('click', logout);
document.getElementById('refresh-btn')?.addEventListener('click', loadDashboardData);

passwordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    login();
  }
});

// Vérifier l'auth au chargement
checkAuth();

