-- Création de la table leaderboard pour stocker les scores
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  score INT4 NOT NULL,
  total_questions INT4 NOT NULL,
  time INT4 NOT NULL,
  date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index pour améliorer les performances de tri
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC, time ASC);

-- Activer RLS (Row Level Security)
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture à tous
CREATE POLICY "Allow public read access" ON leaderboard
  FOR SELECT
  USING (true);

-- Politique pour permettre l'insertion à tous
CREATE POLICY "Allow public insert access" ON leaderboard
  FOR INSERT
  WITH CHECK (true);

