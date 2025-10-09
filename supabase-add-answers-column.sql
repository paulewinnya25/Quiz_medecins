-- Ajouter la colonne answers à la table leaderboard
ALTER TABLE leaderboard 
ADD COLUMN answers TEXT;

-- Commentaire pour expliquer la colonne
COMMENT ON COLUMN leaderboard.answers IS 'Réponses du participant au format JSON array';

-- Optionnel : Créer un index pour améliorer les performances si nécessaire
-- CREATE INDEX idx_leaderboard_answers ON leaderboard USING GIN ((answers::jsonb));
