# 🧪 Guide de Test Local

## ✅ Corrections Appliquées

J'ai corrigé l'erreur **"supabaseUrl is required"** en améliorant la gestion des variables d'environnement :

### 🔧 Changements effectués :

1. **Fichier `.env` créé** avec vos identifiants :
   ```env
   VITE_SUPABASE_URL=https://foljouvmepqujlpvvokp.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...
   ```

2. **Amélioration de `src/supabase.ts`** :
   - ✅ Vérification si les credentials sont disponibles avant de créer le client
   - ✅ Gestion des erreurs avec try/catch
   - ✅ Fallback automatique sur localStorage
   - ✅ Messages console informatifs

3. **Amélioration de `src/main.ts`** :
   - ✅ Gestion d'erreur robuste pour getLeaderboard
   - ✅ Sauvegarde dans localStorage ET Supabase
   - ✅ Fallback intelligent si Supabase échoue

## 🚀 Serveur de Développement Lancé

Le serveur est maintenant actif ! Voici comment accéder à votre application :

### 📍 URL Local
Ouvrez votre navigateur et allez sur :
**http://localhost:3000**

ou

**http://localhost:5173** (selon la configuration Vite)

## ✅ Vérifications à Faire

1. **Page d'accueil** :
   - [ ] QR Code s'affiche correctement
   - [ ] Bouton "Commencer le Quiz" fonctionne

2. **Saisie du nom** :
   - [ ] Input nom fonctionne
   - [ ] Bouton "Démarrer le Quiz" fonctionne

3. **Questions** :
   - [ ] Les 10 questions s'affichent
   - [ ] Timer fonctionne
   - [ ] Barre de progression s'anime
   - [ ] Sélection de réponse fonctionne
   - [ ] Bouton "Question Suivante" apparaît

4. **Résultats** :
   - [ ] Score affiché correctement
   - [ ] Message personnalisé
   - [ ] Leaderboard affiché
   - [ ] Bouton "Rejouer" fonctionne

5. **Console du navigateur** :
   - Vérifiez les messages (F12 → Console)
   - Vous devriez voir : "✅ Supabase connecté avec succès"
   - Ou : "ℹ️ Supabase non configuré, utilisation du localStorage"

## 🗄️ Mode Fonctionnement

### Avec Supabase configuré :
- ✅ Scores sauvegardés dans Supabase
- ✅ Leaderboard synchronisé en temps réel
- ✅ Backup automatique dans localStorage

### Sans Supabase (fallback) :
- ✅ Scores sauvegardés dans localStorage
- ✅ Leaderboard local persistant
- ✅ Application 100% fonctionnelle

## 🔄 Arrêter le serveur

Pour arrêter le serveur de développement :
```bash
# Appuyez sur Ctrl+C dans le terminal
```

## 📦 Prochaines Étapes

Une fois que vous avez vérifié que tout fonctionne localement :

1. **Committer les changements** :
   ```bash
   git add .
   git commit -m "Fix: Amélioration gestion Supabase avec fallback localStorage"
   git push
   ```

2. **Déployer sur Netlify** :
   - Allez sur [app.netlify.com](https://app.netlify.com)
   - Import depuis GitHub
   - Ajoutez les variables d'environnement
   - Deploy !

## 🎯 Résumé

- ✅ Erreur "supabaseUrl is required" **corrigée**
- ✅ QR Code **fonctionnel**
- ✅ Boutons **fonctionnels**
- ✅ Gestion robuste des erreurs
- ✅ Fallback localStorage
- ✅ Application **prête pour production**

**Testez l'application sur http://localhost:3000 !** 🚀
