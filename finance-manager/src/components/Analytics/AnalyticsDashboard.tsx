"use client";

import { useState } from "react";
import { useFinanceStore } from "@/lib/store";
import { formatCurrency, formatShortDate } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Filter,
} from "lucide-react";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#f97316",
  "#6b7280",
];

export default function AnalyticsDashboard() {
  const { transactions, categories, selectedDateRange, selectedAccount } =
    useFinanceStore();
  const [viewType, setViewType] = useState<"monthly" | "category" | "trends">(
    "monthly"
  );

  // Filter transactions by date range and selected account
  const filteredTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    const matchesDate =
      transactionDate >= selectedDateRange.start &&
      transactionDate <= selectedDateRange.end;

    // Filtrer par compte sélectionné
    const matchesAccount =
      t.account === selectedAccount ||
      (t.type === "transfer" &&
        (t.fromAccount === selectedAccount || t.toAccount === selectedAccount));

    return matchesDate && matchesAccount;
  });

  // Monthly analysis
  const monthlyData = (() => {
    const dataMap = new Map<
      string,
      { income: number; expenses: number; balance: number }
    >();

    filteredTransactions.forEach((transaction) => {
      const monthKey = new Date(transaction.date).toISOString().slice(0, 7); // YYYY-MM
      const existing = dataMap.get(monthKey) || {
        income: 0,
        expenses: 0,
        balance: 0,
      };

      if (transaction.type === "income") {
        existing.income += transaction.amount;
      } else {
        existing.expenses += transaction.amount;
      }
      existing.balance = existing.income - existing.expenses;

      dataMap.set(monthKey, existing);
    });

    return Array.from(dataMap.entries())
      .map(([month, data]) => ({
        month: new Date(month + "-01").toLocaleDateString("fr-FR", {
          month: "short",
          year: "numeric",
        }),
        income: data.income,
        expenses: data.expenses,
        balance: data.balance,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  })();

  // Category analysis
  const categoryData = (() => {
    const dataMap = new Map<string, { amount: number; count: number }>();

    filteredTransactions
      .filter((t) => t.type === "expense")
      .forEach((transaction) => {
        const existing = dataMap.get(transaction.category) || {
          amount: 0,
          count: 0,
        };
        existing.amount += transaction.amount;
        existing.count += 1;
        dataMap.set(transaction.category, existing);
      });

    return Array.from(dataMap.entries())
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        count: data.count,
        percentage: 0, // Will be calculated later
      }))
      .sort((a, b) => b.amount - a.amount);
  })();

  // Calculate percentages
  const totalCategoryExpenses = categoryData.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  categoryData.forEach((item) => {
    item.percentage =
      totalCategoryExpenses > 0
        ? (item.amount / totalCategoryExpenses) * 100
        : 0;
  });

  // Trends analysis
  const trendsData = (() => {
    if (monthlyData.length < 2) return [];

    return monthlyData.map((item, index) => {
      const prevItem = monthlyData[index - 1];
      if (!prevItem) return { ...item, incomeTrend: 0, expenseTrend: 0 };

      const incomeTrend =
        prevItem.income > 0
          ? ((item.income - prevItem.income) / prevItem.income) * 100
          : 0;
      const expenseTrend =
        prevItem.expenses > 0
          ? ((item.expenses - prevItem.expenses) / prevItem.expenses) * 100
          : 0;

      return {
        ...item,
        incomeTrend: Math.round(incomeTrend * 100) / 100,
        expenseTrend: Math.round(expenseTrend * 100) / 100,
      };
    });
  })();

  // Summary stats
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const averageTransaction =
    filteredTransactions.length > 0
      ? (totalIncome + totalExpenses) / filteredTransactions.length
      : 0;
  const largestExpense = Math.max(
    ...filteredTransactions
      .filter((t) => t.type === "expense")
      .map((t) => t.amount),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2
              className="text-2xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Analyses Financières
            </h2>
            <p className="mt-1" style={{ color: "var(--text-secondary)" }}>
              Période: {formatShortDate(selectedDateRange.start)} -{" "}
              {formatShortDate(selectedDateRange.end)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Filter
              className="h-4 w-4"
              style={{ color: "var(--text-secondary)" }}
            />
            <select
              value={viewType}
              onChange={(e) => setViewType(e.target.value as any)}
              className="px-3 py-2 rounded-lg transition-colors"
              style={{
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <option value="monthly">Vue Mensuelle</option>
              <option value="category">Par Catégorie</option>
              <option value="trends">Tendances</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-5" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div
                  className="text-sm mb-1"
                  style={{ color: "var(--color-success)" }}
                >
                  Revenus Totaux
                </div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: "var(--color-success)" }}
                >
                  {formatCurrency(totalIncome)}
                </div>
              </div>
              <TrendingUp
                className="h-8 w-8"
                style={{ color: "var(--color-success)" }}
              />
            </div>
          </div>

          <div className="glass-card p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-rose-600 opacity-5" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div
                  className="text-sm mb-1"
                  style={{ color: "var(--color-danger)" }}
                >
                  Dépenses Totales
                </div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: "var(--color-danger)" }}
                >
                  {formatCurrency(totalExpenses)}
                </div>
              </div>
              <TrendingDown
                className="h-8 w-8"
                style={{ color: "var(--color-danger)" }}
              />
            </div>
          </div>

          <div className="glass-card p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-5" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div
                  className="text-sm mb-1"
                  style={{ color: "var(--text-accent)" }}
                >
                  Solde
                </div>
                <div
                  className={`text-2xl font-bold ${
                    totalIncome - totalExpenses >= 0
                      ? "text-success"
                      : "text-danger"
                  }`}
                >
                  {formatCurrency(totalIncome - totalExpenses)}
                </div>
              </div>
              <DollarSign
                className="h-8 w-8"
                style={{ color: "var(--text-accent)" }}
              />
            </div>
          </div>

          <div className="glass-card p-4 relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div
                  className="text-sm mb-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Transactions
                </div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {filteredTransactions.length}
                </div>
              </div>
              <Calendar
                className="h-8 w-8"
                style={{ color: "var(--text-secondary)" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* View Selection */}
      <div className="glass-card p-6">
        <div className="flex items-center space-x-4 mb-6">
          {[
            { key: "monthly", label: "Vue Mensuelle", icon: Calendar },
            { key: "category", label: "Par Catégorie", icon: DollarSign },
            { key: "trends", label: "Tendances", icon: TrendingUp },
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => setViewType(option.key as any)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
              style={{
                background:
                  viewType === option.key
                    ? "var(--color-accent)"
                    : "var(--bg-secondary)",
                color:
                  viewType === option.key
                    ? "var(--text-on-accent)"
                    : "var(--text-primary)",
              }}
              onMouseEnter={(e) =>
                viewType !== option.key &&
                (e.currentTarget.style.opacity = "0.8")
              }
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <option.icon className="h-4 w-4" />
              <span>{option.label}</span>
            </button>
          ))}
        </div>

        {/* Monthly View */}
        {viewType === "monthly" && (
          <div>
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Évolution Mensuelle
            </h3>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Bar dataKey="income" fill="#10b981" name="Revenus" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Dépenses" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div
                className="text-center py-12"
                style={{ color: "var(--text-secondary)" }}
              >
                Aucune donnée disponible pour cette période
              </div>
            )}
          </div>
        )}

        {/* Category View */}
        {viewType === "category" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Répartition par Catégorie
              </h3>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="amount"
                      label={({ name, percentage }) =>
                        `${name} (${percentage.toFixed(1)}%)`
                      }
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Aucune dépense dans cette période
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Détails par Catégorie
              </h3>
              <div className="space-y-3">
                {categoryData.slice(0, 8).map((item, index) => (
                  <div
                    key={item.category}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="font-medium text-gray-900">
                        {item.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(item.amount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.percentage.toFixed(1)}% • {item.count}{" "}
                        transactions
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Trends View */}
        {viewType === "trends" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tendances d'Évolution
            </h3>
            {trendsData.length > 1 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={trendsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip
                    formatter={(value, name) => [
                      `${Number(value).toFixed(1)}%`,
                      name === "incomeTrend"
                        ? "Tendance Revenus"
                        : "Tendance Dépenses",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="incomeTrend"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Tendance Revenus"
                  />
                  <Line
                    type="monotone"
                    dataKey="expenseTrend"
                    stroke="#ef4444"
                    strokeWidth={3}
                    name="Tendance Dépenses"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Données insuffisantes pour l'analyse des tendances
              </div>
            )}
          </div>
        )}
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Statistiques Clés
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span style={{ color: "var(--text-secondary)" }}>
                Transaction moyenne
              </span>
              <span
                className="font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {formatCurrency(averageTransaction)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span style={{ color: "var(--text-secondary)" }}>
                Plus grosse dépense
              </span>
              <span
                className="font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {formatCurrency(largestExpense)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span style={{ color: "var(--text-secondary)" }}>
                Nombre de catégories
              </span>
              <span
                className="font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {categoryData.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span style={{ color: "var(--text-secondary)" }}>
                Période analysée
              </span>
              <span
                className="font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {Math.ceil(
                  (selectedDateRange.end.getTime() -
                    selectedDateRange.start.getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                jours
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Recommandations
          </h3>
          <div className="space-y-3">
            {totalExpenses > totalIncome && (
              <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg">
                <div className="text-sm text-danger font-medium">
                  Alerte: Dépenses élevées
                </div>
                <div className="text-xs text-danger mt-1">
                  Vos dépenses dépassent vos revenus. Pensez à réduire les
                  dépenses non essentielles.
                </div>
              </div>
            )}

            {categoryData.length > 0 && categoryData[0].percentage > 40 && (
              <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="text-sm text-warning font-medium">
                  Catégorie dominante
                </div>
                <div className="text-xs text-warning mt-1">
                  {categoryData[0].category} représente{" "}
                  {categoryData[0].percentage.toFixed(1)}% de vos dépenses.
                </div>
              </div>
            )}

            <div className="p-3 bg-financial-100 border border-financial-200 rounded-lg">
              <div className="text-sm text-financial-700 font-medium">
                Épargne recommandée
              </div>
              <div className="text-xs text-financial-600 mt-1">
                Essayez d'épargner au moins 20% de vos revenus mensuels.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
