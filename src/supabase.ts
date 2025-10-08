import { createClient } from '@supabase/supabase-js';
import { LeaderboardEntry } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveScore(entry: LeaderboardEntry): Promise<void> {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase non configuré, utilisation du localStorage');
    return;
  }

  const { error } = await supabase
    .from('leaderboard')
    .insert([{
      name: entry.name,
      score: entry.score,
      total_questions: entry.totalQuestions,
      time: entry.time,
      date: entry.date
    }]);

  if (error) {
    console.error('Erreur lors de la sauvegarde du score:', error);
  }
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase non configuré, utilisation du localStorage');
    const localLeaderboard = localStorage.getItem('quizLeaderboard');
    return localLeaderboard ? JSON.parse(localLeaderboard) : [];
  }

  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('score', { ascending: false })
    .order('time', { ascending: true })
    .limit(10);

  if (error) {
    console.error('Erreur lors de la récupération du leaderboard:', error);
    return [];
  }

  return (data || []).map((item: any) => ({
    name: item.name,
    score: item.score,
    totalQuestions: item.total_questions,
    time: item.time,
    date: item.date,
    id: item.id,
    created_at: item.created_at
  }));
}

