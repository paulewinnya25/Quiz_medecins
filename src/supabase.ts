import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { LeaderboardEntry } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Créer le client Supabase seulement si les credentials sont disponibles
let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase connecté avec succès');
  } catch (error) {
    console.warn('⚠️ Erreur de connexion Supabase:', error);
    console.log('📦 L\'application utilisera localStorage comme fallback');
  }
} else {
  console.log('ℹ️ Supabase non configuré, utilisation du localStorage');
}

export { supabase };

export async function saveScore(entry: LeaderboardEntry): Promise<void> {
  if (!supabase) {
    console.log('📦 Supabase non disponible, utilisation du localStorage');
    return;
  }

  try {
    const { error } = await supabase
      .from('leaderboard')
      .insert([{
        name: entry.name,
        score: entry.score,
        total_questions: entry.totalQuestions,
        time: entry.time,
        date: entry.date,
        answers: entry.answers ? JSON.stringify(entry.answers) : null
      }]);

    if (error) {
      console.error('Erreur lors de la sauvegarde du score:', error);
    } else {
      console.log('✅ Score sauvegardé dans Supabase');
    }
  } catch (error) {
    console.error('Erreur Supabase:', error);
  }
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  if (!supabase) {
    console.log('📦 Supabase non disponible, utilisation du localStorage');
    const localLeaderboard = localStorage.getItem('quizLeaderboard');
    return localLeaderboard ? JSON.parse(localLeaderboard) : [];
  }

  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .order('time', { ascending: true })
      .limit(10);

    if (error) {
      console.error('Erreur lors de la récupération du leaderboard:', error);
      // Fallback sur localStorage
      const localLeaderboard = localStorage.getItem('quizLeaderboard');
      return localLeaderboard ? JSON.parse(localLeaderboard) : [];
    }

    console.log('✅ Leaderboard récupéré depuis Supabase');
    return (data || []).map((item: any) => ({
      name: item.name,
      score: item.score,
      totalQuestions: item.total_questions,
      time: item.time,
      date: item.date,
      answers: item.answers ? JSON.parse(item.answers) : undefined,
      id: item.id,
      created_at: item.created_at
    }));
  } catch (error) {
    console.error('Erreur Supabase:', error);
    // Fallback sur localStorage
    const localLeaderboard = localStorage.getItem('quizLeaderboard');
    return localLeaderboard ? JSON.parse(localLeaderboard) : [];
  }
}

