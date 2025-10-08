# 🚀 Guide de Déploiement Manuel sur Netlify

## 📋 Étape 1 : Vérifier la Connexion GitHub ↔ Netlify

### A. Allez sur Netlify Dashboard
1. Connectez-vous sur : https://app.netlify.com/
2. Trouvez votre site : `quizzmedecinscdl`
3. Cliquez sur le site

### B. Vérifiez la Connexion GitHub
1. Allez dans **"Site Settings"** (Paramètres du site)
2. Cliquez sur **"Build & deploy"** dans le menu de gauche
3. Section **"Continuous Deployment"** :
   - Vérifiez que **GitHub** est connecté
   - Repository : `paulewinnya25/Quiz_medecins`
   - Branch : `main`

## 🔧 Étape 2 : Configurer les Variables d'Environnement

### Dans Netlify Dashboard :
1. **Site Settings** → **Build & deploy** → **Environment**
2. Cliquez sur **"Edit variables"** ou **"Add variable"**
3. Ajoutez ces 2 variables :

```
Key: VITE_SUPABASE_URL
Value: https://foljouvmepqujlpvvokp.supabase.co

Key: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvbGpvdXZtZXBxdWpscHZ2b2twIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjEzNjYsImV4cCI6MjA3NTM5NzM2Nn0.S1c18WRUxxE_AftiBrAraoOC2arsGr4h6t2fHTgDQZk
```

4. Cliquez sur **"Save"**

## 🏗️ Étape 3 : Vérifier les Build Settings

### Dans Netlify Dashboard :
1. **Site Settings** → **Build & deploy** → **Build settings**
2. Vérifiez :
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
   - **Node version** : 18 (dans Environment variables)

## 🚀 Étape 4 : Déploiement Manuel (Si nécessaire)

### Option A : Trigger Deploy (Recommandé)
1. Allez dans **"Deploys"** (en haut)
2. Cliquez sur **"Trigger deploy"** (bouton vert en haut à droite)
3. Sélectionnez **"Deploy site"**
4. Attendez 2-3 minutes

### Option B : Clear Cache & Deploy
1. Allez dans **"Deploys"**
2. Cliquez sur **"Trigger deploy"**
3. Sélectionnez **"Clear cache and deploy site"**
4. Attendez 2-3 minutes

## 🔍 Étape 5 : Vérifier le Déploiement

### A. Logs de Build
1. Dans **"Deploys"**, cliquez sur le déploiement en cours
2. Regardez les logs en temps réel
3. Vérifiez qu'il n'y a pas d'erreurs

### B. Fichiers Déployés
1. Une fois le build terminé, vérifiez les fichiers
2. Dans les logs, vous devriez voir :
   ```
   dist/index.html
   dist/admin.html
   dist/assets/...
   ```

### C. Test Final
1. Allez sur : `https://quizzmedecinscdl.netlify.app/admin.html`
2. Vous devriez voir la page admin
3. Mot de passe : `admin2025`

## ⚙️ Étape 6 : Configuration Alternative (Si toujours des problèmes)

### Si la redirection ne fonctionne toujours pas :

1. **Vérifiez le fichier `_redirects`** est dans le build :
   - Dans les logs Netlify, cherchez `_redirects`
   - Il devrait être copié dans `dist/`

2. **Alternative : Règles de Redirection dans l'UI Netlify** :
   - Allez dans **Site Settings** → **Build & deploy** → **Post processing**
   - Section **"Redirects and rewrites"**
   - Cliquez sur **"Edit rules"**
   - Ajoutez :
     ```
     /admin.html /admin.html 200
     /* /index.html 200
     ```

## 🆘 Dépannage

### Problème : Le site ne se déploie pas automatiquement

**Solution** :
1. Vérifiez les **Deploy notifications** dans Netlify
2. Vérifiez le **webhook** GitHub :
   - Allez sur GitHub : `https://github.com/paulewinnya25/Quiz_medecins`
   - **Settings** → **Webhooks**
   - Vérifiez qu'un webhook Netlify existe et est actif

### Problème : Build échoue

**Solution** :
1. Regardez les logs d'erreur
2. Vérifiez que `package.json` a les bonnes dépendances
3. Vérifiez que les variables d'environnement sont définies

### Problème : Page blanche

**Solution** :
1. Ouvrez la console (F12)
2. Regardez les erreurs
3. Vérifiez que les variables Supabase sont bien définies dans Netlify

## 📞 Contact Support Netlify

Si rien ne fonctionne :
1. Allez sur : https://answers.netlify.com/
2. Créez un nouveau topic avec :
   - URL de votre site
   - Description du problème
   - Logs de build

---

## ✅ Checklist Finale

Avant de tester, vérifiez que TOUT est fait :

- [ ] Repository GitHub connecté à Netlify
- [ ] Variables d'environnement configurées (VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY)
- [ ] Build settings corrects (npm run build, dist/)
- [ ] Déploiement manuel déclenché
- [ ] Build réussi (statut "Published" en vert)
- [ ] Fichiers admin.html et _redirects dans le build
- [ ] Test de la page admin
- [ ] Cache navigateur vidé

**Une fois tout coché, la page admin devrait fonctionner !** 🎉
