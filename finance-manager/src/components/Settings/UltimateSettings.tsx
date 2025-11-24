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
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  function ThemeSelector() {
    const { theme, setTheme } = useTheme();

    const themes = [
      {
        id: "light",
        name: "Clair",
        description: "Doux et naturel",
        icon: Sun,
        colors: {
          bg: "#ebe6dd",
          surface: "#f5f2ed",
          accent: "#1565c0",
          success: "#00a86b",
          danger: "#c62828",
        },
      },
      {
        id: "dark",
        name: "Sombre",
        description: "Élégant et moderne",
        icon: Moon,
        colors: {
          bg: "#0a0e17",
          surface: "#151924",
          accent: "#3b82f6",
          success: "#10b981",
          danger: "#dc2626",
        },
      },
      {
        id: "ocean",
        name: "Océan",
        description: "Deep tech premium",
        icon: Palette,
        colors: {
          bg: "#030712",
          surface: "#0a1929",
          accent: "#00d9ff",
          success: "#00ff9d",
          danger: "#ff0844",
        },
      },
      {
        id: "cosmic",
        name: "Cosmique",
        description: "Royal galaxy ultra",
        icon: Sparkles,
        colors: {
          bg: "#0d0221",
          surface: "#1a0a2e",
          accent: "#c77dff",
          success: "#72f2a7",
          danger: "#ff0054",
        },
      },
    ];

    return (
      <div className="space-y-6">
        {/* Current Theme Display - Apple Style */}
        <div
          className="p-6 rounded-2xl transition-all duration-200"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-primary)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                }}
              >
                {themes.find((t) => t.id === theme)?.icon &&
                  (() => {
                    const Icon = themes.find((t) => t.id === theme)!.icon;
                    return (
                      <Icon
                        className="w-6 h-6"
                        style={{ color: "var(--color-accent)" }}
                      />
                    );
                  })()}
              </div>
              <div>
                <div
                  className="text-xs font-medium uppercase tracking-wide mb-0.5"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Thème actif
                </div>
                <div
                  className="text-xl font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {themes.find((t) => t.id === theme)?.name}
                </div>
              </div>
            </div>

            {/* Color Palette Preview - Apple Style avec bordures */}
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-lg transition-transform hover:scale-110"
                style={{
                  backgroundColor: "var(--color-accent)",
                  border: "2px solid var(--border-primary)",
                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
                }}
                title="Accent"
              />
              <div
                className="w-10 h-10 rounded-lg transition-transform hover:scale-110"
                style={{
                  backgroundColor: "var(--color-success)",
                  border: "2px solid var(--border-primary)",
                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
                }}
                title="Succès"
              />
              <div
                className="w-10 h-10 rounded-lg transition-transform hover:scale-110"
                style={{
                  backgroundColor: "var(--color-danger)",
                  border: "2px solid var(--border-primary)",
                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
                }}
                title="Danger"
              />
            </div>
          </div>
        </div>

        {/* Theme Grid - Apple Minimalist Style */}
        <div>
          <h4
            className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: "var(--text-tertiary)" }}
          >
            Apparence
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {themes.map((themeOption) => {
              const Icon = themeOption.icon;
              const isSelected = theme === themeOption.id;

              return (
                <motion.button
                  key={themeOption.id}
                  onClick={() => setTheme(themeOption.id as any)}
                  className="relative group text-left"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div
                    className={`
                    relative p-5 rounded-xl transition-all duration-200
                    ${
                      isSelected
                        ? "ring-2 ring-[var(--color-accent)] shadow-md"
                        : "hover:shadow-sm"
                    }
                  `}
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      border: "1px solid var(--border-primary)",
                    }}
                  >
                    {/* Theme Preview - Apple Minimalist */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{
                            backgroundColor: themeOption.colors.bg,
                          }}
                        >
                          <Icon
                            className="h-5 w-5"
                            style={{ color: themeOption.colors.accent }}
                          />
                        </div>

                        <div>
                          <h5
                            className="text-base font-semibold mb-0.5"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {themeOption.name}
                          </h5>
                          <p
                            className="text-xs"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {themeOption.description}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: "var(--color-accent)" }}
                        >
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Color Palette - Apple Style avec bordures */}
                    <div className="flex gap-1.5">
                      <div
                        className="flex-1 h-10 rounded-md"
                        style={{
                          backgroundColor: themeOption.colors.bg,
                          border: "1.5px solid var(--border-primary)",
                          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
                        }}
                        title="Fond"
                      />
                      <div
                        className="flex-1 h-10 rounded-md"
                        style={{
                          backgroundColor: themeOption.colors.surface,
                          border: "1.5px solid var(--border-primary)",
                          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
                        }}
                        title="Surface"
                      />
                      <div
                        className="flex-1 h-10 rounded-md"
                        style={{
                          backgroundColor: themeOption.colors.accent,
                          border: "1.5px solid var(--border-primary)",
                          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
                        }}
                        title="Accent"
                      />
                      <div
                        className="flex-1 h-10 rounded-md"
                        style={{
                          backgroundColor: themeOption.colors.success,
                          border: "1.5px solid var(--border-primary)",
                          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
                        }}
                        title="Succès"
                      />
                      <div
                        className="flex-1 h-10 rounded-md"
                        style={{
                          backgroundColor: themeOption.colors.danger,
                          border: "1.5px solid var(--border-primary)",
                          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
                        }}
                        title="Danger"
                      />
                    </div>
                  </div>
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
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear" as const,
            }}
            className="p-3 bg-gradient-to-r from-financial-500 to-blue-500 rounded-full"
          >
            <SettingsIcon className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent">
              Paramètres avancés
            </h1>
            <p className="text-[var(--text-secondary)]">
              Personnalisez votre expérience
            </p>
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
        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center">
          <Palette className="h-5 w-5 mr-2 text-financial-400" />
          Thème & Apparence
        </h3>
        <ThemeSelector />
      </motion.div>

      {/* General Settings */}
      <motion.div variants={sectionVariants} className="glass-card p-6">
        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center">
          <Globe className="h-5 w-5 mr-2 text-financial-400" />
          Paramètres Généraux
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Devise
              </label>
              <select
                value={formData?.currency || "EUR"}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
                className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-financial)] backdrop-blur-sm"
                style={{ colorScheme: "normal" }}
              >
                <option
                  value="EUR"
                  className="bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                >
                  € Euro (EUR)
                </option>
                <option
                  value="USD"
                  className="bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                >
                  $ Dollar (USD)
                </option>
                <option
                  value="GBP"
                  className="bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                >
                  £ Livre (GBP)
                </option>
                <option
                  value="CHF"
                  className="bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                >
                  Fr Franc (CHF)
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Langue
              </label>
              <select
                value={formData?.language || "fr"}
                onChange={(e) =>
                  setFormData({ ...formData, language: e.target.value })
                }
                className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-financial)] backdrop-blur-sm"
                style={{ colorScheme: "normal" }}
              >
                <option
                  value="fr"
                  className="bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                >
                  Français
                </option>
                <option
                  value="en"
                  className="bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                >
                  English
                </option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Data Management */}
      <motion.div variants={sectionVariants} className="glass-card p-6">
        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center">
          <RefreshCw className="h-5 w-5 mr-2 text-financial-400" />
          Gestion des Données
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)]">
            <div>
              <div className="font-medium text-[var(--text-primary)]">
                Exporter les données
              </div>
              <div className="text-sm text-[var(--text-secondary)]">
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

          <div className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)]">
            <div>
              <div className="font-medium text-[var(--text-primary)]">
                Importer des données
              </div>
              <div className="text-sm text-[var(--text-secondary)]">
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

          <div
            className="p-4 rounded-lg border-2"
            style={{
              backgroundColor: "rgba(196, 71, 65, 0.1)",
              borderColor: "var(--color-danger)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div
                  className="font-medium flex items-center"
                  style={{ color: "var(--color-danger)" }}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Supprimer toutes les données
                </div>
                <div
                  className="text-sm"
                  style={{ color: "var(--color-danger)", opacity: 0.8 }}
                >
                  ⚠️ Cette action est irréversible et supprimera toutes vos
                  données
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearData}
                className="px-4 py-2 text-white rounded-lg transition-all duration-200 font-medium"
                style={{
                  backgroundColor: "var(--color-danger)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
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
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear" as const,
                }}
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
