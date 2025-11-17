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

  const filteredGoals = goals.filter((goal) => {
    const isCompleted = goal.currentAmount >= goal.targetAmount;
    if (filterStatus === "active") return !isCompleted;
    if (filterStatus === "completed") return isCompleted;
    return true;
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Gestion des Objectifs
            </h2>
            <p className="text-gray-600 mt-1">Suivez vos projets d'épargne</p>
          </div>
          <button
            onClick={() => {
              setEditingGoal(null);
              setShowForm(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-financial-600 hover:bg-financial-700 text-white rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Nouvel objectif</span>
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-financial-50 p-4 rounded-lg">
            <div className="text-sm text-financial-600 mb-1">Total épargné</div>
            <div className="text-2xl font-bold text-financial-700">
              {formatCurrency(totalSaved)}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Objectif total</div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalTarget)}
            </div>
          </div>
          <div className="bg-success/10 p-4 rounded-lg">
            <div className="text-sm text-success mb-1">Progression globale</div>
            <div className="text-2xl font-bold text-success">
              {overallProgress}%
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600 mb-1">Objectifs actifs</div>
            <div className="text-2xl font-bold text-blue-700">
              {activeGoals.length}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
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
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  filterStatus === tab.key
                    ? "border-financial-500 text-financial-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {filteredGoals.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <div className="text-gray-400 mb-2">
                {filterStatus === "active"
                  ? "Aucun objectif actif"
                  : filterStatus === "completed"
                  ? "Aucun objectif terminé"
                  : "Aucun objectif"}
              </div>
              <div className="text-sm text-gray-500">
                {filterStatus === "active"
                  ? "Créez votre premier objectif pour commencer à épargner !"
                  : filterStatus === "completed"
                  ? "Vos objectifs terminés apparaîtront ici."
                  : "Commencez par créer un objectif d'épargne."}
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
                    className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    {/* Goal Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {goal.name}
                        </h3>
                        {goal.description && (
                          <p className="text-sm text-gray-600">
                            {goal.description}
                          </p>
                        )}
                      </div>
                      {isCompleted && (
                        <CheckCircle className="h-6 w-6 text-success flex-shrink-0" />
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
                            <div className="text-lg font-bold text-gray-900">
                              {progress}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Info */}
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Épargné</span>
                        <span className="font-medium">
                          {formatCurrency(goal.currentAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Objectif</span>
                        <span className="font-medium">
                          {formatCurrency(goal.targetAmount)}
                        </span>
                      </div>
                      {!isCompleted && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Restant</span>
                          <span className="font-medium">
                            {formatCurrency(
                              goal.targetAmount - goal.currentAmount
                            )}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Échéance</span>
                        <span className="font-medium">
                          {isCompleted ? "Terminé" : `${daysLeft} jours`}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isCompleted ? "bg-success" : "bg-financial-600"
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingGoal(goal);
                          setShowForm(true);
                        }}
                        className="flex-1 px-3 py-2 text-sm bg-financial-100 hover:bg-financial-200 text-financial-700 rounded-lg transition-colors flex items-center justify-center space-x-1"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Modifier</span>
                      </button>
                      {!isCompleted && (
                        <button
                          onClick={() => {
                            // Add contribution logic would go here
                          }}
                          className="flex-1 px-3 py-2 text-sm bg-success hover:bg-success/90 text-white rounded-lg transition-colors flex items-center justify-center space-x-1"
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
