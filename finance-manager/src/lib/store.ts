import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import {
  Transaction,
  Category,
  Goal,
  Account,
  UserSettings,
  FinancialPulse,
} from "@/types";
import {
  getTransactions,
  getCategories,
  getGoals,
  getAccounts,
  getSettings,
  getTransactionsByDateRange,
  addTransaction as addTransactionToDb,
  updateTransaction as updateTransactionInDb,
  deleteTransaction as deleteTransactionFromDb,
} from "@/lib/database";
import { format, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

interface FinanceStore {
  // Data
  transactions: Transaction[];
  categories: Category[];
  goals: Goal[];
  accounts: Account[];
  settings: UserSettings | null;

  // UI State
  currentView:
    | "dashboard"
    | "transactions"
    | "goals"
    | "analytics"
    | "settings";
  isLoading: boolean;
  selectedDateRange: { start: Date; end: Date };
  selectedAccount: string; // "Compte Courant" ou "Compte Épargne"
  error: string | null;

  // Actions
  setCurrentView: (view: FinanceStore["currentView"]) => void;
  setDateRange: (start: Date, end: Date) => void;
  setSelectedAccount: (account: string) => void;
  setError: (error: string | null) => void;
  loadData: () => Promise<void>;
  addTransaction: (
    transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateTransaction: (
    id: number,
    updates: Partial<Transaction>
  ) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
  refreshData: () => Promise<void>;

  // Computed values
  getFinancialPulse: () => FinancialPulse;
  getMonthlyStats: () => { income: number; expenses: number; balance: number };
  getCategoryStats: () => Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

export const useFinanceStore = create<FinanceStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    transactions: [],
    categories: [],
    goals: [],
    accounts: [],
    settings: null,
    currentView: "dashboard",
    isLoading: false,
    selectedAccount: "Compte Courant", // Par défaut sur le compte courant
    error: null,
    selectedDateRange: {
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date()),
    },

    // Actions
    setCurrentView: (view) => set({ currentView: view }),

    setDateRange: (start, end) => set({ selectedDateRange: { start, end } }),

    setSelectedAccount: (account) => set({ selectedAccount: account }),

    setError: (error) => set({ error }),

    loadData: async () => {
      set({ isLoading: true });
      try {
        const [transactions, categories, goals, accounts, settings] =
          await Promise.all([
            getTransactions(),
            getCategories(),
            getGoals(),
            getAccounts(),
            getSettings(),
          ]);

        set({
          transactions,
          categories,
          goals,
          accounts,
          settings,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error loading data:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Erreur lors du chargement des données";
        set({
          isLoading: false,
          error: errorMessage,
        });
      }
    },

    addTransaction: async (transaction) => {
      try {
        await addTransactionToDb(transaction);
        await get().refreshData();
      } catch (error) {
        console.error("Error adding transaction:", error);
        throw error;
      }
    },

    updateTransaction: async (id, updates) => {
      try {
        await updateTransactionInDb(id, updates);
        await get().refreshData();
      } catch (error) {
        console.error("Error updating transaction:", error);
        throw error;
      }
    },

    deleteTransaction: async (id) => {
      try {
        await deleteTransactionFromDb(id);
        await get().refreshData();
      } catch (error) {
        console.error("Error deleting transaction:", error);
        throw error;
      }
    },

    refreshData: async () => {
      const { loadData } = get();
      await loadData();
    },

    // Computed values
    getFinancialPulse: () => {
      const { transactions, selectedDateRange } = get();
      const monthlyTransactions = transactions.filter((t) =>
        isWithinInterval(new Date(t.date), {
          start: selectedDateRange.start,
          end: selectedDateRange.end,
        })
      );

      const income = monthlyTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthlyTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      const balance = income - expenses;
      const remainingDays = Math.max(
        1,
        Math.ceil(
          (selectedDateRange.end.getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        )
      );
      const dailyBudget = remainingDays > 0 ? balance / remainingDays : 0;

      let status: FinancialPulse["status"] = "healthy";
      if (dailyBudget < 0) status = "danger";
      else if (dailyBudget < 20) status = "warning";

      // Simple score calculation (0-100) with safety checks
      let score = 50;
      if (income > 0) {
        score = 50 + (balance / income) * 50;
      } else if (expenses === 0) {
        score = 100; // No expenses, perfect score
      } else {
        score = 0; // Only expenses, no income
      }
      score = Math.max(0, Math.min(100, score));

      return {
        status,
        score,
        monthlyIncome: income,
        monthlyExpenses: expenses,
        remainingBudget: balance,
        daysUntilNextIncome: remainingDays,
        projectedEndOfMonth: balance,
      };
    },

    getMonthlyStats: () => {
      const { transactions, selectedDateRange } = get();
      const monthlyTransactions = transactions.filter((t) =>
        isWithinInterval(new Date(t.date), {
          start: selectedDateRange.start,
          end: selectedDateRange.end,
        })
      );

      const income = monthlyTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthlyTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        income,
        expenses,
        balance: income - expenses,
      };
    },

    getCategoryStats: () => {
      const { transactions, categories, selectedDateRange } = get();
      const monthlyTransactions = transactions.filter((t) =>
        isWithinInterval(new Date(t.date), {
          start: selectedDateRange.start,
          end: selectedDateRange.end,
        })
      );

      const categoryTotals = monthlyTransactions.reduce((acc, transaction) => {
        const category = transaction.category || "Autre";
        acc[category] = (acc[category] || 0) + transaction.amount;
        return acc;
      }, {} as Record<string, number>);

      const totalExpenses = Object.values(categoryTotals).reduce(
        (sum, amount) => sum + amount,
        0
      );

      return Object.entries(categoryTotals)
        .map(([category, amount]) => ({
          category,
          amount,
          percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
        }))
        .sort((a, b) => b.amount - a.amount);
    },
  }))
);
