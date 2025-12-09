import React from "react";
import Card from "../common/Card";
import Badge from "../common/Badge";
import {
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Zap,
} from "lucide-react";

/**
 * DashboardKPIs Component
 * Displays the key performance indicators for the dashboard.
 * Currently uses hardcoded values as per the original implementation,
 * but can be extended to accept props.
 */
const DashboardKPIs: React.FC = () => {
  return (
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
            <div className="progress-fill blue" style={{ width: "86%" }}></div>
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
            <div className="progress-fill green" style={{ width: "95%" }}></div>
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
  );
};

export default DashboardKPIs;
