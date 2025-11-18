export interface Transaction {
  id?: number;
  date: Date | string;
  amount: number;
  description: string;
  category: string;
  account: string;
  type: "income" | "expense" | "transfer";
  fromAccount?: string; // Pour les transferts
  toAccount?: string; // Pour les transferts
  tags?: string[];
  notes?: string;
  importedFrom?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Category {
  id?: number;
  name: string;
  color: string;
  icon: string;
  budget?: number;
  type: "income" | "expense" | "both";
  parentId?: number;
}

export interface Goal {
  id?: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date | string;
  description?: string;
  image?: string;
  category?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Account {
  id?: number;
  name: string;
  type: "checking" | "savings" | "credit" | "cash" | "investment";
  balance: number;
  currency: string;
  color: string;
  isActive: boolean;
}

export interface Budget {
  id?: number;
  categoryId: number;
  amount: number;
  period: "monthly" | "weekly" | "yearly";
  startDate: Date | string;
  endDate?: Date | string;
}

export interface UserSettings {
  id?: number;
  currency: string;
  language: string;
  theme: "light" | "dark" | "ocean" | "forest" | "cosmic" | "system";
  dateFormat: string;
  weekStartsOn: "monday" | "sunday";
  notifications: boolean;
  autoBackup: boolean;
  defaultAccount?: number;
}

export interface FinancialPulse {
  status: "healthy" | "warning" | "danger";
  score: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  remainingBudget: number;
  daysUntilNextIncome: number;
  projectedEndOfMonth: number;
}

export interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  errors: string[];
  duplicates: number;
}

export interface BackupData {
  version: string;
  exportedAt: Date | string;
  transactions: Transaction[];
  categories: Category[];
  goals: Goal[];
  accounts: Account[];
  budgets: Budget[];
  settings: UserSettings;
}
