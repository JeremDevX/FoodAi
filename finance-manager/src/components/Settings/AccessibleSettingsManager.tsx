"use client";

import { useState, useEffect } from "react";
import { useFinanceStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings as SettingsIcon,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Save,
  Trash2,
  Bell,
  Shield,
  User,
  Clock,
} from "lucide-react";
import { downloadFile } from "@/lib/utils";
import { AccessibleThemeManager } from "@/components/Theme/AccessibleThemeManager";

export default function AccessibleSettingsManager() {
  const { settings, refreshData } = useFinanceStore();
  const [formData, setFormData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [activeSection, setActiveSection] = useState("general");

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

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  if (!formData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-wcag-secondary-text">
          Chargement des paramètres...
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
          <SettingsIcon className="h-8 w-8 text-wcag-nav-active" />
          <div>
            <h1 className="text-3xl font-bold text-wcag-primary-text">
              Paramètres
            </h1>
            <p className="text-wcag-secondary-text">
              Configurez votre application
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

      {/* Thème et apparence */}
      <motion.div variants={sectionVariants} className="wcag-card">
        <h3 className="text-xl font-bold text-wcag-primary-text mb-4">
          Apparence et accessibilité
        </h3>
        <AccessibleThemeManager />
      </motion.div>

      {/* Gestion des données */}
      <motion.div variants={sectionVariants} className="wcag-card">
        <h3 className="text-xl font-bold text-wcag-primary-text mb-4">
          Gestion des données
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-wcag-surface rounded-lg border border-wcag-border">
            <div>
              <div className="font-medium text-wcag-primary-text">
                Exporter les données
              </div>
              <div className="text-sm text-wcag-secondary-text">
                Téléchargez une copie complète de vos données au format JSON
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportData}
              className="wcag-button wcag-button-secondary flex items-center space-x-2"
              aria-label="Exporter les données"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>Exporter</span>
            </motion.button>
          </div>

          <div className="flex items-center justify-between p-4 bg-wcag-surface rounded-lg border border-wcag-border">
            <div>
              <div className="font-medium text-wcag-primary-text">
                Importer des données
              </div>
              <div className="text-sm text-wcag-secondary-text">
                Restaurez vos données depuis un fichier JSON
              </div>
            </div>
            <label className="wcag-button wcag-button-secondary flex items-center space-x-2 cursor-pointer">
              <Upload className="h-4 w-4" aria-hidden="true" />
              <span>Importer</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
                aria-label="Sélectionner un fichier de sauvegarde"
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
                className="wcag-button bg-danger hover:bg-danger/90 text-white"
                aria-label="Supprimer toutes les données (action irréversible)"
              >
                Supprimer
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bouton de sauvegarde */}
      <motion.div variants={sectionVariants} className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={isLoading}
          className="wcag-button wcag-button-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
              Sauvegarde...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" aria-hidden="true" />
              <span>Sauvegarder les paramètres</span>
            </>
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
