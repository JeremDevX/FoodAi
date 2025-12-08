"use client";

import { useState } from "react";
import { useFinanceStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Tag,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";
import { Category } from "@/types";
import Modal from "@/components/atoms/Modal/Modal";
import { Input } from "@/components/atoms/Input/Input";
import { Button } from "@/components/atoms/Button/Button";

export default function CategoryManager() {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    transactions,
  } = useFinanceStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({
    name: "",
    type: "expense",
    color: "#3b82f6",
    icon: "🏷️",
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    categoryId: number | null;
    transactionCount: number;
  }>({ isOpen: false, categoryId: null, transactionCount: 0 });

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData(category);
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        type: "expense",
        color: "#3b82f6",
        icon: "🏷️",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.color || !formData.icon || !formData.type)
      return;

    try {
      if (editingCategory && editingCategory.id) {
        await updateCategory(editingCategory.id, formData);
      } else {
        await addCategory(formData as Omit<Category, "id">);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleDeleteClick = (category: Category) => {
    if (!category.id) return;

    // Check if category is used in transactions
    const usedCount = transactions.filter(
      (t) => t.category === category.name
    ).length;

    setDeleteConfirmation({
      isOpen: true,
      categoryId: category.id,
      transactionCount: usedCount,
    });
  };

  const confirmDelete = async () => {
    if (deleteConfirmation.categoryId) {
      try {
        await deleteCategory(deleteConfirmation.categoryId);
        setDeleteConfirmation({
          isOpen: false,
          categoryId: null,
          transactionCount: 0,
        });
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const incomeCategories = categories.filter((c) => c.type === "income");
  const expenseCategories = categories.filter((c) => c.type === "expense");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-[var(--text-primary)] flex items-center">
          <Tag className="h-5 w-5 mr-2 text-financial-400" />
          Gestion des Catégories
        </h3>
        <Button onClick={() => handleOpenModal()} variant="primary" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Catégorie
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income Categories */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">
            Revenus
          </h4>
          <div className="space-y-2">
            {incomeCategories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                onEdit={() => handleOpenModal(category)}
                onDelete={() => handleDeleteClick(category)}
              />
            ))}
          </div>
        </div>

        {/* Expense Categories */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">
            Dépenses
          </h4>
          <div className="space-y-2">
            {expenseCategories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                onEdit={() => handleOpenModal(category)}
                onDelete={() => handleDeleteClick(category)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Edit/Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Nom
            </label>
            <Input
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ex: Alimentation"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as "income" | "expense",
                  })
                }
                className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-financial)]"
              >
                <option value="income">Revenu</option>
                <option value="expense">Dépense</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Icône (Emoji)
              </label>
              <Input
                value={formData.icon}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                placeholder="Ex: 🍔"
                maxLength={2}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Couleur
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="h-10 w-20 rounded cursor-pointer bg-transparent border-0"
              />
              <div
                className="h-10 flex-1 rounded-lg border border-[var(--border-primary)] flex items-center justify-center text-white font-medium"
                style={{ backgroundColor: formData.color }}
              >
                Aperçu
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit" variant="primary">
              {editingCategory ? "Mettre à jour" : "Créer"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmation.isOpen}
        onClose={() =>
          setDeleteConfirmation({ ...deleteConfirmation, isOpen: false })
        }
        title="Supprimer la catégorie"
      >
        <div className="space-y-4">
          <div className="flex items-center text-danger bg-danger/10 p-4 rounded-lg">
            <AlertTriangle className="h-6 w-6 mr-3 flex-shrink-0" />
            <p className="text-sm">
              Êtes-vous sûr de vouloir supprimer cette catégorie ?
              {deleteConfirmation.transactionCount > 0 && (
                <span className="block mt-1 font-bold">
                  Attention : {deleteConfirmation.transactionCount}{" "}
                  transaction(s) utilisent cette catégorie.
                </span>
              )}
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="ghost"
              onClick={() =>
                setDeleteConfirmation({ ...deleteConfirmation, isOpen: false })
              }
            >
              Annuler
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function CategoryItem({
  category,
  onEdit,
  onDelete,
}: {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg group hover:border-[var(--color-financial)] transition-colors"
    >
      <div className="flex items-center space-x-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
          style={{ backgroundColor: `${category.color}20` }}
        >
          {category.icon}
        </div>
        <div>
          <div className="font-medium text-[var(--text-primary)]">
            {category.name}
          </div>
          <div className="text-xs" style={{ color: category.color }}>
            {category.color}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="p-2 text-[var(--text-secondary)] hover:text-[var(--color-financial)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
        >
          <Edit2 className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-[var(--text-secondary)] hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
