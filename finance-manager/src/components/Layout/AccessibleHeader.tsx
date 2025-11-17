'use client';

import { useFinanceStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Download, 
  Upload, 
  Settings,
  Bell,
  Search,
  User,
  ChevronDown,
  Clock
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatShortDate } from '@/lib/utils';

export default function AccessibleHeader() {
  const { selectedDateRange, setDateRange } = useFinanceStore();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleQuickDateSelect = (type: 'current' | 'previous' | 'next') => {
    const now = new Date();
    let start: Date, end: Date;

    switch (type) {
      case 'current':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'previous':
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case 'next':
        start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
        break;
    }

    setDateRange(start, end);
    setShowDatePicker(false);
    
    // Annonce pour les lecteurs d'écran
    announceDateChange(formatShortDate(start), formatShortDate(end));
  };

  const announceDateChange = (start: string, end: string) => {
    const announcement = `Période changée : ${start} au ${end}`;
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = announcement;
    document.body.appendChild(announcer);
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  };

  const handleExport = async () => {
    const { exportData } = await import('@/lib/database');
    const data = await exportData();
    const jsonString = JSON.stringify(data, null, 2);
    
    const { downloadFile } = await import('@/lib/utils');
    downloadFile(
      jsonString,
      `finance-backup-${formatShortDate(new Date())}.json`,
      'application/json'
    );
    
    // Annonce de succès
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = 'Export des données réussi';
    document.body.appendChild(announcement);
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return (
    <header 
      className="bg-wcag-surface border-b border-wcag-border p-4"
      role="banner"
    >
      {/* Fil d'Ariane caché pour les lecteurs d'écran */}
      <nav aria-label="Fil d'Ariane" className="sr-only">
        <ol>
          <li><a href="/">Accueil</a></li>
          <li aria-current="page">Tableau de bord</li>
        </ol>
      </nav>

      <div className="flex items-center justify-between">
        {/* Section gauche - Date et heure */}
        <div className="flex items-center space-x-4">
          {/* Horloge accessible */}
          <div className="flex items-center space-x-2" role="timer" aria-label="Heure actuelle">
            <Clock className="h-4 w-4 text-wcag-secondary-text" aria-hidden="true" />
            <time 
              dateTime={currentTime.toISOString()}
              className="text-sm text-wcag-secondary-text font-mono"
            >
              {currentTime.toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </time>
          </div>

          {/* Sélecteur de période accessible */}
          <div className="relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="wcag-button wcag-button-secondary flex items-center space-x-2"
              aria-label={`Période actuelle : ${formatShortDate(selectedDateRange.start)} au ${formatShortDate(selectedDateRange.end)}. Cliquez pour changer.`}
              aria-expanded={showDatePicker}
              aria-haspopup="true"
            >
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm font-medium">
                {formatShortDate(selectedDateRange.start)} - {formatShortDate(selectedDateRange.end)}
              </span>
              <ChevronDown 
                className={`h-4 w-4 transition-transform ${showDatePicker ? 'rotate-180' : ''}`} 
                aria-hidden="true"
              />
            </button>

            <AnimatePresence>
              {showDatePicker && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-2 w-64 bg-white border border-wcag-border rounded-lg shadow-lg z-50"
                  role="dialog"
                  aria-label="Sélection de période"
                >
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-wcag-primary-text mb-3">
                      Sélectionner une période
                    </h3>
                    <div className="space-y-2" role="group" aria-label="Options de période">
                      {[
                        { key: 'previous', name: 'Mois précédent' },
                        { key: 'current', name: 'Mois en cours' },
                        { key: 'next', name: 'Mois suivant' }
                      ].map((option) => (
                        <button
                          key={option.key}
                          onClick={() => handleQuickDateSelect(option.key as any)}
                          className="w-full text-left px-3 py-2 text-wcag-primary-text hover:bg-wcag-surface-hover rounded transition-colors"
                          role="menuitem"
                        >
                          {option.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Section droite - Actions */}
        <div className="flex items-center space-x-3">
          {/* Recherche accessible */}
          <div className="relative">
            <label htmlFor="search-header" className="sr-only">
              Rechercher dans l'application
            </label>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-wcag-secondary-text pointer-events-none" aria-hidden="true" />
            <input
              id="search-header"
              type="search"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 bg-white border border-wcag-border rounded-lg text-wcag-primary-text placeholder-wcag-tertiary-text focus:outline-none focus:ring-2 focus:ring-wcag-focus"
              aria-label="Rechercher des transactions, objectifs ou analyses"
            />
          </div>

          {/* Actions rapides */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExport}
              className="wcag-button wcag-button-secondary"
              aria-label="Exporter les données"
              title="Exporter vos données au format JSON"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Exporter</span>
            </button>
            
            <button
              className="wcag-button wcag-button-secondary"
              aria-label="Importer des données"
              title="Importer des données depuis un fichier JSON"
            >
              <Upload className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Importer</span>
            </button>
          </div>

          {/* Utilisateur */}
          <div className="flex items-center space-x-2 p-2 bg-white rounded-lg">
            <div className="w-8 h-8 bg-wcag-nav-active rounded-full flex items-center justify-center" aria-hidden="true">
              <User className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-wcag-primary-text">Utilisateur</div>
              <div className="text-xs text-wcag-secondary-text">Connecté</div>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de statut accessible */}
      <div className="mt-4 pt-4 border-t border-wcag-border">
        <div className="flex items-center justify-between text-xs text-wcag-tertiary-text">
          <div className="flex items-center space-x-2">
            <span className="sr-only">Statut:</span>
            <div className="w-2 h-2 bg-wcag-success rounded-full" aria-hidden="true"></div>
            <span>Connecté</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="sr-only">Accessibilité:</span>
            <span>WCAG AA ✓</span>
          </div>
        </div>
      </div>
    </header>
  );
}