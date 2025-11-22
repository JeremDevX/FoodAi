"use client";

import { useFinanceStore } from "@/lib/store";
import {
  useFormatCurrency,
  formatShortDate,
  getFinancialColor,
  normalizeDate,
} from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownLeft,
  ArrowDownRight,
  ArrowRightLeft,
} from "lucide-react";
import Link from "next/link";

export default function RecentTransactions() {
  const { transactions, selectedAccount } = useFinanceStore();
  const formatCurrency = useFormatCurrency();
  const recentTransactions = transactions
    .filter(
      (t) =>
        t.account === selectedAccount ||
        (t.type === "transfer" &&
          (t.fromAccount === selectedAccount ||
            t.toAccount === selectedAccount))
    )
    .slice(0, 5);

  const getTransactionIcon = (type: "income" | "expense" | "transfer") => {
    switch (type) {
      case "income":
        return <ArrowUpRight className="h-4 w-4 text-success" />;
      case "expense":
        return <ArrowDownRight className="h-4 w-4 text-danger" />;
      case "transfer":
        return <ArrowRightLeft className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTransactionColor = (
    type: "income" | "expense" | "transfer",
    transaction: any
  ) => {
    if (type === "transfer") {
      return transaction.toAccount === selectedAccount
        ? "text-success"
        : "text-danger";
    }
    switch (type) {
      case "income":
        return "text-success";
      case "expense":
        return "text-danger";
      default:
        return "text-primary";
    }
  };

  const getAmountPrefix = (
    type: "income" | "expense" | "transfer",
    transaction: any
  ) => {
    if (type === "transfer") {
      return transaction.toAccount === selectedAccount ? "+" : "-";
    }
    return type === "income" ? "+" : "-";
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-xl font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Transactions Récentes
        </h2>
        <Link
          href="#"
          onClick={() =>
            useFinanceStore.getState().setCurrentView("transactions")
          }
          className="text-sm"
          style={{ color: "var(--text-accent)" }}
        >
          Voir tout
        </Link>
      </div>

      <div className="space-y-4">
        {recentTransactions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <div className="mb-2" style={{ color: "var(--text-tertiary)" }}>
              Aucune transaction
            </div>
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Commencez par ajouter une transaction
            </div>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg transition-all duration-200 cursor-pointer hover:bg-opacity-50"
                style={{ background: "var(--bg-secondary)" }}
                onClick={() =>
                  useFinanceStore.getState().setCurrentView("transactions")
                }
              >
                <div className="flex items-center space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex-shrink-0"
                  >
                    {getTransactionIcon(transaction.type)}
                  </motion.div>
                  <div>
                    <div
                      className="font-medium text-base"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {transaction.description}
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {transaction.category} •{" "}
                      {formatShortDate(new Date(transaction.date))}
                    </div>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <div
                    className={`font-medium ${getTransactionColor(
                      transaction.type,
                      transaction
                    )}`}
                  >
                    {getAmountPrefix(transaction.type, transaction)}
                    {formatCurrency(transaction.amount)}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div
        className="mt-6 pt-4"
        style={{ borderTop: "1px solid var(--border-primary)" }}
      >
        <button
          onClick={() =>
            useFinanceStore.getState().setCurrentView("transactions")
          }
          className="w-full px-4 py-2 rounded-lg transition-colors font-medium"
          style={{
            background: "var(--bg-secondary)",
            color: "var(--text-accent)",
          }}
          aria-label="Gérer toutes les transactions"
        >
          Gérer les transactions
        </button>
      </div>
    </div>
  );
}
