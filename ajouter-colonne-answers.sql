-- Script SQL pour ajouter la colonne answers à la table leaderboard
-- À exécuter dans le SQL Editor de Supabase

-- Ajouter la colonne answers
ALTER TABLE leaderboard 
ADD COLUMN answers TEXT;

-- Ajouter un commentaire explicatif
COMMENT ON COLUMN leaderboard.answers IS 'Réponses du participant au format JSON array';

-- Vérifier que la colonne a été ajoutée
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'leaderboard' 
AND column_name = 'answers';

-- Optionnel : Créer un index pour améliorer les performances
-- CREATE INDEX idx_leaderboard_answers ON leaderboard USING GIN ((answers::jsonb));
