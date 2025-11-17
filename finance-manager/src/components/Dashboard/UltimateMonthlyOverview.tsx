"use client";

import { useFinanceStore } from "@/lib/store";
import { useFormatCurrency } from "@/lib/utils";
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

export default function UltimateMonthlyOverview() {
  const { getMonthlyStats, getCategoryStats } = useFinanceStore();
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
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2 },
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
    <div className="glass-card transition-all duration-200 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5`}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div
            className="p-2 rounded-lg"
            style={{ background: "var(--bg-glass)" }}
          >
            <Icon className="h-5 w-5" style={{ color: "var(--text-accent)" }} />
          </div>
          {trend && (
            <div
              className="p-1 rounded-full"
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
            >
              {trend === "up" ? (
                <TrendingUp className="h-4 w-4" />
              ) : trend === "down" ? (
                <TrendingDown className="h-4 w-4" />
              ) : (
                <div className="w-4 h-4 bg-current rounded-full" />
              )}
            </div>
          )}
        </div>

        <div>
          <div
            className="text-sm mb-1"
            style={{ color: "var(--text-secondary)" }}
          >
            {title}
          </div>
          <div
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {value}
          </div>
        </div>

        {/* Simple progress bar */}
        <div
          className="mt-4 h-1 rounded-full overflow-hidden"
          style={{ background: "var(--bg-tertiary)" }}
        >
          <div
            className={`h-full bg-gradient-to-r ${color} rounded-full`}
            style={{ width: "75%", transition: "width 0.5s ease-out" }}
          />
        </div>
      </div>
    </div>
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
      transition={{ delay }}
      className={`glass-card ${className}`}
    >
      <h3
        className="text-lg font-semibold mb-4"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </div>
      )}

      {/* Categories View */}
      {selectedView === "categories" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    label={({ name, percentage }) =>
                      `${name} (${percentage.toFixed(1)}%)`
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
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {chartData.map((item, index) => (
                <motion.div
                  key={item.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-gray-900">
                      {item.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(item.amount)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.percentage.toFixed(1)}%
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ChartCard>
        </div>
      )}

      {/* Trends View */}
      {selectedView === "trends" && (
        <ChartCard title="Évolution Mensuelle" delay={0.1} className="h-96">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyTrends}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
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
      )}

      {/* Additional Insights */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="glass-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-financial-100 rounded-lg">
              <Calendar className="h-5 w-5 text-financial-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Période Actuelle</h4>
          </div>
          <p className="text-gray-600 text-sm">
            Données du mois en cours. Comparez avec les mois précédents pour
            identifier les tendances.
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-success/20 rounded-lg">
              <Target className="h-5 w-5 text-success" />
            </div>
            <h4 className="font-semibold text-gray-900">Objectif</h4>
          </div>
          <p className="text-gray-600 text-sm">
            Maintenez un ratio épargne/revenus de 20% pour une santé financière
            optimale.
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-warning/20 rounded-lg">
              <Zap className="h-5 w-5 text-warning" />
            </div>
            <h4 className="font-semibold text-gray-900">Conseil</h4>
          </div>
          <p className="text-gray-600 text-sm">
            {stats.balance > 0
              ? "Excellent ! Vous épargnez plus que vous ne dépensez. Continuez ainsi !"
              : "Attention à vos dépenses. Essayez de réduire les achats non essentiels."}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
