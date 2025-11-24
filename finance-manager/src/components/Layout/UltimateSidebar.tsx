"use client";

import { useTheme } from "@/components/Theme/ThemeProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Receipt,
  Target,
  BarChart3,
  Settings,
  PiggyBank,
  Sparkles,
  ChevronRight,
  Plus,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import UltimateTransactionForm from "@/components/Transactions/UltimateTransactionForm";

const menuItems = [
  {
    id: "dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "transactions",
    label: "Transactions",
    icon: Receipt,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "goals",
    label: "Objectifs",
    icon: Target,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "analytics",
    label: "Analyses",
    icon: BarChart3,
    color: "from-orange-500 to-red-500",
  },
  {
    id: "settings",
    label: "Paramètres",
    icon: Settings,
    color: "from-gray-500 to-slate-600",
  },
];

export default function UltimateSidebar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  // Détecter si on est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsExpanded(false); // Collapser par défaut sur mobile
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.2,
      },
    }),
  };

  return (
    <>
      <motion.div
        variants={sidebarVariants}
        initial="expanded"
        animate={isExpanded ? "expanded" : "collapsed"}
        className={`relative h-screen overflow-hidden ${
          isMobile && isExpanded
            ? "fixed inset-0 z-50 md:relative md:z-auto"
            : ""
        }`}
        style={{
          background: "var(--bg-primary)",
          borderRight: "1px solid var(--border-primary)",
        }}
      >
        {/* Subtle Background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-5"
            style={{ background: "var(--gradient-primary)" }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <motion.div
            variants={itemVariants}
            custom={0}
            className="p-6"
            style={{ borderBottom: "1px solid var(--border-primary)" }}
          >
            <div
              className={`flex items-center mb-4 ${
                isExpanded ? "space-x-3" : "justify-center"
              }`}
            >
              {/* Premium Logo Design */}
              <div className="relative group">
                {/* Outer glow - subtle */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-financial), var(--color-financial-light))",
                    filter: "blur(16px)",
                  }}
                />

                {/* Main container with premium styling */}
                <div
                  className="relative rounded-2xl overflow-hidden transition-all duration-300 group-hover:scale-105"
                  style={{
                    background: "var(--bg-tertiary)",
                    border: "2px solid var(--border-primary)",
                    boxShadow:
                      "inset 0 2px 12px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.08)",
                  }}
                >
                  {/* Gradient overlay for depth */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(139, 92, 246, 0.12))",
                    }}
                  />

                  {/* Icon container */}
                  <div className="relative p-3">
                    <PiggyBank
                      className="h-8 w-8 transition-transform duration-300 group-hover:rotate-12"
                      style={{
                        color: "var(--text-accent)",
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                      }}
                    />
                  </div>

                  {/* Shine effect on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
                    }}
                  />
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden"
                  >
                    <h2
                      className="text-2xl font-bold tracking-tight"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Finance
                    </h2>
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Gestionnaire Financier
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Navigation */}
          <nav
            className="flex-1 px-4 py-6 space-y-2"
            aria-label="Navigation principale"
          >
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive =
                pathname === `/${item.id}` ||
                (item.id === "dashboard" && pathname === "/");

              return (
                <Link
                  key={item.id}
                  href={`/${item.id}`}
                  className="relative w-full flex items-center p-3 rounded-xl transition-all duration-200 group"
                  style={{
                    background: isActive ? "var(--bg-glass)" : "transparent",
                    color: isActive
                      ? "var(--text-primary)"
                      : "var(--text-secondary)",
                    border: isActive
                      ? "1px solid var(--border-primary)"
                      : "none",
                  }}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                      style={{
                        background:
                          "linear-gradient(to bottom, var(--color-financial), var(--color-financial-light))",
                      }}
                    />
                  )}

                  {/* Icon */}
                  <div className="relative">
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Label */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="ml-4 text-sm font-medium overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Chevron for active item */}
                  {isActive && isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="ml-auto"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </motion.div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bouton Ajouter une opération */}
          <AnimatePresence>
            {isExpanded ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="px-4 py-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowTransactionForm(true);
                  }}
                  className="w-full flex items-center justify-center p-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-financial), var(--color-financial-light))",
                    color: "white",
                    fontWeight: "500",
                  }}
                  aria-label="Ajouter une nouvelle opération"
                >
                  <Plus className="h-5 w-5" />
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="ml-2 text-sm font-medium overflow-hidden"
                  >
                    Ajouter une opération
                  </motion.span>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="px-4 py-4 flex justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setShowTransactionForm(true);
                  }}
                  className="p-3 rounded-xl shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-financial), var(--color-financial-light))",
                    color: "white",
                  }}
                  aria-label="Ajouter une nouvelle opération"
                >
                  <Plus className="h-6 w-6" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bouton de contrôle de la sidebar - juste avant le footer */}
          <div className="px-4 pb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className={`w-full flex items-center justify-center p-3 rounded-xl transition-all duration-300 shadow-md ${
                isExpanded ? "" : "mx-auto"
              }`}
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-primary)",
                color: "var(--text-accent)",
                maxWidth: isExpanded ? "100%" : "48px",
              }}
              aria-label={isExpanded ? "Réduire le menu" : "Agrandir le menu"}
            >
              <ChevronRight
                className={`h-5 w-5 transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="ml-2 text-sm font-medium overflow-hidden whitespace-nowrap"
                  >
                    Réduire le menu
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Footer - Toujours visible */}
          <div className="p-4 border-t border-white/10">
            {isExpanded ? (
              /* Version ouverte avec texte */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* User Profile */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  variants={itemVariants}
                  custom={menuItems.length + 2}
                  className="flex items-center space-x-3 p-3 rounded-xl backdrop-blur-sm"
                  style={{ background: "var(--bg-secondary)" }}
                >
                  <div className="relative">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: "var(--bg-glass)" }}
                    >
                      <User
                        className="h-5 w-5"
                        style={{ color: "var(--text-accent)" }}
                      />
                    </div>
                    <div
                      className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2"
                      style={{
                        background: "var(--color-success)",
                        borderColor: "var(--bg-primary)",
                      }}
                    />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Utilisateur
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      En ligne
                    </div>
                  </motion.div>
                </motion.div>

                {/* Privacy Notice */}
                <motion.div
                  variants={itemVariants}
                  custom={menuItems.length + 3}
                  className="mt-4 text-center"
                >
                  <div
                    className="flex items-center justify-center space-x-1 text-xs"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>100% local &amp; privé</span>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              /* Version fermée - icônes seulement */
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center space-y-4"
              >
                {/* User Profile Icon */}
                <div className="relative">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: "var(--bg-glass)" }}
                  >
                    <User
                      className="h-5 w-5"
                      style={{ color: "var(--text-accent)" }}
                    />
                  </div>
                  <div
                    className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2"
                    style={{
                      background: "var(--color-success)",
                      borderColor: "var(--bg-primary)",
                    }}
                  />
                </div>

                {/* Privacy Icon */}
                <div
                  className="p-2 rounded-lg"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  <Sparkles className="h-4 w-4" />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Modal d'ajout de transaction */}
      {showTransactionForm && (
        <UltimateTransactionForm
          onClose={() => setShowTransactionForm(false)}
          onSave={() => {
            setShowTransactionForm(false);
            // Rafraîchir les données si nécessaire
          }}
        />
      )}
    </>
  );
}
