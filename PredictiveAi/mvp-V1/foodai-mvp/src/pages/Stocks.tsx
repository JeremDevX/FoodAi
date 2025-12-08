import React, { useState } from "react";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import ProductDetail from "../components/stocks/ProductDetail";
import { Search, Filter, Plus, ShoppingCart } from "lucide-react";
import { MOCK_PRODUCTS, getStatus, type Product } from "../utils/mockData";
import { useToast } from "../context/ToastContext";
import "./Stocks.css";

const Stocks: React.FC = () => {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState(MOCK_PRODUCTS);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdjustStock = (
    e: React.MouseEvent,
    id: string,
    amount: number
  ) => {
    e.stopPropagation();
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, currentStock: Math.max(0, p.currentStock + amount) }
          : p
      )
    );
  };

  return (
    <div className="stocks-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Gestion des Stocks</h1>
          <p className="page-subtitle">Inventaire en temps réel et alertes</p>
        </div>
        <Button icon={<Plus size={18} />}>Ajouter un produit</Button>
      </header>

      <Card className="stocks-toolbar">
        <div className="toolbar-content">
          <div className="search-wrapper">
            <Input
              placeholder="Rechercher un produit..."
              icon={<Search size={18} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filters-wrapper">
            <select className="category-select">
              <option value="all">Toutes les catégories</option>
              <option value="veg">Légumes</option>
              <option value="dairy">Produits Laitiers</option>
              <option value="meat">Viandes</option>
            </select>
            <Button variant="outline" icon={<Filter size={18} />}>
              Filtres
            </Button>
            <Button icon={<Plus size={18} />}>Nouveau Produit</Button>
          </div>
        </div>
      </Card>

      <Card title="Gestion des Stocks" className="stocks-table-card">
        <table className="stocks-table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Catégorie</th>
              <th>Stock</th>
              <th>Valeur</th>
              <th>État</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const status = getStatus(product);
              return (
                <tr
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="clickable-row"
                >
                  <td className="font-medium">{product.name}</td>
                  <td className="text-secondary">{product.category}</td>
                  <td>
                    {product.currentStock} {product.unit}
                  </td>
                  <td className="font-mono text-xs">
                    {(product.currentStock * product.pricePerUnit).toFixed(2)}€
                  </td>
                  <td>
                    <Badge
                      label={
                        status === "optimal"
                          ? "Bon"
                          : status === "moderate"
                          ? "Moyen"
                          : "Critique"
                      }
                      status={status}
                    />
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="outline"
                      icon={<ShoppingCart size={14} />}
                      onClick={() =>
                        addToast(
                          "success",
                          "Ajouté au panier",
                          `${product.name} ajouté à la commande Rungis.`
                        )
                      }
                    >
                      Commander
                    </Button>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-2">
                      <button
                        className="stock-action-btn minus"
                        onClick={(e) => handleAdjustStock(e, product.id, -1)}
                      >
                        -
                      </button>
                      <button
                        className="stock-action-btn plus"
                        onClick={(e) => handleAdjustStock(e, product.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
      <ProductDetail
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default Stocks;
