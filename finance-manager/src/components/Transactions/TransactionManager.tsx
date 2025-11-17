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
} from "lucide-react";
import UltimateTransactionForm from "./UltimateTransactionForm";
import ImportModal from "./ImportModal";

export default function TransactionManager() {
  const { transactions, categories, refreshData } = useFinanceStore();
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all"
  );
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

    return matchesSearch && matchesType && matchesCategory;
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Gestion des Transactions
          </h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowImport(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span>Importer</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Exporter</span>
            </button>
            <button
              onClick={() => {
                setEditingTransaction(null);
                setShowForm(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-financial-600 hover:bg-financial-700 text-white rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Nouvelle transaction</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-financial-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-financial-500 focus:border-transparent"
          >
            <option value="all">Tous les types</option>
            <option value="income">Revenus</option>
            <option value="expense">Dépenses</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-financial-500 focus:border-transparent"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {filteredTransactions.length} transaction
              {filteredTransactions.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-success/10 p-4 rounded-lg">
            <div className="text-sm text-success mb-1">Total Revenus</div>
            <div className="text-xl font-bold text-success">
              {formatCurrency(
                filteredTransactions
                  .filter((t) => t.type === "income")
                  .reduce((sum, t) => sum + t.amount, 0)
              )}
            </div>
          </div>
          <div className="bg-danger/10 p-4 rounded-lg">
            <div className="text-sm text-danger mb-1">Total Dépenses</div>
            <div className="text-xl font-bold text-danger">
              {formatCurrency(
                filteredTransactions
                  .filter((t) => t.type === "expense")
                  .reduce((sum, t) => sum + t.amount, 0)
              )}
            </div>
          </div>
          <div className="bg-financial-100 p-4 rounded-lg">
            <div className="text-sm text-financial-600 mb-1">Solde</div>
            <div
              className={`text-xl font-bold ${getFinancialColor(
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

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Transactions ({filteredTransactions.length})
          </h3>

          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                Aucune transaction trouvée
              </div>
              <div className="text-sm text-gray-500">
                Essayez de modifier vos filtres ou ajoutez une nouvelle
                transaction
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "income"
                          ? "bg-success/10"
                          : "bg-danger/10"
                      }`}
                    >
                      <span className="text-lg">
                        {categories.find(
                          (cat) => cat.name === transaction.category
                        )?.icon || "📝"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {transaction.description}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.category} •{" "}
                        {formatShortDate(new Date(transaction.date))} •{" "}
                        {transaction.account}
                      </div>
                      {transaction.notes && (
                        <div className="text-xs text-gray-400 mt-1">
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
                        className="p-2 text-gray-400 hover:text-financial-600 hover:bg-financial-100 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id!)}
                        className="p-2 text-gray-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
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
