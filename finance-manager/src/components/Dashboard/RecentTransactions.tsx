"use client";

import { useFinanceStore } from "@/lib/store";
import {
  useFormatCurrency,
  formatShortDate,
  getFinancialColor,
  normalizeDate,
} from "@/lib/utils";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import Link from "next/link";

export default function RecentTransactions() {
  const { transactions } = useFinanceStore();
  const formatCurrency = useFormatCurrency();
  const recentTransactions = transactions.slice(0, 5);

  const getTransactionIcon = (type: "income" | "expense") => {
    if (type === "income") {
      return <ArrowUpRight className="h-4 w-4 text-success" />;
    }
    return <ArrowDownLeft className="h-4 w-4 text-danger" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Transactions Récentes
        </h2>
        <Link
          href="#"
          onClick={() =>
            useFinanceStore.getState().setCurrentView("transactions")
          }
          className="text-sm text-financial-600 hover:text-financial-700"
        >
          Voir tout
        </Link>
      </div>

      <div className="space-y-4">
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">Aucune transaction</div>
            <div className="text-sm text-gray-500">
              Commencez par ajouter une transaction
            </div>
          </div>
        ) : (
          recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {transaction.description}
                  </div>
                  <div className="text-sm text-gray-500">
                    {transaction.category} •{" "}
                    {formatShortDate(new Date(transaction.date))}
                  </div>
                </div>
              </div>
              <div
                className={`font-semibold ${getFinancialColor(
                  transaction.type === "income"
                    ? transaction.amount
                    : -transaction.amount
                )}`}
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(Math.abs(transaction.amount))}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={() =>
            useFinanceStore.getState().setCurrentView("transactions")
          }
          className="w-full px-4 py-2 bg-financial-100 hover:bg-financial-200 text-financial-700 rounded-lg transition-colors font-medium"
        >
          Gérer les transactions
        </button>
      </div>
    </div>
  );
}
