import React, { useState } from "react";
import Button from "../common/Button";
import Card from "../common/Card";
import Badge from "../common/Badge";
import {
  Send,
  FileText,
  CheckCircle,
  AlertCircle,
  Truck,
  X,
} from "lucide-react";
import {
  type Prediction,
  MOCK_SUPPLIERS,
  MOCK_PRODUCTS,
} from "../../utils/mockData";

interface OrderGeneratorProps {
  recommendations: Prediction[];
  onClose: () => void;
}

const OrderGenerator: React.FC<OrderGeneratorProps> = ({
  recommendations,
  onClose,
}) => {
  const [step, setStep] = useState<"preview" | "sending" | "success">(
    "preview"
  );

  // Group recommendations by supplier
  const ordersBySupplier = recommendations.reduce((acc, pred) => {
    if (pred.recommendation?.action !== "buy") return acc;

    const product = MOCK_PRODUCTS.find((p) => p.id === pred.productId);
    if (!product) return acc;

    const supplierId = product.supplierId;
    if (!acc[supplierId]) {
      acc[supplierId] = {
        supplier: MOCK_SUPPLIERS.find((s) => s.id === supplierId),
        items: [],
      };
    }
    acc[supplierId].items.push({
      productName: product.name,
      quantity: pred.recommendation.quantity,
      unit: product.unit,
      price: product.pricePerUnit * pred.recommendation.quantity,
    });
    return acc;
  }, {} as Record<string, any>);

  const handleSend = () => {
    setStep("sending");
    setTimeout(() => {
      setStep("success");
    }, 2000);
  };

  if (step === "success") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md text-center p-8 animate-in fade-in zoom-in duration-300">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
            <CheckCircle size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Commandes Envoyées !</h3>
          <p className="text-secondary mb-6">
            3 emails ont été envoyés à vos fournisseurs. Vous recevrez les
            confirmations d'ici peu.
          </p>
          <Button onClick={onClose} size="lg" className="w-full">
            Retour au Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-border flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FileText size={20} className="text-primary" />
              Générateur de Commandes
            </h3>
            <p className="text-sm text-secondary">
              Basé sur les prédictions d'achat de l'IA
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-secondary hover:text-primary transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {Object.keys(ordersBySupplier).length === 0 ? (
            <div className="text-center py-12 text-secondary">
              <AlertCircle className="mx-auto mb-2 opacity-50" />
              Aucune commande nécessaire pour le moment.
            </div>
          ) : (
            Object.values(ordersBySupplier).map((order: any, idx) => (
              <div
                key={idx}
                className="border border-border rounded-lg p-4 bg-white"
              >
                <div className="flex justify-between items-start mb-3 border-b border-dashed border-gray-100 pb-2">
                  <div>
                    <h4 className="font-bold flex items-center gap-2">
                      <Truck size={16} className="text-secondary" />
                      {order.supplier?.name || "Fournisseur Inconnu"}
                    </h4>
                    <span className="text-xs text-secondary">
                      {order.supplier?.email}
                    </span>
                  </div>
                  <Badge
                    label={`${order.items.length} articles`}
                    status="neutral"
                  />
                </div>
                <div className="space-y-2">
                  {order.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>
                        {item.quantity} {item.unit} x {item.productName}
                      </span>
                      <span className="font-mono text-secondary">
                        {item.price.toFixed(2)}€
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-2 border-t border-border flex justify-end">
                  <span className="font-bold text-lg">
                    Total:{" "}
                    {order.items
                      .reduce((sum: number, i: any) => sum + i.price, 0)
                      .toFixed(2)}
                    €
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-gray-50 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            onClick={handleSend}
            disabled={
              Object.keys(ordersBySupplier).length === 0 || step === "sending"
            }
            icon={step === "sending" ? undefined : <Send size={16} />}
          >
            {step === "sending"
              ? "Envoi en cours..."
              : "Valider et Envoyer (Simulé)"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OrderGenerator;
