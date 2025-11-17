'use client';

import { useState, useEffect } from 'react';
import { useFinanceStore } from '@/lib/store';
import { UserSettings } from '@/types';
import { Settings as SettingsIcon, Download, Upload, Moon, Sun, Globe, Calendar } from 'lucide-react';
import { downloadFile } from '@/lib/utils';

export default function SettingsManager() {
  const { settings, refreshData } = useFinanceStore();
  const [formData, setFormData] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSave = async () => {
    if (!formData) return;

    setIsLoading(true);
    try {
      const { updateSettings } = await import('@/lib/database');
      await updateSettings(formData);
      await refreshData();
      setMessage({ type: 'success', text: 'Paramètres sauvegardés avec succès !' });
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde des paramètres.' });
    } finally {
      setIsLoading(false);
    }

    // Clear message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
  };

  const handleExportData = async () => {
    try {
      const { exportData } = await import('@/lib/database');
      const data = await exportData();
      const jsonString = JSON.stringify(data, null, 2);
      
      downloadFile(
        jsonString,
        `finance-backup-${new Date().toISOString().split('T')[0]}.json`,
        'application/json'
      );
      
      setMessage({ type: 'success', text: 'Données exportées avec succès !' });
    } catch (error) {
      console.error('Error exporting data:', error);
      setMessage({ type: 'error', text: 'Erreur lors de l\'export des données.' });
    }

    setTimeout(() => setMessage(null), 3000);
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Validate data structure
      if (!data.transactions || !data.categories || !data.goals || !data.accounts) {
        throw new Error('Format de fichier invalide');
      }

      if (confirm('Cette action remplacera toutes vos données actuelles. Êtes-vous sûr ?')) {
        const { importData } = await import('@/lib/database');
        await importData(data);
        await refreshData();
        setMessage({ type: 'success', text: 'Données importées avec succès !' });
      }
    } catch (error) {
      console.error('Error importing data:', error);
      setMessage({ type: 'error', text: 'Erreur lors de l\'import des données.' });
    }

    // Reset file input
    event.target.value = '';
    setTimeout(() => setMessage(null), 3000);
  };

  const handleClearData = async () => {
    if (confirm('⚠️ Cette action supprimera TOUTES vos données de façon permanente. Êtes-vous absolument sûr ?')) {
      if (confirm('⚠️ Dernière confirmation : Toutes vos transactions, objectifs et paramètres seront supprimés. Continuer ?')) {
        try {
          const { db } = await import('@/lib/database');
          await db.transactions.clear();
          await db.categories.clear();
          await db.goals.clear();
          await db.accounts.clear();
          await db.budgets.clear();
          await db.settings.clear();
          
          // Reinitialize with defaults
          const { initializeDatabase } = await import('@/lib/database');
          await initializeDatabase();
          await refreshData();
          
          setMessage({ type: 'success', text: 'Toutes les données ont été supprimées.' });
        } catch (error) {
          console.error('Error clearing data:', error);
          setMessage({ type: 'error', text: 'Erreur lors de la suppression des données.' });
        }
      }
    }

    setTimeout(() => setMessage(null), 3000);
  };

  if (!formData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <SettingsIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <div className="text-gray-400">Chargement des paramètres...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <SettingsIcon className="h-8 w-8 text-financial-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Paramètres</h2>
            <p className="text-gray-600">Configurez votre application locale</p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.type === 'success' 
              ? 'bg-success/10 border border-success/20 text-success' 
              : 'bg-danger/10 border border-danger/20 text-danger'
          }`}>
            {message.text}
          </div>
        )}
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres Généraux</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Devise
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({...formData, currency: e.target.value as 'EUR' | 'USD' | 'GBP' | 'CHF'})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-financial-500 focus:border-transparent"
            >
              <option value="EUR">€ Euro (EUR)</option>
              <option value="USD">$ Dollar (USD)</option>
              <option value="GBP">£ Livre (GBP)</option>
              <option value="CHF">Fr Franc (CHF)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Langue
            </label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({...formData, language: e.target.value as 'fr' | 'en'})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-financial-500 focus:border-transparent"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thème
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={formData.theme === 'light'}
                  onChange={(e) => setFormData({...formData, theme: e.target.value as 'light' | 'dark' | 'system'})}
                  className="mr-2"
                />
                <Sun className="h-4 w-4 mr-1" />
                Clair
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={formData.theme === 'dark'}
                  onChange={(e) => setFormData({...formData, theme: e.target.value as 'light' | 'dark' | 'system'})}
                  className="mr-2"
                />
                <Moon className="h-4 w-4 mr-1" />
                Sombre
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="theme"
                  value="system"
                  checked={formData.theme === 'system'}
                  onChange={(e) => setFormData({...formData, theme: e.target.value as 'light' | 'dark' | 'system'})}
                  className="mr-2"
                />
                Système
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Format de date
            </label>
            <select
              value={formData.dateFormat}
              onChange={(e) => setFormData({...formData, dateFormat: e.target.value as 'dd/MM/yyyy' | 'MM/dd/yyyy' | 'yyyy-MM-dd'})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-financial-500 focus:border-transparent"
            >
              <option value="dd/MM/yyyy">JJ/MM/AAAA</option>
              <option value="MM/dd/yyyy">MM/JJ/AAAA</option>
              <option value="yyyy-MM-dd">AAAA-MM-JJ</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Début de semaine
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="weekStartsOn"
                  value="monday"
                  checked={formData.weekStartsOn === 'monday'}
                  onChange={(e) => setFormData({...formData, weekStartsOn: e.target.value as 'monday' | 'sunday'})}
                  className="mr-2"
                />
                <Calendar className="h-4 w-4 mr-1" />
                Lundi
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="weekStartsOn"
                  value="sunday"
                  checked={formData.weekStartsOn === 'sunday'}
                  onChange={(e) => setFormData({...formData, weekStartsOn: e.target.value as 'monday' | 'sunday'})}
                  className="mr-2"
                />
                Dimanche
              </label>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoBackup"
              checked={formData.autoBackup}
              onChange={(e) => setFormData({...formData, autoBackup: e.target.checked})}
              className="rounded border-gray-300 text-financial-600 focus:ring-financial-500"
            />
            <label htmlFor="autoBackup" className="text-sm text-gray-700">
              Sauvegarde automatique mensuelle
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-2 bg-financial-600 hover:bg-financial-700 disabled:opacity-50 text-white rounded-lg transition-colors font-medium"
          >
            {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestion des Données</h3>
        <p className="text-sm text-gray-600 mb-6">
          Toutes vos données restent stockées localement sur votre appareil.
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Exporter les données</div>
              <div className="text-sm text-gray-600">
                Téléchargez une copie complète de vos données au format JSON
              </div>
            </div>
            <button
              onClick={handleExportData}
              className="flex items-center space-x-2 px-4 py-2 bg-financial-100 hover:bg-financial-200 text-financial-700 rounded-lg transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Exporter</span>
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Importer des données</div>
              <div className="text-sm text-gray-600">
                Restaurez vos données depuis un fichier JSON
              </div>
            </div>
            <label className="flex items-center space-x-2 px-4 py-2 bg-financial-100 hover:bg-financial-200 text-financial-700 rounded-lg transition-colors cursor-pointer">
              <Upload className="h-4 w-4" />
              <span>Importer</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-danger/10 rounded-lg border border-danger/20">
            <div>
              <div className="font-medium text-danger">Supprimer toutes les données</div>
              <div className="text-sm text-danger/80">
                ⚠️ Cette action est irréversible et supprimera toutes vos données
              </div>
            </div>
            <button
              onClick={handleClearData}
              className="px-4 py-2 bg-danger hover:bg-danger/90 text-white rounded-lg transition-colors font-medium"
            >
              Supprimer tout
            </button>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">À propos</h3>
        <div className="space-y-4 text-sm text-gray-600">
          <div>
            <div className="font-medium text-gray-900">Finance Manager</div>
            <div>Version 1.0.0 - Application 100% locale et privée</div>
          </div>
          <div>
            <div className="font-medium text-gray-900">Caractéristiques</div>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>Stockage local des données (IndexedDB)</li>
              <li>Fonctionnement hors ligne complet</li>
              <li>Aucune donnée envoyée à des serveurs externes</li>
              <li>Export/import des données au format JSON</li>
              <li>Analyses financières basiques</li>
            </ul>
          </div>
          <div>
            <div className="font-medium text-gray-900">Vie privée</div>
            <div>
              Cette application respecte votre vie privée. Toutes vos données financières restent stockées 
              localement sur votre appareil et ne sont jamais transmises à des tiers.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}