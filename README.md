# Quiz Interactif avec QR Code

Application de quiz interactive développée en TypeScript avec Supabase pour le stockage du leaderboard.

## 🚀 Fonctionnalités

- Quiz interactif avec 10 questions
- Génération de QR Code pour partage facile
- Timer pour mesurer le temps de réponse
- Système de score et de classement
- Stockage persistant avec Supabase
- Interface responsive et moderne

## 📦 Technologies utilisées

- **TypeScript** - Langage principal
- **Vite** - Build tool et dev server
- **Supabase** - Backend as a Service pour le stockage
- **QRCode.js** - Génération de QR codes

## 🛠️ Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/votre-username/Quizz_medecins.git
cd Quizz_medecins
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez Supabase :
   - Créez un projet sur [Supabase](https://supabase.com)
   - Créez une table `leaderboard` avec les colonnes suivantes :
     - `id` (uuid, primary key, auto-generated)
     - `name` (text)
     - `score` (int4)
     - `total_questions` (int4)
     - `time` (int4)
     - `date` (timestamp)
     - `created_at` (timestamp, auto-generated)
   
4. Créez un fichier `.env` à la racine du projet :
```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_clé_anon_supabase
```

5. Lancez le serveur de développement :
```bash
npm run dev
```

## 🌐 Déploiement sur Netlify

### Option 1 : Déploiement via GitHub

1. Poussez votre code sur GitHub :
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/votre-username/Quizz_medecins.git
git push -u origin main
```

2. Connectez-vous sur [Netlify](https://www.netlify.com)
3. Cliquez sur "New site from Git"
4. Sélectionnez votre dépôt GitHub
5. Configurez les variables d'environnement dans Netlify :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Déployez !

### Option 2 : Déploiement via CLI

```bash
# Installez la CLI Netlify
npm install -g netlify-cli

# Connectez-vous
netlify login

# Déployez
netlify deploy --prod
```

## 📝 Configuration Supabase

SQL pour créer la table :

```sql
CREATE TABLE leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  score INT4 NOT NULL,
  total_questions INT4 NOT NULL,
  time INT4 NOT NULL,
  date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX idx_leaderboard_score ON leaderboard(score DESC, time ASC);
```

## 🎮 Utilisation

1. Scannez le QR code ou cliquez sur "Commencer le Quiz"
2. Entrez votre nom
3. Répondez aux questions
4. Consultez votre score et le classement

## 📄 License

ISC

