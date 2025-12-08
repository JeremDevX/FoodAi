"use client";

import { useState } from "react";
import { useFinanceStore } from "@/lib/store";
import { Transaction } from "@/types";
import {
  formatCurrency,
  formatShortDate,
  getFinancialColor,
  downloadFile,
} from "@/lib/utils";
import {
  Plus,
  Upload,
  Search,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react";
import UltimateTransactionForm from "./UltimateTransactionForm";
import ImportModal from "./ImportModal";
import { Button, Input, Card } from "@/components/atoms";
import { StatCard, TransactionItem } from "@/components/molecules";

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
      <Card variant="glass" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Transactions
          </h2>
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              icon={Upload}
              onClick={() => setShowImport(true)}
            >
              Importer
            </Button>
            <Button
              variant="secondary"
              icon={Download}
              onClick={handleExportCSV}
            >
              Exporter
            </Button>
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => {
                setEditingTransaction(null);
                setShowForm(true);
              }}
            >
              Nouvelle transaction
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 rounded-lg transition-colors"
            style={{
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-primary)",
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
              border: "1px solid var(--border-primary)",
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
          <StatCard
            title="Total Revenus"
            value={formatCurrency(
              filteredTransactions
                .filter((t) => t.type === "income")
                .reduce((sum, t) => sum + t.amount, 0)
            )}
            icon={TrendingUp}
            color="var(--color-success)"
            gradient="from-green-500 to-emerald-600"
          />

          <StatCard
            title="Total Dépenses"
            value={formatCurrency(
              Math.abs(
                filteredTransactions
                  .filter((t) => t.type === "expense")
                  .reduce((sum, t) => sum + t.amount, 0)
              )
            )}
            icon={TrendingDown}
            color="var(--color-danger)"
            gradient="from-red-500 to-rose-600"
          />

          <div className="relative">
            <StatCard
              title="Solde"
              value={formatCurrency(
                filteredTransactions.reduce((sum, t) => sum + t.amount, 0)
              )}
              icon={DollarSign}
              color={getFinancialColor(
                filteredTransactions.reduce((sum, t) => sum + t.amount, 0)
              ).replace("text-", "var(--color-")}
              gradient="from-blue-500 to-indigo-600"
            />
          </div>
        </div>
      </Card>

      {/* Transactions List */}
      <Card variant="glass">
        <div>
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
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  categories={categories}
                  onEdit={() => {
                    setEditingTransaction(transaction);
                    setShowForm(true);
                  }}
                  onDelete={() => handleDelete(transaction.id!)}
                />
              ))}
            </div>
          )}
        </div>
      </Card>

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
