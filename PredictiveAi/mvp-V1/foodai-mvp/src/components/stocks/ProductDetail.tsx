import React from "react";
import Button from "../common/Button";
import Badge from "../common/Badge";
import { X, Package, Truck, AlertTriangle, History } from "lucide-react";
import { getStatus, type Product } from "../../utils/mockData";

import "./ProductDetail.css";

interface ProductDetailProps {
  product: Product | null;
  onClose: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose }) => {
  if (!product) return null;

  const status = getStatus(product);

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="product-drawer">
        <header className="drawer-header">
          <div>
            <span className="drawer-subtitle">Détails du produit</span>
            <h2 className="drawer-title">{product.name}</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </header>

        <div className="drawer-content">
          <section className="drawer-section">
            <div className="status-banner">
              <Badge
                label={
                  status === "urgent"
                    ? "Rupture Imminente"
                    : status === "moderate"
                    ? "Stock Faible"
                    : "Stock Optimal"
                }
                status={status}
              />
              <span className="stock-big">
                {product.currentStock}{" "}
                <span className="unit">{product.unit}</span>
              </span>
            </div>
          </section>

          <section className="drawer-section">
            <h3 className="section-heading">
              <Package size={18} /> Inventaire
            </h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Catégorie</span>
                <span className="value">{product.category}</span>
              </div>
              <div className="info-item">
                <span className="label">Seuil Min.</span>
                <span className="value">
                  {product.minThreshold} {product.unit}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Prix Unitaire</span>
                <span className="value">{product.pricePerUnit} €</span>
              </div>
              <div className="info-item">
                <span className="label">Valeur Stock</span>
                <span className="value">
                  {(product.currentStock * product.pricePerUnit).toFixed(2)} €
                </span>
              </div>
            </div>
          </section>

          <section className="drawer-section">
            <h3 className="section-heading">
              <Truck size={18} /> Fournisseur
            </h3>
            <div className="supplier-card">
              <span className="supplier-name">Franck Légumes (Mock)</span>
              <div className="supplier-actions">
                <Button size="sm" variant="outline">
                  Contacter
                </Button>
                <Button size="sm">Commander</Button>
              </div>
            </div>
          </section>

          <section className="drawer-section">
            <h3 className="section-heading">
              <History size={18} /> Historique
            </h3>
            <div className="history-list">
              <div className="history-item">
                <span className="date">07 Dec</span>
                <span className="action">-2.5 kg (Service Midi)</span>
              </div>
              <div className="history-item">
                <span className="date">06 Dec</span>
                <span className="action">+10 kg (Livraison)</span>
              </div>
            </div>
          </section>
        </div>

        <footer className="drawer-footer">
          <Button variant="danger" icon={<AlertTriangle size={16} />}>
            Signaler Perte
          </Button>
          <Button variant="secondary">Ajuster Stock</Button>
        </footer>
      </div>
    </>
  );
};

export default ProductDetail;
