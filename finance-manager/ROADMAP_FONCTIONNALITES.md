# Roadmap des Fonctionnalités Futures

Ce document détaille les spécifications techniques pour les 4 prochaines fonctionnalités majeures, classées par ordre croissant de complexité.

---

## 1. Gestion des Catégories Personnalisées (Niveau : Facile/Moyen) - ✅ TERMINÉ

Permettre à l'utilisateur d'ajouter, modifier et supprimer ses propres catégories de dépenses et de revenus, au lieu de se limiter à la liste prédéfinie.

### Fonctionnalités (Implémentées)

- ✅ Ajouter une nouvelle catégorie (Nom, Type, Icône, Couleur).
- ✅ Modifier une catégorie existante.
- ✅ Supprimer une catégorie (avec gestion des transactions orphelines : interdire la suppression ou migrer vers "Autre").
- ✅ Persistance en base de données (IndexedDB).

### Impact Technique (Réalisé)

- **Base de données** : Ajout de `updateCategory` et `deleteCategory`.
- **Store (`store.ts`)** : Ajout des actions `addCategory`, `updateCategory`, `deleteCategory`.
- **UI** :
  - Création du composant `CategoryManager.tsx` dans les paramètres.
  - Mise à jour de `UltimateTransactionForm.tsx` pour utiliser la liste dynamique.

---

## 2. Gestion Multi-Comptes (Niveau : Moyen)

Offrir une interface pour gérer plusieurs comptes (Courant, Épargne, Joint, Livret A, etc.) et les nommer librement.

### Fonctionnalités

- Liste des comptes dans les paramètres.
- Ajouter un compte (Nom, Type, Solde initial, Devise).
- Modifier le nom ou le type d'un compte.
- Supprimer un compte (attention aux transactions liées).
- Le sélecteur de compte dans le Header et le Formulaire de transaction doit refléter ces changements dynamiquement.

### Impact Technique

- **Base de données** : La table `accounts` existe déjà.
- **Store (`store.ts`)** :
  - Actions `addAccount`, `updateAccount`, `deleteAccount`.
  - La logique de calcul du solde global doit bien itérer sur tous les comptes.
- **UI** :
  - Créer `AccountSettings.tsx`.
  - Adapter `UltimateHeader.tsx` pour gérer une liste de comptes de longueur variable (défilement si trop de comptes).
  - Vérifier que les filtres dans `TransactionManager.tsx` gèrent bien les IDs de comptes dynamiques.

---

## 3. Menu "Charges Fixes" / Récurrentes (Niveau : Moyen/Difficile)

Automatiser la création de transactions récurrentes (Loyer, Abonnements, Salaire) pour éviter la saisie manuelle chaque mois.

### Fonctionnalités

- Nouveau menu "Charges Fixes" ou "Récurrent".
- Créer une récurrence : Transaction modèle + Fréquence (Mensuel, Hebdo, Annuel) + Date de début.
- Génération automatique des transactions à l'ouverture de l'application si la date est passée.
- Vue prévisionnelle des charges à venir dans le mois.

### Impact Technique

- **Base de données** :
  - Créer une nouvelle table `recurring_transactions` (id, amount, description, category, account, type, frequency, nextDueDate, active).
- **Logique (`store.ts` / `database.ts`)** :
  - Au chargement de l'app (`loadData`), vérifier les récurrences actives.
  - Si `nextDueDate` <= `today`, générer la transaction dans `transactions`, mettre à jour `nextDueDate`, et sauvegarder.
- **UI** :
  - Nouvelle page/composant `RecurringExpenses.tsx`.
  - Formulaire similaire à `UltimateTransactionForm` mais avec des champs de fréquence.

---

## 4. Personnalisation du Début de Mois (Niveau : Difficile)

Permettre à l'utilisateur de définir que son "mois financier" commence à une date spécifique (ex: le 5 du mois, jour de réception du salaire), impactant tous les calculs et graphiques.

### Fonctionnalités

- Paramètre global "Jour de début de mois" (1-28).
- Tous les dashboards (Revenus, Dépenses, Solde, Graphiques) doivent se baser sur cette période glissante (ex: du 5 janvier au 4 février) et non plus sur le mois civil (1er au 31).

### Impact Technique

- **Complexité** : C'est un changement structurel profond. Actuellement, beaucoup de fonctions utilisent `startOfMonth` et `endOfMonth` de `date-fns` qui se basent sur le calendrier civil.
- **Store & Utils** :
  - Il faudra créer des fonctions utilitaires personnalisées `getFinancialMonthStart(date, startDay)` et `getFinancialMonthEnd(date, startDay)`.
  - Remplacer **tous** les appels à `startOfMonth`/`endOfMonth` dans l'application par ces nouvelles fonctions.
  - Adapter les graphiques (Recharts) pour que l'axe X affiche les bonnes périodes.
  - Gérer les cas limites (mois de février, années bissextiles) si le jour choisi est le 29, 30 ou 31 (d'où la limitation conseillée à 28).
- **Risque de régression** : Élevé. Nécessite des tests approfondis sur toutes les vues (Dashboard, Analytics, Transactions).
