import React from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
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
import "./Analytics.css";

const Analytics: React.FC = () => {
  const {
    wasteStats,
    aiReliability,
    wasteEvolution,
    savingsEvolution,
    criticalProducts,
  } = MOCK_ANALYTICS;

  return (
    <div className="analytics-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Analytics & Gaspillage</h1>
          <p className="page-subtitle">Suivi des performances et du ROI</p>
        </div>
        <div className="flex gap-sm">
          <Button variant="outline" size="sm">
            Personnaliser
          </Button>
          <Button size="sm" icon={<Download size={16} />}>
            Rapport AGEC 2025
          </Button>
        </div>
      </header>

      <div className="analytics-grid">
        {/* Waste Stats */}
        <Card title="📉 Gaspillage Alimentaire">
          <div className="kpi-row">
            <div>
              <span className="kpi-label">Total ce mois</span>
              <div className="kpi-value red">{wasteStats.totalWasteKg} kg</div>
            </div>
            <span className="trend-pill positive">
              -{wasteStats.monthlyTrend}%
            </span>
          </div>
          <div className="kpi-row">
            <div>
              <span className="kpi-label">Grammes / Couvert</span>
              <div className="kpi-value">{wasteStats.wastePerMealGram}g</div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-secondary text-xs">Cible</span>
              <span className="font-semibold text-optimal">
                {wasteStats.targetWastePerMealGram}g
              </span>
            </div>
          </div>

          <div className="chart-wrapper">
            <h4 className="text-sm font-semibold mb-2 text-secondary">
              Évolution Semaine (Réel vs Cible)
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={wasteEvolution}>
                <XAxis
                  dataKey="name"
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar
                  dataKey="waste"
                  fill="#C0152F"
                  radius={[4, 4, 0, 0]}
                  name="Gaspillage (kg)"
                />
                <Bar
                  dataKey="target"
                  fill="#E6C2AD"
                  radius={[4, 4, 0, 0]}
                  name="Cible"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* AI Performance */}
        <Card title="🤖 Fiabilité de l'IA">
          <div className="kpi-row">
            <div>
              <span className="kpi-label">Prédictions Correctes</span>
              <div className="kpi-value green">
                {aiReliability.correctPredictions}%
              </div>
            </div>
            <Brain size={24} className="text-primary" />
          </div>

          <div className="chart-wrapper">
            <h4 className="text-sm font-semibold mb-2 text-secondary">
              Tendance Précision (4 Semaines)
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={aiReliability.monthlyTrend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#eee"
                />
                <XAxis
                  dataKey="name"
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#218083"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-3 text-secondary">
              Produits Critiques
            </h4>
            <div className="product-perf-list">
              {criticalProducts.map((prod, idx) => (
                <div key={idx} className="product-perf-item">
                  <span className="font-medium text-sm">{prod.name}</span>
                  <div className="flex items-center gap-sm">
                    <span className="text-xs text-secondary">
                      {prod.accuracy}% préc.
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

        {/* ROI / Savings */}
        <div className="col-span-2 grid grid-cols-2 gap-md">
          <ROISimulator />
          <Card className="h-full">
            <h3 className="section-title flex items-center gap-sm">
              <Target size={20} className="text-optimal" /> Total Économies
            </h3>
            <div className="grid grid-cols-2 gap-xl items-center">
              <div className="savings-summary">
                <span className="text-secondary uppercase text-xs font-bold tracking-wider">
                  Cumulé depuis le début
                </span>
                <span className="big-saving">4 840 €</span>
                <div className="roi-badge">ROI: +4346%</div>
                <p className="text-xs text-secondary mt-2 w-2/3 text-center">
                  Basé sur la réduction du gaspillage et l'optimisation des
                  stocks comparé à la période N-1.
                </p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={savingsEvolution}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#228B5B"
                      strokeWidth={4}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
