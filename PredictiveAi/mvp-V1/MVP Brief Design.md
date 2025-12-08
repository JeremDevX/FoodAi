# MVP APPLICATION - BRIEF CRÉATIF COMPLET
## Application d'IA Prédictive de Gestion des Stocks Restauration
### Document de Conception pour Maquettes UI/UX

---

## 1. POSITIONNEMENT PRODUIT & PROPOSITION DE VALEUR

### Tagline Principal
**"Réduisez votre gaspillage de 25-35% en 3 mois grâce à l'IA"**

### Sous-titre
Intelligence artificielle qui anticipe la demande, optimise vos achats, et vous fait économiser des milliers d'euros

### Utilisateur Cible Principal
- **Restaurateurs français indépendants** : fast-food, petit restaurant traditionnel, pizzeria
- **Profil type** : 300-400 couverts/jour, 350k-500k EUR CA/an, peu d'expertise tech
- **Pain point** : Gaspillage de 180g/portion = 265k EUR/an de perte, prévision manuelle erreurs

### Objectifs Utilisateur
1. Voir en un coup d'œil l'état de leurs stocks
2. Recevoir des recommandations d'achat précises et automatiques
3. Réduire le gaspillage alimentaire (objectif légal AGEC 2025)
4. Économiser temps et argent

---

## 2. ARCHITECTURE GÉNÉRALE DE L'APPLICATION

### 2.1 Structure de Navigation Principale

```
┌─────────────────────────────────────────────────────────────┐
│                     TOP NAV BAR                              │
│  Logo | Dashboard | Stocks | Prédictions | Historique      │
│                                          | Compte | Support  │
└─────────────────────────────────────────────────────────────┘
│                                                               │
│  SIDEBAR (Collapsible)                  MAIN CONTENT AREA    │
│  ├─ 📊 Dashboard                        │                   │
│  ├─ 📦 Gestion Stocks                   │  [Dynamic content]│
│  ├─ 🔮 Prédictions & Achat              │                   │
│  ├─ 📈 Analytics                        │                   │
│  ├─ ⚙️ Paramètres                       │                   │
│  └─ ❓ Support / FAQ                     │                   │
│                                          │                   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Pages Principales (MVP Phase 1)

**Priorité 1 (Must-have) :**
1. **Authentification** (Login/Signup)
2. **Dashboard Principal** (Vue d'ensemble)
3. **Page Stocks en Temps Réel** (Inventaire)
4. **Page Prédictions & Recommandations** (Achats proposés)
5. **Page Paramètres** (Restaurant, produits, fournisseurs)

**Priorité 2 (Nice-to-have Phase 1.5) :**
6. **Analytics & Historique** (Tendances gaspillage)
7. **Support / FAQ** (Aide contextuelle)

---

## 3. SPECIFICATIONS DES ÉCRANS PRINCIPAUX

### ÉCRAN 1 : AUTHENTIFICATION

#### Page Login
**URL** : `/login`

**Layout :**
```
┌─────────────────────────────┐
│                             │
│   [LOGO PRODUCT]            │
│   "FoodAI"                  │
│                             │
│   ┌─────────────────────┐   │
│   │ Email              │   │
│   │ [____@_____.com] X │   │
│   │                     │   │
│   │ Mot de passe        │   │
│   │ [__________] 👁      │   │
│   │                     │   │
│   │ [🔵 Se connecter]   │   │
│   │                     │   │
│   │ Pas encore inscrit? │   │
│   │ 🔗 Créer un compte  │   │
│   └─────────────────────┘   │
│                             │
│  FAQ: "Première utilisation?" │
│  📖 Comment ça marche?       │
│                             │
└─────────────────────────────┘
```

**Éléments clés :**
- Logo simple et mémorable (peut-être stylisé fork/leaves pour restauration)
- Champs email et mot de passe avec validation en temps réel
- Bouton primaire large et clickable (CTA "Se connecter")
- Lien vers signup visible
- Optionnel : "Se souvenir de moi" checkbox
- Optionnel : "Mot de passe oublié?" link
- Toast/notification succès/erreur

**États :**
- Normal
- Loading (bouton désactivé, spinner)
- Erreur (message erreur visible, champ rouge)

---

### ÉCRAN 2 : SIGNUP / ONBOARDING

#### Page Inscription (Multi-step form)

**Step 1 : Informations Compte**
```
┌────────────────────────────────────┐
│  Créer votre compte                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │
│                                    │
│  Étape 1/4 : Votre email          │
│                                    │
│  Adresse email:                    │
│  [__________________]              │
│                                    │
│  Créer un mot de passe:            │
│  [__________________] 👁           │
│                                    │
│  Confirmez le mot de passe:        │
│  [__________________] 👁           │
│                                    │
│  ☑️ J'accepte les conditions      │
│                                    │
│  [Suivant >] [Annuler]            │
└────────────────────────────────────┘
```

**Step 2 : Restaurant (Propriété clé)**
```
┌────────────────────────────────────┐
│  Étape 2/4 : Votre restaurant      │
│                                    │
│  Nom du restaurant:                │
│  [__________________]              │
│                                    │
│  Type de restauration:             │
│  ⊙ Fast-food indépendant          │
│  ⊙ Restaurant traditionnel        │
│  ⊙ Pizzeria / Crêperie            │
│  ⊙ Brasserie / Café               │
│  ⊙ Autre...                       │
│                                    │
│  Adresse:                          │
│  [__________________]              │
│                                    │
│  Code postal:                      │
│  [________]                        │
│                                    │
│  [< Précédent] [Suivant >]        │
└────────────────────────────────────┘
```

**Step 3 : Opérations**
```
┌────────────────────────────────────┐
│  Étape 3/4 : Vos opérations        │
│                                    │
│  Combien de couverts/jour          │
│  en moyenne?                       │
│  [________] (ex: 350)              │
│                                    │
│  Nombre de points de vente:        │
│  ⊙ 1 établissement                │
│  ⊙ 2-5 établissements             │
│  ⊙ 5-10 établissements            │
│  ⊙ 10+ établissements             │
│                                    │
│  Système POS actuel:               │
│  [ Sélectionnez ] ▼               │
│  ├─ iiko                          │
│  ├─ Lightspeed                    │
│  ├─ Toast                         │
│  ├─ Aucun (manuel)                │
│  └─ Autre...                      │
│                                    │
│  [< Précédent] [Suivant >]        │
└────────────────────────────────────┘
```

**Step 4 : Confirmation & Activation**
```
┌────────────────────────────────────┐
│  Étape 4/4 : Vérification          │
│                                    │
│  ✓ Email: user@example.com        │
│  ✓ Restaurant: La Pizzeria        │
│  ✓ Type: Pizzeria / Crêperie      │
│  ✓ Couverts/jour: 350             │
│  ✓ Localisation: Paris            │
│                                    │
│  Confirmation email envoyé!        │
│  📧 Consultez votre inbox         │
│                                    │
│  [Aller au Dashboard >]           │
│  ou                               │
│  "Renvoyer le lien" si nécessaire  │
└────────────────────────────────────┘
```

---

### ÉCRAN 3 : DASHBOARD PRINCIPAL (Vue d'ensemble)

**URL** : `/dashboard`

**Layout :**
```
┌──────────────────────────────────────────────────────────┐
│ Welcome Back, Jean! | Lundi 8 décembre 2025, 14:32      │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ 📊 RÉSUMÉ D'AUJOURD'HUI                                 │
│ ─────────────────────────────────────────────────────   │
│                                                          │
│ ┌──────────┬──────────┬──────────┬──────────┐           │
│ │ Couverts │  Coût   │ Prévus   │ Écart    │           │
│ │ Servis   │ Matière │ Demain   │ Gaspillage
│ ├──────────┼──────────┼──────────┼──────────┤           │
│ │   347    │ 4 892 €  │   420    │ -2.3%    │           │
│ │   ↓ 5%  │  ↑ 3%   │  ↑ 12%   │  ✓ Bon   │           │
│ └──────────┴──────────┴──────────┴──────────┘           │
│                                                          │
│ 🎯 TOP RECOMMANDATIONS ACHAT (Urgence: Haute)           │
│ ─────────────────────────────────────────────────────   │
│                                                          │
│ ┌──────────────────────────────────────────────┐        │
│ │ 🔴 Tomates (Rupture imminente!)             │        │
│ │    Stock actuel: 12 kg → Prévu: 8.5 kg     │        │
│ │    ⚡ Commander 25 kg dès aujourd'hui       │        │
│ │    ├─ Fournisseur: Franck                  │        │
│ │    ├─ Prix: 2.40€/kg                       │        │
│ │    └─ [✓ Commander via API] [📧 Email]    │        │
│ └──────────────────────────────────────────────┘        │
│                                                          │
│ ┌──────────────────────────────────────────────┐        │
│ │ 🟡 Mozzarella Fromage (Stock modéré)        │        │
│ │    Stock actuel: 8 kg → Prévu: 5.2 kg      │        │
│ │    ℹ️ Commander 20 kg jeudi matin           │        │
│ │    ├─ Fournisseur: Fromages Dupont         │        │
│ │    ├─ Prix: 8.50€/kg                       │        │
│ │    └─ [✓ Commander] [📧 Email]            │        │
│ └──────────────────────────────────────────────┘        │
│                                                          │
│ 📈 PRÉDICTIONS CETTE SEMAINE                           │
│ ─────────────────────────────────────────────────────   │
│                                                          │
│ Demande prédite (couverts/jour):                       │
│   Lun   Mar   Mer   Jeu   Ven   Sam   Dim            │
│   420 ▯▯▯▯▯ 450 ▯▯▯▯▯ 520 ▯▯▯▯▯▯▯ 380 ▯▯▯▯       │
│   380 ▯▯▯▯ 410 ▯▯▯▯▯ 520 ▯▯▯▯▯▯▯ 350 ▯▯▯        │
│                                                          │
│ Raison: Météo (18°C), jour de la semaine, évènements │
│                                                          │
│                                                          │
│ [📦 Voir tous les stocks] [🎯 Toutes recommandations] │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Éléments Clés :**

1. **Header Personnalisé** : Salutation + date/heure + météo

2. **Cartes KPI (4 colonnes)** :
   - Couverts servis aujourd'hui
   - Coût matière d'aujourd'hui
   - Demande prédite demain
   - Écart gaspillage (vs. objectif)
   - Flèches d'évolution trend + couleur (rouge/jaune/vert)

3. **Section Recommandations Achat** :
   - Max 2-3 recommandations prioritaires
   - Code couleur : 🔴 Urgent, 🟡 Modéré, 🟢 Normal
   - Pour chaque : nom produit, stock actuel, stock prévu, quantité à commander, fournisseur, prix, actions rapides
   - Boutons : "Commander" (API direct), "Email Fournisseur"

4. **Section Prédictions Visuelles** :
   - Graphique simple en barres ou courbes
   - 7 jours visibles
   - Légende couleurs explicative

5. **Call-to-Action Footer** :
   - Liens vers pages détail (stocks full, recommandations full, analytics)

---

### ÉCRAN 4 : GESTION DES STOCKS (Inventaire Détaillé)

**URL** : `/stocks`

**Layout :**
```
┌──────────────────────────────────────────────────────────┐
│ 📦 GESTION DES STOCKS                                   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ [Tous les produits ▼]  [Categories ▼]  [Recherche____] │
│                                                          │
│ Filtre rapide:  ☑ Ruptures  ☐ Stock faible  ☐ Excess  │
│                                                          │
│ Trier par: [Stock décroissant ▼]                        │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ # │ Produit          │ Stock │ Seuil │ État  │ Actions │
│──┼──────────────────┼───────┼───────┼───────┼─────────┤
│ 1│ Tomates (kg)     │ 12    │  20   │ 🔴  │ [+] [-] │
│  │ → Rupture demain!│       │       │Urgent│ [Cmd] ❌│
│──┼──────────────────┼───────┼───────┼───────┼─────────┤
│ 2│ Oeufs (dz)       │ 8     │  10   │ 🟡  │ [+] [-] │
│  │ → Commande jeudi │       │       │Modéré│ [Cmd]   │
│──┼──────────────────┼───────┼───────┼───────┼─────────┤
│ 3│ Fromage mozz(kg) │ 15    │  12   │ 🟢  │ [+] [-] │
│  │ Stock optimal    │       │       │Bon   │ [ ]     │
│──┼──────────────────┼───────┼───────┼───────┼─────────┤
│ 4│ Huile d'olive(L) │ 35    │  20   │ 🟢  │ [+] [-] │
│  │ Stock élevé      │       │       │Bon   │ [ ]     │
│──┼──────────────────┼───────┼───────┼───────┼─────────┤
│ 5│ Sel fin (kg)     │ 5     │  8    │ 🟡  │ [+] [-] │
│  │ → Commande FRI   │       │       │Modéré│ [Cmd]   │
├──────────────────────────────────────────────────────────┤
│                         Page 1/3                         │
│ [< Précédent] [1] [2] [3] [Suivant >]                   │
└──────────────────────────────────────────────────────────┘
```

**Interactions :**

- **Click produit** → Slide-out panel détail (right panel overlay)
  ```
  ┌──────────────────────┐
  │ TOMATES              │
  ├──────────────────────┤
  │ Stock actuel: 12 kg  │
  │ Seuil minimum: 20kg  │
  │ Dernière entrée:     │
  │   24/11/25, 25 kg    │
  │   Fournisseur: Franck│
  │   Prix: 2.40€/kg     │
  │                      │
  │ Prédiction consomm:  │
  │   Aujourd'hui: 8 kg  │
  │   Demain: 10 kg      │
  │   Tendance: +12%     │
  │                      │
  │ Historique dernier   │
  │ mois: [Graphe]      │
  │                      │
  │ [Ajouter stock +]    │
  │ [Retirer stock -]    │
  │ [Commander]          │
  │ [Parametres]         │
  │                      │
  │ [Fermer X]           │
  └──────────────────────┘
  ```

- **[+] [-] Buttons** : Modifier stock manuel (ex. Inventaire physique)

- **[Cmd] Button** → Modal commander (voir Écran prédictions)

- **Recherche** : Auto-complete produits

- **Filtres** : Urgence, catégorie, fournisseur

---

### ÉCRAN 5 : PRÉDICTIONS & RECOMMANDATIONS D'ACHAT

**URL** : `/predictions`

**Layout :**
```
┌──────────────────────────────────────────────────────────┐
│ 🔮 PRÉDICTIONS & RECOMMANDATIONS D'ACHAT                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ 📅 Période: [Cette semaine ▼] [Personnaliser]          │
│                                                          │
│ Vue: [List] [Priorités] [Calendrier]                    │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ 🔴 URGENT (Commande aujourd'hui)                        │
│                                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Tomates                                           │ │
│ │ ├─ Stock prévu: 8.5 kg (rupture jeudi)           │ │
│ │ ├─ Recommendation: Commander 25 kg AUJOURD'HUI   │ │
│ │ ├─ Confiance prédiction: 92%                     │ │
│ │ │                                                 │ │
│ │ │ Facteurs pris en compte:                       │ │
│ │ │ • Consommation moyenne: 10.5 kg/jour           │ │
│ │ │ • Tendance: +12% cette semaine (week-end)     │ │
│ │ │ • Météo: Soleil (18°C)                        │ │
│ │ │ • Événement: Service étendu dimanche (+2h)    │ │
│ │ │                                                 │ │
│ │ │ Fournisseur recommandé:                        │ │
│ │ │ ✓ Franck (Meilleur prix: 2.40€/kg)           │ │
│ │ │   Alternative: Légumes Bio (2.80€/kg)         │ │
│ │ │                                                 │ │
│ │ │ Actions rapides:                               │ │
│ │ │ [🤖 Commander automatiquement] [📧 Email]    │ │
│ │ │ [Modifier] [Ignorer]                          │ │
│ │ │                                                 │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
│ 🟡 MODÉRÉ (Commande d'ici 2-3 jours)                   │
│                                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Fromage Mozzarella                                │ │
│ │ ├─ Stock prévu: 5.2 kg (seuil atteint vendredi)  │ │
│ │ ├─ Recommendation: Commander 20 kg jeudi matin    │ │
│ │ ├─ Confiance prédiction: 87%                     │ │
│ │ │ [Détails] [Actions] [Ignorer]                 │ │
│ │ │                                                 │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Œufs (dz)                                         │ │
│ │ ├─ Stock prévu: 6 dz (seuil atteint samedi)      │ │
│ │ ├─ Recommendation: Commander 24 dz vendredi      │ │
│ │ ├─ Confiance prédiction: 84%                     │ │
│ │ │ [Détails] [Actions] [Ignorer]                 │ │
│ │ │                                                 │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
│ 🟢 OPTIMAL (Stocks bons)                               │
│                                                          │
│ → 4 produits en situation optimale                     │
│                                                          │
│ [Afficher détails]                                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Interactions clés :**

1. **Confiance de la prédiction** : % visible, expliqué
2. **Facteurs explicables** : Affichés sous chaque recommandation
   - Consommation historique
   - Tendances (croissance, baisse)
   - Facteurs externes (météo, événements, jours semaine)
3. **Actions rapides** :
   - [🤖 Commander automatiquement] : Envoie commande directement via API fournisseur
   - [📧 Email] : Pré-remplisseur email à envoyer manuellement
   - [Modifier] : Ajuste quantité recommandée avant commande
   - [Ignorer] : Dismiss prédiction si restaurateur désaccord

---

### ÉCRAN 6 : PARAMÈTRES / CONFIGURATION

**URL** : `/settings`

**Layout (Tabs):**
```
┌──────────────────────────────────────────────────────────┐
│ ⚙️ PARAMÈTRES                                            │
├──────────────────────────────────────────────────────────┤
│ [Restaurant] [Produits] [Fournisseurs] [Intégrations]  │
│ [Facturation] [Compte]                                  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ 🏪 RESTAURANT (Tab 1)                                   │
│                                                          │
│ Nom: [La Pizzeria de Jean___________]                  │
│ Type: [Pizzeria/Crêperie ▼]                            │
│ Adresse: [12 Rue de Paris, 75001___]                   │
│ Code Postal: [75001]                                    │
│ Téléphone: [+33 1 23 45 67 89________]                 │
│ Email: [contact@lapizzeria.fr_____]                    │
│ Couverts/jour (moyenne): [350]                          │
│ Heures d'ouverture:                                     │
│   Lun-Jeu: 11:30-14:30 19:00-23:00                     │
│   Ven-Sam: 11:30-14:30 19:00-23:30                     │
│   Dimanche: 12:00-14:00 19:00-23:00                    │
│                                                          │
│ [💾 Enregistrer]                                        │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ 📦 PRODUITS (Tab 2)                                     │
│                                                          │
│ [+ Ajouter un produit]                                  │
│                                                          │
│ # │ Produit         │ Catégorie  │ Unité│ Actions      │
│───┼─────────────────┼────────────┼──────┼──────────────│
│ 1 │ Tomates         │ Légumes    │ kg   │ [✏️] [❌]   │
│ 2 │ Fromage Mozz    │ Fromages   │ kg   │ [✏️] [❌]   │
│ 3 │ Œufs            │ Laitier    │ dz   │ [✏️] [❌]   │
│   │                 │            │      │             │
│                                                          │
│ [💾 Sauvegarder modifications]                         │
│                                                          │
│                                                          │
│ 🤝 FOURNISSEURS (Tab 3)                                │
│                                                          │
│ [+ Ajouter un fournisseur]                             │
│                                                          │
│ ┌──────────────────────────────────────────────────┐   │
│ │ Franck Légumes                                  │   │
│ │ Produits: Tomates, Carottes, Oignons...        │   │
│ │ Email: franck@legumes.fr                       │   │
│ │ Téléphone: +33 6 12 34 56 78                   │   │
│ │ Délai livraison: 24h                           │   │
│ │ Commande par: API / Email / Téléphone          │   │
│ │ [Éditer] [Tester connexion API] [Supprimer]    │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
│                                                          │
│ 🔌 INTÉGRATIONS (Tab 4)                                │
│                                                          │
│ ☑ iiko POS  [Connecté] [Status: OK] [Reconnecter]     │
│ ☐ Toast POS [Non connecté] [Connecter]                │
│ ☐ Google Calendar [Non connecté] [Connecter]          │
│ ☐ Weather API [Non connecté] [Connecter]              │
│                                                          │
│                                                          │
│ 💳 FACTURATION (Tab 5)                                 │
│                                                          │
│ Plan actuel: Growth (39€/mois)                         │
│ Prochaine facturation: 8 janvier 2026                  │
│ [Voir factures] [Gérer méthode paiement] [Changer]    │
│                                                          │
│                                                          │
│ 👤 COMPTE (Tab 6)                                      │
│                                                          │
│ Nom: Jean Martin                                        │
│ Email: jean@lapizzeria.fr                              │
│ [Changer mot de passe]                                  │
│ [Activer 2FA]                                          │
│ [Télécharger mes données]                              │
│ [Supprimer mon compte]                                 │
│                                                          │
│                                                          │
│ [💾 Enregistrer les modifications]                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

### ÉCRAN 7 : ANALYTICS & HISTORIQUE (Phase 1.5)

**URL** : `/analytics`

```
┌──────────────────────────────────────────────────────────┐
│ 📊 ANALYTICS & GASPILLAGE                               │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Période: [Ce mois ▼] [Personnaliser] [Exporter PDF]    │
│                                                          │
│ ┌─ 📈 GASPILLAGE                                      ─┐
│ │                                                      │
│ │ Gaspillage ce mois: 120 kg (-18% vs. mois dernier) │
│ │ Gaspillage par repas: 48g (cible: 45g)             │
│ │ Économies réalisées: 1 680€                        │
│ │                                                    │
│ │ [Graphique évolution mensuelle]                   │
│ │ [Graphique détail par catégorie]                  │
│ │                                                    │
│ └────────────────────────────────────────────────────┘
│                                                          │
│ ┌─ 🎯 TAUX DE FIABILITÉ IA                           ─┐
│ │                                                      │
│ │ Prédictions correctes ce mois: 89%                 │
│ │ [Graphique évolution fiabilité]                    │
│ │                                                    │
│ └────────────────────────────────────────────────────┘
│                                                          │
│ ┌─ 💰 ÉCONOMIES RÉALISÉES                             ─┐
│ │                                                      │
│ │ Économies ce mois: 1 680€ (↑40% vs mois précédent) │
│ │ Économies depuis lancement: 4 840€                 │
│ │ Coût de la solution: 39€/mois × 2.8 mois = 109€  │
│ │ ROI net: 4 731€ (↑ 4346% ✓)                       │
│ │                                                    │
│ └────────────────────────────────────────────────────┘
│                                                          │
│ ┌─ 📦 PRODUITS CRITIQUES                              ─┐
│ │                                                      │
│ │ Ruptures évitées ce mois: 7                        │
│ │ Produits en surstock réduits: 4                    │
│ │ Précision prédiction Tomates: 94%                 │
│ │ Précision prédiction Fromage: 87%                 │
│ │                                                    │
│ └────────────────────────────────────────────────────┘
│                                                          │
│ [Télécharger rapport mensuel] [Générer report AGEC]   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 4. MODAL / POPUP INTERACTIONS

### Modal : Commander (Accessible depuis Dashboard + Stocks)

```
┌──────────────────────────────────┐
│ 📦 COMMANDER                  [X]│
├──────────────────────────────────┤
│                                  │
│ Produit: Tomates               │
│ Quantité à commander:          │
│ [25] kg                        │
│                                  │
│ Prix unitaire: 2.40€/kg        │
│ Total estimé: 60.00€           │
│                                  │
│ Fournisseur: Franck Légumes    │
│ Email: franck@legumes.fr       │
│ Téléphone: +33 6 12 34 56 78   │
│                                  │
│ Méthode de commande:           │
│ ⊙ Via API (automatique)        │
│ ⊙ Email                        │
│ ⊙ Téléphone                    │
│ ⊙ Manuel                       │
│                                  │
│ Notes (optionnel):             │
│ [_______________________]      │
│                                  │
│ [✓ Commander] [Annuler]        │
│                                  │
└──────────────────────────────────┘
```

### Toast Notifications (Bottom-right corner)

```
✓ Commande de Tomates envoyée à Franck!
  [Voir historique]

⚠️ Stock de Fromage atteindra seuil demain
  [Accepter recommandation]

❌ Erreur de connexion iiko POS
  [Réessayer] [Détails]
```

---

## 5. DESIGN SYSTEM & STYLE GUIDE

### Couleurs Principales

```
Primary (Actions, CTAs):
  - Teal #218083 / RGB(33, 128, 141) [Calls-to-action, buttons]

Status Colors:
  🔴 Urgent / Rupture: #C0152F (Red)
  🟡 Modéré / Faible: #A84B2F (Orange)
  🟢 Optimal / Bon: #228B5B (Green)
  🔵 Info: #1F212F (Dark)

Neutral (Backgrounds, Text):
  Background: #FFFCF9 (Cream 50)
  Surface: #FFFFFD (Cream 100)
  Text Primary: #134252 (Dark Slate)
  Text Secondary: #627C7F (Gray 400)
  Border: #E6C2AD (Light Brown)

Alert/Hover States:
  Hover Button: #1D7480
  Error: #C0152F
  Success: #218083
  Warning: #A84B2F
```

### Typography

```
Font Family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

Heading 1 (H1): 30px, weight 600, letter-spacing -1%
Heading 2 (H2): 24px, weight 600, letter-spacing -1%
Heading 3 (H3): 20px, weight 550, letter-spacing -1%
Body (default): 14px, weight 400, line-height 1.5
Small: 12px, weight 400
Code/Monospace: 14px (Berkeley Mono or equivalent)
```

### Spacing (8px base grid)

```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px

Padding defaults:
  Button: 8px 16px (vertical horizontal)
  Card: 16px
  Container: 32px
```

### Components

**Buttons:**
- Primary (CTA): Teal bg, cream text, 8px 16px
- Secondary: Cream bg, dark text, border 1px
- Outline: Transparent, border, dark text
- Danger: Red bg, cream text

**Inputs:**
- Border: 1px #E6C2AD
- Padding: 8px 12px
- Focus: Teal border + outline
- Placeholder: #999

**Cards:**
- Background: white or cream
- Border: 1px #E6C2AD
- Radius: 8px
- Padding: 16px
- Shadow: light (0 2px 4px rgba(0,0,0,0.05))

**Tables:**
- Header bg: #F5F5F5
- Row hover: #FFFCF9
- Border: 1px #E6C2AD

**Badges/Status:**
- Size: Small, padding 6px 12px
- Radius: full (border-radius: 9999px)
- Examples: 🔴 Urgent, 🟡 Modéré, 🟢 Optimal
```

---

## 6. USER FLOWS & INTERACTIONS

### Flow 1 : Premier accès utilisateur

```
1. User lands → Landing page "FoodAI" → Click "Essayer gratuitement"
2. → Sign up page (4 steps) → Confirm email
3. → Dashboard vierge
   - Message: "Bienvenue! Commençons..."
   - [Ajouter mes premiers produits]
4. → Product management page (setup initial)
   - Template pré-rempli avec catégories français (Légumes, Fromages, etc.)
   - User valide / customise
5. → POS integration setup
   - "Connectez votre caisse pour automatiser"
   - User choisit iiko / Lightspeed / Manuel
6. → Dashboard avec premières données
```

### Flow 2 : Utilisateur jour-type

```
1. 08:00 - User se connecte → Dashboard
   - Voir résumé aujourd'hui + TOP 2-3 recommandations urgentes
   - Voir prédiction demain
2. 08:30 - Si rupture imminente:
   - [Commander automatiquement] → API sends order → Toast success
   - OU [Email Fournisseur] → User reviews, envoie email
3. 12:00 - En cuisine, stocks baissent manuellement
   - User met à jour stocks via [+] [-] buttons (optionnel)
4. 17:00 - Clôture service
   - Dashboard auto-update si intégration POS
   - Voir nouveau gaspillage du jour
5. 20:00 - Consultant analytics
   - Voir tendance semaine
   - Voir économies réalisées
```

### Flow 3 : Setup fournisseur API

```
1. User → Settings → Fournisseurs
2. → [+ Ajouter fournisseur]
3. → Saisit : Nom, Email, Téléphone, Type API
4. → Sélectionne produits gérés par ce fournisseur
5. → [Tester connexion API] → Validates with iiko/Toast API
6. → If success: Fournisseur added, API key stored secure
7. Maintenant: Quand restaurateur clique [Commander], IA envoie directement!
```

---

## 7. KEY FEATURES & MVP SCOPE

### Must-Have (MVP Phase 1 - M0-M3)

- ✅ Authentication (Login/Signup) avec 4-step onboarding
- ✅ Dashboard Principal avec KPI + top recommendations
- ✅ Gestion Stocks (list + detail + modify)
- ✅ Prédictions & Recommandations (explainability)
- ✅ Paramètres (Restaurant + Produits + Fournisseurs)
- ✅ Intégrations POS (iiko, Lightspeed manuel fallback)
- ✅ Commander via Email ou manuel

### Nice-to-Have (MVP Phase 1.5 - M4-M6)

- 🎯 API direct pour commandes fournisseurs
- 🎯 Analytics & Historique gaspillage
- 🎯 Support français 24/7
- 🎯 Mobile responsive (PWA)
- 🎯 Notifications push

### Future (Phase 2+)

- 📌 IoT sensors integration (température, inventaire automatisé)
- 📌 Slack/Teams notifications
- 📌 Multi-location management
- 📌 Menu engineering recommendations
- 📌 Supplier comparison tool
- 📌 AGEC reporting automation
- 📌 AI chat assistant (intégration Claude API)

---

## 8. WIREFRAME SUMMARY

```
ÉCRANS MVP LISTÉS :

1. ✅ Login Page
2. ✅ Signup (4-step form)
3. ✅ Dashboard Principal (Homepage)
4. ✅ Gestion Stocks (Inventory list)
5. ✅ Stocks Detail Panel (Slide-out)
6. ✅ Prédictions & Recommandations
7. ✅ Paramètres (6 tabs: Restaurant, Produits, Fournisseurs, Intégrations, Facturation, Compte)
8. ✅ Modal Commander
9. 🎯 Analytics (Phase 1.5)

TOTAL SCREENS: 9 (MVP) + 1 (Optional)
```

---

## 9. MOCKUP SPECIFICATIONS FOR DESIGNER

### File Structure Recommended
```
FoodAI_MVP_Mockups/
├── 1_Authentication/
│   ├── 1a_Login.fig
│   ├── 1b_Signup_Step1.fig
│   ├── 1c_Signup_Step2.fig
│   ├── 1d_Signup_Step3.fig
│   ├── 1e_Signup_Step4.fig
│
├── 2_Dashboard/
│   ├── 2a_Dashboard_Desktop.fig
│   ├── 2b_Dashboard_Mobile.fig
│
├── 3_Inventory/
│   ├── 3a_Stocks_List.fig
│   ├── 3b_Stocks_Detail_Panel.fig
│
├── 4_Predictions/
│   ├── 4a_Predictions_List.fig
│   ├── 4b_Prediction_Detail.fig
│
├── 5_Settings/
│   ├── 5a_Settings_Restaurant.fig
│   ├── 5b_Settings_Products.fig
│   ├── 5c_Settings_Suppliers.fig
│   ├── 5d_Settings_Integrations.fig
│   ├── 5e_Settings_Billing.fig
│   ├── 5f_Settings_Account.fig
│
├── 6_Modals/
│   ├── 6a_Modal_Order.fig
│   ├── 6b_Toasts_Notifications.fig
│
├── 7_Analytics/
│   ├── 7a_Analytics_Overview.fig
│
├── Design_System/
│   ├── Colors.fig
│   ├── Typography.fig
│   ├── Components.fig
│   ├── Icons.fig
│
└── Mobile_Responsive/
    ├── Mobile_Dashboard.fig
    ├── Mobile_Stocks.fig
    └── Mobile_Menu.fig
```

### Design Tools
- Primary: Figma (collaborative, prototyping)
- Alternative: Adobe XD, Sketch
- Prototyping: Figma interactive components
- Handoff: Figma dev specs + CSS tokens export

### Key Prototyping Flows
1. Login → Signup → Dashboard
2. Dashboard → [Commander] → Modal → Success Toast
3. Stocks → Click product → Detail panel
4. Predictions → Click recommendation → Modal order → Email/API
5. Settings → Tabs navigation

---

## 10. MOTION & MICRO-INTERACTIONS

### Smooth Transitions
- Page navigation: Fade in/out (250ms, ease-standard)
- Modal open/close: Scale + fade (200ms)
- Slide panels: Translate X (300ms)
- Toast appear: Slide up + fade (150ms)

### Loading States
- Dashboard initial load: Skeleton screens (gradients, placeholder blocks)
- Prediction calculation: Spinner + "Analysing..." text
- API command send: Button → spinner → success checkmark

### Hover/Focus States
- Buttons: Subtle background color change
- Links: Underline appears on hover
- Cards: Slight shadow increase on hover
- Inputs: Border color change to teal on focus

### Error States
- Invalid input: Shake animation + red border
- API failure: Red toast with retry button
- Connection lost: Yellow banner top with reconnect option

---

## 11. ACCESSIBILITY & INCLUSION

### WCAG Compliance (AA Standard)

- ✅ Color contrast: 4.5:1 for normal text, 3:1 for large text
- ✅ Focus indicators: Visible on all interactive elements
- ✅ Keyboard navigation: Tab through all buttons, forms, links
- ✅ Screen reader: Alt text on images, semantic HTML, ARIA labels
- ✅ Mobile: Touch targets min 44x44px
- ✅ Language: French default, support for other languages

### Inclusive Design
- Simple, clear language (avoid jargon for restaurateurs non-tech)
- Explanations of IA predictions (not black-box)
- Light/dark mode support
- Large text option
- High contrast mode option

---

## 12. BRIEF FINAL POUR DESIGNER

### Tone & Visual Identity
- **Tone**: Moderne, professionnel, empathique, rassurant
- **Vibe**: Tech startupish mais accessible aux "travailleurs manuels" (restaurateurs)
- **Inspiration**: Airbnb (trust), Stripe (clarity), Slack (friendliness)

### Color Palette Personality
- Teal (Primary): Trustworthy, forward-thinking, pro-growth
- Creams (Background): Warm, welcoming, non-corporate
- Reds/Oranges/Greens (Status): Clear, urgent, simple

### Imagery Style
- Icons: Simple line icons + colorful badges/dots
- Illustrations: Optional - minimalist food/restauration themes if needed
- Data viz: Clean charts, readable at all sizes

### Spacing & Density
- Generous whitespace (restaurant owners aren't data scientists - don't overwhelm)
- Compact but readable tables
- Cards with clear visual hierarchy

---

*Brief créatif complet pour MVP FoodAI application.*
*Prêt pour briefing designer ou développement maquettes haute-fidelité Figma.*
*Scope: 9 écrans MVP + composants design system.*