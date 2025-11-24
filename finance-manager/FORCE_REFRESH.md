# 🔄 Comment voir les nouvelles couleurs

## Le problème

Les modifications CSS sont dans le fichier mais vous ne les voyez pas à cause du cache.

## Solutions (dans l'ordre) :

### 1. 🔴 Hard Refresh du navigateur

- **Windows** : `Ctrl + Shift + R` ou `Ctrl + F5`
- **Mac** : `Cmd + Shift + R`

### 2. 🎨 Vérifier le thème actif

1. Ouvrez l'application
2. Allez dans **Paramètres** (⚙️)
3. Sélectionnez le thème **"Clair"** (Sun icon)
4. Hard refresh : `Ctrl + Shift + R`

### 3. 🧹 Vider le cache du navigateur

1. Ouvrez les DevTools : `F12`
2. Clic droit sur le bouton refresh → **"Vider le cache et actualiser"**

### 4. 🔧 Redémarrer le serveur de dev

```bash
# Arrêter le serveur (Ctrl + C)
# Puis relancer :
npm run dev
```

### 5. 🧪 Tester dans une fenêtre privée

Ouvrez une fenêtre de navigation privée pour tester sans cache

## 🎨 Couleurs à vérifier (thème Clair)

- Fond : `#fbf8f3` (beige crème)
- Texte : `#3d3935` (brun sépia)
- Accent : `#2b6cb0` (bleu ardoise)
- Succès : `#15a37e` (vert menthe)
- Danger : `#c44741` (rouge brique)

Si aucune de ces couleurs n'est visible, c'est un problème de cache !
