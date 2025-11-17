'use client';

import { useFinanceStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Receipt, 
  Target, 
  BarChart3, 
  Settings,
  PiggyBank,
  Menu,
  X,
  Plus,
  Search,
  Bell,
  User,
  Home
} from 'lucide-react';
import { useState, useEffect } from 'react';

const menuItems = [
  { 
    id: 'dashboard', 
    label: 'Tableau de bord', 
    icon: LayoutDashboard,
    description: 'Vue d\'ensemble de vos finances'
  },
  { 
    id: 'transactions', 
    label: 'Transactions', 
    icon: Receipt,
    description: 'Gérer vos opérations'
  },
  { 
    id: 'goals', 
    label: 'Objectifs', 
    icon: Target,
    description: 'Suivre vos objectifs d\'épargne'
  },
  { 
    id: 'analytics', 
    label: 'Analyses', 
    icon: BarChart3,
    description: 'Analyser vos dépenses'
  },
  { 
    id: 'settings', 
    label: 'Paramètres', 
    icon: Settings,
    description: 'Configurer l\'application'
  },
];

export default function AccessibleSidebar() {
  const { currentView, setCurrentView } = useFinanceStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');

  // Gestion du focus pour l'accessibilité
  const handleNavClick = (viewId: string) => {
    setCurrentView(viewId as any);
    setActiveSection(viewId);
    
    // Annonce aux technologies d'assistance
    const announcement = `Navigation vers ${menuItems.find(item => item.id === viewId)?.label}`;
    announceToScreenReader(announcement);
  };

  // Fonction pour annoncer aux lecteurs d'écran
  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return (
    <nav 
      className="bg-wcag-surface border-r border-wcag-border min-h-screen flex flex-col"
      role="navigation"
      aria-label="Navigation principale"
    >
      {/* Skip link pour l'accessibilité */}
      <a 
        href="#main-content" 
        className="wcag-skip-link"
      >
        Aller au contenu principal
      </a>

      {/* Header de navigation */}
      <div className="p-4 border-b border-wcag-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-wcag-nav-active rounded-lg" aria-hidden="true">
              <PiggyBank className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-wcag-primary-text">
                Finance Manager
              </h1>
              <p className="text-sm text-wcag-secondary-text">
                100% local & accessible
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="wcag-button wcag-button-secondary p-2"
            aria-label={isExpanded ? "Réduire le menu" : "Étendre le menu"}
            aria-expanded={isExpanded}
          >
            {isExpanded ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {/* Barre de recherche accessible */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-wcag-secondary-text" aria-hidden="true" />
          <input
            type="search"
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-wcag-border rounded-lg text-wcag-primary-text placeholder-wcag-tertiary-text focus:outline-none focus:ring-2 focus:ring-wcag-focus"
            aria-label="Rechercher dans l'application"
          />
        </div>
      </div>

      {/* Navigation principale */}
      <div className="flex-1 py-4">
        <h2 className="sr-only">Navigation principale</h2>
        
        <ul className="space-y-1 px-2" role="list">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <li key={item.id} role="none">
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    wcag-nav-item w-full text-left
                    ${isActive ? 'bg-wcag-nav-active text-white' : 'text-wcag-nav-inactive'}
                  `}
                  role="menuitem"
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`${item.label} - ${item.description}`}
                  title={item.description}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  <span className="ml-3">{item.label}</span>
                  {isExpanded && (
                    <span className="ml-auto text-xs opacity-75">
                      {index + 1}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Actions rapides */}
        <div className="mt-6 px-2">
          <h3 className="sr-only">Actions rapides</h3>
          <button
            onClick={() => setCurrentView('transactions')}
            className="wcag-button wcag-button-primary w-full mb-3"
            aria-label="Ajouter une nouvelle transaction"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span className="ml-2">Nouvelle transaction</span>
          </button>
        </div>
      </div>

      {/* Footer de navigation */}
      <div className="p-4 border-t border-wcag-border bg-wcag-surface">
        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
          <div className="w-10 h-10 bg-wcag-nav-active rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <div className="text-sm font-medium text-wcag-primary-text">Utilisateur</div>
            <div className="text-xs text-wcag-secondary-text">Connecté</div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <div className="text-xs text-wcag-tertiary-text">
            Accessibilité WCAG AA ✓
          </div>
        </div>
      </div>
    </nav>
  );
}