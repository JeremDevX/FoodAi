"use client";

import { useFinanceStore } from "@/lib/store";
import { useFormatCurrency } from "@/lib/utils";
import { useTheme } from "@/components/Theme/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Target,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#f97316",
  "#6b7280",
];

const getAccessibleBgColor = (theme: string) => {
  // Utiliser les variables CSS du thème au lieu des couleurs en dur
  return "glass-card";
};

const getAccessibleTextColor = (theme: string) => {
  // Utiliser les variables CSS du thème
  return "";
};

export default function UltimateMonthlyOverview() {
  const { getMonthlyStats, getCategoryStats } = useFinanceStore();
  const { theme } = useTheme();
  const formatCurrency = useFormatCurrency();
  const stats = getMonthlyStats();
  const categoryStats = getCategoryStats();
  const [selectedView, setSelectedView] = useState<
    "overview" | "categories" | "trends"
  >("overview");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
      },
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
      transition: {
        duration: 0.2,
        ease: "easeInOut" as const,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
      },
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
      transition: {
        duration: 0.2,
        ease: "easeInOut" as const,
      },
    },
  };

  // Prepare data for charts
  const chartData = categoryStats.slice(0, 6).map((stat, index) => ({
    category: stat.category,
    amount: stat.amount,
    color: COLORS[index % COLORS.length],
    percentage: stat.percentage,
  }));

  const monthlyTrends = [
    { month: "Jan", income: 2500, expenses: 1800 },
    { month: "Fév", income: 2650, expenses: 1950 },
    { month: "Mar", income: stats.income, expenses: stats.expenses },
  ];

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    trend,
    delay = 0,
  }: {
    title: string;
    value: string;
    icon: any;
    color: string;
    trend?: "up" | "down" | "stable";
    delay?: number;
  }) => (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{ delay }}
      className="glass-card transition-all duration-200 relative overflow-hidden p-6"
      style={{
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
      }}
    >
      {/* Subtle background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5`}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div
            className="p-3 rounded-lg"
            style={{ background: "var(--bg-glass)" }}
          >
            <Icon className="h-6 w-6" style={{ color: "var(--text-accent)" }} />
          </div>
          {trend && (
            <motion.div
              className="p-2 rounded-full"
              style={{
                background:
                  trend === "up"
                    ? "rgba(16, 185, 129, 0.1)"
                    : trend === "down"
                    ? "rgba(239, 68, 68, 0.1)"
                    : "rgba(100, 116, 139, 0.1)",
                color:
                  trend === "up"
                    ? "var(--color-success)"
                    : trend === "down"
                    ? "var(--color-danger)"
                    : "var(--text-tertiary)",
              }}
              whileHover={{ scale: 1.1 }}
            >
              {trend === "up" ? (
                <TrendingUp className="h-4 w-4" />
              ) : trend === "down" ? (
                <TrendingDown className="h-4 w-4" />
              ) : (
                <div className="w-4 h-4 bg-current rounded-full" />
              )}
            </motion.div>
          )}
        </div>

        <div>
          <div
            className="text-base font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            {title}
          </div>
          <div
            className="text-3xl font-bold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            {value}
          </div>
        </div>

        {/* Simple progress bar */}
        <div
          className="mt-4 h-2 rounded-full overflow-hidden"
          style={{ background: "var(--bg-tertiary)" }}
        >
          <div
            className={`h-full bg-gradient-to-r ${color} rounded-full`}
            style={{ width: "75%", transition: "width 0.5s ease-out" }}
          />
        </div>
      </div>
    </motion.div>
  );

  const ChartCard = ({
    title,
    children,
    delay = 0,
    className = "",
  }: {
    title: string;
    children: React.ReactNode;
    delay?: number;
    className?: string;
  }) => (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{ delay }}
      className={`glass-card p-6 ${className}`}
      style={{
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
      }}
    >
      <h3
        className="text-xl font-semibold mb-6"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h3>
      {children}
    </motion.div>
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header with View Selector */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between"
      >
        <div>
          <h2
            className="text-3xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Vue Mensuelle
          </h2>
          <p className="mt-1" style={{ color: "var(--text-secondary)" }}>
            Analyse détaillée de vos finances
          </p>
        </div>

        <div
          className="flex space-x-2 p-1 rounded-xl"
          style={{ background: "var(--bg-glass)" }}
        >
          {[
            { id: "overview", name: "Aperçu", icon: Zap },
            { id: "categories", name: "Catégories", icon: Target },
            { id: "trends", name: "Tendances", icon: TrendingUp },
          ].map((view) => {
            const Icon = view.icon;
            return (
              <button
                key={view.id}
                onClick={() => setSelectedView(view.id as any)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200"
                style={{
                  background:
                    selectedView === view.id
                      ? "var(--bg-secondary)"
                      : "transparent",
                  color:
                    selectedView === view.id
                      ? "var(--text-accent)"
                      : "var(--text-secondary)",
                  boxShadow:
                    selectedView === view.id
                      ? "0 2px 8px rgba(0,0,0,0.1)"
                      : "none",
                }}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{view.name}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Overview Stats */}
      {selectedView === "overview" && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
        >
          <StatCard
            title="Revenus du mois"
            value={formatCurrency(stats.income)}
            icon={TrendingUp}
            color="from-success to-emerald-500"
            trend="up"
            delay={0.1}
          />

          <StatCard
            title="Dépenses du mois"
            value={formatCurrency(stats.expenses)}
            icon={TrendingDown}
            color="from-danger to-red-500"
            trend="down"
            delay={0.2}
          />

          <StatCard
            title="Solde net"
            value={formatCurrency(stats.balance)}
            icon={DollarSign}
            color={
              stats.balance >= 0
                ? "from-success to-emerald-500"
                : "from-danger to-red-500"
            }
            trend={stats.balance >= 0 ? "up" : "down"}
            delay={0.3}
          />
        </motion.div>
      )}

      {/* Categories View */}
      {selectedView === "categories" && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          <ChartCard title="Répartition par Catégorie" delay={0.1}>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="amount"
                    label={({ name, percent }) =>
                      `${name} (${((percent || 0) * 100).toFixed(1)}%)`
                    }
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Top Dépenses" delay={0.2}>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {chartData.map((item, index) => (
                <motion.div
                  key={item.category}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-lg ${getAccessibleBgColor(
                    theme
                  )}`}
                  style={{
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span
                      className={`font-medium ${getAccessibleTextColor(theme)}`}
                    >
                      {item.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-semibold ${getAccessibleTextColor(
                        theme
                      )}`}
                    >
                      {formatCurrency(item.amount)}
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {item.percentage.toFixed(1)}%
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ChartCard>
        </motion.div>
      )}

      {/* Trends View */}
      {selectedView === "trends" && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <ChartCard title="Évolution Mensuelle" delay={0.1} className="h-96">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyTrends}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(0,0,0,0.1)"
                  />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: "#10b981", strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ fill: "#ef4444", strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: "#ef4444", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>
      )}

      {/* Additional Insights */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="glass-card p-6"
          style={{
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          }}
        >
          <div className="flex items-center space-x-4 mb-4">
            <div
              className="p-3 rounded-lg"
              style={{ background: "var(--bg-glass)" }}
            >
              <Calendar
                className="h-6 w-6"
                style={{ color: "var(--text-accent)" }}
              />
            </div>
            <h4
              className="font-semibold text-lg"
              style={{ color: "var(--text-primary)" }}
            >
              Période Actuelle
            </h4>
          </div>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)", opacity: 0.8 }}
          >
            Données du mois en cours. Comparez avec les mois précédents pour
            identifier les tendances.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="glass-card p-6"
          style={{
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          }}
        >
          <div className="flex items-center space-x-4 mb-4">
            <div
              className="p-3 rounded-lg"
              style={{ background: "var(--bg-glass)" }}
            >
              <Target
                className="h-6 w-6"
                style={{ color: "var(--color-success)" }}
              />
            </div>
            <h4
              className="font-semibold text-lg"
              style={{ color: "var(--text-primary)" }}
            >
              Objectif
            </h4>
          </div>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)", opacity: 0.8 }}
          >
            Maintenez un ratio épargne/revenus de 20% pour une santé financière
            optimale.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="glass-card p-6"
          style={{
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          }}
        >
          <div className="flex items-center space-x-4 mb-4">
            <div
              className="p-3 rounded-lg"
              style={{ background: "var(--bg-glass)" }}
            >
              <Zap
                className="h-6 w-6"
                style={{ color: "var(--color-warning)" }}
              />
            </div>
            <h4
              className="font-semibold text-lg"
              style={{ color: "var(--text-primary)" }}
            >
              Conseil
            </h4>
          </div>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)", opacity: 0.8 }}
          >
            {stats.balance > 0
              ? "Excellent ! Vous épargnez plus que vous ne dépensez. Continuez ainsi !"
              : "Attention à vos dépenses. Essayez de réduire les achats non essentiels."}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
