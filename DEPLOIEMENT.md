# Guide de Déploiement

Ce guide vous explique comment déployer votre application Quiz sur GitHub et Netlify.

## 📋 Pré-requis

- Un compte GitHub ([créer un compte](https://github.com/signup))
- Un compte Netlify ([créer un compte](https://app.netlify.com/signup))
- Un compte Supabase ([créer un compte](https://supabase.com))

## 🗄️ Configuration de Supabase

### 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com) et connectez-vous
2. Cliquez sur "New Project"
3. Donnez un nom à votre projet (ex: "quiz-medecins")
4. Choisissez un mot de passe sécurisé
5. Sélectionnez une région proche de vos utilisateurs
6. Cliquez sur "Create new project"

### 2. Créer la table

1. Dans votre projet Supabase, allez dans "SQL Editor"
2. Cliquez sur "New query"
3. Copiez et collez le contenu du fichier `supabase-setup.sql`
4. Cliquez sur "Run" pour exécuter le script

### 3. Récupérer les clés API

1. Allez dans "Settings" > "API"
2. Notez les informations suivantes :
   - **Project URL** : `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 🐙 Déploiement sur GitHub

### 1. Créer un dépôt sur GitHub

1. Allez sur [github.com](https://github.com)
2. Cliquez sur le bouton "+" en haut à droite puis "New repository"
3. Nommez votre dépôt : `Quizz_medecins`
4. Laissez-le en **Public** ou **Private** selon vos préférences
5. **Ne cochez PAS** "Initialize this repository with a README"
6. Cliquez sur "Create repository"

### 2. Pousser le code sur GitHub

Votre dépôt Git local est déjà initialisé. Il vous suffit d'ajouter le remote et de pousser :

```bash
# Remplacez 'votre-username' par votre nom d'utilisateur GitHub
git remote add origin https://github.com/votre-username/Quizz_medecins.git

# Pousser le code
git push -u origin main
```

Si vous avez une erreur d'authentification, vous devrez peut-être créer un Personal Access Token :
1. Allez dans GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Generate new token (classic)
3. Donnez-lui un nom et sélectionnez "repo"
4. Utilisez ce token comme mot de passe lors du push

## 🚀 Déploiement sur Netlify

### Option 1 : Via l'interface web (Recommandé)

1. Allez sur [netlify.com](https://www.netlify.com) et connectez-vous
2. Cliquez sur "Add new site" > "Import an existing project"
3. Choisissez "Deploy with GitHub"
4. Autorisez Netlify à accéder à votre compte GitHub
5. Sélectionnez le dépôt `Quizz_medecins`
6. Configurez le build :
   - **Branch to deploy** : `main`
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
7. Cliquez sur "Show advanced" puis "New variable"
8. Ajoutez les variables d'environnement :
   - `VITE_SUPABASE_URL` : votre URL Supabase
   - `VITE_SUPABASE_ANON_KEY` : votre clé anon Supabase
9. Cliquez sur "Deploy site"

### Option 2 : Via la CLI

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Initialiser le site
netlify init

# Ajouter les variables d'environnement
netlify env:set VITE_SUPABASE_URL "votre_url_supabase"
netlify env:set VITE_SUPABASE_ANON_KEY "votre_clé_anon"

# Déployer
netlify deploy --prod
```

## ✅ Vérification

Une fois le déploiement terminé :

1. Netlify vous donnera une URL (ex: `https://monquiz-abc123.netlify.app`)
2. Visitez cette URL pour tester votre application
3. Testez le quiz et vérifiez que les scores sont bien enregistrés dans Supabase

## 🔄 Mises à jour futures

Pour déployer des modifications :

```bash
# Faites vos modifications dans le code
# Puis :

git add .
git commit -m "Description de vos modifications"
git push

# Netlify redéploiera automatiquement !
```

## 🎨 Personnalisation du domaine (Optionnel)

Sur Netlify, vous pouvez :
1. Aller dans "Domain settings"
2. Cliquer sur "Add custom domain"
3. Suivre les instructions pour connecter votre propre domaine

## 🆘 Dépannage

### Le site ne se charge pas
- Vérifiez que le build s'est bien terminé dans Netlify
- Consultez les logs de déploiement

### Les scores ne s'enregistrent pas
- Vérifiez que les variables d'environnement sont bien configurées dans Netlify
- Vérifiez que la table Supabase existe et que les politiques RLS sont activées

### Erreur CORS
- Vérifiez que l'URL de votre site Netlify est autorisée dans Supabase
- Allez dans Authentication > URL Configuration dans Supabase

## 📞 Support

En cas de problème, consultez :
- [Documentation Netlify](https://docs.netlify.com)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Vite](https://vitejs.dev)

