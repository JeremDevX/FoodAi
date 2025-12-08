"use client";

import { useState, useEffect } from "react";
import { Goal } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { X, Target, Calendar, DollarSign, FileText, Image } from "lucide-react";

interface GoalFormProps {
  goal?: Goal | null;
  onClose: () => void;
  onSave: () => void;
}

export default function GoalForm({ goal, onClose, onSave }: GoalFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "0",
    deadline: "",
    description: "",
    category: "",
    image: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name,
        targetAmount: goal.targetAmount.toString(),
        currentAmount: goal.currentAmount.toString(),
        deadline: new Date(goal.deadline).toISOString().split("T")[0],
        description: goal.description || "",
        category: goal.category || "",
        image: goal.image || "",
      });
    }
  }, [goal]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    }

    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = "Le montant cible doit être supérieur à 0";
    }

    if (!formData.deadline) {
      newErrors.deadline = "La date limite est requise";
    } else {
      const deadlineDate = new Date(formData.deadline);
      if (deadlineDate <= new Date()) {
        newErrors.deadline = "La date limite doit être dans le futur";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const { addGoal, updateGoal } = await import("@/lib/database");

      const goalData = {
        name: formData.name.trim(),
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0,
        deadline: new Date(formData.deadline),
        description: formData.description.trim(),
        category: formData.category || "Autre",
        image: formData.image.trim(),
      };

      if (goal?.id) {
        await updateGoal(goal.id, goalData);
      } else {
        await addGoal(goalData);
      }

      onSave();
    } catch (error) {
      console.error("Error saving goal:", error);
      alert("Erreur lors de la sauvegarde de l'objectif");
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, image: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const goalCategories = [
    "Vacances",
    "Voyage",
    "Voiture",
    "Maison",
    "Études",
    "Mariage",
    "Retraite",
    "Urgence",
    "Investissement",
    "Autre",
  ];

  const progress =
    parseFloat(formData.targetAmount) > 0
      ? (parseFloat(formData.currentAmount) /
          parseFloat(formData.targetAmount)) *
        100
      : 0;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(4px)" }}
    >
      <div className="glass-card rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div
          className="p-6"
          style={{ borderBottom: "1px solid var(--border-color)" }}
        >
          <div className="flex items-center justify-between">
            <h2
              className="text-xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {goal ? "Modifier l'objectif" : "Nouvel objectif"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--bg-secondary)";
                e.currentTarget.style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Goal Image */}
          {formData.image && (
            <div className="relative">
              <img
                src={formData.image}
                alt="Goal"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, image: "" })}
                className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Name */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Nom de l&apos;objectif
            </label>
            <div className="relative">
              <Target
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5"
                style={{ color: "var(--text-tertiary)" }}
              />
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 transition-colors"
                style={{
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  border: `1px solid ${
                    errors.name ? "var(--color-danger)" : "var(--border-color)"
                  }`,
                }}
                placeholder="Ex: Voyage au Japon"
                required
              />
            </div>
            {errors.name && (
              <p
                className="mt-1 text-sm"
                style={{ color: "var(--color-danger)" }}
              >
                {errors.name}
              </p>
            )}
          </div>

          {/* Target Amount and Current Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Montant cible
              </label>
              <div className="relative">
                <DollarSign
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5"
                  style={{ color: "var(--text-tertiary)" }}
                />
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.targetAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, targetAmount: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 transition-colors"
                  style={{
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    border: `1px solid ${
                      errors.targetAmount
                        ? "var(--color-danger)"
                        : "var(--border-color)"
                    }`,
                  }}
                  placeholder="1000.00"
                  required
                />
              </div>
              {errors.targetAmount && (
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--color-danger)" }}
                >
                  {errors.targetAmount}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Montant actuel
              </label>
              <div className="relative">
                <DollarSign
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5"
                  style={{ color: "var(--text-tertiary)" }}
                />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.currentAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, currentAmount: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-lg transition-colors"
                  style={{
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-color)",
                  }}
                  placeholder="0.00"
                />
              </div>
              <div
                className="mt-1 text-xs"
                style={{ color: "var(--text-tertiary)" }}
              >
                Progression: {progress.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {progress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-secondary)" }}>
                  Progression
                </span>
                <span
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {progress.toFixed(1)}%
                </span>
              </div>
              <div
                className="w-full rounded-full h-2"
                style={{ background: "var(--bg-tertiary)" }}
              >
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(progress, 100)}%`,
                    background: "var(--color-accent)",
                  }}
                />
              </div>
            </div>
          )}

          {/* Deadline */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Date limite
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5"
                style={{ color: "var(--text-tertiary)" }}
              />
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 transition-colors"
                style={{
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  border: `1px solid ${
                    errors.deadline
                      ? "var(--color-danger)"
                      : "var(--border-color)"
                  }`,
                }}
                required
              />
            </div>
            {errors.deadline && (
              <p
                className="mt-1 text-sm"
                style={{ color: "var(--color-danger)" }}
              >
                {errors.deadline}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Catégorie
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg focus:ring-2 transition-colors"
              style={{
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <option value="">Sélectionner une catégorie</option>
              {goalCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Image (optionnel)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="goal-image"
              />
              <label
                htmlFor="goal-image"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                style={{
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <Image className="h-4 w-4" />
                <span>
                  {formData.image ? "Changer l'image" : "Ajouter une image"}
                </span>
              </label>
              {formData.image && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image: "" })}
                  className="text-sm transition-colors"
                  style={{ color: "var(--color-danger)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Supprimer
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Description (optionnel)
            </label>
            <div className="relative">
              <FileText
                className="absolute left-3 top-3 h-5 w-5"
                style={{ color: "var(--text-tertiary)" }}
              />
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 transition-colors"
                style={{
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-color)",
                }}
                rows={3}
                placeholder="Décrivez votre objectif..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 font-medium transition-colors"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--text-primary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-secondary)")
              }
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg transition-colors font-medium"
              style={{
                background: "var(--color-accent)",
                color: "var(--text-on-accent)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {goal ? "Modifier" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
