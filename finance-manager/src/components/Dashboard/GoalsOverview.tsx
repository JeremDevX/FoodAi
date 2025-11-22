"use client";

import { useFinanceStore } from "@/lib/store";
import { formatCurrency, calculatePercentage } from "@/lib/utils";
import { motion } from "framer-motion";
import { Target, Plus } from "lucide-react";

export default function GoalsOverview() {
  const { goals } = useFinanceStore();
  const activeGoals = goals
    .filter((goal) => goal.currentAmount < goal.targetAmount)
    .slice(0, 3);

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-xl font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Objectifs en Cours
        </h2>
        <button
          onClick={() => useFinanceStore.getState().setCurrentView("goals")}
          className="p-2 rounded-lg transition-colors"
          style={{
            color: "var(--text-accent)",
            background: "var(--bg-secondary)",
          }}
          aria-label="Ajouter un nouvel objectif"
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="space-y-6">
        {activeGoals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <motion.div whileHover={{ scale: 1.1 }} className="inline-block">
              <Target
                className="h-12 w-12 mx-auto mb-3"
                style={{ color: "var(--text-tertiary)" }}
                aria-hidden="true"
              />
            </motion.div>
            <div className="mb-2" style={{ color: "var(--text-tertiary)" }}>
              Aucun objectif actif
            </div>
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Créez votre premier objectif d&apos;épargne
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {activeGoals.map((goal, index) => {
              const progress = calculatePercentage(
                goal.currentAmount,
                goal.targetAmount
              );
              const daysLeft = Math.ceil(
                (new Date(goal.deadline).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
              );

              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-4 p-4 rounded-lg transition-all duration-200 hover:bg-opacity-50"
                  style={{ background: "var(--bg-secondary)" }}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="font-medium text-lg"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {goal.name}
                    </div>
                    <div
                      className="text-sm font-medium"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {daysLeft > 0 ? `${daysLeft} jours restants` : "Terminé"}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span
                        className="font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {formatCurrency(goal.currentAmount)}
                      </span>
                      <span
                        className="font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>

                    <div
                      className="w-full rounded-full h-3 overflow-hidden"
                      style={{ background: "var(--bg-tertiary)" }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(progress, 100)}%`,
                          background:
                            "linear-gradient(to right, var(--color-financial), var(--color-financial-light))",
                        }}
                        role="progressbar"
                        aria-valuenow={Math.min(progress, 100)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Progression de l'objectif ${goal.name}`}
                      />
                    </div>

                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                        className="text-sm font-bold inline-block px-3 py-1 rounded-full"
                        style={{
                          color: "var(--text-accent)",
                          background: "var(--bg-secondary)",
                        }}
                      >
                        {progress}%
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {activeGoals.length > 0 && (
        <div
          className="mt-6 pt-4"
          style={{ borderTop: "1px solid var(--border-primary)" }}
        >
          <button
            onClick={() => useFinanceStore.getState().setCurrentView("goals")}
            className="w-full px-4 py-2 rounded-lg transition-colors font-medium"
            style={{
              background: "var(--bg-secondary)",
              color: "var(--text-accent)",
            }}
            aria-label="Voir tous les objectifs"
          >
            Voir tous les objectifs
          </button>
        </div>
      )}
    </div>
  );
}
