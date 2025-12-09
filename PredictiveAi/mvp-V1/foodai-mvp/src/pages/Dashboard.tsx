import React, { useState } from "react";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import InvoiceModal from "../components/dashboard/InvoiceModal";
import MenuIdeasModal from "../components/dashboard/MenuIdeasModal";
import DashboardKPIs from "../components/dashboard/DashboardKPIs";
import RecommendationsSection from "../components/dashboard/RecommendationsSection";
import ActivityChart from "../components/dashboard/ActivityChart";
import OrderGenerator from "../components/dashboard/OrderGenerator";
import { useToast } from "../context/ToastContext";
import { Calendar, FileText, ChefHat } from "lucide-react";
import { MOCK_PREDICTIONS } from "../utils/mockData";
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

  const handleGenerateOrders = () => {
    if (selectedPredictionIds.length > 0) {
      setShowOrderGenerator(true);
    } else {
      addToast(
        "info",
        "Sélectionnez des articles",
        "Veuillez valider au moins une action."
      );
    }
  };

  const todayDate = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  // Filter recommendations: pass all that are not selected (to show in list)
  // But wait, the list usually shows pending actions.
  // The original logic was: visiblePredictions = MOCK_PREDICTIONS.filter(pred => !selectedPredictionIds.includes(pred.id))
  // BUT the map actually checked `isSelected` inside the map.
  // Wait, let's look at the original code (lines 102-104 and 259-261):
  // visiblePredictions excluded selectedIds.
  // BUT inside the map: `const isSelected = selectedPredictionIds.includes(pred.id);`
  // This implies visiblePredictions would NEVER be selected if we filter them out.
  // Ah, the original code filtered them out of the list if selected?
  // Line 102: `const visiblePredictions = MOCK_PREDICTIONS.filter((pred) => !selectedPredictionIds.includes(pred.id));`
  // Then line 260: `visiblePredictions.map(...)`.
  // So yes, selected items disappered from the list?
  // BUT `handleTogglePrediction` (line 72) adds to selection.
  // AND `OrderGenerator` (line 98) used `selectedPredictions` which are the ones in the ID list.
  // So the workflow is: User clicks "Validate", it moves to "selected" state (and disappears from the main list?)
  // Let's re-read the original render logic.
  // Line 267: `${isSelected ? "border-optimal bg-green-50/10" : ""}`
  // If `visiblePredictions` excludes selected, then `isSelected` is ALWAYS false inside the map.
  // So the styling for "selected" state was unreachable code if the filter was active.
  // UNLESS the intent was to show them but visually marked.
  // However, line 102 was explicit.
  // I will PRESERVE the `visiblePredictions` filter logic to maintain existing behavior,
  // BUT I should check if I should pass `MOCK_PREDICTIONS` directly if I want to show selection state.
  // Actually, if they disappear, the "Generated Orders" count updates.
  // I think I'll pass `visiblePredictions` to `RecommendationsSection`.

  const visiblePredictions = MOCK_PREDICTIONS.filter(
    (pred) => !selectedPredictionIds.includes(pred.id)
  );

  // For OrderGenerator
  const selectedPredictions = MOCK_PREDICTIONS.filter((pred) =>
    selectedPredictionIds.includes(pred.id)
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

      {/* KPI Section extracted */}
      <DashboardKPIs />

      <div className="dashboard-main-grid">
        {/* Left Column: Recommendations extracted */}
        <RecommendationsSection
          predictions={visiblePredictions}
          selectedIds={selectedPredictionIds}
          onTogglePrediction={handleTogglePrediction}
          onGenerateOrders={handleGenerateOrders}
        />

        {showOrderGenerator && (
          <OrderGenerator
            recommendations={selectedPredictions}
            onClose={() => setShowOrderGenerator(false)}
          />
        )}

        {/* Right Column: Chart extracted */}
        <div className="chart-section">
          <ActivityChart />
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
