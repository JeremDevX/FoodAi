# Recommandations d'Amélioration - Finance Manager

**Date**: 24 novembre 2025  
**Priorité**: Plan d'action par ordre d'importance

---

## 🚀 Actions Immédiates (Cette Semaine)

### 1. Tester les Ratios de Contraste ⏱️ 2h

**Objectif**: Garantir WCAG AA (4.5:1 pour texte, 3:1 pour UI)

**Actions**:

1. Installer [WAVE Browser Extension](https://wave.webaim.org/extension/)
2. Tester chaque page:
   - Dashboard
   - Transactions
   - Goals
   - Analytics
   - Settings
3. Noter tous les ratios < 4.5:1
4. Ajuster les couleurs dans `themes.css` si nécessaire

**Outil recommandé**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### 2. Tester la Navigation au Clavier ⏱️ 1h

**Objectif**: Garantir une navigation fluide et logique

**Checklist**:

- [ ] Parcourir tout le site avec TAB uniquement
- [ ] Vérifier que tous les éléments interactifs sont accessibles
- [ ] Tester SHIFT+TAB (retour arrière)
- [ ] Vérifier que le focus est visible partout
- [ ] Tester les raccourcis (ESC pour fermer les modales)
- [ ] Vérifier que le skip link fonctionne

### 3. Corriger les Erreurs TypeScript ⏱️ 30min

**Composants concernés**:

- Button.tsx (ligne 71)
- Card.tsx (ligne 60)

**Solution**: ✅ FAIT - Retrait de framer-motion pour éviter les conflits de types

---

## 📦 Refactoring Phase 1 (Cette Semaine)

### 4. Utiliser les Nouveaux Composants Atomiques ⏱️ 4h

**Composants créés**:

```
✅ src/components/atoms/
   ├── Button/Button.tsx
   ├── Input/Input.tsx
   ├── Card/Card.tsx
   └── Modal/Modal.tsx
```

**Migration recommandée**:

#### A. TransactionManager.tsx

```tsx
// Avant
<button className="px-4 py-2 rounded-lg..." onClick={handleExport}>
  <Download className="h-4 w-4" />
  <span>Exporter</span>
</button>;

// Après
import { Button } from "@/components/atoms";

<Button
  variant="secondary"
  leftIcon={<Download className="h-4 w-4" />}
  onClick={handleExport}
>
  Exporter
</Button>;
```

#### B. UltimateTransactionForm.tsx

```tsx
// Avant
<input
  type="number"
  value={formData.amount}
  onChange={...}
  className="w-full pl-10 pr-4 py-3..."
/>

// Après
import { Input } from "@/components/atoms";

<Input
  type="number"
  label="Montant (€)"
  value={formData.amount}
  onChange={...}
  leftIcon={<DollarSign className="h-5 w-5" />}
  error={errors.amount}
  required
/>
```

#### C. Toutes les Glass Cards

```tsx
// Avant
<div className="glass-card p-6">{content}</div>;

// Après
import { Card } from "@/components/atoms";

<Card variant="glass" padding="md">
  {content}
</Card>;
```

**Fichiers à migrer** (par ordre de priorité):

1. ✅ UltimateTransactionForm.tsx (déjà migré partiellement)
2. TransactionManager.tsx
3. UltimateSettings.tsx
4. UltimateFinancialPulse.tsx
5. Dashboard/GoalsOverview.tsx

---

## 🏗️ Refactoring Phase 2 (Semaine Prochaine)

### 5. Créer des Composants Molecules ⏱️ 6h

#### A. StatCard (Carte de statistique réutilisable)

```tsx
// src/components/molecules/StatCard/StatCard.tsx
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  gradient?: { from: string; to: string };
}

export function StatCard({ title, value, icon, trend, ... }: StatCardProps) {
  return (
    <Card variant="glass" padding="md" hoverable>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-lg" style={{ background: "var(--bg-glass)" }}>
          {icon}
        </div>
        {trend && <TrendIndicator trend={trend} value={trendValue} />}
      </div>
      <div className="text-base font-medium" style={{ color: "var(--text-secondary)" }}>
        {title}
      </div>
      <div className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
        {value}
      </div>
    </Card>
  );
}
```

**Utilisation**:

```tsx
<div className="grid grid-cols-3 gap-4">
  <StatCard
    title="Total Revenus"
    value={formatCurrency(income)}
    icon={
      <TrendingUp
        className="h-6 w-6"
        style={{ color: "var(--color-success)" }}
      />
    }
    trend="up"
    trendValue="+12%"
  />
  <StatCard
    title="Total Dépenses"
    value={formatCurrency(expenses)}
    icon={
      <TrendingDown
        className="h-6 w-6"
        style={{ color: "var(--color-danger)" }}
      />
    }
    trend="down"
    trendValue="-5%"
  />
  <StatCard
    title="Solde"
    value={formatCurrency(balance)}
    icon={
      <DollarSign className="h-6 w-6" style={{ color: "var(--text-accent)" }} />
    }
  />
</div>
```

#### B. FormField (Champ de formulaire avec label et erreur)

```tsx
// src/components/molecules/FormField/FormField.tsx
interface FormFieldProps extends InputProps {
  label: string;
  name: string;
  type?: "text" | "number" | "date" | "email" | "textarea";
  register?: any; // Pour React Hook Form
}

export function FormField({
  label,
  name,
  type = "text",
  register,
  error,
  ...props
}: FormFieldProps) {
  if (type === "textarea") {
    return (
      <div className="space-y-2">
        <label htmlFor={name}>{label}</label>
        <textarea id={name} {...register?.(name)} {...props} />
        {error && <span role="alert">{error}</span>}
      </div>
    );
  }

  return (
    <Input
      id={name}
      label={label}
      type={type}
      {...register?.(name)}
      error={error}
      {...props}
    />
  );
}
```

#### C. TransactionItem (Ligne de transaction)

```tsx
// src/components/molecules/TransactionItem/TransactionItem.tsx
interface TransactionItemProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: number) => void;
}

export function TransactionItem({
  transaction,
  onEdit,
  onDelete,
}: TransactionItemProps) {
  const { formatCurrency, formatShortDate } = useFinanceStore();

  return (
    <Card variant="default" padding="sm" hoverable>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <CategoryIcon category={transaction.category} />
          <div>
            <div className="font-medium">{transaction.description}</div>
            <div className="text-sm text-secondary">
              {transaction.category} • {formatShortDate(transaction.date)}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div
            className={`text-lg font-semibold ${getFinancialColor(
              transaction.amount
            )}`}
          >
            {transaction.type === "income" ? "+" : "-"}
            {formatCurrency(Math.abs(transaction.amount))}
          </div>

          <div className="flex items-center space-x-2">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(transaction)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(transaction.id!)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
```

### 6. Décomposer les Gros Composants ⏱️ 8h

#### A. UltimateFinancialPulse.tsx (400+ lignes)

**Structure actuelle**: Monolithique  
**Structure proposée**: Composée

```
UltimateFinancialPulse/
├── index.tsx (Orchestrateur - 100 lignes)
├── PulseIndicator.tsx (Cercle avec score - 50 lignes)
├── MonthlyStats.tsx (Revenus/Dépenses - 80 lignes)
├── BudgetProjection.tsx (Budget restant - 60 lignes)
└── QuickActions.tsx (Boutons épargner - 40 lignes)
```

**Exemple**:

```tsx
// UltimateFinancialPulse/index.tsx
export function UltimateFinancialPulse() {
  const pulse = useFinancialPulse();

  return (
    <Card variant="glass" padding="lg">
      <FinancialPulseHeader pulse={pulse} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <PulseIndicator score={pulse.score} status={pulse.status} />
        <MonthlyStats
          income={pulse.monthlyIncome}
          expenses={pulse.monthlyExpenses}
        />
        <BudgetProjection
          remaining={pulse.remainingBudget}
          daysLeft={pulse.daysUntilNextIncome}
        />
      </div>

      <QuickActions pulse={pulse} />
    </Card>
  );
}
```

#### B. UltimateTransactionForm.tsx (600+ lignes)

**Structure proposée**:

```
TransactionForm/
├── index.tsx (Orchestrateur)
├── TransactionTypeSelector.tsx
├── AmountDateFields.tsx
├── CategorySelector.tsx
├── TransferFields.tsx
└── FormActions.tsx
```

#### C. UltimateSettings.tsx (500+ lignes)

**Structure proposée**:

```
Settings/
├── index.tsx
├── ThemeSettings.tsx
├── GeneralSettings.tsx
├── DataManagement.tsx
└── SettingsSection.tsx (Composant réutilisable)
```

---

## 🎨 Refactoring Phase 3 (Dans 2 Semaines)

### 7. Améliorer l'Architecture SOLID ⏱️ 8h

#### A. Créer une Couche de Services

```typescript
// lib/services/transactionService.ts
export class TransactionService {
  private repository: ITransactionRepository;

  constructor(repository: ITransactionRepository) {
    this.repository = repository;
  }

  async create(input: CreateTransactionInput): Promise<Transaction> {
    // Validation
    this.validateTransaction(input);

    // Logique métier
    const transaction = this.buildTransaction(input);

    // Sauvegarde
    return await this.repository.add(transaction);
  }

  async transfer(from: string, to: string, amount: number): Promise<void> {
    // Logique métier complexe de transfert
    // Validation des comptes
    // Création de 2 transactions liées
  }

  private validateTransaction(input: CreateTransactionInput): void {
    if (input.amount <= 0) {
      throw new ValidationError("Le montant doit être positif");
    }
    // Plus de validations...
  }
}
```

#### B. Implémenter des Interfaces (DIP)

```typescript
// lib/repositories/ITransactionRepository.ts
export interface ITransactionRepository {
  add(transaction: Omit<Transaction, "id">): Promise<Transaction>;
  update(id: number, updates: Partial<Transaction>): Promise<void>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Transaction | null>;
  findAll(): Promise<Transaction[]>;
  findByDateRange(start: Date, end: Date): Promise<Transaction[]>;
}

// lib/repositories/IndexedDBTransactionRepository.ts
export class IndexedDBTransactionRepository implements ITransactionRepository {
  async add(transaction: Omit<Transaction, "id">): Promise<Transaction> {
    // Implémentation avec IndexedDB
  }
  // ... autres méthodes
}
```

#### C. Utiliser les Services dans les Composants

```tsx
// components/Transactions/TransactionManager.tsx
const transactionService = new TransactionService(
  new IndexedDBTransactionRepository()
);

const handleAddTransaction = async (data: CreateTransactionInput) => {
  try {
    await transactionService.create(data);
    await refreshData();
  } catch (error) {
    if (error instanceof ValidationError) {
      setErrors(error.getErrors());
    }
  }
};
```

### 8. Séparer le Store en Slices ⏱️ 4h

**Structure actuelle**: Monolithique (343 lignes)  
**Structure proposée**: Modulaire

```typescript
// lib/store/index.ts
import { create } from "zustand";
import { createTransactionSlice } from "./slices/transactionSlice";
import { createGoalSlice } from "./slices/goalSlice";
import { createUISlice } from "./slices/uiSlice";
import { createAccountSlice } from "./slices/accountSlice";

export const useFinanceStore = create((set, get) => ({
  ...createTransactionSlice(set, get),
  ...createGoalSlice(set, get),
  ...createUISlice(set, get),
  ...createAccountSlice(set, get),
}));

// lib/store/slices/transactionSlice.ts
export const createTransactionSlice = (set, get) => ({
  transactions: [],
  loadTransactions: async () => {
    const transactions = await getTransactions();
    set({ transactions });
  },
  addTransaction: async (transaction) => {
    await addTransactionToDb(transaction);
    get().loadTransactions();
  },
  // ... autres actions
});
```

---

## 🧪 Tests (Dans 3 Semaines)

### 9. Tests Unitaires ⏱️ 12h

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

**Structure**:

```
src/components/atoms/
├── Button/
│   ├── Button.tsx
│   ├── Button.test.tsx
│   └── Button.stories.tsx
```

**Exemple de test**:

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when isLoading is true", () => {
    render(<Button isLoading>Click me</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
```

### 10. Tests E2E ⏱️ 8h

```bash
npm install --save-dev @playwright/test
```

**Scénarios critiques**:

1. Créer une transaction
2. Modifier une transaction
3. Supprimer une transaction
4. Créer un objectif
5. Changer de thème
6. Exporter/Importer des données

```typescript
// e2e/transaction.spec.ts
import { test, expect } from "@playwright/test";

test("can create a new transaction", async ({ page }) => {
  await page.goto("http://localhost:3000");

  // Cliquer sur "Ajouter une opération"
  await page.click('button:has-text("Ajouter une opération")');

  // Remplir le formulaire
  await page.fill('input[name="amount"]', "100");
  await page.fill('input[name="description"]', "Test transaction");
  await page.selectOption('select[name="category"]', "Alimentation");

  // Soumettre
  await page.click('button[type="submit"]');

  // Vérifier que la transaction apparaît
  await expect(page.locator("text=Test transaction")).toBeVisible();
});
```

---

## 📊 Métriques de Suivi

### Objectifs Quantifiés

| Métrique                     | Actuel     | Objectif    | Échéance  |
| ---------------------------- | ---------- | ----------- | --------- |
| **WCAG Conformité**          | 75%        | 95%         | Semaine 1 |
| **Composants Atomiques**     | 4          | 12          | Semaine 2 |
| **Duplication de Code**      | ~30%       | <10%        | Semaine 3 |
| **Couverture de Tests**      | 0%         | 80%         | Semaine 5 |
| **Taille Moyenne Composant** | 350 lignes | <200 lignes | Semaine 3 |
| **Temps de Build**           | ?          | <30s        | Semaine 2 |
| **Score Lighthouse**         | ?          | >90         | Semaine 4 |

### Outils de Mesure

```bash
# Analyser la taille des composants
find src/components -name "*.tsx" | xargs wc -l | sort -n

# Détecter les duplications
npx jscpd src/

# Audit Lighthouse
npx lighthouse http://localhost:3000 --view

# Tests de performance
npm run build
npm run analyze
```

---

## ✅ Checklist Finale

### Avant de considérer le projet "terminé":

- [ ] WCAG AA validé avec WAVE
- [ ] Tous les ratios de contraste >= 4.5:1
- [ ] Navigation au clavier testée et fluide
- [ ] Tous les formulaires accessibles
- [ ] Composants atomiques utilisés partout
- [ ] Aucun composant > 300 lignes
- [ ] Couche de services créée
- [ ] Store séparé en slices
- [ ] Tests unitaires >= 80%
- [ ] Tests E2E pour flows critiques
- [ ] Documentation à jour
- [ ] Lighthouse score >= 90
- [ ] Code review effectué
- [ ] Performance optimisée

---

## 📚 Ressources Complémentaires

### Accessibilité

- [MDN: ARIA](https://developer.mozilla.org/fr/docs/Web/Accessibility/ARIA)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [Inclusive Components](https://inclusive-components.design/)

### Architecture

- [Component Driven Development](https://www.componentdriven.org/)
- [React Patterns](https://reactpatterns.com/)
- [Kent C. Dodds Blog](https://kentcdodds.com/blog)

### Tests

- [Testing Library Best Practices](https://testing-library.com/docs/react-testing-library/example-intro)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

---

**Auteur**: GitHub Copilot  
**Date**: 24 novembre 2025  
**Version**: 1.0
