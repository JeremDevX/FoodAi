# Finance Manager - Application de Gestion Financière 100% Locale

Une application de gestion financière personnelle qui respecte votre vie privée. Toutes vos données restent stockées localement sur votre appareil, sans aucun envoi vers des serveurs externes.

## 🚀 Fonctionnalités

### Tableau de Bord "Nexus"
- **Pouls Financier** : Indicateur visuel unique de votre santé financière (0-100)
- **Timeline intelligente** : Vue chronologique des transactions, paiements à venir et alertes
- **Actions contextuelles** : Boutons dynamiques selon votre situation financière

### Gestion des Transactions
- **Import manuel** : Support des formats CSV, OFX, QIF
- **Catégorisation automatique** : Basée sur les noms de marchands
- **Saisie manuelle** : Interface optimisée avec auto-complétion
- **Export CSV** : Pour analyse externe

### Objectifs d'Épargne
- **Objectifs visuels** : Avec images personnalisées et dates cibles
- **Suivi de progression** : Jauges circulaires et statistiques
- **Célébrations** : Animations aux jalons 25%, 50%, 75%, 100%

### Analyses Financières
- **Graphiques interactifs** : Courbes, camemberts, histogrammes
- **Tendances mensuelles** : Comparaison revenus/dépenses
- **Analyse par catégorie** : Répartition et pourcentages
- **Projections simples** : Basées sur les moyennes

### Paramètres & Vie Privée
- **Stockage local** : IndexedDB dans le navigateur
- **Export/Import JSON** : Sauvegarde complète de vos données
- **Sauvegarde auto** : Mensuelle si activée
- **Suppression complète** : Effacement total possible

## 🔒 Vie Privée & Sécurité

- **100% Locale** : Aucune donnée ne quitte votre appareil
- **Pas de cloud** : Aucun serveur externe
- **Pas de tracking** : Aucun analytics ou telemetry
- **Chiffrement local** : Données sensibles protégées
- **Contrôle total** : Vous possédez entièrement vos données

## 🛠️ Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation locale
```bash
# Cloner le projet
git clone <url-du-repo>
cd finance-manager

# Installer les dépendances
npm install

# Lancer l'application
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 📊 Utilisation

### 1. Première Configuration
- L'application initialise automatiquement avec des catégories par défaut
- Un compte "Compte Principal" est créé
- Les paramètres sont configurables dans la section "Paramètres"

### 2. Ajout de Transactions
- **Import CSV** : Téléchargez vos relevés bancaires au format CSV
- **Saisie manuelle** : Utilisez le formulaire rapide
- **Catégorisation** : L'app suggère des catégories basées sur le nom du marchand

### 3. Création d'Objectifs
- Définissez un montant cible et une date limite
- Ajoutez une image pour motivation
- Suivez la progression visuellement

### 4. Analyses
- Consultez l'évolution mensuelle
- Analysez vos dépenses par catégorie
- Identifiez les tendances

## 💾 Sauvegarde des Données

### Sauvegarde Manuelle
1. Allez dans "Paramètres" > "Gestion des Données"
2. Cliquez sur "Exporter les données"
3. Le fichier JSON se télécharge automatiquement

### Sauvegarde Automatique
- Activable dans les paramètres
- Effectuée mensuellement
- Fichier nommé : `auto-backup-YYYY-MM-DD.json`

### Restauration
1. Dans "Paramètres" > "Gestion des Données"
2. Cliquez sur "Importer des données"
3. Sélectionnez votre fichier JSON de sauvegarde
4. Confirmez la restauration

## 🔧 Développement

### Structure du Projet
```
finance-manager/
├── src/
│   ├── app/              # Pages Next.js
│   ├── components/       # Composants React
│   │   ├── Dashboard/   # Composants du tableau de bord
│   │   ├── Transactions/ # Gestion des transactions
│   │   ├── Goals/       # Gestion des objectifs
│   │   ├── Analytics/   # Analyses et graphiques
│   │   └── Settings/    # Paramètres
│   ├── lib/             # Utilitaires et configuration
│   │   ├── database.ts  # IndexedDB et opérations
│   │   ├── store.ts     # Zustand store
│   │   └── utils.ts     # Fonctions utilitaires
│   ├── hooks/           # Hooks React personnalisés
│   └── types/           # Types TypeScript
├── public/              # Fichiers statiques
└── package.json
```

### Technologies Utilisées
- **Next.js 14** : Framework React
- **TypeScript** : Typage statique
- **Tailwind CSS** : Styling
- **IndexedDB** : Stockage local
- **Dexie.js** : Wrapper IndexedDB
- **Zustand** : State management
- **Recharts** : Graphiques et visualisations
- **Framer Motion** : Animations

### Scripts NPM
```bash
npm run dev      # Développement
npm run build    # Construction
npm run start    # Production
npm run lint     # Linting
```

## 🎯 Roadmap

### Version 1.1 (Prochaine)
- [ ] Mode PWA pour mobile
- [ ] Import automatique via drag & drop
- [ ] Catégories personnalisables
- [ ] Budgets par catégorie

### Version 1.2
- [ ] Graphiques plus avancés
- [ ] Prévisions intelligentes
- [ ] Export vers Excel
- [ ] Thèmes personnalisables

### Version 2.0 (Futur)
- [ ] Sync optionnelle (Dropbox, Google Drive)
- [ ] Version mobile dédiée
- [ ] API locale pour extensions
- [ ] Support multi-devises

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité
3. Commitez vos changements
4. Pushez vers la branche
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## ⚠️ Avertissement

Cette application est conçue pour un usage personnel. Bien qu'elle soit sécurisée avec le stockage local, il est recommandé de :
- Sauvegarder régulièrement vos données
- Ne pas stocker d'informations bancaires sensibles
- Utiliser un mot de passe fort pour votre appareil

## 📞 Support

Pour toute question ou problème :
1. Consultez la documentation
2. Vérifiez les issues existantes
3. Créez une nouvelle issue avec des détails

---

**Finance Manager** - Votre gestionnaire financier respectueux de la vie privée 🏦🔒