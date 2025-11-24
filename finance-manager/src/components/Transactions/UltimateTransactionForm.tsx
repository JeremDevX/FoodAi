"use client";

import { useState, useEffect } from "react";
import { Transaction } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useFinanceStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  DollarSign,
  Tag,
  FileText,
  Plus,
  Save,
  Camera,
  Mic,
  Sparkles,
  Zap,
} from "lucide-react";

interface UltimateTransactionFormProps {
  transaction?: Transaction | null;
  onClose: () => void;
  onSave: () => void;
}

export default function UltimateTransactionForm({
  transaction,
  onClose,
  onSave,
}: UltimateTransactionFormProps) {
  const { accounts } = useFinanceStore();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    description: "",
    category: "",
    account: "Compte Courant",
    type: "expense" as "income" | "expense" | "transfer",
    fromAccount: "Compte Courant",
    toAccount: "Compte Épargne",
    notes: "",
    tags: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const categories = [
    // Income categories
    {
      name: "Salaire",
      type: "income",
      icon: "💰",
      gradientStart: "#10b981",
      gradientEnd: "#059669",
    },
    {
      name: "Investissement",
      type: "income",
      icon: "📈",
      gradientStart: "#3b82f6",
      gradientEnd: "#06b6d4",
    },
    {
      name: "Cadeau",
      type: "income",
      icon: "🎁",
      gradientStart: "#a855f7",
      gradientEnd: "#ec4899",
    },
    {
      name: "Autre",
      type: "income",
      icon: "📝",
      gradientStart: "#6b7280",
      gradientEnd: "#64748b",
    },
    // Expense categories
    {
      name: "Alimentation",
      type: "expense",
      icon: "🍎",
      gradientStart: "#ef4444",
      gradientEnd: "#f43f5e",
    },
    {
      name: "Transport",
      type: "expense",
      icon: "🚗",
      gradientStart: "#0ea5e9",
      gradientEnd: "#2563eb",
    },
    {
      name: "Logement",
      type: "expense",
      icon: "🏠",
      gradientStart: "#f59e0b",
      gradientEnd: "#ea580c",
    },
    {
      name: "Santé",
      type: "expense",
      icon: "🏥",
      gradientStart: "#ec4899",
      gradientEnd: "#c026d3",
    },
    {
      name: "Loisirs",
      type: "expense",
      icon: "🎮",
      gradientStart: "#8b5cf6",
      gradientEnd: "#7c3aed",
    },
    {
      name: "Shopping",
      type: "expense",
      icon: "🛍️",
      gradientStart: "#6366f1",
      gradientEnd: "#1d4ed8",
    },
    {
      name: "Restaurant",
      type: "expense",
      icon: "🍽️",
      gradientStart: "#f97316",
      gradientEnd: "#dc2626",
    },
    {
      name: "Services",
      type: "expense",
      icon: "⚡",
      gradientStart: "#06b6d4",
      gradientEnd: "#0d9488",
    },
    {
      name: "Autre",
      type: "expense",
      icon: "📝",
      gradientStart: "#64748b",
      gradientEnd: "#475569",
    },
  ];

  const filteredCategories = categories.filter(
    (cat) => cat.type === formData.type && formData.type !== "transfer"
  );

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: new Date(transaction.date).toISOString().split("T")[0],
        amount: Math.abs(transaction.amount).toString(),
        description: transaction.description,
        category: transaction.category,
        account: transaction.account,
        type: transaction.type,
        fromAccount: transaction.fromAccount || "Compte Courant",
        toAccount: transaction.toAccount || "Compte Épargne",
        notes: transaction.notes || "",
        tags: transaction.tags || [],
      });
    }
  }, [transaction]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (
      !formData.amount ||
      isNaN(parseFloat(formData.amount)) ||
      parseFloat(formData.amount) <= 0
    ) {
      newErrors.amount = "Veuillez entrer un montant valide supérieur à 0";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La description est requise";
    }

    if (formData.type !== "transfer" && !formData.category) {
      newErrors.category = "La catégorie est requise";
    }

    if (
      formData.type === "transfer" &&
      formData.fromAccount === formData.toAccount
    ) {
      newErrors.transfer =
        "Les comptes source et destination doivent être différents";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { addTransaction, updateTransaction } = await import(
        "@/lib/database"
      );

      const transactionData = {
        date: new Date(formData.date),
        amount:
          formData.type === "income"
            ? Math.abs(parseFloat(formData.amount))
            : formData.type === "transfer"
            ? Math.abs(parseFloat(formData.amount))
            : -Math.abs(parseFloat(formData.amount)),
        description: formData.description.trim(),
        category:
          formData.type === "transfer" ? "Transfert" : formData.category,
        account:
          formData.type === "transfer"
            ? formData.fromAccount
            : formData.account,
        type: formData.type,
        fromAccount:
          formData.type === "transfer" ? formData.fromAccount : undefined,
        toAccount:
          formData.type === "transfer" ? formData.toAccount : undefined,
        notes: formData.notes.trim(),
        tags: formData.tags,
      };

      if (transaction?.id) {
        await updateTransaction(transaction.id, transactionData);
      } else {
        await addTransaction(transactionData);
      }

      // Show success animation
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onSave();
      }, 2000);
    } catch (error) {
      console.error("Error saving transaction:", error);
      alert("Erreur lors de la sauvegarde de la transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoiceInput = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = "fr-FR";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setFormData({ ...formData, description: transcript });
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        alert("Erreur de reconnaissance vocale");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert(
        "La reconnaissance vocale n'est pas supportée par votre navigateur"
      );
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        style={{
          background: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(4px)",
        }}
        onClick={onClose}
      >
        <div
          className="glass-card rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="p-6"
            style={{ borderBottom: "1px solid var(--border-color)" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ background: "var(--color-accent)" }}
                >
                  <DollarSign
                    className="h-6 w-6"
                    style={{ color: "var(--text-on-accent)" }}
                  />
                </div>
                <div>
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {transaction
                      ? "Modifier la transaction"
                      : "Nouvelle transaction"}
                  </h2>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {transaction
                      ? "Modifier les informations"
                      : "Saisir les détails"}
                  </p>
                </div>
              </div>
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
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div
              className="p-4"
              style={{ background: "var(--color-success)20" }}
            >
              <div
                className="flex items-center justify-center space-x-2"
                style={{ color: "var(--color-success)" }}
              >
                <Zap className="h-5 w-5" />
                <span className="font-medium">
                  Transaction enregistrée avec succès !
                </span>
              </div>
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Type Selection */}
            <div className="space-y-4">
              <label
                className="text-sm font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Type de transaction
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    type: "expense",
                    label: "Dépense",
                    icon: "💸",
                    gradientStart: "#ef4444",
                    gradientEnd: "#f43f5e",
                  },
                  {
                    type: "income",
                    label: "Revenu",
                    icon: "💰",
                    gradientStart: "#10b981",
                    gradientEnd: "#059669",
                  },
                  {
                    type: "transfer",
                    label: "Transfert",
                    icon: "↔️",
                    gradientStart: "#3b82f6",
                    gradientEnd: "#8b5cf6",
                  },
                ].map((option) => (
                  <button
                    key={option.type}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        type: option.type as any,
                        category: "",
                      })
                    }
                    className="relative p-6 rounded-xl border-2 transition-all duration-200 overflow-hidden backdrop-blur-sm"
                    style={{
                      borderColor:
                        formData.type === option.type
                          ? "var(--color-accent)"
                          : "var(--border-color)",
                      background: "rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    {/* Gradient background */}
                    <div
                      className="absolute inset-0 transition-opacity duration-200"
                      style={{
                        background: `linear-gradient(to bottom right, ${option.gradientStart}, ${option.gradientEnd})`,
                        opacity: formData.type === option.type ? 0.4 : 0.2,
                      }}
                    />
                    <div className="relative z-10 text-center">
                      <div className="text-3xl mb-2">{option.icon}</div>
                      <div
                        className="text-lg font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {option.label}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="transaction-amount"
                  className="text-sm font-medium flex items-center"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <DollarSign className="h-4 w-4 mr-2" aria-hidden="true" />
                  Montant (€){" "}
                  <span className="text-red-500 ml-1" aria-label="requis">
                    *
                  </span>
                </label>
                <div className="relative">
                  <div
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                    style={{ color: "var(--text-accent)" }}
                    aria-hidden="true"
                  >
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <input
                    id="transaction-amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 rounded-lg transition-colors"
                    style={{
                      background: "var(--bg-secondary)",
                      color: "var(--text-primary)",
                      border: `1px solid ${
                        errors.amount
                          ? "var(--color-danger)"
                          : "var(--border-color)"
                      }`,
                    }}
                    placeholder="0.00"
                    required
                    aria-required="true"
                    aria-invalid={!!errors.amount}
                    aria-describedby={
                      errors.amount ? "amount-error" : undefined
                    }
                  />
                </div>
                {errors.amount && (
                  <p
                    id="amount-error"
                    className="text-sm"
                    style={{ color: "var(--color-danger)" }}
                    role="alert"
                  >
                    {errors.amount}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="transaction-date"
                  className="text-sm font-medium flex items-center"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <Calendar className="h-4 w-4 mr-2" aria-hidden="true" />
                  Date{" "}
                  <span className="text-red-500 ml-1" aria-label="requis">
                    *
                  </span>
                </label>
                <input
                  id="transaction-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg transition-colors"
                  style={{
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-color)",
                  }}
                  required
                  aria-required="true"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label
                htmlFor="transaction-description"
                className="text-sm font-medium flex items-center"
                style={{ color: "var(--text-secondary)" }}
              >
                <Tag className="h-4 w-4 mr-2" aria-hidden="true" />
                Description{" "}
                <span className="text-red-500 ml-1" aria-label="requis">
                  *
                </span>
              </label>
              <textarea
                id="transaction-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg resize-none transition-colors"
                style={{
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  border: `1px solid ${
                    errors.description
                      ? "var(--color-danger)"
                      : "var(--border-color)"
                  }`,
                }}
                placeholder="Décrivez la transaction..."
                rows={3}
                required
                aria-required="true"
                aria-invalid={!!errors.description}
                aria-describedby={
                  errors.description ? "description-error" : undefined
                }
              />
              {errors.description && (
                <p
                  id="description-error"
                  className="text-sm"
                  style={{ color: "var(--color-danger)" }}
                  role="alert"
                >
                  {errors.description}
                </p>
              )}
            </div>

            {/* Transfer Accounts - Only show for transfers */}
            {formData.type === "transfer" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Depuis
                  </label>
                  <select
                    value={formData.fromAccount}
                    onChange={(e) =>
                      setFormData({ ...formData, fromAccount: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg transition-colors"
                    style={{
                      background: "var(--bg-secondary)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    {accounts.map((account) => (
                      <option key={account.id} value={account.name}>
                        {account.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Vers
                  </label>
                  <select
                    value={formData.toAccount}
                    onChange={(e) =>
                      setFormData({ ...formData, toAccount: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg transition-colors"
                    style={{
                      background: "var(--bg-secondary)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    {accounts.map((account) => (
                      <option key={account.id} value={account.name}>
                        {account.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.transfer && (
                  <p
                    className="text-sm col-span-2"
                    style={{ color: "var(--color-danger)" }}
                  >
                    {errors.transfer}
                  </p>
                )}
              </div>
            )}

            {/* Category Selection */}
            {formData.type !== "transfer" && (
              <div className="space-y-2">
                <label
                  className="text-sm font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Catégorie
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {filteredCategories.map((category) => (
                    <button
                      key={category.name}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, category: category.name })
                      }
                      className="relative p-4 rounded-xl border-2 transition-all duration-200 overflow-hidden backdrop-blur-sm"
                      style={{
                        borderColor:
                          formData.category === category.name
                            ? "var(--color-accent)"
                            : "var(--border-color)",
                        background: "rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      {/* Gradient background */}
                      <div
                        className="absolute inset-0 transition-opacity duration-200"
                        style={{
                          background: `linear-gradient(to bottom right, ${category.gradientStart}, ${category.gradientEnd})`,
                          opacity:
                            formData.category === category.name ? 0.5 : 0.25,
                        }}
                      />
                      <div className="relative z-10 text-center">
                        <div className="text-2xl mb-1">{category.icon}</div>
                        <div
                          className="text-xs font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {category.name}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {errors.category && (
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-danger)" }}
                  >
                    {errors.category}
                  </p>
                )}
              </div>
            )}

            {/* Advanced Options */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Compte
                  </label>
                  <select
                    value={formData.account}
                    onChange={(e) =>
                      setFormData({ ...formData, account: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg transition-colors"
                    style={{
                      background: "var(--bg-secondary)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    {accounts.map((account) => (
                      <option key={account.id} value={account.name}>
                        {account.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium flex items-center"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Notes (optionnel)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg resize-none transition-colors"
                    style={{
                      background: "var(--bg-secondary)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--border-color)",
                    }}
                    placeholder="Ajoutez des notes..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div
              className="flex items-center justify-end space-x-4 pt-6"
              style={{ borderTop: "1px solid var(--border-color)" }}
            >
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 font-medium rounded-lg transition-colors"
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
                disabled={isSubmitting}
                className="px-8 py-3 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
                style={{
                  background: isSubmitting
                    ? "var(--bg-tertiary)"
                    : "var(--color-accent)",
                  color: isSubmitting
                    ? "var(--text-secondary)"
                    : "var(--text-on-accent)",
                }}
                onMouseEnter={(e) =>
                  !isSubmitting && (e.currentTarget.style.opacity = "0.9")
                }
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                {isSubmitting ? (
                  <>
                    <div
                      className="w-4 h-4 border-2 rounded-full animate-spin"
                      style={{
                        borderColor: "var(--text-secondary)",
                        borderTopColor: "transparent",
                      }}
                    />
                    <span>Enregistrement...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>{transaction ? "Modifier" : "Enregistrer"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AnimatePresence>
  );
}
