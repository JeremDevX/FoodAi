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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Objectifs en Cours
        </h2>
        <button
          onClick={() => useFinanceStore.getState().setCurrentView("goals")}
          className="p-2 text-financial-600 hover:bg-financial-100 dark:text-financial-400 dark:hover:bg-financial-900 rounded-lg transition-colors"
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
                className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3"
                aria-hidden="true"
              />
            </motion.div>
            <div className="text-gray-400 dark:text-gray-500 mb-2">
              Aucun objectif actif
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Créez votre premier objectif d'épargne
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
                  className="space-y-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900 dark:text-white text-lg">
                      {goal.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {daysLeft > 0 ? `${daysLeft} jours restants` : "Terminé"}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        {formatCurrency(goal.currentAmount)}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="bg-gradient-to-r from-financial-500 to-financial-600 dark:from-financial-400 dark:to-financial-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progress, 100)}%` }}
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
                        className="text-sm font-bold text-financial-600 dark:text-financial-400 inline-block px-3 py-1 bg-financial-100 dark:bg-financial-900 rounded-full"
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
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => useFinanceStore.getState().setCurrentView("goals")}
            className="w-full px-4 py-2 bg-financial-100 hover:bg-financial-200 dark:bg-financial-900 dark:hover:bg-financial-800 text-financial-700 dark:text-financial-300 rounded-lg transition-colors font-medium"
            aria-label="Voir tous les objectifs"
          >
            Voir tous les objectifs
          </button>
        </div>
      )}
    </div>
  );
}
