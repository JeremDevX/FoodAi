"use client";

import { useFinanceStore } from "@/lib/store";
import { useTheme } from "@/components/Theme/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Download,
  Upload,
  Settings,
  Bell,
  Search,
  User,
  Sparkles,
  Clock,
  Globe,
  Zap,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { formatShortDate } from "@/lib/utils";

export default function UltimateHeader() {
  const { selectedDateRange, setDateRange } = useFinanceStore();
  const { theme } = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleQuickDateSelect = (type: "current" | "previous" | "next") => {
    const now = new Date();
    let start: Date, end: Date;

    switch (type) {
      case "current":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case "previous":
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case "next":
        start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
        break;
    }

    setDateRange(start, end);
    setShowDatePicker(false);
  };

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
          className="absolute inset-0 opacity-3"
          style={{ background: "var(--gradient-primary)" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 py-4">
        <div className="flex items-center justify-between">
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

            {/* Date Range Selector */}
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200"
                style={{
                  background: "var(--bg-glass)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              >
                <Calendar
                  className="h-4 w-4"
                  style={{ color: "var(--text-accent)" }}
                />
                <span className="text-sm font-medium">
                  {formatShortDate(selectedDateRange.start)} -{" "}
                  {formatShortDate(selectedDateRange.end)}
                </span>
                <ChevronRight
                  className="h-4 w-4"
                  style={{
                    transform: showDatePicker ? "rotate(90deg)" : "none",
                    transition: "transform 0.2s",
                  }}
                />
              </button>

              <AnimatePresence>
                {showDatePicker && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-64 rounded-xl shadow-xl p-4 z-50"
                    style={{
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-primary)",
                    }}
                  >
                    <div className="space-y-2">
                      {[
                        { key: "previous", name: "Mois précédent" },
                        { key: "current", name: "Mois en cours" },
                        { key: "next", name: "Mois suivant" },
                      ].map((option) => (
                        <button
                          key={option.key}
                          onClick={() =>
                            handleQuickDateSelect(option.key as any)
                          }
                          className="w-full text-left px-3 py-2 rounded-lg transition-colors"
                          style={{ color: "var(--text-primary)" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              "var(--bg-glass)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          {option.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Section - Actions */}
          <motion.div
            variants={itemVariants}
            className="flex items-center space-x-3"
          >
            {/* Search */}
            <div className="relative">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 z-10"
                  style={{ color: "var(--text-tertiary)" }}
                />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full max-w-xs md:max-w-sm lg:w-64 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{
                    background: "var(--bg-glass)",
                    border: "1px solid var(--border-primary)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>

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

            {/* User Menu */}
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
                <div
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Premium
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
              <Zap className="h-3 w-3" />
              <span>Interface optimisée</span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: "var(--color-success)" }}
              />
              <span>Connecté</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
