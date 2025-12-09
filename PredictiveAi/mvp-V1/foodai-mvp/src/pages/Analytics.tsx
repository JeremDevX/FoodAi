import React, { useState } from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import ExportReportModal from "../components/analytics/ExportReportModal";
import CustomizeAnalyticsModal from "../components/analytics/CustomizeAnalyticsModal";
import { Download, Target, Brain } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { MOCK_ANALYTICS } from "../utils/mockData";
import ROISimulator from "../components/analytics/ROISimulator";
import { useToast } from "../context/ToastContext";
import "./Analytics.css";

const Analytics: React.FC = () => {
  const { addToast } = useToast();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);

  const handleExport = (format: string, period: string) => {
    addToast(
      "success",
      "Rapport généré",
      `Rapport AGEC ${period} exporté en ${format.toUpperCase()}. Téléchargement en cours...`
    );
  };

  const handleSaveSettings = (_settings: any) => {
    addToast(
      "success",
      "Paramètres enregistrés",
      "Vos préférences d'affichage ont été mises à jour."
    );
  };

  const {
    wasteStats,
    aiReliability,
    wasteEvolution,
    savingsEvolution,
    criticalProducts,
  } = MOCK_ANALYTICS;

  return (
    <div className="analytics-container">
      <header className="page-header glass-header">
        <div>
          <h1 className="page-title">Analytics & Gaspillage</h1>
          <p className="page-subtitle">Suivi des performances et du ROI</p>
        </div>
        <div className="flex gap-sm">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCustomizeModalOpen(true)}
          >
            Personnaliser
          </Button>
          <Button
            size="sm"
            icon={<Download size={16} />}
            onClick={() => setIsExportModalOpen(true)}
          >
            Rapport AGEC 2025
          </Button>
        </div>
      </header>

      <div className="analytics-grid">
        {/* Waste Stats - Enhanced */}
        <Card title="📉 Gaspillage Alimentaire" className="stat-card">
          <div className="metric-comparison">
            <div className="metric-item">
              <div className="metric-item-label">Total ce mois</div>
              <div className="kpi-value red" style={{ fontSize: "2rem" }}>
                {wasteStats.totalWasteKg} kg
              </div>
              <div className="trend-pill positive" style={{ marginTop: "8px" }}>
                ↓ {wasteStats.monthlyTrend}% vs mois dernier
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-item-label">Par couvert</div>
              <div className="kpi-value" style={{ fontSize: "2rem" }}>
                {wasteStats.wastePerMealGram}g
              </div>
              <div className="text-xs text-secondary mt-2">
                Cible:{" "}
                <strong className="text-optimal">
                  {wasteStats.targetWastePerMealGram}g
                </strong>
              </div>
            </div>
          </div>

          <div className="chart-wrapper">
            <h4>Évolution Hebdomadaire</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={wasteEvolution}>
                <XAxis
                  dataKey="name"
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    background: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar
                  dataKey="waste"
                  fill="url(#wasteGradient)"
                  radius={[8, 8, 0, 0]}
                  name="Gaspillage (kg)"
                />
                <Bar
                  dataKey="target"
                  fill="#E6C2AD"
                  radius={[8, 8, 0, 0]}
                  name="Cible"
                  opacity={0.6}
                />
                <defs>
                  <linearGradient
                    id="wasteGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#E63946" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#C0152F" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* AI Performance - Enhanced */}
        <Card title="🤖 Performance de l'IA" className="stat-card">
          <div className="stat-card-header">
            <div>
              <span className="kpi-label">Précision Globale</span>
              <div className="kpi-value green">
                {aiReliability.correctPredictions}%
              </div>
              <div className="text-xs text-secondary mt-2">
                Basé sur {Math.floor(Math.random() * 500 + 1000)} prédictions
              </div>
            </div>
            <div className="stat-card-icon">
              <Brain size={28} />
            </div>
          </div>

          <div className="chart-wrapper">
            <h4>Évolution de la Précision (4 Semaines)</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={aiReliability.monthlyTrend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey="name"
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[70, 100]}
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="url(#aiGradient)"
                  strokeWidth={4}
                  dot={{
                    r: 6,
                    fill: "#218083",
                    strokeWidth: 2,
                    stroke: "white",
                  }}
                  activeDot={{ r: 8 }}
                />
                <defs>
                  <linearGradient id="aiGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#218083" stopOpacity={1} />
                    <stop offset="100%" stopColor="#22C55E" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-3 text-secondary uppercase tracking-wide">
              Produits à Surveiller
            </h4>
            <div className="product-perf-list">
              {criticalProducts.map((prod, idx) => (
                <div key={idx} className="product-perf-item">
                  <span className="font-medium text-sm">{prod.name}</span>
                  <div className="flex items-center gap-sm">
                    <span className="text-xs text-secondary font-semibold">
                      {prod.accuracy}%
                    </span>
                    <div className="accuracy-bar-bg">
                      <div
                        className="accuracy-bar-fill"
                        style={{ width: `${prod.accuracy}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Total Économies - Now more prominent */}
        <Card className="stat-card">
          <h3 className="section-title flex items-center gap-sm">
            <Target size={20} className="text-optimal" /> Total Économies
          </h3>
          <div className="savings-summary">
            <span className="text-secondary uppercase text-xs font-bold tracking-wider">
              Cumulé depuis le début
            </span>
            <span className="big-saving">4 840 €</span>
            <div className="roi-badge">ROI: +4346%</div>
            <p className="text-xs text-secondary mt-2 text-center max-w-xs">
              Basé sur la réduction du gaspillage et l'optimisation des stocks
              comparé à la période N-1.
            </p>
          </div>
          <div className="chart-wrapper mt-4">
            <h4>Évolution des Économies</h4>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={savingsEvolution}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  fontSize={10}
                />
                <YAxis axisLine={false} tickLine={false} fontSize={10} />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="url(#savingsGradient)"
                  strokeWidth={4}
                  dot={{
                    r: 5,
                    fill: "#228B5B",
                    strokeWidth: 2,
                    stroke: "white",
                  }}
                  activeDot={{ r: 8 }}
                />
                <defs>
                  <linearGradient
                    id="savingsGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor="#228B5B" stopOpacity={1} />
                    <stop offset="100%" stopColor="#22C55E" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* ROI Simulator - Full width */}
        <div className="col-span-2">
          <ROISimulator />
        </div>
      </div>

      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />

      <CustomizeAnalyticsModal
        isOpen={isCustomizeModalOpen}
        onClose={() => setIsCustomizeModalOpen(false)}
        onSave={handleSaveSettings}
      />
    </div>
  );
};

export default Analytics;
