"use client";

import { useTheme } from "@/components/Theme/ThemeProvider";
import { useFinanceStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Upload,
  Bell,
  Wallet,
  PiggyBank,
  ChevronDown,
  X,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { formatShortDate, useFormatCurrency } from "@/lib/utils";

export default function UltimateHeader() {
  const { theme } = useTheme();
  const formatCurrency = useFormatCurrency();
  const {
    transactions,
    selectedAccount,
    setSelectedAccount,
    accounts,
    getAccountBalance,
  } = useFinanceStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  // Dédupliquer les comptes basé sur le nom
  const uniqueAccounts = useMemo(() => {
    const seen = new Set<string>();
    return accounts.filter((account) => {
      if (seen.has(account.name)) {
        return false;
      }
      seen.add(account.name);
      return true;
    });
  }, [accounts]);

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
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
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
          alert("Erreur lors de l'importation du fichier");
          console.error("Import error:", error);
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
    <header
      className="sticky top-0 z-[100] backdrop-blur-md"
      style={{
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border-primary)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="relative">
        {/* Gradient Background */}
        <div
          className="absolute inset-0 opacity-5"
          style={{ background: "var(--gradient-primary)" }}
        />

        {/* Main Header Content */}
        <div className="relative z-10 px-6 py-3">
          <div className="flex items-center justify-between gap-6">
            {/* Left: Brand & Time */}
            <div className="flex items-center space-x-6">
              {/* Brand */}
              <div className="flex items-center space-x-3" role="banner">
                {/* Premium Logo with Layered Design */}
                <div className="relative group">
                  {/* Outer glow ring */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-accent), var(--color-financial-light))",
                      filter: "blur(12px)",
                    }}
                  />

                  {/* Main logo container */}
                  <div
                    className="relative w-11 h-11 rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105"
                    style={{
                      background: "var(--bg-tertiary)",
                      border: "2px solid var(--border-primary)",
                      boxShadow:
                        "inset 0 2px 8px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.05)",
                    }}
                    aria-hidden="true"
                  >
                    {/* Gradient overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))",
                      }}
                    />

                    {/* Icon with subtle shadow */}
                    <div className="relative z-10">
                      <Wallet
                        className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12"
                        style={{
                          color: "var(--text-accent)",
                          filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))",
                        }}
                      />
                    </div>

                    {/* Shine effect on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background:
                          "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div
                    className="text-lg font-bold tracking-tight"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Finance Manager
                  </div>
                  <div
                    className="text-xs font-medium"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {currentTime.toLocaleDateString("fr-FR", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    •{" "}
                    {currentTime.toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Account Selector & Actions */}
            <div className="flex items-center space-x-3">
              {/* Account Selector */}
              <div className="relative z-[200]">
                <button
                  onClick={() => {
                    setShowAccountDropdown(!showAccountDropdown);
                    setShowNotifications(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 hover:scale-105"
                  style={{
                    background: "var(--bg-glass)",
                    border: "1px solid var(--border-primary)",
                  }}
                  aria-label={`Sélecteur de compte: ${selectedAccount}, solde ${formatCurrency(
                    getAccountBalance(selectedAccount)
                  )}`}
                  aria-expanded={showAccountDropdown}
                  aria-haspopup="true"
                >
                  {selectedAccount === "Compte Courant" ? (
                    <Wallet
                      className="h-5 w-5"
                      style={{ color: "var(--text-accent)" }}
                    />
                  ) : (
                    <PiggyBank
                      className="h-5 w-5"
                      style={{ color: "var(--color-success)" }}
                    />
                  )}
                  <div className="text-left">
                    <div
                      className="text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {selectedAccount}
                    </div>
                    <div
                      className="text-xs font-bold"
                      style={{
                        color:
                          selectedAccount === "Compte Courant"
                            ? "var(--text-accent)"
                            : "var(--color-success)",
                      }}
                    >
                      {formatCurrency(getAccountBalance(selectedAccount))}
                    </div>
                  </div>
                  <ChevronDown
                    className="h-4 w-4 transition-transform"
                    style={{
                      color: "var(--text-tertiary)",
                      transform: showAccountDropdown
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  />
                </button>

                <AnimatePresence>
                  {showAccountDropdown && (
                    <>
                      {/* Backdrop */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[190]"
                        onClick={() => setShowAccountDropdown(false)}
                      />
                      {/* Dropdown */}
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-2 w-80 rounded-xl shadow-2xl p-3 z-[200]"
                        style={{
                          background: "var(--bg-secondary)",
                          border: "1px solid var(--border-primary)",
                        }}
                      >
                        <div className="space-y-2">
                          {uniqueAccounts.map((account) => (
                            <button
                              key={account.id}
                              onClick={() => {
                                setSelectedAccount(account.name);
                                setShowAccountDropdown(false);
                              }}
                              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:scale-[1.02]"
                              style={{
                                background:
                                  selectedAccount === account.name
                                    ? "var(--bg-glass)"
                                    : "transparent",
                                border: `1px solid ${
                                  selectedAccount === account.name
                                    ? "var(--border-primary)"
                                    : "transparent"
                                }`,
                              }}
                            >
                              {account.name === "Compte Courant" ? (
                                <Wallet
                                  className="h-5 w-5"
                                  style={{ color: "var(--text-accent)" }}
                                />
                              ) : (
                                <PiggyBank
                                  className="h-5 w-5"
                                  style={{ color: "var(--color-success)" }}
                                />
                              )}
                              <div className="flex-1 text-left">
                                <div
                                  className="font-medium text-sm"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  {account.name}
                                </div>
                                <div
                                  className="text-xs font-bold"
                                  style={{
                                    color:
                                      account.name === "Compte Courant"
                                        ? "var(--text-accent)"
                                        : "var(--color-success)",
                                  }}
                                >
                                  {formatCurrency(
                                    getAccountBalance(account.name)
                                  )}
                                </div>
                              </div>
                              {selectedAccount === account.name && (
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{ background: "var(--text-accent)" }}
                                />
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Notifications */}
              <div className="relative z-[200]">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowAccountDropdown(false);
                  }}
                  className="p-2.5 rounded-lg transition-all duration-200 relative hover:scale-110"
                  style={{
                    background: "var(--bg-glass)",
                    border: "1px solid var(--border-primary)",
                    color: "var(--text-primary)",
                  }}
                  aria-label="Notifications (2 nouvelles)"
                  aria-expanded={showNotifications}
                  aria-haspopup="true"
                >
                  <Bell className="h-5 w-5" />
                  <div
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse"
                    style={{ background: "var(--color-info)" }}
                  />
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <>
                      {/* Backdrop */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[190]"
                        onClick={() => setShowNotifications(false)}
                      />
                      {/* Dropdown */}
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-2 w-80 rounded-xl shadow-2xl p-4 z-[200]"
                        style={{
                          background: "var(--bg-secondary)",
                          border: "1px solid var(--border-primary)",
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4
                            className="font-semibold"
                            style={{ color: "var(--text-primary)" }}
                          >
                            Notifications
                          </h4>
                          <button
                            onClick={() => setShowNotifications(false)}
                            className="p-1 rounded-lg transition-colors hover:bg-opacity-10"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="space-y-2">
                          <div
                            className="p-3 rounded-lg"
                            style={{
                              background: "rgba(16, 185, 129, 0.1)",
                              border: "1px solid rgba(16, 185, 129, 0.2)",
                            }}
                          >
                            <div
                              className="text-sm font-medium"
                              style={{ color: "var(--color-success)" }}
                            >
                              Objectif atteint!
                            </div>
                            <div
                              className="text-xs mt-1"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              Vous avez atteint 75% de votre objectif vacances
                            </div>
                          </div>
                          <div
                            className="p-3 rounded-lg"
                            style={{
                              background: "rgba(245, 158, 11, 0.1)",
                              border: "1px solid rgba(245, 158, 11, 0.2)",
                            }}
                          >
                            <div
                              className="text-sm font-medium"
                              style={{ color: "var(--color-warning)" }}
                            >
                              Alerte budget
                            </div>
                            <div
                              className="text-xs mt-1"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              Vos dépenses restaurants dépassent la moyenne
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Export */}
              <button
                onClick={handleExport}
                className="p-2.5 rounded-lg transition-all duration-200 hover:scale-110"
                style={{
                  background: "var(--bg-glass)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                }}
                title="Exporter les données"
              >
                <Download className="h-5 w-5" />
              </button>

              {/* Import */}
              <button
                onClick={handleImport}
                className="p-2.5 rounded-lg transition-all duration-200 hover:scale-110"
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
          </div>
        </div>
      </div>
    </header>
  );
}
