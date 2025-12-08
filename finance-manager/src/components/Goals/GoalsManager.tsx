"use client";

import { useState } from "react";
import { useFinanceStore } from "@/lib/store";
import { Goal } from "@/types";
import {
  useFormatCurrency,
  calculatePercentage,
  normalizeDate,
} from "@/lib/utils";
import {
  Plus,
  Target,
  Calendar,
  TrendingUp,
  Edit,
  Trash2,
  CheckCircle,
} from "lucide-react";
import GoalForm from "./GoalForm";

export default function GoalsManager() {
  const { goals, refreshData } = useFinanceStore();
  const formatCurrency = useFormatCurrency();
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "completed"
  >("all");

  const filteredGoals = goals
    .filter((goal) => {
      const isCompleted = goal.currentAmount >= goal.targetAmount;
      if (filterStatus === "active") return !isCompleted;
      if (filterStatus === "completed") return isCompleted;
      return true;
    })
    .sort((a, b) => {
      // Trier par date de deadline (plus proche en premier)
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });

  const activeGoals = goals.filter(
    (goal) => goal.currentAmount < goal.targetAmount
  );
  const completedGoals = goals.filter(
    (goal) => goal.currentAmount >= goal.targetAmount
  );

  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const overallProgress = calculatePercentage(totalSaved, totalTarget);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2
              className="text-2xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Objectifs d'Épargne
            </h2>
            <p className="mt-1" style={{ color: "var(--text-secondary)" }}>
              Suivez et planifiez vos projets
            </p>
          </div>
          <button
            onClick={() => {
              setEditingGoal(null);
              setShowForm(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
            style={{
              background: "var(--color-accent)",
              color: "var(--text-on-accent)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <Plus className="h-4 w-4" />
            <span>Nouvel objectif</span>
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-5" />
            <div className="relative z-10">
              <div
                className="text-sm mb-1"
                style={{ color: "var(--text-accent)" }}
              >
                Montant épargné
              </div>
              <div
                className="text-2xl font-bold"
                style={{ color: "var(--text-accent)" }}
              >
                {formatCurrency(totalSaved)}
              </div>
            </div>
          </div>
          <div className="glass-card p-4 relative overflow-hidden">
            <div className="relative z-10">
              <div
                className="text-sm mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Objectif total
              </div>
              <div
                className="text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {formatCurrency(totalTarget)}
              </div>
            </div>
          </div>
          <div className="glass-card p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-5" />
            <div className="relative z-10">
              <div
                className="text-sm mb-1"
                style={{ color: "var(--color-success)" }}
              >
                Progression globale
              </div>
              <div
                className="text-2xl font-bold"
                style={{ color: "var(--color-success)" }}
              >
                {overallProgress}%
              </div>
            </div>
          </div>
          <div className="glass-card p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-violet-600 opacity-5" />
            <div className="relative z-10">
              <div
                className="text-sm mb-1"
                style={{ color: "var(--color-info)" }}
              >
                Objectifs actifs
              </div>
              <div
                className="text-2xl font-bold"
                style={{ color: "var(--color-info)" }}
              >
                {activeGoals.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="glass-card">
        <div style={{ borderBottom: "1px solid var(--border-color)" }}>
          <nav className="flex space-x-8 px-6">
            {[
              { key: "all", label: "Tous", count: goals.length },
              { key: "active", label: "Actifs", count: activeGoals.length },
              {
                key: "completed",
                label: "Terminés",
                count: completedGoals.length,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterStatus(tab.key as any)}
                className="py-4 px-1 font-medium text-sm transition-colors"
                style={{
                  borderBottom:
                    filterStatus === tab.key
                      ? "2px solid var(--color-accent)"
                      : "2px solid transparent",
                  color:
                    filterStatus === tab.key
                      ? "var(--color-accent)"
                      : "var(--text-secondary)",
                }}
                onMouseEnter={(e) =>
                  filterStatus !== tab.key &&
                  (e.currentTarget.style.color = "var(--text-primary)")
                }
                onMouseLeave={(e) =>
                  filterStatus !== tab.key &&
                  (e.currentTarget.style.color = "var(--text-secondary)")
                }
              >
                {tab.label}
                <span
                  className="ml-2 py-0.5 px-2 rounded-full text-xs"
                  style={{
                    background: "var(--bg-secondary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {filteredGoals.length === 0 ? (
            <div className="text-center py-12">
              <Target
                className="h-16 w-16 mx-auto mb-4"
                style={{ color: "var(--text-tertiary)" }}
              />
              <div className="mb-2" style={{ color: "var(--text-secondary)" }}>
                {filterStatus === "active"
                  ? "Aucun objectif actif"
                  : filterStatus === "completed"
                  ? "Aucun objectif terminé"
                  : "Aucun objectif"}
              </div>
              <div
                className="text-sm"
                style={{ color: "var(--text-tertiary)" }}
              >
                {filterStatus === "active"
                  ? "Définissez un objectif d'épargne"
                  : filterStatus === "completed"
                  ? "Vos objectifs terminés apparaîtront ici."
                  : "Aucun objectif défini"}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGoals.map((goal) => {
                const progress = calculatePercentage(
                  goal.currentAmount,
                  goal.targetAmount
                );
                const isCompleted = goal.currentAmount >= goal.targetAmount;
                const daysLeft = Math.ceil(
                  (new Date(goal.deadline).getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                );

                return (
                  <div
                    key={goal.id}
                    className="glass-card p-6 transition-all duration-200"
                    style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}
                  >
                    {/* Goal Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3
                          className="font-semibold mb-1"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {goal.name}
                        </h3>
                        {goal.description && (
                          <p
                            className="text-sm"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {goal.description}
                          </p>
                        )}
                      </div>
                      {isCompleted && (
                        <CheckCircle
                          className="h-6 w-6 flex-shrink-0"
                          style={{ color: "var(--color-success)" }}
                        />
                      )}
                    </div>

                    {/* Progress Circle */}
                    <div className="flex items-center justify-center mb-4">
                      <div className="relative w-24 h-24">
                        <svg
                          className="w-24 h-24 transform -rotate-90"
                          viewBox="0 0 100 100"
                        >
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="#e5e7eb"
                            strokeWidth="8"
                            fill="none"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke={isCompleted ? "#10b981" : "#3b82f6"}
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${
                              2 * Math.PI * 40 * (1 - progress / 100)
                            }`}
                            className="transition-all duration-500"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div
                              className="text-lg font-bold"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {progress}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Info */}
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span style={{ color: "var(--text-secondary)" }}>
                          Épargné
                        </span>
                        <span
                          className="font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {formatCurrency(goal.currentAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: "var(--text-secondary)" }}>
                          Objectif
                        </span>
                        <span
                          className="font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {formatCurrency(goal.targetAmount)}
                        </span>
                      </div>
                      {!isCompleted && (
                        <div className="flex justify-between text-sm">
                          <span style={{ color: "var(--text-secondary)" }}>
                            Restant
                          </span>
                          <span
                            className="font-medium"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {formatCurrency(
                              goal.targetAmount - goal.currentAmount
                            )}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span style={{ color: "var(--text-secondary)" }}>
                          Échéance
                        </span>
                        <span
                          className="font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {isCompleted ? "Terminé" : `${daysLeft} jours`}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div
                      className="w-full rounded-full h-2 mb-4"
                      style={{ background: "var(--bg-tertiary)" }}
                    >
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(progress, 100)}%`,
                          background: isCompleted
                            ? "var(--color-success)"
                            : "var(--color-accent)",
                        }}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingGoal(goal);
                          setShowForm(true);
                        }}
                        className="flex-1 px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-center space-x-1"
                        style={{
                          background: "var(--bg-secondary)",
                          color: "var(--text-accent)",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.opacity = "0.8")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.opacity = "1")
                        }
                      >
                        <Edit className="h-3 w-3" />
                        <span>Modifier</span>
                      </button>
                      {!isCompleted && (
                        <button
                          onClick={() => {
                            // Add contribution logic would go here
                          }}
                          className="flex-1 px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-center space-x-1"
                          style={{
                            background: "var(--color-success)",
                            color: "#ffffff",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.opacity = "0.9")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.opacity = "1")
                          }
                        >
                          <TrendingUp className="h-3 w-3" />
                          <span>Ajouter</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <GoalForm
          goal={editingGoal}
          onClose={() => {
            setShowForm(false);
            setEditingGoal(null);
          }}
          onSave={async () => {
            await refreshData();
            setShowForm(false);
            setEditingGoal(null);
          }}
        />
      )}
    </div>
  );
}
