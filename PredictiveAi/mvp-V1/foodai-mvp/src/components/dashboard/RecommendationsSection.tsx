import React from "react";
import Card from "../common/Card";
import Badge from "../common/Badge";
import Button from "../common/Button";
import { Zap, ShoppingBag, AlertTriangle } from "lucide-react";
import type { Prediction } from "../../utils/mockData";

interface RecommendationsSectionProps {
  predictions: Prediction[];
  selectedIds: string[];
  onTogglePrediction: (id: string, productName: string) => void;
  onGenerateOrders: () => void;
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  predictions,
  selectedIds,
  onTogglePrediction,
  onGenerateOrders,
}) => {
  return (
    <div className="recommendations-section">
      <div className="flex justify-between items-center mb-md">
        <h2 className="section-title mb-0 flex items-center gap-sm">
          <Zap size={20} className="text-moderate" />
          Actions Prioritaires
        </h2>
        <Button
          size="sm"
          variant={selectedIds.length > 0 ? "primary" : "outline"}
          onClick={onGenerateOrders}
          icon={<ShoppingBag size={16} />}
          className="shadow-md"
        >
          Générer Commandes ({selectedIds.length})
        </Button>
      </div>

      <div className="recommendations-list">
        {predictions.length > 0 ? (
          predictions.map((pred) => {
            const isSelected = selectedIds.includes(pred.id);
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
                      <h3 className="rec-product-name">{pred.productName}</h3>
                      <span className="rec-reason flex items-center gap-xs">
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
                      onTogglePrediction(pred.id, pred.productName)
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
  );
};

export default RecommendationsSection;
