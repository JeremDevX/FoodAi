import React from "react";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import { useToast } from "../context/ToastContext";
import {
  TrendingUp,
  DollarSign,
  Users,
  AlertTriangle,
  ShoppingBag,
  Calendar,
  FileText,
  ChefHat,
  Zap,
} from "lucide-react";
import { MOCK_PREDICTIONS } from "../utils/mockData";
import OrderGenerator from "../components/dashboard/OrderGenerator";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const [showOrderGenerator, setShowOrderGenerator] = React.useState(false);
  const { addToast } = useToast();

  const handleScanInvoice = () => {
    addToast(
      "info",
      "Analyse en cours...",
      "Traitement de la facture Rungis #FAC-2024..."
    );
    setTimeout(() => {
      addToast(
        "success",
        "Analyse Terminée",
        "12 produits identifiés et stocks mis à jour."
      );
    }, 2000);
  };

  const handleMenuGen = () => {
    addToast(
      "success",
      "Menu du Jour Généré",
      "Basé sur les stocks à date courte (Tomates, Mozza). Envoyé à l'imprimante."
    );
  };

  // Advanced Mock Data for Composed Chart
  const data = [
    { name: "Lun", revenue: 4000, reservations: 120, consumption: 45 },
    { name: "Mar", revenue: 3000, reservations: 80, consumption: 32 },
    { name: "Mer", revenue: 5500, reservations: 160, consumption: 68 },
    { name: "Jeu", revenue: 4500, reservations: 110, consumption: 51 },
    { name: "Ven", revenue: 8000, reservations: 210, consumption: 85 },
    { name: "Sam", revenue: 9500, reservations: 240, consumption: 105 },
    { name: "Dim", revenue: 7000, reservations: 190, consumption: 78 },
  ];

  const todayDate = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="dashboard-container">
      <header className="page-header glass-header">
        <div>
          <h1 className="page-title text-2xl">Bienvenue, Jean ! 👋</h1>
          <p className="page-subtitle flex items-center gap-2">
            <Calendar size={14} /> {todayDate} • Paris • ☀️ 18°C
          </p>
        </div>
        <div className="header-actions">
          {/* Quick Actions Toolbar */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<FileText size={14} />}
              onClick={handleScanInvoice}
            >
              Scanner Facture
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<ChefHat size={14} />}
              onClick={handleMenuGen}
            >
              Menu du Jour
            </Button>
          </div>
        </div>
      </header>

      {/* KPI Section 2.0 */}
      <div className="kpi-grid">
        <Card className="kpi-card hover-lift">
          <div className="flex justify-between items-start mb-2">
            <div className="kpi-icon bg-blue-100/50 p-2 rounded-lg">
              <Users size={24} className="text-blue-600" />
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full">
              +12% vs N-1
            </span>
          </div>
          <div className="kpi-content">
            <span className="kpi-label text-secondary">Couverts (Hier)</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-primary">347</span>
              <span className="text-sm text-secondary">/ 400 cap.</span>
            </div>
            {/* KPI Progress Bar */}
            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-blue-500 h-1.5 rounded-full"
                style={{ width: "86%" }}
              ></div>
            </div>
          </div>
        </Card>

        <Card className="kpi-card hover-lift">
          <div className="flex justify-between items-start mb-2">
            <div className="kpi-icon bg-orange-100/50 p-2 rounded-lg">
              <DollarSign size={24} className="text-orange-600" />
            </div>
            <Zap size={16} className="text-orange-400 fill-orange-400" />
          </div>
          <div className="kpi-content">
            <span className="kpi-label text-secondary">Chiffre d'Affaires</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-primary">4 892 €</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-orange-500 h-1.5 rounded-full"
                style={{ width: "65%" }}
              ></div>
            </div>
          </div>
        </Card>

        <Card className="kpi-card hover-lift">
          <div className="flex justify-between items-start mb-2">
            <div className="kpi-icon bg-green-100/50 p-2 rounded-lg">
              <TrendingUp size={24} className="text-green-600" />
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
              Prévision IA
            </span>
          </div>
          <div className="kpi-content">
            <span className="kpi-label text-secondary">Prévus Demain</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-primary">420</span>
              <span className="text-sm text-secondary">clients</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-green-500 h-1.5 rounded-full relative overflow-hidden"
                style={{ width: "95%" }}
              >
                <div className="absolute inset-0 bg-white/30 w-full h-full animate-shimmer"></div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="kpi-card hover-lift">
          <div className="flex justify-between items-start mb-2">
            <div className="kpi-icon bg-red-100/50 p-2 rounded-lg">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <Badge label="Objectif AGEC" status="optimal" />
          </div>
          <div className="kpi-content">
            <span className="kpi-label text-secondary">Gaspillage Est.</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-primary text-green-600">
                -2.3%
              </span>
              <span className="text-sm text-secondary">cette semaine</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-green-600 h-1.5 rounded-full"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>
        </Card>
      </div>

      <div className="dashboard-main-grid">
        {/* Left Column: Recommendations */}
        <div className="recommendations-section">
          <div className="flex justify-between items-center mb-4">
            <h2 className="section-title mb-0 flex items-center gap-2">
              <Zap size={20} className="text-yellow-500 fill-yellow-500" />
              Actions Prioritaires
            </h2>
            <Button
              size="sm"
              variant="primary"
              onClick={() => setShowOrderGenerator(true)}
              icon={<ShoppingBag size={16} />}
              className="shadow-lg shadow-blue-500/20"
            >
              Générer Commandes
            </Button>
          </div>

          <div className="recommendations-list">
            {MOCK_PREDICTIONS.map((pred) => (
              <Card
                key={pred.id}
                className="recommendation-card border-l-4 border-l-blue-500"
              >
                <div className="rec-header">
                  <div className="flex items-center gap-md">
                    <div
                      className={`status-indicator ${
                        pred.confidence > 0.9 ? "urgent" : "moderate"
                      }`}
                    ></div>
                    <div>
                      <h3 className="rec-product-name text-lg group-hover:text-blue-600 transition-colors">
                        {pred.productName}
                      </h3>
                      <span className="rec-reason flex items-center gap-1">
                        <AlertTriangle size={12} className="text-secondary" />
                        {pred.recommendation?.reason}
                      </span>
                    </div>
                  </div>
                  <Badge
                    label={pred.confidence > 0.9 ? "Urgent" : "Modéré"}
                    status={pred.confidence > 0.9 ? "urgent" : "moderate"}
                  />
                </div>

                <div className="rec-details grid grid-cols-2 gap-4 mt-3 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                  <div className="rec-detail-item">
                    <span className="label text-xs uppercase tracking-wider">
                      Besoin
                    </span>
                    <span className="value font-bold text-primary">
                      {pred.predictedConsumption} kg
                    </span>
                  </div>
                  <div className="rec-detail-item">
                    <span className="label text-xs uppercase tracking-wider">
                      Fiabilité IA
                    </span>
                    <span className="value font-bold text-green-600">
                      {(pred.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="rec-action mt-4 flex items-center justify-between">
                  <div className="rec-order-info text-sm">
                    Commander{" "}
                    <strong className="text-blue-600 text-lg mx-1">
                      {pred.recommendation?.quantity}
                    </strong>{" "}
                    unités
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
                  >
                    Valider
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {showOrderGenerator && (
          <OrderGenerator
            recommendations={MOCK_PREDICTIONS}
            onClose={() => setShowOrderGenerator(false)}
          />
        )}

        {/* Right Column: Chart */}
        <div className="chart-section">
          <Card
            title="📊 Activité & Prévisions"
            className="h-full flex flex-col"
          >
            <div className="chart-container flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E2E8F0"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                    fontSize={12}
                    tick={{ fill: "#64748B" }}
                  />
                  <YAxis
                    yAxisId="left"
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    tick={{ fill: "#64748B" }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    tick={{ fill: "#64748B" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend iconType="circle" />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    fill="url(#colorRevenue)"
                    stroke="#8884d8"
                    name="CA Prévisionnel (€)"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="reservations"
                    barSize={20}
                    fill="#413ea0"
                    radius={[4, 4, 0, 0]}
                    name="Réservations"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="consumption"
                    stroke="#ff7300"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Sortie Stock (kg)"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-legend mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                <Zap size={14} className="text-yellow-500" /> Insight IA
              </h4>
              <p className="text-sm text-secondary">
                Forte corrélation détectée : +10% de réservations entraîne{" "}
                <strong>+8kg de sortie stock</strong>. Anticipez vos commandes
                pour Samedi.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
