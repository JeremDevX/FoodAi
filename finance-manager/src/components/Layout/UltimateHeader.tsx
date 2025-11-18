"use client";

import { useTheme } from "@/components/Theme/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Upload,
  Settings,
  Bell,
  User,
  Sparkles,
  Clock,
  Globe,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";
import { formatShortDate } from "@/lib/utils";

export default function UltimateHeader() {
  const { theme } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);



  const handleExport = async () => {
    const { exportData } = await import("@/lib/database");
    const data = await exportData();
    const jsonString = JSON.stringify(data, null, 2);

    const { downloadFile } = await import("@/lib/utils");
    downloadFile(
      jsonString,
      `finance-backup-${formatShortDate(new Date())}.json`,
      "application/json"
    );
  };

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const text = await file.text();
          const data = JSON.parse(text);
          const { importData } = await import("@/lib/database");
          await importData(data);
          window.location.reload(); // Recharger pour appliquer les données
        } catch (error) {
          alert('Erreur lors de l\'importation du fichier');
          console.error('Import error:', error);
        }
      }
    };
    input.click();
  };

  const headerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden"
      style={{
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border-primary)",
      }}
    >
      {/* Subtle Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: "var(--gradient-primary)" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 py-4 mb-4">
        <div className="flex items-center justify-between gap-8">
          {/* Left Section - Date & Time */}
          <motion.div
            variants={itemVariants}
            className="flex items-center space-x-6"
          >
            {/* Live Clock */}
            <div className="flex items-center space-x-2">
              <div
                className="p-2 rounded-lg"
                style={{
                  background: "var(--bg-glass)",
                  border: "1px solid var(--border-primary)",
                }}
              >
                <Clock
                  className="h-4 w-4"
                  style={{ color: "var(--text-accent)" }}
                />
              </div>
              <div className="text-sm">
                <div
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {currentTime.toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {currentTime.toLocaleDateString("fr-FR", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </div>
              </div>
            </div>


          </motion.div>

          {/* Right Section - Actions */}
          <motion.div
            variants={itemVariants}
            className="flex items-center space-x-3"
          >
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg transition-all duration-200 relative"
                style={{
                  background: "var(--bg-glass)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              >
                <Bell className="h-5 w-5" />
                <div
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                  style={{ background: "var(--color-info)" }}
                />
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 w-80 rounded-xl shadow-xl p-4 z-50"
                    style={{
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-primary)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4
                        className="font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Notifications
                      </h4>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="transition-colors"
                        style={{ color: "var(--text-secondary)" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "var(--text-primary)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color =
                            "var(--text-secondary)")
                        }
                      >
                        <span className="text-xs">✕</span>
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div
                        className="p-3 rounded-lg"
                        style={{
                          background: "var(--color-success)" + "20",
                          border: "1px solid " + "var(--color-success)" + "30",
                        }}
                      >
                        <div
                          className="text-sm font-medium"
                          style={{ color: "var(--color-success)" }}
                        >
                          Objectif atteint!
                        </div>
                        <div
                          className="text-xs"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Vous avez atteint 75% de votre objectif vacances
                        </div>
                      </div>
                      <div
                        className="p-3 rounded-lg"
                        style={{
                          background: "var(--color-warning)" + "20",
                          border: "1px solid " + "var(--color-warning)" + "30",
                        }}
                      >
                        <div
                          className="text-sm font-medium"
                          style={{ color: "var(--color-warning)" }}
                        >
                          Alerte budget
                        </div>
                        <div
                          className="text-xs"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Vos dépenses restaurants dépassent la moyenne
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Export/Import */}
            <div className="flex space-x-2">
              <button
                onClick={handleExport}
                className="p-2 rounded-lg transition-all duration-200"
                style={{
                  background: "var(--bg-glass)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                }}
                title="Exporter les données"
              >
                <Download className="h-5 w-5" />
              </button>

              <button
                onClick={handleImport}
                className="p-2 rounded-lg transition-all duration-200"
                style={{
                  background: "var(--bg-glass)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                }}
                title="Importer des données"
              >
                <Upload className="h-5 w-5" />
              </button>
            </div>

            {/* User Menu - Simplifié */}
            <div
              className="flex items-center space-x-2 p-2 rounded-lg"
              style={{
                background: "var(--bg-glass)",
                border: "1px solid var(--border-primary)",
              }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-financial-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="text-sm">
                <div
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Utilisateur
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Status Bar */}
        <motion.div
          variants={itemVariants}
          className="px-6 py-2"
          style={{
            background: "var(--bg-tertiary)",
            borderTop: "1px solid var(--border-primary)",
          }}
        >
          <div
            className="flex items-center justify-between text-xs"
            style={{ color: "var(--text-tertiary)" }}
          >
            <div className="flex items-center space-x-2">
              <Globe className="h-3 w-3" />
              <span>Données stockées localement</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-3 w-3" style={{ color: "var(--color-success)" }} />
              <span>100% Local</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
