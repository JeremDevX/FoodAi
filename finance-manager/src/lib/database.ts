import Dexie, { Table } from 'dexie';
import { Transaction, Category, Goal, Account, Budget, UserSettings } from '@/types';

export class FinanceDatabase extends Dexie {
  transactions!: Table<Transaction>;
  categories!: Table<Category>;
  goals!: Table<Goal>;
  accounts!: Table<Account>;
  budgets!: Table<Budget>;
  settings!: Table<UserSettings>;

  constructor() {
    super('FinanceManager');
    
    this.version(1).stores({
      transactions: '++id, date, amount, category, account, type',
      categories: '++id, name, type, parentId',
      goals: '++id, name, targetAmount, currentAmount, deadline',
      accounts: '++id, name, type, balance, currency, isActive',
      budgets: '++id, categoryId, amount, period, startDate',
      settings: '++id' // Single settings record
    });
  }
}

export const db = new FinanceDatabase();

// Initialize default data
export async function initializeDatabase() {
  try {
    // Vérifier si IndexedDB est disponible
    if (typeof window === 'undefined' || !window.indexedDB) {
      console.warn('IndexedDB not available in this environment');
      return;
    }

    // Check if categories exist
    const categoryCount = await db.categories.count();
    if (categoryCount === 0) {
      // Add default categories
      const defaultCategories = [
        { name: 'Alimentation', color: '#10b981', icon: '🍎', type: 'expense' as const },
        { name: 'Transport', color: '#3b82f6', icon: '🚗', type: 'expense' as const },
        { name: 'Logement', color: '#8b5cf6', icon: '🏠', type: 'expense' as const },
        { name: 'Santé', color: '#ef4444', icon: '🏥', type: 'expense' as const },
        { name: 'Loisirs', color: '#f59e0b', icon: '🎮', type: 'expense' as const },
        { name: 'Shopping', color: '#ec4899', icon: '🛍️', type: 'expense' as const },
        { name: 'Restaurant', color: '#f97316', icon: '🍽️', type: 'expense' as const },
        { name: 'Services', color: '#6b7280', icon: '⚡', type: 'expense' as const },
        { name: 'Salaire', color: '#10b981', icon: '💰', type: 'income' as const },
        { name: 'Investissement', color: '#6366f1', icon: '📈', type: 'income' as const },
        { name: 'Cadeau', color: '#f59e0b', icon: '🎁', type: 'income' as const },
        { name: 'Autre', color: '#6b7280', icon: '📝', type: 'both' as const }
      ];
      
      await db.categories.bulkAdd(defaultCategories);
    }

    // Check if accounts exist
    const accountCount = await db.accounts.count();
    if (accountCount === 0) {
      // Add default account
      await db.accounts.add({
        name: 'Compte Principal',
        type: 'checking',
        balance: 0,
        currency: 'EUR',
        color: '#3b82f6',
        isActive: true
      });
    }

    // Check if settings exist
    const settingsCount = await db.settings.count();
    if (settingsCount === 0) {
      // Add default settings
      await db.settings.add({
        currency: 'EUR',
        language: 'fr',
        theme: 'system',
        dateFormat: 'dd/MM/yyyy',
        weekStartsOn: 'monday',
        notifications: true,
        autoBackup: true
      });
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    // Don't throw in production, just log the error
    if (typeof window !== 'undefined') {
      console.warn('Database initialization failed, app will run with limited functionality');
    }
  }
}

// Transaction operations
export async function addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) {
  return await db.transactions.add({
    ...transaction,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

export async function getTransactions(limit = 100, offset = 0) {
  return await db.transactions
    .orderBy('date')
    .reverse()
    .offset(offset)
    .limit(limit)
    .toArray();
}

export async function getTransactionsByDateRange(startDate: Date, endDate: Date) {
  return await db.transactions
    .where('date')
    .between(startDate, endDate, true, true)
    .toArray();
}

export async function updateTransaction(id: number, updates: Partial<Transaction>) {
  return await db.transactions.update(id, {
    ...updates,
    updatedAt: new Date()
  });
}

export async function deleteTransaction(id: number) {
  return await db.transactions.delete(id);
}

// Category operations
export async function getCategories() {
  return await db.categories.toArray();
}

export async function addCategory(category: Omit<Category, 'id'>) {
  return await db.categories.add(category);
}

// Goal operations
export async function getGoals() {
  return await db.goals.toArray();
}

export async function addGoal(goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) {
  return await db.goals.add({
    ...goal,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

export async function updateGoal(id: number, updates: Partial<Goal>) {
  return await db.goals.update(id, {
    ...updates,
    updatedAt: new Date()
  });
}

export async function updateGoalProgress(id: number, amount: number) {
  const goal = await db.goals.get(id);
  if (goal) {
    return await db.goals.update(id, {
      currentAmount: goal.currentAmount + amount,
      updatedAt: new Date()
    });
  }
}

// Account operations
export async function getAccounts() {
  return await db.accounts.toArray();
}

export async function updateAccountBalance(id: number, newBalance: number) {
  return await db.accounts.update(id, { balance: newBalance });
}

// Settings operations
export async function getSettings() {
  const settings = await db.settings.toArray();
  return settings[0] || null;
}

export async function updateSettings(updates: Partial<UserSettings>) {
  const settings = await getSettings();
  if (settings?.id) {
    return await db.settings.update(settings.id, updates);
  }
}

// Backup and restore
export async function exportData() {
  const [transactions, categories, goals, accounts, budgets, settings] = await Promise.all([
    db.transactions.toArray(),
    db.categories.toArray(),
    db.goals.toArray(),
    db.accounts.toArray(),
    db.budgets.toArray(),
    db.settings.toArray()
  ]);

  return {
    version: '1.0.0',
    exportedAt: new Date(),
    transactions,
    categories,
    goals,
    accounts,
    budgets,
    settings: settings[0] || null
  };
}

export async function importData(data: any) {
  // Clear existing data
  await Promise.all([
    db.transactions.clear(),
    db.categories.clear(),
    db.goals.clear(),
    db.accounts.clear(),
    db.budgets.clear(),
    db.settings.clear()
  ]);

  // Import new data
  await Promise.all([
    db.transactions.bulkAdd(data.transactions || []),
    db.categories.bulkAdd(data.categories || []),
    db.goals.bulkAdd(data.goals || []),
    db.accounts.bulkAdd(data.accounts || []),
    db.budgets.bulkAdd(data.budgets || []),
    data.settings ? db.settings.add(data.settings) : Promise.resolve()
  ]);
}