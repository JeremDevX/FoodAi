"use client";

import { useFinanceStore } from "@/lib/store";
import { useFormatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Target,
  AlertCircle,
} from "lucide-react";

export default function AccessibleFinancialPulse() {
  const { getFinancialPulse } = useFinanceStore();
  const formatCurrency = useFormatCurrency();
  const pulse = getFinancialPulse();

  // Messages d'état pour l'accessibilité
  const getStatusMessage = () => {
    switch (pulse.status) {
      case "healthy":
        return "Vos finances sont en bonne santé. Continuez ainsi !";
      case "warning":
        return "Attention à vos dépenses. Pensez à réduire certaines catégories.";
      case "danger":
        return "Alerte : vos dépenses dépassent vos revenus. Action requise.";
      default:
        return "Analyse de vos finances en cours.";
    }
  };

  const getStatusColor = () => {
    switch (pulse.status) {
      case "healthy":
        return "text-wcag-success";
      case "warning":
        return "text-wcag-warning";
      case "danger":
        return "text-wcag-error";
      default:
        return "text-wcag-secondary-text";
    }
  };

  const getStatusIcon = () => {
    switch (pulse.status) {
      case "healthy":
        return <TrendingUp className="h-6 w-6" />;
      case "warning":
        return <AlertCircle className="h-6 w-6" />;
      case "danger":
        return <TrendingDown className="h-6 w-6" />;
      default:
        return <DollarSign className="h-6 w-6" />;
    }
  };

  return (
    <section
      className="wcag-card"
      aria-labelledby="financial-pulse-title"
      role="region"
    >
      <h2
        id="financial-pulse-title"
        className="text-xl font-bold text-wcag-primary-text mb-4"
      >
        État de vos finances
      </h2>

      {/* Message d'état pour les lecteurs d'écran */}
      <div className="sr-only" role="status" aria-live="polite">
        {getStatusMessage()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Indicateur de statut */}
        <div className="text-center">
          <div
            className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()} bg-wcag-surface`}
          >
            {getStatusIcon()}
            <span>
              {pulse.status === "healthy"
                ? "Santé"
                : pulse.status === "warning"
                ? "Attention"
                : "Alerte"}
            </span>
          </div>

          <div className="mt-2 text-2xl font-bold text-wcag-primary-text">
            {Math.round(pulse.score)}%
          </div>
          <div className="text-sm text-wcag-secondary-text">
            Score de santé financière
          </div>
        </div>

        {/* Revenus */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <TrendingUp
              className="h-5 w-5 text-wcag-success"
              aria-hidden="true"
            />
            <span className="text-sm text-wcag-secondary-text">
              Revenus du mois
            </span>
          </div>
          <div className="text-2xl font-bold text-wcag-success">
            {formatCurrency(pulse.monthlyIncome)}
          </div>
        </div>

        {/* Dépenses */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <TrendingDown
              className="h-5 w-5 text-wcag-error"
              aria-hidden="true"
            />
            <span className="text-sm text-wcag-secondary-text">
              Dépenses du mois
            </span>
          </div>
          <div className="text-2xl font-bold text-wcag-error">
            {formatCurrency(pulse.monthlyExpenses)}
          </div>
        </div>
      </div>

      {/* Résumé détaillé */}
      <div className="mt-6 pt-6 border-t border-wcag-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-wcag-secondary-text">Budget restant</div>
            <div
              className={`font-semibold ${
                pulse.remainingBudget >= 0
                  ? "text-wcag-success"
                  : "text-wcag-error"
              }`}
            >
              {formatCurrency(pulse.remainingBudget)}
            </div>
          </div>

          <div>
            <div className="text-wcag-secondary-text">Jours restants</div>
            <div className="font-semibold text-wcag-primary-text">
              {pulse.daysUntilNextIncome}
            </div>
          </div>

          <div>
            <div className="text-wcag-secondary-text">Recommandation</div>
            <div className="text-wcag-secondary-text text-xs">
              {getStatusMessage()}
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="mt-6 pt-6 border-t border-wcag-border">
        <div className="flex flex-wrap gap-3">
          {pulse.remainingBudget > 0 && (
            <button className="wcag-button wcag-button-primary">
              <Target className="h-4 w-4" aria-hidden="true" />
              <span className="ml-2">
                Épargner {formatCurrency(pulse.remainingBudget * 0.2)}
              </span>
            </button>
          )}

          <button className="wcag-button wcag-button-secondary">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <span className="ml-2">Voir le détail</span>
          </button>
        </div>
      </div>
    </section>
  );
}
