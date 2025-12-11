import React, { useState } from "react";
import Button from "../common/Button";
import Card from "../common/Card";
import { ShoppingCart, Check, ChevronLeft, ChevronRight } from "lucide-react";
import type { Prediction } from "../../types";

interface RecommendationsSectionProps {
  predictions: Prediction[];
  selectedIds: string[];
  onTogglePrediction: (id: string, productName: string) => void;
}

const ITEMS_PER_PAGE = 6;

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  predictions,
  selectedIds,
  onTogglePrediction,
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  // Calculate pagination
  const totalPages = Math.ceil(predictions.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPredictions = predictions.slice(startIndex, endIndex);

  // Reset to first page if current page becomes invalid
  React.useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    }
  }, [predictions.length, currentPage, totalPages]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  return (
    <div className="recommendations-section">
      <div className="section-header flex justify-between items-center mb-4">
        <h3 className="section-title">Actions Prioritaires</h3>
        {totalPages > 1 && (
          <div className="pagination-info">
            <span className="pagination-text">
              {startIndex + 1}-{Math.min(endIndex, predictions.length)} sur{" "}
              {predictions.length}
            </span>
          </div>
        )}
      </div>

      <div className="recommendations-list grid-layout">
        {paginatedPredictions.length > 0 ? (
          paginatedPredictions.map((pred) => {
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            aria-label="Page précédente"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="pagination-dots">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`pagination-dot ${
                  i === currentPage ? "active" : ""
                }`}
                onClick={() => setCurrentPage(i)}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>

          <button
            className="pagination-btn"
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            aria-label="Page suivante"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default RecommendationsSection;
