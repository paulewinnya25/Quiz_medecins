# 🔑 Configuration Finale - Vos Identifiants Supabase

## ✅ Identifiants Récupérés

J'ai maintenant vos identifiants Supabase complets :

- **URL du projet** : `https://foljouvmepqujlpvvokp.supabase.co`
- **Clé API (anon public)** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvbGpvdXZtZXBxdWpscHZ2b2twIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjEzNjYsImV4cCI6MjA3NTM5NzM2Nn0.S1c18WRUxxE_AftiBrAraoOC2arsGr4h6t2fHTgDQZk`

## 🗄️ ÉTAPE 1 : Créer la table dans Supabase

### Instructions détaillées :

1. **Allez dans votre projet Supabase** : https://foljouvmepqujlpvvokp.supabase.co
2. **Connectez-vous** avec vos identifiants
3. **Cliquez sur "SQL Editor"** dans le menu de gauche
4. **Cliquez sur "New query"**
5. **Copiez et collez le script suivant** :

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

6. **Cliquez sur "Run"** pour exécuter le script
7. **Vérifiez** que la table `leaderboard` apparaît dans "Table Editor"

## 🚀 ÉTAPE 2 : Déployer sur Netlify

### Via l'interface web (Recommandé) :

1. **Allez sur [app.netlify.com](https://app.netlify.com)**
2. **Cliquez sur "Add new site" → "Import an existing project"**
3. **Choisissez "Deploy with GitHub"**
4. **Autorisez Netlify** à accéder à votre compte GitHub
5. **Sélectionnez le dépôt `Quiz_medecins`**
6. **Configurez le build** :
   - **Branch to deploy** : `main`
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
7. **Cliquez sur "Show advanced" → "New variable"**
8. **Ajoutez les variables d'environnement** :
   - **Variable 1** :
     - **Key** : `VITE_SUPABASE_URL`
     - **Value** : `https://foljouvmepqujlpvvokp.supabase.co`
   - **Variable 2** :
     - **Key** : `VITE_SUPABASE_ANON_KEY`
     - **Value** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvbGpvdXZtZXBxdWpscHZ2b2twIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjEzNjYsImV4cCI6MjA3NTM5NzM2Nn0.S1c18WRUxxE_AftiBrAraoOC2arsGr4h6t2fHTgDQZk`
9. **Cliquez sur "Deploy site"**

## 🧪 ÉTAPE 3 : Tester l'application

Une fois le déploiement terminé :

1. **Visitez l'URL Netlify** (ex: `https://monquiz-abc123.netlify.app`)
2. **Testez le quiz** :
   - Scannez le QR code ou cliquez "Commencer le Quiz"
   - Entrez votre nom
   - Répondez aux 10 questions
   - Vérifiez que votre score apparaît dans le classement
3. **Vérifiez dans Supabase** :
   - Allez dans "Table Editor"
   - Cliquez sur la table `leaderboard`
   - Vérifiez que vos données sont bien sauvegardées

## ✅ Vérification finale

Si tout fonctionne correctement, vous devriez voir :

- ✅ **L'application se charge** sans erreur
- ✅ **Le quiz fonctionne** (questions, timer, score)
- ✅ **Le QR code s'affiche** correctement
- ✅ **Les scores sont sauvegardés** dans Supabase
- ✅ **Le leaderboard se met à jour** en temps réel

## 🆘 Dépannage

### Si l'application ne se charge pas :
- Vérifiez les logs de build dans Netlify
- Vérifiez que les variables d'environnement sont correctes

### Si les scores ne s'enregistrent pas :
- Vérifiez que la table `leaderboard` existe dans Supabase
- Vérifiez que les politiques RLS sont activées
- Vérifiez que les variables d'environnement sont bien configurées dans Netlify

### Si erreur CORS :
- Allez dans Supabase → Authentication → URL Configuration
- Ajoutez l'URL de votre site Netlify dans "Site URL"

## 🎉 Félicitations !

Une fois ces 3 étapes terminées, votre application de quiz interactive sera :
- ✅ **En ligne et accessible** via l'URL Netlify
- ✅ **Connectée à Supabase** pour le stockage persistant
- ✅ **Partageable** via QR code
- ✅ **Responsive** et moderne

**Votre application sera prête à être utilisée !** 🚀
