import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Transaction, Category } from "@/types";
import {
  formatCurrency,
  formatShortDate,
  getFinancialColor,
} from "@/lib/utils";
import { Button } from "@/components/atoms";

export interface TransactionItemProps {
  transaction: Transaction;
  categories: Category[];
  onEdit: () => void;
  onDelete: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  categories,
  onEdit,
  onDelete,
}) => {
  const categoryIcon =
    categories.find((cat) => cat.name === transaction.category)?.icon || "📝";

  return (
    <div
      className="flex items-center justify-between p-4 rounded-lg transition-all duration-200 hover:opacity-90"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-primary)",
      }}
    >
      <div className="flex items-center space-x-4 flex-1">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background:
              transaction.type === "income"
                ? "var(--color-success)20"
                : "var(--color-danger)20",
          }}
        >
          <span className="text-lg">{categoryIcon}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div
            className="font-medium truncate"
            style={{ color: "var(--text-primary)" }}
          >
            {transaction.description}
          </div>
          <div
            className="text-sm truncate"
            style={{ color: "var(--text-secondary)" }}
          >
            {transaction.category} •{" "}
            {formatShortDate(new Date(transaction.date))} •{" "}
            {transaction.account}
          </div>
          {transaction.notes && (
            <div
              className="text-xs mt-1 truncate"
              style={{ color: "var(--text-tertiary)" }}
            >
              {transaction.notes}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4 flex-shrink-0">
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
            onClick={onEdit}
            className="p-2 rounded-lg transition-colors"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-accent)";
              e.currentTarget.style.background = "var(--color-accent)20";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-secondary)";
              e.currentTarget.style.background = "transparent";
            }}
            title="Modifier"
            aria-label="Modifier la transaction"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg transition-colors"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-danger)";
              e.currentTarget.style.background = "var(--color-danger)20";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-secondary)";
              e.currentTarget.style.background = "transparent";
            }}
            title="Supprimer"
            aria-label="Supprimer la transaction"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
