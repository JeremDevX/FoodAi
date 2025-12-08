import React, { useState } from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import { Clock, ChefHat, CheckCircle, Leaf, AlertTriangle } from "lucide-react";
import { MOCK_RECIPES, MOCK_PRODUCTS } from "../utils/mockData";
import { format, parseISO, isSameWeek } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "../context/ToastContext";
import "./Recipes.css";

const Recipes: React.FC = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<"history" | "anti-waste">(
    "history"
  );

  // Helper to find product name by ID
  const getProductName = (id: string) =>
    MOCK_PRODUCTS.find((p) => p.id === id)?.name || "Inconnu";
  const getProductUnit = (id: string) =>
    MOCK_PRODUCTS.find((p) => p.id === id)?.unit || "";

  // 1. Filter: Recipes made this week
  const historyRecipes = MOCK_RECIPES.filter(
    (r) =>
      r.lastMade &&
      isSameWeek(parseISO(r.lastMade), new Date(), { weekStartsOn: 1 })
  );

  // 2. Logic: Calculate feasible quantity based on stock
  const antiWasteRecipes = MOCK_RECIPES.map((recipe) => {
    // Determine max portions possible
    const maxPortions = Math.min(
      ...recipe.ingredients.map((ing) => {
        const product = MOCK_PRODUCTS.find((p) => p.id === ing.productId);
        if (!product) return 0;
        return Math.floor(product.currentStock / ing.quantity);
      })
    );

    return { ...recipe, maxYield: maxPortions };
  })
    .filter((r) => r.maxYield > 0) // Only show possible recipes
    .sort((a, b) => b.maxYield - a.maxYield); // Sort by quantity possible

  return (
    <div className="recipes-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Carnet de Recettes</h1>
          <p className="page-subtitle">
            Gérez votre production et réduisez le gaspillage
          </p>
        </div>
        <div className="flex gap-sm">
          <Button
            variant={activeTab === "history" ? "primary" : "outline"}
            onClick={() => setActiveTab("history")}
            size="sm"
          >
            Semaine en cours
          </Button>
          <Button
            variant={activeTab === "anti-waste" ? "primary" : "outline"}
            onClick={() => setActiveTab("anti-waste")}
            size="sm"
            icon={<Leaf size={16} />}
          >
            Suggestions Anti-Gaspi
          </Button>
        </div>
      </header>

      {/* TAB 1: HISTORY */}
      {activeTab === "history" && (
        <div className="recipes-grid">
          {historyRecipes.length > 0 ? (
            historyRecipes.map((recipe) => (
              <Card key={recipe.id} className="recipe-card">
                <div className="recipe-header">
                  <span className="recipe-title">{recipe.name}</span>
                  <Badge label={recipe.category} status="neutral" />
                </div>
                <div className="recipe-meta">
                  <span className="recipe-meta-item">
                    <Clock size={14} /> {recipe.prepTime} min
                  </span>
                  <span className="recipe-meta-item">
                    <ChefHat size={14} /> Cuisiné le{" "}
                    {format(parseISO(recipe.lastMade!), "EEEE d", {
                      locale: fr,
                    })}
                  </span>
                </div>
                <div className="recipe-ingredients">
                  <h4 className="text-xs font-semibold uppercase text-secondary mb-2">
                    Ingrédients utilisés
                  </h4>
                  {recipe.ingredients.map((ing, i) => (
                    <div key={i} className="ingredient-item">
                      <span>{getProductName(ing.productId)}</span>
                      <span>
                        {ing.quantity} {getProductUnit(ing.productId)}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            ))
          ) : (
            <div className="empty-week col-span-full">
              <ChefHat
                size={48}
                className="mx-auto mb-4 text-secondary opacity-50"
              />
              <p>Aucune recette enregistrée cette semaine.</p>
              <Button variant="outline" className="mt-4">
                Enregistrer une production
              </Button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ANTI-WASTE SUGGESTIONS */}
      {activeTab === "anti-waste" && (
        <div className="recipes-grid">
          {antiWasteRecipes.map((recipe) => (
            <Card key={recipe.id} className="recipe-card border-optimal">
              {/* Special styling for recommended items */}
              <div className="recipe-header">
                <span className="recipe-title text-optimal">{recipe.name}</span>
                <Badge label="Faisable" status="optimal" />
              </div>
              <div className="recipe-meta">
                <span className="recipe-meta-item">
                  <Clock size={14} /> {recipe.prepTime} min
                </span>
                <span className="recipe-meta-item text-optimal font-medium">
                  100% Stock dispo
                </span>
              </div>

              <div className="recipe-ingredients bg-green-50 p-2 rounded-md mb-2">
                <div className="stock-match-badge w-full justify-center mb-2">
                  <CheckCircle size={16} />
                  Vous pouvez faire {recipe.maxYield} portions
                </div>

                {/* Economics Section */}
                <div className="flex justify-between items-center mb-2 pb-2 border-b border-green-100 text-xs">
                  <div className="flex flex-col">
                    <span className="text-secondary">Coût Matière</span>
                    <span className="font-bold text-gray-700">
                      {recipe.ingredients
                        .reduce((sum, ing) => {
                          const p = MOCK_PRODUCTS.find(
                            (p) => p.id === ing.productId
                          );
                          return sum + (p ? p.pricePerUnit * ing.quantity : 0);
                        }, 0)
                        .toFixed(2)}
                      €
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-secondary">Marge Est. (75%)</span>
                    <span className="font-bold text-optimal">
                      +
                      {(
                        recipe.ingredients.reduce((sum, ing) => {
                          const p = MOCK_PRODUCTS.find(
                            (p) => p.id === ing.productId
                          );
                          return sum + (p ? p.pricePerUnit * ing.quantity : 0);
                        }, 0) * 3
                      ).toFixed(2)}
                      €
                    </span>
                  </div>
                </div>

                {recipe.ingredients.map((ing, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-xs py-1 border-b border-green-100 last:border-0"
                  >
                    <span>{getProductName(ing.productId)}</span>
                    <span className="font-medium text-optimal">Stock OK</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-auto">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() =>
                    addToast(
                      "success",
                      "Production Lancée",
                      `Les ingrédients pour ${recipe.name} ont été déstockés.`
                    )
                  }
                >
                  Produire
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  icon={<AlertTriangle size={14} />}
                  onClick={() => {
                    const qty = window.prompt(
                      `Combien de ${recipe.name} refusés faute de stock ?`
                    );
                    if (qty && parseInt(qty) > 0) {
                      addToast(
                        "success",
                        "Prévision Ajustée",
                        `La demande pour ${recipe.name} (+${qty}) a été enregistrée.`
                      );
                    }
                  }}
                >
                  Refus
                </Button>
              </div>
            </Card>
          ))}
          {antiWasteRecipes.length === 0 && (
            <div className="empty-week col-span-full">
              <p>Pas assez de stock pour des recettes complètes sans achat.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Recipes;
