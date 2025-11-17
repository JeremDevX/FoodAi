'use client';

import { useState } from 'react';
import { Transaction } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  DollarSign, 
  Tag, 
  FileText,
  Plus,
  Save,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface AccessibleTransactionFormProps {
  transaction?: Transaction | null;
  onClose: () => void;
  onSave: () => void;
}

export default function AccessibleTransactionForm({ transaction, onClose, onSave }: AccessibleTransactionFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    description: '',
    category: '',
    account: 'Compte Principal',
    type: 'expense' as 'income' | 'expense',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Catégories optimisées pour l'accessibilité
  const categories = [
    // Revenus
    { name: 'Salaire', type: 'income', description: 'Revenu principal du travail' },
    { name: 'Investissement', type: 'income', description: 'Revenus d\'investissements' },
    { name: 'Cadeau', type: 'income', description: 'Argent reçu en cadeau' },
    { name: 'Remboursement', type: 'income', description: 'Remboursement d\'argent' },
    
    // Dépenses
    { name: 'Alimentation', type: 'expense', description: 'Courses et repas' },
    { name: 'Transport', type: 'expense', description: 'Essence, transports publics' },
    { name: 'Logement', type: 'expense', description: 'Loyer, charges, maintenance' },
    { name: 'Santé', type: 'expense', description: 'Médicaments, consultations' },
    { name: 'Loisirs', type: 'expense', description: 'Activités, divertissements' },
    { name: 'Shopping', type: 'expense', description: 'Achats divers' },
    { name: 'Restaurant', type: 'expense', description: 'Repas hors domicile' },
    { name: 'Services', type: 'expense', description: 'Abonnements, services' },
  ];

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  // Validation accessible
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Le montant doit être supérieur à 0';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }
    
    if (!formData.category) {
      newErrors.category = 'La catégorie est requise';
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
      const { addTransaction, updateTransaction } = await import('@/lib/database');
      
      const transactionData = {
        date: new Date(formData.date),
        amount: parseFloat(formData.amount),
        description: formData.description.trim(),
        category: formData.category,
        account: formData.account,
        type: formData.type,
        notes: formData.notes.trim(),
      };

      if (transaction?.id) {
        await updateTransaction(transaction.id, transactionData);
      } else {
        await addTransaction(transactionData);
      }

      // Annonce de succès
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = transaction ? 'Transaction modifiée avec succès' : 'Transaction ajoutée avec succès';
      document.body.appendChild(announcement);
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onSave();
      }, 2000);

    } catch (error) {
      console.error('Error saving transaction:', error);
      
      // Annonce d'erreur
      const errorAnnouncement = document.createElement('div');
      errorAnnouncement.setAttribute('aria-live', 'assertive');
      errorAnnouncement.className = 'sr-only';
      errorAnnouncement.textContent = 'Erreur lors de la sauvegarde de la transaction';
      document.body.appendChild(errorAnnouncement);
      setTimeout(() => {
        document.body.removeChild(errorAnnouncement);
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-wcag-background rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-wcag-border"
        role="dialog"
        aria-labelledby="transaction-form-title"
        aria-describedby="transaction-form-description"
      >
        {/* Header accessible */}
        <div className="p-6 border-b border-wcag-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="transaction-form-title" className="text-xl font-bold text-wcag-primary-text">
                {transaction ? 'Modifier la transaction' : 'Nouvelle transaction'}
              </h2>
              <p id="transaction-form-description" className="text-sm text-wcag-secondary-text">
                Remplissez les informations de votre transaction
              </p>
            </div>
            <button
              onClick={onClose}
              className="wcag-button wcag-button-secondary p-2"
              aria-label="Fermer le formulaire"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Annonces pour les lecteurs d'écran */}
        <div className="sr-only" role="status" aria-live="polite">
          {showSuccess && 'Transaction enregistrée avec succès'}
        </div>

        {/* Formulaire accessible */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type de transaction - Groupe radio accessible */}
          <fieldset>
            <legend className="text-sm font-medium text-wcag-primary-text mb-3">
              Type de transaction <span className="text-wcag-error">*</span>
            </legend>
            <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-required="true">
              {[
                { type: 'expense', label: 'Dépense', description: 'Argent sortant' },
                { type: 'income', label: 'Revenu', description: 'Argent entrant' }
              ].map((option) => (
                <label key={option.type} className="flex items-center space-x-3 p-3 border border-wcag-border rounded-lg cursor-pointer hover:bg-wcag-surface-hover">
                  <input
                    type="radio"
                    name="type"
                    value={option.type}
                    checked={formData.type === option.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="w-4 h-4 text-wcag-nav-active focus:ring-wcag-focus"
                    aria-describedby={`type-${option.type}-desc`}
                  />
                  <div>
                    <div className="font-medium text-wcag-primary-text">{option.label}</div>
                    <div id={`type-${option.type}-desc`} className="text-xs text-wcag-secondary-text">
                      {option.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Montant et date - Grille accessible */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="amount" className="wcag-label">
                Montant (€) <span className="text-wcag-error">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-wcag-secondary-text pointer-events-none" aria-hidden="true" />
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className={`wcag-input pl-10 ${errors.amount ? 'border-wcag-error' : ''}`}
                  placeholder="0.00"
                  required
                  aria-describedby={errors.amount ? 'amount-error' : undefined}
                  aria-invalid={errors.amount ? 'true' : 'false'}
                />
                {errors.amount && (
                  <p id="amount-error" className="wcag-error-message" role="alert">
                    {errors.amount}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="date" className="wcag-label">
                Date <span className="text-wcag-error">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-wcag-secondary-text pointer-events-none" aria-hidden="true" />
                <input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="wcag-input pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Description - Textarea accessible */}
          <div>
            <label htmlFor="description" className="wcag-label">
              Description <span className="text-wcag-error">*</span>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className={`wcag-input ${errors.description ? 'border-wcag-error' : ''}`}
              placeholder="Ex: Courses chez Carrefour"
              rows={3}
              required
              aria-describedby={errors.description ? 'description-error' : undefined}
              aria-invalid={errors.description ? 'true' : 'false'}
            />
            {errors.description && (
              <p id="description-error" className="wcag-error-message" role="alert">
                {errors.description}
              </p>
            )}
          </div>

          {/* Catégorie - Select accessible */}
          <div>
            <label htmlFor="category" className="wcag-label">
              Catégorie <span className="text-wcag-error">*</span>
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className={`wcag-input ${errors.category ? 'border-wcag-error' : ''}`}
              required
              aria-describedby={errors.category ? 'category-error' : undefined}
              aria-invalid={errors.category ? 'true' : 'false'}
            >
              <option value="">Sélectionner une catégorie</option>
              {filteredCategories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name} - {category.description}
                </option>
              ))}
            </select>
            {errors.category && (
              <p id="category-error" className="wcag-error-message" role="alert">
                {errors.category}
              </p>
            )}
          </div>

          {/* Compte et notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="account" className="wcag-label">
                Compte
              </label>
              <select
                id="account"
                value={formData.account}
                onChange={(e) => setFormData({...formData, account: e.target.value})}
                className="wcag-input"
              >
                <option value="Compte Principal">Compte Principal</option>
                <option value="Compte Épargne">Compte Épargne</option>
                <option value="Espèces">Espèces</option>
                <option value="Carte de Crédit">Carte de Crédit</option>
              </select>
            </div>

            <div>
              <label htmlFor="notes" className="wcag-label">
                Notes (optionnel)
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="wcag-input"
                placeholder="Informations supplémentaires..."
                rows={3}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-wcag-border">
            <button
              type="button"
              onClick={onClose}
              className="wcag-button wcag-button-secondary"
              aria-label="Annuler et fermer le formulaire"
            >
              Annuler
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="wcag-button wcag-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={transaction ? 'Modifier la transaction' : 'Ajouter la transaction'}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" aria-hidden="true" />
                  {transaction ? 'Modifier' : 'Enregistrer'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}