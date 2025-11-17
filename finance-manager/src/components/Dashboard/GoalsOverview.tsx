'use client';

import { useFinanceStore } from '@/lib/store';
import { formatCurrency, calculatePercentage } from '@/lib/utils';
import { Target, Plus } from 'lucide-react';

export default function GoalsOverview() {
  const { goals } = useFinanceStore();
  const activeGoals = goals.filter(goal => goal.currentAmount < goal.targetAmount).slice(0, 3);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Objectifs en Cours</h2>
        <button 
          onClick={() => useFinanceStore.getState().setCurrentView('goals')}
          className="p-2 text-financial-600 hover:bg-financial-100 rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        {activeGoals.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <div className="text-gray-400 mb-2">Aucun objectif actif</div>
            <div className="text-sm text-gray-500">Créez votre premier objectif d'épargne</div>
          </div>
        ) : (
          activeGoals.map((goal) => {
            const progress = calculatePercentage(goal.currentAmount, goal.targetAmount);
            const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <div key={goal.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-gray-900">{goal.name}</div>
                  <div className="text-sm text-gray-500">
                    {daysLeft > 0 ? `${daysLeft} jours` : 'Terminé'}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {formatCurrency(goal.currentAmount)}
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(goal.targetAmount)}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-financial-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  
                  <div className="text-center text-sm font-medium text-financial-600">
                    {progress}%
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {activeGoals.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button 
            onClick={() => useFinanceStore.getState().setCurrentView('goals')}
            className="w-full px-4 py-2 bg-financial-100 hover:bg-financial-200 text-financial-700 rounded-lg transition-colors font-medium"
          >
            Voir tous les objectifs
          </button>
        </div>
      )}
    </div>
  );
}