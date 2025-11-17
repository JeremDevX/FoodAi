'use client';

import { useFinanceStore } from '@/lib/store';
import { formatCurrency, getPulseColor } from '@/lib/utils';
import { Heart, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FinancialPulse() {
  const { getFinancialPulse } = useFinanceStore();
  const pulse = getFinancialPulse();

  const getPulseIcon = () => {
    switch (pulse.status) {
      case 'healthy':
        return <TrendingUp className="h-8 w-8 text-success" />;
      case 'warning':
        return <Minus className="h-8 w-8 text-warning" />;
      case 'danger':
        return <TrendingDown className="h-8 w-8 text-danger" />;
    }
  };

  const getPulseColor = () => {
    switch (pulse.status) {
      case 'healthy': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'danger': return 'bg-danger';
    }
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (pulse.score / 100) * circumference;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">État financier</h2>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          pulse.status === 'healthy' ? 'bg-success/10 text-success' :
          pulse.status === 'warning' ? 'bg-warning/10 text-warning' :
          'bg-danger/10 text-danger'
        }`}>
          {pulse.status === 'healthy' ? 'Santé' : 
           pulse.status === 'warning' ? 'Attention' : 'Danger'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pulse Circle */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                stroke={getPulseColor()}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(pulse.score)}
                </div>
                <div className="text-sm text-gray-500">/100</div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            {getPulseIcon()}
            <span className={`font-medium ${getPulseColor()}`}>
              {pulse.status === 'healthy' ? 'Excellent' :
               pulse.status === 'warning' ? 'Prudent' : 'Alerte'}
            </span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Revenus du mois</div>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(pulse.monthlyIncome)}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Dépenses du mois</div>
            <div className="text-2xl font-bold text-danger">
              {formatCurrency(pulse.monthlyExpenses)}
            </div>
          </div>
        </div>

        {/* Projections */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Budget restant</div>
            <div className={`text-2xl font-bold ${getPulseColor.call(pulse.remainingBudget)}`}>
              {formatCurrency(pulse.remainingBudget)}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Jours restants</div>
            <div className="text-2xl font-bold text-gray-900">
              {pulse.daysUntilNextIncome}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-3">
          {pulse.remainingBudget > 0 && (
            <button className="px-4 py-2 bg-success hover:bg-success/90 text-white rounded-lg transition-colors font-medium">
              Épargner {formatCurrency(pulse.remainingBudget * 0.2)}
            </button>
          )}
          <button className="px-4 py-2 bg-financial-100 hover:bg-financial-200 text-financial-700 rounded-lg transition-colors font-medium">
            Voir le détail
          </button>
        </div>
      </div>
    </div>
  );
}