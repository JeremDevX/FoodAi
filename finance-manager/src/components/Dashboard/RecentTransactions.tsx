"use client";

import { useFinanceStore } from "@/lib/store";
import {
  useFormatCurrency,
  formatShortDate,
  getFinancialColor,
  normalizeDate,
} from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import Link from "next/link";

export default function RecentTransactions() {
  const { transactions } = useFinanceStore();
  const formatCurrency = useFormatCurrency();
  const recentTransactions = transactions.slice(0, 5);

  const getTransactionIcon = (type: "income" | "expense") => {
    if (type === "income") {
      return (
        <ArrowUpRight className="h-4 w-4 text-success" aria-hidden="true" />
      );
    }
    return <ArrowDownLeft className="h-4 w-4 text-danger" aria-hidden="true" />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Transactions Récentes
        </h2>
        <Link
          href="#"
          onClick={() =>
            useFinanceStore.getState().setCurrentView("transactions")
          }
          className="text-sm text-financial-600 hover:text-financial-700 dark:text-financial-400 dark:hover:text-financial-300"
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
            <div className="text-gray-400 dark:text-gray-500 mb-2">
              Aucune transaction
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
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
                className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer"
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
                    <div className="font-medium text-gray-900 dark:text-white text-base">
                      {transaction.description}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {transaction.category} •{" "}
                      {formatShortDate(new Date(transaction.date))}
                    </div>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`font-semibold text-lg ${getFinancialColor(
                    transaction.type === "income"
                      ? transaction.amount
                      : -transaction.amount
                  )}`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(Math.abs(transaction.amount))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={() =>
            useFinanceStore.getState().setCurrentView("transactions")
          }
          className="w-full px-4 py-2 bg-financial-100 hover:bg-financial-200 dark:bg-financial-900 dark:hover:bg-financial-800 text-financial-700 dark:text-financial-300 rounded-lg transition-colors font-medium"
          aria-label="Gérer toutes les transactions"
        >
          Gérer les transactions
        </button>
      </div>
    </div>
  );
}
