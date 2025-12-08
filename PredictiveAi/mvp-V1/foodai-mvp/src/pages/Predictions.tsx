import React, { useState } from "react";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import { ShoppingCart, Mail, ArrowRight, Brain, Calendar } from "lucide-react";
import { MOCK_PREDICTIONS, type Prediction } from "../utils/mockData";
import { format, parseISO, startOfWeek, addDays, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import "./Predictions.css";
const Predictions: React.FC = () => {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  const urgentPredictions = MOCK_PREDICTIONS.filter((p) => p.confidence > 0.9);
  const moderatePredictions = MOCK_PREDICTIONS.filter(
    (p) => p.confidence <= 0.9
  );

  return (
    <div className="predictions-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Prédictions & Achats</h1>
          <p className="page-subtitle">Recommandations basées sur l'IA</p>
        </div>
        <div className="view-toggles">
          <Button
            variant={viewMode === "list" ? "primary" : "secondary"}
            onClick={() => setViewMode("list")}
            size="sm"
          >
            Liste Priorités
          </Button>
          <Button
            variant={viewMode === "calendar" ? "primary" : "secondary"}
            onClick={() => setViewMode("calendar")}
            size="sm"
            icon={<Calendar size={14} />}
          >
            Calendrier
          </Button>
        </div>
      </header>

      {viewMode === "list" ? (
        <div className="predictions-grid">
          {/* Urgent Section */}
          <section>
            <div className="section-header urgent">
              <h2 className="section-title text-urgent">
                🔴 Urgent (Commander Aujourd'hui)
              </h2>
            </div>
            <div className="cards-stack">
              {urgentPredictions.map((pred) => (
                <Card key={pred.id} className="prediction-card urgent-border">
                  <div className="pred-main">
                    <div className="pred-info">
                      <div className="pred-header">
                        <h3 className="product-name">{pred.productName}</h3>
                        <Badge label="Rupture demain" status="urgent" />
                      </div>
                      <div className="pred-reason">
                        <Brain size={16} className="text-secondary" />
                        <span>
                          IA: {pred.recommendation?.reason} (Confiance:{" "}
                          {(pred.confidence * 100).toFixed(0)}%)
                        </span>
                      </div>
                      <div className="pred-stats">
                        <div className="stat">
                          <span className="label">Stock Prévu</span>
                          <span className="value text-urgent">Critical</span>
                        </div>
                        <div className="stat">
                          <span className="label">Conso. Moyenne</span>
                          <span className="value">
                            {pred.predictedConsumption} kg/j
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="pred-action-panel">
                      <div className="recommendation-box">
                        <span className="rec-label">Recommandation</span>
                        <span className="rec-value">
                          Commander {pred.recommendation?.quantity} unités
                        </span>
                        <span className="rec-sub">
                          Fournisseur: Franck Légumes (2.40€/u)
                        </span>
                      </div>
                      <div className="action-buttons">
                        <Button
                          className="w-full"
                          icon={<ShoppingCart size={16} />}
                        >
                          Commander Auto
                        </Button>
                        <Button
                          variant="secondary"
                          className="w-full"
                          icon={<Mail size={16} />}
                        >
                          Email Fournisseur
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Moderate Section */}
          <section>
            <div className="section-header">
              <h2 className="section-title text-moderate">
                🟡 Modéré (D'ici 2-3 jours)
              </h2>
            </div>
            <div className="cards-stack">
              {moderatePredictions.map((pred) => (
                <Card key={pred.id} className="prediction-card">
                  <div className="pred-compact">
                    <div className="pred-info-compact">
                      <h3 className="product-name">{pred.productName}</h3>
                      <span className="compact-reason">
                        {pred.recommendation?.reason}
                      </span>
                    </div>
                    <div className="pred-meta">
                      <Badge label="Modéré" status="moderate" />
                      <span className="confidence-pill">
                        {(pred.confidence * 100).toFixed(0)}% fiable
                      </span>
                    </div>
                    <div className="compact-actions">
                      <Button size="sm" variant="outline">
                        Détails
                      </Button>
                      <Button size="sm" icon={<ArrowRight size={14} />}>
                        Commander
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <CalendarView predictions={MOCK_PREDICTIONS} />
      )}
    </div>
  );
};

// Internal Calendar Component

const CalendarView: React.FC<{ predictions: Prediction[] }> = ({
  predictions,
}) => {
  const today = new Date();
  const startDate = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const weekDays = Array.from({ length: 7 }).map((_, i) =>
    addDays(startDate, i)
  );

  return (
    <div className="calendar-view">
      <div className="calendar-grid">
        {weekDays.map((date) => {
          const dayPreds = predictions.filter((p) =>
            isSameDay(parseISO(p.predictedDate), date)
          );
          const isToday = isSameDay(date, today);

          return (
            <div
              key={date.toISOString()}
              className={`calendar-day ${isToday ? "today" : ""}`}
            >
              <div className="day-header">
                <span className="day-name">
                  {format(date, "EEEE", { locale: fr })}
                </span>
                <span className="day-number">{format(date, "d")}</span>
              </div>
              <div className="day-content">
                {dayPreds.map((pred) => (
                  <div
                    key={pred.id}
                    className={`cal-event ${
                      pred.confidence > 0.9 ? "urgent" : "moderate"
                    }`}
                  >
                    <span className="cal-prod">{pred.productName}</span>
                    <span className="cal-qty">
                      {pred.recommendation?.quantity}u
                    </span>
                  </div>
                ))}
                {dayPreds.length === 0 && <span className="no-events">-</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Predictions;
