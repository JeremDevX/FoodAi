import React, { useState } from "react";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import InvoiceModal from "../components/dashboard/InvoiceModal";
import MenuIdeasModal from "../components/dashboard/MenuIdeasModal";
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
import { MOCK_PREDICTIONS, MOCK_DASHBOARD_ACTIVITY } from "../utils/mockData";
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
  const [showOrderGenerator, setShowOrderGenerator] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [selectedPredictionIds, setSelectedPredictionIds] = useState<string[]>(
    []
  );

  const { addToast } = useToast();

  const handleScanInvoice = () => {
    setIsInvoiceModalOpen(true);
  };

  const handleValidateInvoice = () => {
    addToast(
      "success",
      "Facture Intégrée",
      "Les stocks de Tomates et Mozzarella ont été mis à jour."
    );
    setIsInvoiceModalOpen(false);
  };

  const handleMenuGen = () => {
    setIsMenuModalOpen(true);
  };

  const handleValidateMenu = () => {
    addToast(
      "success",
      "Menu Validé & Imprimé",
      "La production a été planifiée pour demain."
    );
    setIsMenuModalOpen(false);
  };

  const handleTogglePrediction = (id: string, productName: string) => {
    const isCurrentlySelected = selectedPredictionIds.includes(id);

    if (isCurrentlySelected) {
      // Remove from selection
      setSelectedPredictionIds((prev) => prev.filter((pId) => pId !== id));
    } else {
      // Add to selection
      setSelectedPredictionIds((prev) => [...prev, id]);
      addToast(
        "success",
        "Ajouté à la commande",
        `${productName} ajouté au panier.`
      );
    }
  };

  const todayDate = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  // Filter recommendations: if selection exists, pass only selected; otherwise pass all (or none? User flow usually implies checking specific things)
  // Actually, OrderGenerator should receive EITHER the full list (if we want to bulk add) OR just the selected ones.
  // Let's pass ONLY the selected ones to OrderGenerator.
  const selectedPredictions = MOCK_PREDICTIONS.filter((pred) =>
    selectedPredictionIds.includes(pred.id)
  );

  const visiblePredictions = MOCK_PREDICTIONS.filter(
    (pred) => !selectedPredictionIds.includes(pred.id)
  );

  return (
    <div className="dashboard-container">
      <header className="page-header glass-header">
        <div>
          <h1 className="page-title">Bienvenue, Jean ! 👋</h1>
          <p className="page-subtitle flex items-center gap-sm">
            <Calendar size={14} /> {todayDate} • Paris • ☀️ 18°C
          </p>
        </div>
        <div className="header-actions">
          {/* Quick Actions Toolbar */}
          <div className="flex gap-sm">
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
          <div className="flex justify-between items-start mb-md">
            <div className="kpi-icon blue">
              <Users size={24} />
            </div>
            <span className="badge badge-optimal">+12% vs N-1</span>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Couverts (Hier)</span>
            <div className="kpi-value-row">
              <span className="kpi-value">347</span>
              <span className="text-secondary text-sm">/ 400 cap.</span>
            </div>
            {/* KPI Progress Bar */}
            <div className="progress-bar">
              <div
                className="progress-fill blue"
                style={{ width: "86%" }}
              ></div>
            </div>
          </div>
        </Card>

        <Card className="kpi-card hover-lift">
          <div className="flex justify-between items-start mb-md">
            <div className="kpi-icon orange">
              <DollarSign size={24} />
            </div>
            <Zap size={16} className="text-moderate" />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Chiffre d'Affaires</span>
            <div className="kpi-value-row">
              <span className="kpi-value">4 892 €</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill orange"
                style={{ width: "65%" }}
              ></div>
            </div>
          </div>
        </Card>

        <Card className="kpi-card hover-lift">
          <div className="flex justify-between items-start mb-md">
            <div className="kpi-icon green">
              <TrendingUp size={24} />
            </div>
            <span className="badge badge-optimal">Prévision IA</span>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Prévus Demain</span>
            <div className="kpi-value-row">
              <span className="kpi-value">420</span>
              <span className="text-secondary text-sm">clients</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill green"
                style={{ width: "95%" }}
              ></div>
            </div>
          </div>
        </Card>

        <Card className="kpi-card hover-lift">
          <div className="flex justify-between items-start mb-md">
            <div className="kpi-icon red">
              <AlertTriangle size={24} />
            </div>
            <Badge label="Objectif AGEC" status="optimal" />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Gaspillage Est.</span>
            <div className="kpi-value-row">
              <span className="kpi-value text-optimal">-2.3%</span>
              <span className="text-secondary text-sm">cette semaine</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill green"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>
        </Card>
      </div>

      <div className="dashboard-main-grid">
        {/* Left Column: Recommendations */}
        <div className="recommendations-section">
          <div className="flex justify-between items-center mb-md">
            <h2 className="section-title mb-0 flex items-center gap-sm">
              <Zap size={20} className="text-moderate" />
              Actions Prioritaires
            </h2>
            <Button
              size="sm"
              variant={selectedPredictionIds.length > 0 ? "primary" : "outline"}
              onClick={() => {
                if (selectedPredictionIds.length > 0) {
                  setShowOrderGenerator(true);
                } else {
                  addToast(
                    "info",
                    "Sélectionnez des articles",
                    "Veuillez valider au moins une action."
                  );
                }
              }}
              icon={<ShoppingBag size={16} />}
              className="shadow-md"
            >
              Générer Commandes ({selectedPredictionIds.length})
            </Button>
          </div>

          <div className="recommendations-list">
            {visiblePredictions.length > 0 ? (
              visiblePredictions.map((pred) => {
                const isSelected = selectedPredictionIds.includes(pred.id);
                return (
                  <Card
                    key={pred.id}
                    className={`recommendation-card ${
                      pred.confidence > 0.9 ? "urgent" : "moderate"
                    } ${isSelected ? "border-optimal bg-green-50/10" : ""}`}
                  >
                    <div className="rec-header">
                      <div className="flex items-center gap-md">
                        <div
                          className={`status-indicator ${
                            pred.confidence > 0.9 ? "urgent" : "moderate"
                          }`}
                        ></div>
                        <div>
                          <h3 className="rec-product-name">
                            {pred.productName}
                          </h3>
                          <span className="rec-reason flex items-center gap-xs">
                            <AlertTriangle
                              size={12}
                              className="text-secondary"
                            />
                            {pred.recommendation?.reason}
                          </span>
                        </div>
                      </div>
                      <Badge
                        label={pred.confidence > 0.9 ? "Urgent" : "Modéré"}
                        status={pred.confidence > 0.9 ? "urgent" : "moderate"}
                      />
                    </div>

                    <div className="rec-details">
                      <div className="rec-detail-item">
                        <span className="label">Besoin</span>
                        <span className="value text-primary">
                          {pred.predictedConsumption} kg
                        </span>
                      </div>
                      <div className="rec-detail-item">
                        <span className="label">Fiabilité IA</span>
                        <span className="value text-optimal">
                          {(pred.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <div className="rec-action">
                      <div className="rec-order-info">
                        Commander{" "}
                        <strong className="text-primary text-lg mx-1">
                          {pred.recommendation?.quantity}
                        </strong>{" "}
                        unités
                      </div>
                      <Button
                        size="sm"
                        variant={isSelected ? "primary" : "outline"}
                        onClick={() =>
                          handleTogglePrediction(pred.id, pred.productName)
                        }
                      >
                        {isSelected ? "Ajouté" : "Valider"}
                      </Button>
                    </div>
                  </Card>
                );
              })
            ) : (
              <div className="p-8 text-center text-secondary border border-dashed border-gray-300 rounded-lg">
                <p>Aucune action prioritaire en attente. Bon travail ! 🎉</p>
              </div>
            )}
          </div>
        </div>

        {showOrderGenerator && (
          <OrderGenerator
            recommendations={selectedPredictions}
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
                <ComposedChart data={MOCK_DASHBOARD_ACTIVITY}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#218083" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#218083" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E6C2AD"
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                    fontSize={12}
                    tick={{ fill: "#627C7F" }}
                  />
                  <YAxis
                    yAxisId="left"
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    tick={{ fill: "#627C7F" }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    tick={{ fill: "#627C7F" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFD",
                      borderRadius: "8px",
                      border: "1px solid #E6C2AD",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      color: "#134252",
                    }}
                  />
                  <Legend iconType="circle" />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    fill="url(#colorRevenue)"
                    stroke="#218083"
                    name="CA Prévisionnel (€)"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="reservations"
                    barSize={20}
                    fill="#1F212F"
                    radius={[4, 4, 0, 0]}
                    name="Réservations"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="consumption"
                    stroke="#A84B2F"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Sortie Stock (kg)"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-legend">
              <h4 className="text-sm font-bold mb-2 flex items-center gap-sm">
                <Zap size={14} className="text-moderate" /> Insight IA
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

      {/* Modals */}
      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title="Scanner une Facture"
        width="lg"
      >
        <InvoiceModal
          onValidate={handleValidateInvoice}
          onClose={() => setIsInvoiceModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        title="Générateur de Menu du Jour"
        width="md"
      >
        <MenuIdeasModal
          onValidate={handleValidateMenu}
          onClose={() => setIsMenuModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
