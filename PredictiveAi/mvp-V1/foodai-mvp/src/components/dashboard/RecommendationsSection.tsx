import React from "react";
import Button from "../common/Button";
import Card from "../common/Card";
import { ShoppingCart, Check } from "lucide-react";
import type { Prediction } from "../../types";

interface RecommendationsSectionProps {
  predictions: Prediction[];
  selectedIds: string[];
  onTogglePrediction: (id: string, productName: string) => void;
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  predictions,
  selectedIds,
  onTogglePrediction,
}) => {
  return (
    <div className="recommendations-section">
      <div className="section-header flex justify-between items-center mb-4">
        <h3 className="section-title">Actions Prioritaires</h3>
      </div>

      <div className="recommendations-list grid-layout">
        {predictions.length > 0 ? (
          predictions.map((pred) => {
            const isSelected = selectedIds.includes(pred.id);
            const isUrgent = pred.recommendation?.action === "buy";

            return (
              <Card
                key={pred.id}
                className={`recommendation-card ${
                  isUrgent ? "urgent" : "moderate"
                } ${
                  isSelected ? "border-optimal bg-green-50/10" : "hover-lift"
                }`}
              >
                <div className="p-4 flex flex-col h-full justify-between">
                  <div>
                    <div className="rec-header mb-3">
                      <h4 className="rec-product-name">{pred.productName}</h4>
                      <div
                        className={`status-indicator ${
                          isUrgent ? "urgent" : "moderate"
                        }`}
                      />
                    </div>

                    <p className="rec-reason mb-4">
                      {pred.recommendation?.reason}
                    </p>

                    <div className="rec-details mb-4">
                      <div className="rec-detail-item">
                        <span className="label">Prévision</span>
                        <span className="value">
                          {pred.predictedConsumption} kg
                        </span>
                      </div>
                      <div className="rec-detail-item">
                        <span className="label">Recommandé</span>
                        <span className="value">
                          {pred.recommendation?.quantity} kg
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rec-action">
                    <span className="rec-order-info">
                      {isUrgent ? "Stock critique" : "Optimisation stock"}
                    </span>
                    <Button
                      size="sm"
                      variant={isSelected ? "primary" : "outline"}
                      className={isSelected ? "bg-optimal border-optimal" : ""}
                      onClick={() =>
                        onTogglePrediction(pred.id, pred.productName)
                      }
                      icon={
                        isSelected ? (
                          <Check size={16} />
                        ) : (
                          <ShoppingCart size={16} />
                        )
                      }
                    >
                      {isSelected ? "Ajouté" : "Ajouter"}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="col-span-3 p-8 text-center text-secondary border border-dashed border-gray-300 rounded-lg">
            <p>Aucune action prioritaire en attente. Bon travail ! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationsSection;
