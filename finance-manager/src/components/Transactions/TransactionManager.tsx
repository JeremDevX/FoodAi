"use client";

import { useState, useEffect } from "react";
import { useFinanceStore } from "@/lib/store";
import { Transaction } from "@/types";
import {
  formatCurrency,
  formatShortDate,
  getFinancialColor,
  parseCSV,
  downloadFile,
} from "@/lib/utils";
import {
  Plus,
  Upload,
  Search,
  Filter,
  Edit,
  Trash2,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react";
import UltimateTransactionForm from "./UltimateTransactionForm";
import ImportModal from "./ImportModal";

export default function TransactionManager() {
  const { transactions, categories, selectedAccount, refreshData } =
    useFinanceStore();
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "income" | "expense" | "transfer"
  >("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || transaction.type === filterType;
    const matchesCategory =
      filterCategory === "all" || transaction.category === filterCategory;

    // Filtrer par compte sélectionné
    const matchesAccount =
      transaction.account === selectedAccount ||
      (transaction.type === "transfer" &&
        (transaction.fromAccount === selectedAccount ||
          transaction.toAccount === selectedAccount));

    return matchesSearch && matchesType && matchesCategory && matchesAccount;
  });

  const handleExportCSV = () => {
    const headers = [
      "Date",
      "Description",
      "Catégorie",
      "Montant",
      "Type",
      "Compte",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredTransactions.map((t) =>
        [
          formatShortDate(new Date(t.date)),
          `"${t.description}"`,
          t.category,
          t.amount.toString(),
          t.type,
          t.account,
        ].join(",")
      ),
    ].join("\n");

    downloadFile(
      csvContent,
      `transactions-${new Date().toISOString().split("T")[0]}.csv`,
      "text/csv"
    );
  };

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette transaction ?")) {
      const { deleteTransaction } = await import("@/lib/database");
      await deleteTransaction(id);
      await refreshData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Gestion des Transactions
          </h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowImport(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
              style={{
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <Upload className="h-4 w-4" />
              <span>Importer</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
              style={{
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <Download className="h-4 w-4" />
              <span>Exporter</span>
            </button>
            <button
              onClick={() => {
                setEditingTransaction(null);
                setShowForm(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
              style={{
                background: "var(--color-accent)",
                color: "var(--text-on-accent)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <Plus className="h-4 w-4" />
              <span>Nouvelle transaction</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
              style={{ color: "var(--text-secondary)" }}
            />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg transition-colors"
              style={{
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
              }}
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 rounded-lg transition-colors"
            style={{
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-color)",
            }}
          >
            <option value="all">Tous les types</option>
            <option value="income">Revenus</option>
            <option value="expense">Dépenses</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-lg transition-colors"
            style={{
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-color)",
            }}
          >
            <option value="all">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-2">
            <Filter
              className="h-4 w-4"
              style={{ color: "var(--text-secondary)" }}
            />
            <span
              className="text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {filteredTransactions.length} transaction
              {filteredTransactions.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Revenus */}
          <div className="glass-card p-6 relative overflow-hidden transition-all duration-200">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-5" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ background: "var(--bg-glass)" }}
                >
                  <TrendingUp
                    className="h-6 w-6"
                    style={{ color: "var(--color-success)" }}
                  />
                </div>
              </div>
              <div>
                <div
                  className="text-base font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Total Revenus
                </div>
                <div
                  className="text-3xl font-bold"
                  style={{ color: "var(--color-success)" }}
                >
                  {formatCurrency(
                    filteredTransactions
                      .filter((t) => t.type === "income")
                      .reduce((sum, t) => sum + t.amount, 0)
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Total Dépenses */}
          <div className="glass-card p-6 relative overflow-hidden transition-all duration-200">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-rose-600 opacity-5" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ background: "var(--bg-glass)" }}
                >
                  <TrendingDown
                    className="h-6 w-6"
                    style={{ color: "var(--color-danger)" }}
                  />
                </div>
              </div>
              <div>
                <div
                  className="text-base font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Total Dépenses
                </div>
                <div
                  className="text-3xl font-bold"
                  style={{ color: "var(--color-danger)" }}
                >
                  {formatCurrency(
                    filteredTransactions
                      .filter((t) => t.type === "expense")
                      .reduce((sum, t) => sum + t.amount, 0)
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Solde */}
          <div className="glass-card p-6 relative overflow-hidden transition-all duration-200">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-5" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ background: "var(--bg-glass)" }}
                >
                  <DollarSign
                    className="h-6 w-6"
                    style={{ color: "var(--text-accent)" }}
                  />
                </div>
              </div>
              <div>
                <div
                  className="text-base font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Solde
                </div>
                <div
                  className={`text-3xl font-bold ${getFinancialColor(
                    filteredTransactions.reduce(
                      (sum, t) =>
                        sum + (t.type === "income" ? t.amount : -t.amount),
                      0
                    )
                  )}`}
                >
                  {formatCurrency(
                    filteredTransactions.reduce(
                      (sum, t) =>
                        sum + (t.type === "income" ? t.amount : -t.amount),
                      0
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="glass-card rounded-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Transactions
            </h3>
            <div
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{
                background: "var(--bg-glass)",
                color: "var(--text-accent)",
              }}
            >
              {filteredTransactions.length}
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-2" style={{ color: "var(--text-secondary)" }}>
                Aucune transaction trouvée
              </div>
              <div
                className="text-sm"
                style={{ color: "var(--text-tertiary)" }}
              >
                Essayez de modifier vos filtres ou ajoutez une nouvelle
                transaction
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg transition-colors"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background:
                          transaction.type === "income"
                            ? "var(--color-success)20"
                            : "var(--color-danger)20",
                      }}
                    >
                      <span className="text-lg">
                        {categories.find(
                          (cat) => cat.name === transaction.category
                        )?.icon || "📝"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div
                        className="font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {transaction.description}
                      </div>
                      <div
                        className="text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {transaction.category} •{" "}
                        {formatShortDate(new Date(transaction.date))} •{" "}
                        {transaction.account}
                      </div>
                      {transaction.notes && (
                        <div
                          className="text-xs mt-1"
                          style={{ color: "var(--text-tertiary)" }}
                        >
                          {transaction.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div
                      className={`text-lg font-semibold ${getFinancialColor(
                        transaction.type === "income"
                          ? transaction.amount
                          : -transaction.amount
                      )}`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingTransaction(transaction);
                          setShowForm(true);
                        }}
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: "var(--text-secondary)" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "var(--color-accent)";
                          e.currentTarget.style.background =
                            "var(--color-accent)20";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "var(--text-secondary)";
                          e.currentTarget.style.background = "transparent";
                        }}
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id!)}
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: "var(--text-secondary)" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "var(--color-danger)";
                          e.currentTarget.style.background =
                            "var(--color-danger)20";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "var(--text-secondary)";
                          e.currentTarget.style.background = "transparent";
                        }}
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showForm && (
        <UltimateTransactionForm
          transaction={editingTransaction}
          onClose={() => {
            setShowForm(false);
            setEditingTransaction(null);
          }}
          onSave={async () => {
            await refreshData();
            setShowForm(false);
            setEditingTransaction(null);
          }}
        />
      )}

      {showImport && (
        <ImportModal
          onClose={() => setShowImport(false)}
          onImport={async () => {
            await refreshData();
            setShowImport(false);
          }}
        />
      )}
    </div>
  );
}
