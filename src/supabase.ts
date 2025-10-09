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

// Fonction pour nettoyer les doublons dans Supabase
export async function cleanSupabaseDuplicates(): Promise<void> {
  if (!supabase) {
    console.log('📦 Supabase non disponible');
    return;
  }

  try {
    console.log('🧹 Nettoyage des doublons dans Supabase...');
    
    // Récupérer toutes les données
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('❌ Erreur lors de la récupération des données:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.log('📦 Aucune donnée à nettoyer');
      return;
    }

    console.log('📊 Données récupérées:', data.length, 'participants');

    // Identifier les doublons (garder le plus récent)
    const seen = new Map();
    const toDelete: string[] = [];

    data.forEach((item: any) => {
      const key = `${item.name}_${item.date}`;
      if (seen.has(key)) {
        // Garder le plus récent (created_at le plus grand)
        const existing = seen.get(key);
        if (new Date(item.created_at) > new Date(existing.created_at)) {
          toDelete.push(existing.id);
          seen.set(key, item);
        } else {
          toDelete.push(item.id);
        }
      } else {
        seen.set(key, item);
      }
    });

    console.log('🗑️ Doublons à supprimer:', toDelete.length);

    if (toDelete.length > 0) {
      // Supprimer les doublons
      const { error: deleteError } = await supabase
        .from('leaderboard')
        .delete()
        .in('id', toDelete);

      if (deleteError) {
        console.error('❌ Erreur lors de la suppression:', deleteError);
      } else {
        console.log('✅ Doublons supprimés avec succès');
      }
    } else {
      console.log('✅ Aucun doublon trouvé');
    }

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
}

export async function saveScore(entry: LeaderboardEntry): Promise<void> {
  if (!supabase) {
    console.log('📦 Supabase non disponible, utilisation du localStorage');
    return;
  }

  console.log('🔄 Tentative de sauvegarde Supabase pour:', entry.name);
  console.log('🔄 Données à sauvegarder:', {
    name: entry.name,
    score: entry.score,
    total_questions: entry.totalQuestions,
    time: entry.time,
    date: entry.date,
    answers: entry.answers
  });

  try {
    const dataToInsert = {
      name: entry.name,
      score: entry.score,
      total_questions: entry.totalQuestions,
      time: entry.time,
      date: entry.date,
      answers: entry.answers ? JSON.stringify(entry.answers) : null
    };

    console.log('🔄 Données formatées pour Supabase:', dataToInsert);

    const { data, error } = await supabase
      .from('leaderboard')
      .insert([dataToInsert])
      .select();

    if (error) {
      console.error('❌ Erreur lors de la sauvegarde du score:', error);
      console.error('❌ Détails de l\'erreur:', error.message, error.details, error.hint);
    } else {
      console.log('✅ Score sauvegardé dans Supabase avec succès');
      console.log('✅ Données retournées:', data);
    }
  } catch (error) {
    console.error('❌ Erreur Supabase (catch):', error);
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
    const mappedData = (data || []).map((item: any) => ({
      name: item.name,
      score: item.score,
      totalQuestions: item.total_questions,
      time: item.time,
      date: item.date,
      answers: item.answers ? JSON.parse(item.answers) : undefined,
      id: item.id,
      created_at: item.created_at
    }));
    
    // Supprimer les doublons basés sur nom + date
    const uniqueData = mappedData.filter((participant: any, index: number, arr: any[]) => {
      return arr.findIndex(p => p.name === participant.name && p.date === participant.date) === index;
    });
    
    console.log('🧹 Données Supabase après déduplication:', uniqueData.length, 'participants');
    return uniqueData;
  } catch (error) {
    console.error('Erreur Supabase:', error);
    // Fallback sur localStorage
    const localLeaderboard = localStorage.getItem('quizLeaderboard');
    return localLeaderboard ? JSON.parse(localLeaderboard) : [];
  }
}

