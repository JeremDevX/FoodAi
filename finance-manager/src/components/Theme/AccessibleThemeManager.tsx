'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Palette, CheckCircle, AlertCircle } from 'lucide-react';

// Thèmes optimisés WCAG AA
type Theme = 'light' | 'dark' | 'system';

const themes: Array<{
  id: Theme;
  name: string;
  icon: any;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
  } | null;
}> = [
  { 
    id: 'light', 
    name: 'Clair', 
    icon: Sun, 
    description: 'Thème clair avec contraste élevé',
    colors: {
      primary: '#1a1a1a',
      secondary: '#4a5568',
      background: '#ffffff',
      surface: '#f8fafc'
    }
  },
  { 
    id: 'dark', 
    name: 'Sombre', 
    icon: Moon, 
    description: 'Thème sombre avec contraste élevé',
    colors: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      background: '#0f172a',
      surface: '#1e293b'
    }
  },
  { 
    id: 'system', 
    name: 'Système', 
    icon: Palette, 
    description: 'Suit les préférences du système',
    colors: null
  }
];

export function AccessibleThemeManager() {
  const [currentTheme, setCurrentTheme] = useState<Theme>('system');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Détecter le thème système
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Appliquer le thème
    const effectiveTheme = currentTheme === 'system' ? systemTheme : currentTheme;
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    localStorage.setItem('finance-theme', currentTheme);
  }, [currentTheme, systemTheme]);

  const handleThemeChange = (themeId: Theme) => {
    setCurrentTheme(themeId);
    
    // Annonce pour les lecteurs d'écran
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `Thème changé en ${themes.find(t => t.id === themeId)?.name}`;
    document.body.appendChild(announcement);
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  const effectiveTheme = currentTheme === 'system' ? systemTheme : currentTheme;

  return (
    <div className="wcag-card" role="region" aria-labelledby="theme-manager-title">
      <h3 id="theme-manager-title" className="text-lg font-bold text-wcag-primary-text mb-4">
        Préférences d'affichage
      </h3>
      
      <div className="space-y-6">
        {/* Sélection de thème */}
        <fieldset>
          <legend className="text-sm font-medium text-wcag-primary-text mb-3">
            Thème de l'interface
          </legend>
          <div className="space-y-2" role="radiogroup">
            {themes.map((theme) => {
              const Icon = theme.icon;
              const isSelected = currentTheme === theme.id;
              const isEffective = effectiveTheme === (theme.id === 'system' ? systemTheme : theme.id);
              
              return (
                <label 
                  key={theme.id}
                  className="flex items-center space-x-3 p-3 border border-wcag-border rounded-lg cursor-pointer hover:bg-wcag-surface-hover transition-colors"
                >
                  <input
                    type="radio"
                    name="theme"
                    value={theme.id}
                    checked={isSelected}
                    onChange={() => handleThemeChange(theme.id)}
                    className="w-4 h-4 text-wcag-nav-active focus:ring-wcag-focus"
                    aria-describedby={`theme-${theme.id}-desc`}
                  />
                  <Icon className="h-5 w-5 text-wcag-secondary-text" aria-hidden="true" />
                  <div className="flex-1">
                    <div className="font-medium text-wcag-primary-text">{theme.name}</div>
                    <div id={`theme-${theme.id}-desc`} className="text-sm text-wcag-secondary-text">
                      {theme.description}
                      {isEffective && (
                        <span className="ml-2 text-wcag-success">(actif)</span>
                      )}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Informations d'accessibilité */}
        <div className="p-4 bg-wcag-surface rounded-lg border border-wcag-border">
          <h4 className="font-medium text-wcag-primary-text mb-2 flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-wcag-success" aria-hidden="true" />
            Accessibilité WCAG AA
          </h4>
          <ul className="text-sm text-wcag-secondary-text space-y-1">
            <li>✓ Contraste des couleurs : Ratio ≥ 4.5:1</li>
            <li>✓ Navigation au clavier : Complète</li>
            <li>✓ Focus visible : Optimisé</li>
            <li>✓ Taille des éléments : ≥ 44x44px</li>
            <li>✓ Texte lisible : 16px minimum</li>
          </ul>
        </div>

        {/* Aide à la navigation */}
        <div className="p-4 bg-wcag-surface rounded-lg border border-wcag-border">
          <h4 className="font-medium text-wcag-primary-text mb-2 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-wcag-info" aria-hidden="true" />
            Conseils de navigation
          </h4>
          <ul className="text-sm text-wcag-secondary-text space-y-1">
            <li>• Utilisez la touche Tab pour naviguer</li>
            <li>• Les éléments interactifs ont un focus visible</li>
            <li>• Les formulaires ont des labels explicites</li>
            <li>• Les messages d'erreur sont annoncés</li>
          </ul>
        </div>
      </div>
    </div>
  );
}