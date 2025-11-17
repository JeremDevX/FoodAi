"use client";

import { useFinanceStore } from "@/lib/store";
import { useTheme } from "@/components/Theme/ThemeProvider";
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
  Bell,
  Search,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";

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
  const { currentView, setCurrentView } = useFinanceStore();
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Détecter si on est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsExpanded(false); // Collapser par défaut sur mobile
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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
      {/* Bouton flottant pour réouvrir la sidebar sur mobile */}
      {!isExpanded && isMobile && (
        <motion.button
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsExpanded(true)}
          className="fixed top-4 left-4 z-50 p-3 bg-gradient-to-r from-financial-500 to-blue-500 text-white rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-financial-500 focus:ring-offset-2"
          aria-label="Ouvrir le menu"
        >
          <ChevronRight className="h-6 w-6" />
        </motion.button>
      )}

      <motion.div
        variants={sidebarVariants}
        initial="expanded"
        animate={isExpanded ? "expanded" : "collapsed"}
        className={`relative h-screen overflow-hidden ${isMobile && isExpanded ? 'fixed inset-0 z-50 md:relative md:z-auto' : ''}`}
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
          <div className="flex items-center justify-between mb-4">
            {isMobile && isExpanded && (
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-financial-500"
                aria-label="Fermer le menu"
              >
                <ChevronRight className="h-5 w-5 rotate-180" />
              </button>
            )}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-financial-500 to-blue-500 rounded-full blur-lg opacity-75" />
                <div
                  className="relative p-3 rounded-full"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-primary)",
                  }}
                >
                  <PiggyBank className="h-8 w-8 text-financial-400" />
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
                      className="text-2xl font-bold"
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
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-financial-500 focus:ring-offset-2"
              style={{ color: "var(--text-secondary)" }}
              aria-label={isExpanded ? "Réduire le menu" : "Étendre le menu"}
              aria-expanded={isExpanded}
            >
              <ChevronRight
                className={`h-5 w-5 transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </motion.button>
          </div>

          {/* Search Bar */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative"
              >
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                  style={{ color: "var(--text-tertiary)" }}
                />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-financial-500 focus:border-transparent backdrop-blur-sm"
                  style={{
                    background: "var(--bg-glass)",
                    border: "1px solid var(--border-primary)",
                    color: "var(--text-primary)",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <motion.button
                key={item.id}
                variants={itemVariants}
                custom={index + 1}
                onClick={() => setCurrentView(item.id as any)}
                className="relative w-full flex items-center p-3 rounded-xl transition-all duration-200 group"
                style={{
                  background: isActive ? "var(--bg-glass)" : "transparent",
                  color: isActive
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                  border: isActive ? "1px solid var(--border-primary)" : "none",
                }}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-financial-500 to-blue-500 rounded-l-xl"
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
              </motion.button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          {/* Quick Actions */}
          <div className="space-y-2 mb-4">
            <motion.button
              variants={itemVariants}
              custom={menuItems.length + 1}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center p-3 bg-gradient-to-r from-financial-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-financial-500 focus:ring-offset-2"
              aria-label="Ajouter une nouvelle opération"
            >
              <Plus className="h-5 w-5" />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="ml-2 text-sm font-medium overflow-hidden"
                  >
                    Ajouter une opération
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* User Profile */}
          <motion.div
            variants={itemVariants}
            custom={menuItems.length + 2}
            className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl backdrop-blur-sm"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-financial-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800" />
            </div>

            <AnimatePresence>
              {isExpanded && (
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
              )}
            </AnimatePresence>
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
              <span>100% local & privé</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        className="fixed bottom-6 left-6 p-4 bg-gradient-to-r from-financial-500 to-blue-500 text-white rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-financial-500 focus:ring-offset-2"
        onClick={() => setCurrentView("transactions")}
        aria-label="Accéder aux transactions"
      >
        <Plus className="h-6 w-6" />
      </motion.button>
    </motion.div>
    </>
  );
}
