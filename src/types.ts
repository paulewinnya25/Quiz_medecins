export interface Question {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface PlayerResult {
  name: string;
  score: number;
  totalQuestions: number;
  time: number;
  date: string;
  answers?: number[];  // Les réponses du joueur (index des réponses)
}

export interface LeaderboardEntry extends PlayerResult {
  id?: string;
  created_at?: string;
}

