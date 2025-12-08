"use client";

import { useFinanceStore } from "@/lib/store";
import { useFormatCurrency, getPulseColor } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  Sparkles,
  Waves,
} from "lucide-react";
import { useTheme } from "@/components/Theme/ThemeProvider";
import { useState, useEffect } from "react";

export default function UltimateFinancialPulse() {
  const { getFinancialPulse, addTransaction, refreshData } = useFinanceStore();
  const { theme } = useTheme();
  const formatCurrency = useFormatCurrency();
  const pulse = getFinancialPulse();
  const [isAnimated, setIsAnimated] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimated((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getPulseIcon = () => {
    switch (pulse.status) {
      case "healthy":
        return <TrendingUp className="h-8 w-8 text-success" />;
      case "warning":
        return <Minus className="h-8 w-8 text-warning" />;
      case "danger":
        return <TrendingDown className="h-8 w-8 text-danger" />;
    }
  };

  const getPulseColor = () => {
    switch (pulse.status) {
      case "healthy":
        return "bg-success";
      case "warning":
        return "bg-warning";
      case "danger":
        return "bg-danger";
    }
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (pulse.score / 100) * circumference;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative glass-card overflow-hidden p-8"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="relative z-10 flex items-center justify-between mb-8"
      >
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div
              className="p-3 rounded-full"
              style={{ background: "var(--bg-secondary)" }}
            >
              <Heart
                className="h-6 w-6"
                style={{ color: "var(--text-accent)" }}
              />
            </div>
          </div>
          <div>
            <h2
              className="text-2xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Synthèse Financière
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Vue d'ensemble de votre patrimoine
            </p>
          </div>
        </div>

        <div
          className="px-4 py-2 rounded-full text-sm font-medium"
          style={{
            background:
              pulse.status === "healthy"
                ? "rgba(16, 185, 129, 0.1)"
                : pulse.status === "warning"
                ? "rgba(245, 158, 11, 0.1)"
                : "rgba(239, 68, 68, 0.1)",
            color:
              pulse.status === "healthy"
                ? "var(--color-success)"
                : pulse.status === "warning"
                ? "var(--color-warning)"
                : "var(--color-danger)",
            border: `1px solid ${
              pulse.status === "healthy"
                ? "var(--color-success)"
                : pulse.status === "warning"
                ? "var(--color-warning)"
                : "var(--color-danger)"
            }`,
          }}
        >
          <div className="flex items-center space-x-2">
            {getPulseIcon()}
            <span>
              {pulse.status === "healthy"
                ? "Positif"
                : pulse.status === "warning"
                ? "Vigilance"
                : "Alerte"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-4">
        {/* Pulse Circle */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <svg
              className="w-32 h-32 transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <defs>
                <linearGradient
                  id="pulseGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>

              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="rgba(59, 130, 246, 0.2)"
                strokeWidth="8"
                fill="none"
              />

              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#pulseGradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: "stroke-dashoffset 1s ease-out" }}
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div
                  className="text-3xl font-bold mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {Math.round(pulse.score)}
                </div>
                <div
                  className="text-sm"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  /100
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-2">
            {getPulseIcon()}
            <span
              className="font-medium"
              style={{
                color:
                  pulse.status === "healthy"
                    ? "var(--color-success)"
                    : pulse.status === "warning"
                    ? "var(--color-warning)"
                    : "var(--color-danger)",
              }}
            >
              {pulse.status === "healthy"
                ? "Positif"
                : pulse.status === "warning"
                ? "Vigilance"
                : "Alerte"}
            </span>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="glass-card p-4 transition-all duration-200 h-32">
            <div className="flex items-center justify-between mb-2">
              <div
                className="text-base font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Revenus du mois
              </div>
              <TrendingUp
                className="h-5 w-5"
                style={{ color: "var(--color-success)" }}
              />
            </div>
            <div
              className="text-2xl font-bold mb-2"
              style={{ color: "var(--color-success)" }}
            >
              {formatCurrency(pulse.monthlyIncome)}
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ background: "var(--bg-tertiary)" }}
            >
              <div
                className="h-full bg-gradient-to-r from-success to-emerald-500 rounded-full"
                style={{
                  width: `${Math.min(
                    (pulse.monthlyIncome / 10000) * 100,
                    100
                  )}%`,
                  transition: "width 1s ease-out",
                }}
              />
            </div>
          </div>

          <div className="glass-card p-4 transition-all duration-200 h-32">
            <div className="flex items-center justify-between mb-2">
              <div
                className="text-base font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Dépenses du mois
              </div>
              <TrendingDown
                className="h-5 w-5"
                style={{ color: "var(--color-danger)" }}
              />
            </div>
            <div
              className="text-2xl font-bold mb-2"
              style={{ color: "var(--color-danger)" }}
            >
              {formatCurrency(pulse.monthlyExpenses)}
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ background: "var(--bg-tertiary)" }}
            >
              <div
                className="h-full bg-gradient-to-r from-danger to-red-500 rounded-full"
                style={{
                  width: `${Math.min(
                    (pulse.monthlyExpenses / 10000) * 100,
                    100
                  )}%`,
                  transition: "width 1s ease-out",
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Projections */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="glass-card p-4 transition-all duration-200 h-32">
            <div className="flex items-center justify-between mb-2">
              <div
                className="text-base font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Allocation Disponible
              </div>
              <Zap
                className="h-5 w-5"
                style={{ color: "var(--text-accent)" }}
              />
            </div>
            <div
              className="text-2xl font-bold mb-2"
              style={{
                color:
                  pulse.remainingBudget >= 0
                    ? "var(--color-success)"
                    : "var(--color-danger)",
              }}
            >
              {formatCurrency(pulse.remainingBudget)}
            </div>
            <div
              className="text-sm font-medium"
              style={{ color: "var(--text-tertiary)" }}
            >
              {pulse.remainingBudget >= 0
                ? "Surplus Stratégique"
                : "Réajustement Requis"}
            </div>
          </div>

          <div className="glass-card p-4 transition-all duration-200 h-32">
            <div className="flex items-center justify-between mb-2">
              <div
                className="text-base font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Jours restants
              </div>
              <Waves
                className="h-5 w-5"
                style={{ color: "var(--text-tertiary)" }}
              />
            </div>
            <div
              className="text-2xl font-bold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              {pulse.daysUntilNextIncome}
            </div>
            <div
              className="text-sm font-medium"
              style={{ color: "var(--text-tertiary)" }}
            >
              jours jusqu&apos;au prochain revenu
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        variants={itemVariants}
        className="relative z-10 mt-8 pt-6"
        style={{ borderTop: "1px solid var(--border-primary)" }}
      >
        <div className="flex flex-wrap gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={async () => {
              // Créer un transfert d'épargne
              const saveAmount =
                pulse.remainingBudget > 0 ? pulse.remainingBudget * 0.2 : 0;
              if (saveAmount > 0) {
                if (
                  confirm(
                    `Optimiser ${formatCurrency(
                      saveAmount
                    )} de votre allocation stratégique ?`
                  )
                ) {
                  try {
                    // Créer la transaction de transfert avec la date d'aujourd'hui
                    const today = new Date();
                    const dateString = today.toISOString().split("T")[0];

                    await addTransaction({
                      amount: saveAmount,
                      type: "transfer",
                      category: "Transfert",
                      description: "Optimisation mensuelle du capital",
                      date: dateString,
                      account: "Compte Courant",
                      fromAccount: "Compte Courant",
                      toAccount: "Compte Épargne",
                    });
                    alert(
                      `Optimisation de ${formatCurrency(
                        saveAmount
                      )} effectuée avec succès vers votre Réserve Stratégique !\n\nLe montant a été transféré depuis votre Compte Courant.`
                    );

                    // Rafraîchir les données pour que la transaction apparaisse
                    await refreshData();
                  } catch (error) {
                    alert("Une erreur est survenue lors de l'optimisation");
                  }
                }
              } else {
                alert("Aucune allocation disponible pour optimisation");
              }
            }}
            className="px-6 py-3 rounded-xl transition-all duration-200 shadow-lg font-medium hover:shadow-xl"
            style={{
              background:
                "linear-gradient(to right, var(--color-success), #10b981)",
              color: "#ffffff",
            }}
          >
            <Sparkles className="h-4 w-4 inline mr-2" />
            Épargner{" "}
            {formatCurrency(
              pulse.remainingBudget > 0 ? pulse.remainingBudget * 0.2 : 0
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // Naviguer vers la vue analytique détaillée
              const { setCurrentView } = useFinanceStore.getState();
              setCurrentView("analytics");
            }}
            className="px-6 py-3 bg-gradient-to-r from-financial-500 to-blue-600 text-white rounded-xl transition-all duration-200 shadow-lg font-medium hover:shadow-xl"
          >
            Voir les détails
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
