"use client";

import { useState, useEffect } from "react";
import { useFinanceStore } from "@/lib/store";
import { useTheme } from "@/components/Theme/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings as SettingsIcon,
  Download,
  Upload,
  Moon,
  Sun,
  Globe,
  Calendar,
  Palette,
  Sparkles,
  Zap,
  Volume2,
  Bell,
  Shield,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { downloadFile } from "@/lib/utils";

export default function UltimateSettings() {
  const { settings, refreshData } = useFinanceStore();
  const { theme, setTheme } = useTheme();
  const [formData, setFormData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSave = async () => {
    if (!formData) return;

    setIsLoading(true);
    try {
      const { updateSettings } = await import("@/lib/database");
      await updateSettings(formData);
      await refreshData();
      setMessage({
        type: "success",
        text: "Paramètres sauvegardés avec succès !",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage({
        type: "error",
        text: "Erreur lors de la sauvegarde des paramètres.",
      });
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => setMessage(null), 3000);
  };

  const handleClearData = async () => {
    if (
      confirm(
        "⚠️ Cette action supprimera TOUTES vos données de façon permanente. Êtes-vous absolument sûr ?"
      )
    ) {
      if (
        confirm(
          "⚠️ Dernière confirmation : Toutes vos transactions, objectifs et paramètres seront supprimés. Continuer ?"
        )
      ) {
        try {
          const { db } = await import("@/lib/database");
          await db.transactions.clear();
          await db.categories.clear();
          await db.goals.clear();
          await db.accounts.clear();
          await db.budgets.clear();
          await db.settings.clear();

          const { initializeDatabase } = await import("@/lib/database");
          await initializeDatabase();
          await refreshData();

          setMessage({
            type: "success",
            text: "Toutes les données ont été supprimées.",
          });
        } catch (error) {
          console.error("Error clearing data:", error);
          setMessage({
            type: "error",
            text: "Erreur lors de la suppression des données.",
          });
        }
      }
    }

    setTimeout(() => setMessage(null), 3000);
  };

  const handleExportData = async () => {
    try {
      const { exportData } = await import("@/lib/database");
      const data = await exportData();
      const jsonString = JSON.stringify(data, null, 2);

      downloadFile(
        jsonString,
        `finance-backup-${new Date().toISOString().split("T")[0]}.json`,
        "application/json"
      );

      setMessage({ type: "success", text: "Données exportées avec succès !" });
    } catch (error) {
      console.error("Error exporting data:", error);
      setMessage({
        type: "error",
        text: "Erreur lors de l'export des données.",
      });
    }

    setTimeout(() => setMessage(null), 3000);
  };

  const handleImportData = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (
        confirm(
          "Cette action remplacera toutes vos données actuelles. Êtes-vous sûr ?"
        )
      ) {
        const { importData } = await import("@/lib/database");
        await importData(data);
        await refreshData();
        setMessage({
          type: "success",
          text: "Données importées avec succès !",
        });
      }
    } catch (error) {
      console.error("Error importing data:", error);
      setMessage({
        type: "error",
        text: "Erreur lors de l'import des données.",
      });
    }

    event.target.value = "";
    setTimeout(() => setMessage(null), 3000);
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  function ThemeSelector() {
    const { theme, setTheme } = useTheme();

    const themes = [
      {
        id: "light",
        name: "Clair",
        icon: Sun,
        color: "from-yellow-400 to-orange-500",
      },
      {
        id: "dark",
        name: "Sombre",
        icon: Moon,
        color: "from-gray-700 to-gray-900",
      },
      {
        id: "ocean",
        name: "Océan",
        icon: Palette,
        color: "from-cyan-500 to-blue-600",
      },
      {
        id: "forest",
        name: "Forêt",
        icon: Sparkles,
        color: "from-green-500 to-emerald-600",
      },
      {
        id: "cosmic",
        name: "Cosmique",
        icon: Sparkles,
        color: "from-purple-500 to-pink-600",
      },
    ];

    return (
      <div className="space-y-6">
        {/* Theme Selection */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Thème</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {themes.map((themeOption) => {
              const Icon = themeOption.icon;
              const isSelected = theme === themeOption.id;

              return (
                <motion.button
                  key={themeOption.id}
                  onClick={() => setTheme(themeOption.id as any)}
                  className={`
                  relative p-4 rounded-xl border-2 transition-all duration-300
                  ${
                    isSelected
                      ? "border-financial-500 bg-financial-500/20 scale-105"
                      : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                  }
                  group overflow-hidden
                `}
                  whileHover={{ scale: isSelected ? 1.05 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${themeOption.color} opacity-20 group-hover:opacity-30 transition-opacity`}
                  />
                  <div className="relative z-10 text-center">
                    <Icon
                      className={`h-8 w-8 mx-auto mb-2 ${
                        isSelected ? "text-financial-400" : "text-gray-300"
                      }`}
                    />
                    <div
                      className={`text-sm font-medium ${
                        isSelected ? "text-white" : "text-gray-200"
                      }`}
                    >
                      {themeOption.name}
                    </div>
                  </div>
                  {isSelected && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute top-2 right-2 w-5 h-5 bg-financial-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <CheckCircle className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={sectionVariants} className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="p-3 bg-gradient-to-r from-financial-500 to-blue-500 rounded-full"
          >
            <SettingsIcon className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Paramètres avancés
            </h1>
            <p className="text-gray-400">Personnalisez votre expérience</p>
          </div>
        </div>

        {/* Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className={`p-4 rounded-lg mb-6 ${
                message.type === "success"
                  ? "bg-success/10 border border-success/20 text-success"
                  : "bg-danger/10 border border-danger/20 text-danger"
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Theme Selector */}
      <motion.div variants={sectionVariants} className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Palette className="h-5 w-5 mr-2 text-financial-400" />
          Thème & Apparence
        </h3>
        <ThemeSelector />
      </motion.div>

      {/* General Settings */}
      <motion.div variants={sectionVariants} className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Globe className="h-5 w-5 mr-2 text-financial-400" />
          Paramètres Généraux
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Devise
              </label>
              <select
                value={formData?.currency || "EUR"}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-financial-500 backdrop-blur-sm"
                style={{ colorScheme: "dark" }}
              >
                <option value="EUR" className="bg-slate-800 text-white">
                  € Euro (EUR)
                </option>
                <option value="USD" className="bg-slate-800 text-white">
                  $ Dollar (USD)
                </option>
                <option value="GBP" className="bg-slate-800 text-white">
                  £ Livre (GBP)
                </option>
                <option value="CHF" className="bg-slate-800 text-white">
                  Fr Franc (CHF)
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Langue
              </label>
              <select
                value={formData?.language || "fr"}
                onChange={(e) =>
                  setFormData({ ...formData, language: e.target.value })
                }
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-financial-500 backdrop-blur-sm"
                style={{ colorScheme: "dark" }}
              >
                <option value="fr" className="bg-slate-800 text-white">
                  Français
                </option>
                <option value="en" className="bg-slate-800 text-white">
                  English
                </option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Data Management */}
      <motion.div variants={sectionVariants} className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <RefreshCw className="h-5 w-5 mr-2 text-financial-400" />
          Gestion des Données
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg border border-white/20">
            <div>
              <div className="font-medium text-white">Exporter les données</div>
              <div className="text-sm text-gray-400">
                Téléchargez une copie complète de vos données
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportData}
              className="flex items-center space-x-2 px-4 py-2 bg-financial-500 hover:bg-financial-600 text-white rounded-lg transition-all duration-200"
            >
              <Download className="h-4 w-4" />
              <span>Exporter</span>
            </motion.button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg border border-white/20">
            <div>
              <div className="font-medium text-white">Importer des données</div>
              <div className="text-sm text-gray-400">
                Restaurez vos données depuis un fichier JSON
              </div>
            </div>
            <label className="flex items-center space-x-2 px-4 py-2 bg-financial-500 hover:bg-financial-600 text-white rounded-lg transition-all duration-200 cursor-pointer">
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

          <div className="p-4 bg-danger/10 rounded-lg border border-danger/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-danger flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Supprimer toutes les données
                </div>
                <div className="text-sm text-danger/80">
                  ⚠️ Cette action est irréversible et supprimera toutes vos
                  données
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearData}
                className="px-4 py-2 bg-danger hover:bg-danger/90 text-white rounded-lg transition-all duration-200"
              >
                Supprimer
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div variants={sectionVariants} className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={isLoading}
          className="px-8 py-3 bg-gradient-to-r from-financial-500 to-blue-500 hover:from-financial-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-medium flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
              <span>Sauvegarde...</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>Sauvegarder les paramètres</span>
            </>
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
