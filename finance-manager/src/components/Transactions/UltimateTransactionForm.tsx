'use client';

import { useState, useEffect } from 'react';
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
  Camera,
  Mic,
  Sparkles,
  Zap
} from 'lucide-react';

interface UltimateTransactionFormProps {
  transaction?: Transaction | null;
  onClose: () => void;
  onSave: () => void;
}

export default function UltimateTransactionForm({ transaction, onClose, onSave }: UltimateTransactionFormProps) {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const categories = [
    // Income categories
    { name: 'Salaire', type: 'income', icon: '💰', color: 'from-green-500 to-emerald-500' },
    { name: 'Investissement', type: 'income', icon: '📈', color: 'from-blue-500 to-cyan-500' },
    { name: 'Cadeau', type: 'income', icon: '🎁', color: 'from-purple-500 to-pink-500' },
    { name: 'Autre', type: 'income', icon: '📝', color: 'from-gray-500 to-slate-500' },
    // Expense categories
    { name: 'Alimentation', type: 'expense', icon: '🍎', color: 'from-red-500 to-orange-500' },
    { name: 'Transport', type: 'expense', icon: '🚗', color: 'from-blue-500 to-indigo-500' },
    { name: 'Logement', type: 'expense', icon: '🏠', color: 'from-amber-500 to-yellow-500' },
    { name: 'Santé', type: 'expense', icon: '🏥', color: 'from-pink-500 to-rose-500' },
    { name: 'Loisirs', type: 'expense', icon: '🎮', color: 'from-purple-500 to-violet-500' },
    { name: 'Shopping', type: 'expense', icon: '🛍️', color: 'from-indigo-500 to-purple-500' },
    { name: 'Restaurant', type: 'expense', icon: '🍽️', color: 'from-orange-500 to-red-500' },
    { name: 'Services', type: 'expense', icon: '⚡', color: 'from-cyan-500 to-blue-500' },
    { name: 'Autre', type: 'expense', icon: '📝', color: 'from-gray-500 to-slate-500' }
  ];

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: new Date(transaction.date).toISOString().split('T')[0],
        amount: Math.abs(transaction.amount).toString(),
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
    
    if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Veuillez entrer un montant valide supérieur à 0';
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

      // Show success animation
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onSave();
      }, 2000);

    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Erreur lors de la sauvegarde de la transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'fr-FR';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setFormData({...formData, description: transcript});
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
        alert('Erreur de reconnaissance vocale');
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      alert('La reconnaissance vocale n\'est pas supportée par votre navigateur');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="relative p-6 border-b border-white/10 bg-gradient-to-r from-financial-500/20 to-blue-500/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="p-2 bg-gradient-to-r from-financial-500 to-blue-500 rounded-lg"
                >
                  <Sparkles className="h-6 w-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {transaction ? 'Modifier la Transaction' : 'Nouvelle Transaction'}
                  </h2>
                  <p className="text-gray-400 text-sm">Remplissez les détails avec style</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                <X className="h-6 w-6" />
              </motion.button>
            </div>
          </motion.div>

          {/* Success Animation */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -50 }}
                className="absolute inset-x-0 top-20 z-50 flex items-center justify-center"
              >
                <div className="bg-gradient-to-r from-success to-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span className="font-medium">Transaction enregistrée avec succès !</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Type Selection with Animation */}
            <motion.div variants={itemVariants} className="space-y-4">
              <label className="text-sm font-medium text-gray-300">Type de transaction</label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { type: 'expense', label: 'Dépense', icon: '💸', color: 'from-red-500 to-orange-500' },
                  { type: 'income', label: 'Revenu', icon: '💰', color: 'from-green-500 to-emerald-500' }
                ].map((option) => (
                  <motion.button
                    key={option.type}
                    type="button"
                    onClick={() => setFormData({...formData, type: option.type as any})}
                    className={`
                      relative p-6 rounded-xl border-2 transition-all duration-300 group
                      ${formData.type === option.type 
                        ? `border-${option.type === 'expense' ? 'red' : 'green'}-500 bg-${option.type === 'expense' ? 'red' : 'green'}-500/20 scale-105` 
                        : 'border-white/20 hover:border-white/40 hover:scale-102'
                      }
                      overflow-hidden
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                    <div className="relative z-10 text-center">
                      <motion.div
                        animate={{ scale: formData.type === option.type ? [1, 1.2, 1] : 1 }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="text-3xl mb-2"
                      >
                        {option.icon}
                      </motion.div>
                      <div className="text-lg font-bold text-white">{option.label}</div>
                    </div>
                    {formData.type === option.type && (
                      <motion.div
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                      >
                        <div className="w-3 h-3 bg-current rounded-full" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Amount with Voice Input */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-financial-400" />
                  Montant (€)
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-financial-400">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-financial-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 ${
                      errors.amount ? 'border-danger' : 'border-white/20'
                    }`}
                    placeholder="0.00"
                    required
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={handleVoiceInput}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors ${
                      isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Mic className="h-4 w-4" />
                  </motion.button>
                </div>
                {errors.amount && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-danger text-sm"
                  >
                    {errors.amount}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-financial-400" />
                  Date
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-financial-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  required
                />
              </div>
            </motion.div>

            {/* Description with AI Suggestions */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center justify-between">
                <span className="flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-financial-400" />
                  Description
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  type="button"
                  className="text-xs text-financial-400 hover:text-financial-300 flex items-center space-x-1"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Suggestions IA</span>
                </motion.button>
              </label>
              <motion.textarea
                whileFocus={{ scale: 1.01 }}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-financial-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 resize-none ${
                  errors.description ? 'border-danger' : 'border-white/20'
                }`}
                placeholder="Décrivez la transaction..."
                rows={3}
                required
              />
              {errors.description && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-danger text-sm"
                >
                  {errors.description}
                </motion.p>
              )}
            </motion.div>

            {/* Category Selection */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Catégorie</label>
              <div className="grid grid-cols-3 gap-3">
                {filteredCategories.map((category) => (
                  <motion.button
                    key={category.name}
                    type="button"
                    onClick={() => setFormData({...formData, category: category.name})}
                    className={`
                      relative p-4 rounded-xl border-2 transition-all duration-300 group
                      ${formData.category === category.name
                        ? 'border-financial-500 bg-financial-500/20 scale-105' 
                        : 'border-white/20 hover:border-white/40 hover:scale-102'
                      }
                      overflow-hidden
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                    <div className="relative z-10 text-center">
                      <div className="text-2xl mb-1">{category.icon}</div>
                      <div className="text-xs font-medium text-white">{category.name}</div>
                    </div>
                    {formData.category === category.name && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center"
                      >
                        <div className="w-2 h-2 bg-financial-500 rounded-full" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Advanced Options */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Compte</label>
                  <select
                    value={formData.account}
                    onChange={(e) => setFormData({...formData, account: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-financial-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  >
                    <option value="Compte Principal">Compte Principal</option>
                    <option value="Compte Épargne">Compte Épargne</option>
                    <option value="Espèces">Espèces</option>
                    <option value="Carte de Crédit">Carte de Crédit</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-financial-400" />
                    Notes (optionnel)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-financial-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 resize-none"
                    placeholder="Ajoutez des notes..."
                    rows={3}
                  />
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-end space-x-4 pt-6 border-t border-white/10"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-300 hover:text-white font-medium transition-all duration-200"
              >
                Annuler
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-financial-500 to-blue-500 hover:from-financial-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-medium flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Enregistrement...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>{transaction ? 'Modifier' : 'Enregistrer'}</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}