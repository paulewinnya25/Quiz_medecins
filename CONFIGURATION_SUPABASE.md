# 🔧 Configuration Supabase

## ✅ Votre projet Supabase est déjà configuré !

J'ai récupéré vos informations depuis votre tableau de bord Supabase :

### 📋 Vos identifiants Supabase

- **URL du projet** : `https://foljouvmepqujlpvvokp.supabase.co`
- **Clé API (anon public)** : `eyJhbGci0iJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3Mi0iJzd...`

### 🗄️ Créer la table leaderboard

1. Allez dans votre projet Supabase
2. Cliquez sur **"SQL Editor"** dans le menu de gauche
3. Cliquez sur **"New query"**
4. Copiez et collez le contenu du fichier `supabase-setup.sql` qui est dans votre projet
5. Cliquez sur **"Run"** pour exécuter le script

### 📄 Contenu du script SQL

```sql
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
```

### 🔑 Variables d'environnement pour Netlify

Quand vous déploierez sur Netlify, vous devrez ajouter ces variables d'environnement :

- **VITE_SUPABASE_URL** : `https://foljouvmepqujlpvvokp.supabase.co`
- **VITE_SUPABASE_ANON_KEY** : Votre clé API complète depuis Supabase

### ✅ Vérification

Après avoir créé la table, vous devriez voir :
- Une table `leaderboard` dans l'onglet "Table Editor"
- Les colonnes : id, name, score, total_questions, time, date, created_at
- Les politiques RLS activées dans l'onglet "Authentication"

### 🚀 Prochaine étape

Une fois la table créée, vous pouvez déployer sur Netlify ! Votre application utilisera automatiquement Supabase pour stocker les scores.
