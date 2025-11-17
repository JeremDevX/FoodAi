'use client';

import { useState, useEffect } from 'react';
import { Transaction } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { X, Calendar, DollarSign, Tag, FileText } from 'lucide-react';

interface TransactionFormProps {
  transaction?: Transaction | null;
  onClose: () => void;
  onSave: () => void;
}

export default function TransactionForm({ transaction, onClose, onSave }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    description: '',
    category: '',
    account: 'Compte Principal',
    type: 'expense' as 'income' | 'expense',
    notes: '',
    tags: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: new Date(transaction.date).toISOString().split('T')[0],
        amount: Math.abs(transaction.amount).toString(), // Garde la valeur absolue pour l'affichage
        description: transaction.description,
        category: transaction.category,
        account: transaction.account,
        type: transaction.type,
        notes: transaction.notes || '',
        tags: transaction.tags || []
      });
    }
  }, [transaction]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validation du montant
    const amount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Veuillez entrer un montant valide supérieur à 0';
    } else if (amount > 1000000) {
      newErrors.amount = 'Le montant ne peut pas dépasser 1 000 000 €';
    }
    
    // Validation de la description
    const description = formData.description.trim();
    if (!description) {
      newErrors.description = 'La description est requise';
    } else if (description.length < 3) {
      newErrors.description = 'La description doit contenir au moins 3 caractères';
    } else if (description.length > 100) {
      newErrors.description = 'La description ne peut pas dépasser 100 caractères';
    }
    
    // Validation de la date
    const transactionDate = new Date(formData.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Fin de la journée actuelle
    
    if (!formData.date) {
      newErrors.date = 'La date est requise';
    } else if (isNaN(transactionDate.getTime())) {
      newErrors.date = 'Date invalide';
    } else if (transactionDate > today) {
      newErrors.date = 'La date ne peut pas être future';
    } else if (transactionDate < new Date('2000-01-01')) {
      newErrors.date = 'La date est trop ancienne';
    }
    
    if (!formData.category) {
      newErrors.category = 'La catégorie est requise';
    }
    
    if (!formData.account) {
      newErrors.account = 'Le compte est requis';
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
      const { addTransaction, updateTransaction } = await import('@/lib/database');
      
      const transactionData = {
        date: new Date(formData.date),
        amount: formData.type === 'income' ? Math.abs(parseFloat(formData.amount)) : -Math.abs(parseFloat(formData.amount)),
        description: formData.description.trim(),
        category: formData.category,
        account: formData.account,
        type: formData.type,
        notes: formData.notes.trim(),
        tags: formData.tags
      };

      if (transaction?.id) {
        await updateTransaction(transaction.id, transactionData);
      } else {
        await addTransaction(transactionData);
      }

      onSave();
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Erreur lors de la sauvegarde de la transaction');
    }
  };

  const categories = [
    // Income categories
    { name: 'Salaire', type: 'income', icon: '💰' },
    { name: 'Investissement', type: 'income', icon: '📈' },
    { name: 'Cadeau', type: 'income', icon: '🎁' },
    { name: 'Autre', type: 'income', icon: '📝' },
    // Expense categories
    { name: 'Alimentation', type: 'expense', icon: '🍎' },
    { name: 'Transport', type: 'expense', icon: '🚗' },
    { name: 'Logement', type: 'expense', icon: '🏠' },
    { name: 'Santé', type: 'expense', icon: '🏥' },
    { name: 'Loisirs', type: 'expense', icon: '🎮' },
    { name: 'Shopping', type: 'expense', icon: '🛍️' },
    { name: 'Restaurant', type: 'expense', icon: '🍽️' },
    { name: 'Services', type: 'expense', icon: '⚡' },
    { name: 'Autre', type: 'expense', icon: '📝' }
  ];

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {transaction ? 'Modifier la transaction' : 'Nouvelle transaction'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type Selection */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({...formData, type: 'expense'})}
              className={`p-4 rounded-lg border-2 transition-colors ${
                formData.type === 'expense' 
                  ? 'border-danger bg-danger/10 text-danger' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">💸</div>
                <div className="font-medium">Dépense</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, type: 'income'})}
              className={`p-4 rounded-lg border-2 transition-colors ${
                formData.type === 'income' 
                  ? 'border-success bg-success/10 text-success' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">💰</div>
                <div className="font-medium">Revenu</div>
              </div>
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant (€)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-financial-500 focus:border-transparent ${
                  errors.amount ? 'border-danger' : 'border-gray-300'
                }`}
                placeholder="0.00"
                required
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-danger">{errors.amount}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-financial-500 focus:border-transparent ${
                errors.description ? 'border-danger' : 'border-gray-300'
              }`}
              placeholder="Ex: Courses chez Carrefour"
              required
            />
            {errors.description && (
              <p className="mt-1 text-sm text-danger">{errors.description}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <div className="grid grid-cols-3 gap-2">
              {filteredCategories.map((category) => (
                <button
                  key={category.name}
                  type="button"
                  onClick={() => setFormData({...formData, category: category.name})}
                  className={`p-3 rounded-lg border-2 transition-colors text-center ${
                    formData.category === category.name
                      ? 'border-financial-500 bg-financial-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-lg mb-1">{category.icon}</div>
                  <div className="text-xs font-medium">{category.name}</div>
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="mt-1 text-sm text-danger">{errors.category}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-financial-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Account */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compte
            </label>
            <select
              value={formData.account}
              onChange={(e) => setFormData({...formData, account: e.target.value})}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-financial-500 focus:border-transparent ${
                errors.account ? 'border-danger' : 'border-gray-300'
              }`}
              required
            >
              <option value="Compte Principal">Compte Principal</option>
              <option value="Compte Épargne">Compte Épargne</option>
              <option value="Espèces">Espèces</option>
              <option value="Carte de Crédit">Carte de Crédit</option>
            </select>
            {errors.account && (
              <p className="mt-1 text-sm text-danger">{errors.account}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optionnel)
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-financial-500 focus:border-transparent"
                rows={3}
                placeholder="Ajoutez des notes..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-financial-600 hover:bg-financial-700 text-white rounded-lg transition-colors font-medium"
            >
              {transaction ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}