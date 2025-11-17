'use client';

import { useFinanceStore } from '@/lib/store';
import { 
  LayoutDashboard, 
  Receipt, 
  Target, 
  BarChart3, 
  Settings,
  PiggyBank
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
  { id: 'goals', label: 'Objectifs', icon: Target },
  { id: 'analytics', label: 'Analyses', icon: BarChart3 },
  { id: 'settings', label: 'Paramètres', icon: Settings },
];

export default function Sidebar() {
  const { currentView, setCurrentView } = useFinanceStore();

  return (
    <div className="bg-white shadow-lg h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-financial-600 p-2 rounded-lg">
            <PiggyBank className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Finance Manager</h1>
            <p className="text-sm text-gray-500">100% Local & Privé</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentView(item.id as any)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors",
                    isActive 
                      ? "bg-financial-100 text-financial-700 border-r-4 border-financial-600" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>Toutes vos données restent locales</p>
          <p className="mt-1">🔒 Aucun cloud • 🔒 Aucun tracking</p>
        </div>
      </div>
    </div>
  );
}