import React, { useState } from "react";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { Store, Package, Users, Plug, Save } from "lucide-react";
import "./Settings.css";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "restaurant" | "products" | "suppliers" | "integrations"
  >("restaurant");

  const tabs = [
    { id: "restaurant", label: "Restaurant", icon: Store },
    { id: "products", label: "Produits", icon: Package },
    { id: "suppliers", label: "Fournisseurs", icon: Users },
    { id: "integrations", label: "Intégrations", icon: Plug },
  ] as const;

  return (
    <div className="settings-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Paramètres</h1>
          <p className="page-subtitle">Gérez vor configuration</p>
        </div>
        <Button icon={<Save size={18} />}>Enregistrer</Button>
      </header>

      <div className="settings-layout">
        {/* Sidebar Navigation for Settings */}
        <Card className="settings-nav-card">
          <nav className="settings-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </Card>

        {/* Content Area */}
        <div className="settings-content">
          {activeTab === "restaurant" && (
            <Card title="Informations Restaurant">
              <div className="form-grid">
                <Input
                  label="Nom du restaurant"
                  defaultValue="La Pizzeria de Jean"
                />
                <div className="grid-2">
                  <Input label="Type" defaultValue="Pizzeria / Crêperie" />
                  <Input label="Couverts moyen / jour" defaultValue="350" />
                </div>
                <Input
                  label="Adresse"
                  defaultValue="12 Rue de Paris, 75001 Paris"
                />
                <div className="grid-2">
                  <Input label="Téléphone" defaultValue="+33 1 23 45 67 89" />
                  <Input
                    label="Email de contact"
                    defaultValue="contact@lapizzeria.fr"
                  />
                </div>
              </div>
            </Card>
          )}

          {activeTab === "products" && (
            <Card title="Gestion des Produits">
              <div className="empty-state">
                <Package size={48} color="var(--color-border)" />
                <p>Liste des produits (Mock)</p>
                <Button size="sm">Ajouter un produit</Button>
              </div>
            </Card>
          )}

          {activeTab === "suppliers" && (
            <Card title="Fournisseurs">
              <div className="empty-state">
                <Users size={48} color="var(--color-border)" />
                <p>Gestion fournisseurs (Mock)</p>
                <Button size="sm">Ajouter un fournisseur</Button>
              </div>
            </Card>
          )}

          {activeTab === "integrations" && (
            <Card title="Intégrations Externes">
              <div className="integration-item">
                <div className="int-info">
                  <div className="int-icon">POS</div>
                  <div>
                    <h4>iiko POS</h4>
                    <span className="status connected">Connecté</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Configurer
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
