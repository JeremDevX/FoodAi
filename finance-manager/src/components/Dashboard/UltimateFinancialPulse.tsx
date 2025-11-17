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
  const { getFinancialPulse } = useFinanceStore();
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
      className="relative glass-card overflow-hidden"
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
              Pouls Financier
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Votre santé financière en temps réel
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
                ? "Excellent"
                : pulse.status === "warning"
                ? "Attention"
                : "Alerte"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pulse Circle */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <svg
              className="w-40 h-40 transform -rotate-90"
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
                ? "Excellent"
                : pulse.status === "warning"
                ? "Prudent"
                : "Alerte"}
            </span>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="glass-card p-4 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Revenus du mois
              </div>
              <TrendingUp
                className="h-4 w-4"
                style={{ color: "var(--color-success)" }}
              />
            </div>
            <div
              className="text-2xl font-bold"
              style={{ color: "var(--color-success)" }}
            >
              {formatCurrency(pulse.monthlyIncome)}
            </div>
            <div
              className="mt-2 h-2 rounded-full overflow-hidden"
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

          <div className="glass-card p-4 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Dépenses du mois
              </div>
              <TrendingDown
                className="h-4 w-4"
                style={{ color: "var(--color-danger)" }}
              />
            </div>
            <div
              className="text-2xl font-bold"
              style={{ color: "var(--color-danger)" }}
            >
              {formatCurrency(pulse.monthlyExpenses)}
            </div>
            <div
              className="mt-2 h-2 rounded-full overflow-hidden"
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
          <div className="glass-card p-4 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Budget restant
              </div>
              <Zap
                className="h-4 w-4"
                style={{ color: "var(--text-accent)" }}
              />
            </div>
            <div
              className="text-2xl font-bold"
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
              className="mt-2 text-xs"
              style={{ color: "var(--text-tertiary)" }}
            >
              {pulse.remainingBudget >= 0 ? "Excédent" : "Déficit"}
            </div>
          </div>

          <div className="glass-card p-4 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Jours restants
              </div>
              <Waves
                className="h-4 w-4"
                style={{ color: "var(--text-tertiary)" }}
              />
            </div>
            <div
              className="text-2xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {pulse.daysUntilNextIncome}
            </div>
            <div
              className="mt-2 text-xs"
              style={{ color: "var(--text-tertiary)" }}
            >
              jours
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
        <div className="flex flex-wrap gap-3">
          {pulse.remainingBudget > 0 && (
            <button className="px-6 py-3 bg-gradient-to-r from-success to-emerald-500 text-white rounded-xl transition-all duration-200 shadow-lg font-medium">
              <Sparkles className="h-4 w-4 inline mr-2" />
              Épargner {formatCurrency(pulse.remainingBudget * 0.2)}
            </button>
          )}

          <button className="px-6 py-3 bg-gradient-to-r from-financial-500 to-blue-600 text-white rounded-xl transition-all duration-200 shadow-lg font-medium">
            Voir le détail
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
