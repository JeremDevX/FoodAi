import React, { useState } from "react";
import { Bell, AlertTriangle, CloudRain, Lightbulb } from "lucide-react";
import Modal from "../common/Modal";

interface Notification {
  id: string;
  type: "warning" | "alert" | "info";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "alert",
    title: "Alerte Météo",
    message:
      "Orages violents prévus demain soir. Impact terrasse estimé : -30%.",
    time: "Il y a 10 min",
    read: false,
  },
  {
    id: "n2",
    type: "warning",
    title: "Stock Critique",
    message: "Mozzarella à épuisement dans 2 services.",
    time: "Il y a 1h",
    read: false,
  },
  {
    id: "n3",
    type: "info",
    title: "Opportunité Achat",
    message: "Promo -20% sur la Tomate chez Franck Légumes.",
    time: "Il y a 3h",
    read: false,
  },
];

// Styles pour les badges d'icônes professionnels - Couleurs DA
const iconBadgeStyles = {
  alert: {
    // Teal pour météo/alertes
    background: "linear-gradient(135deg, #218083 0%, #1a6668 100%)",
    boxShadow: "0 4px 12px rgba(33, 128, 131, 0.35)",
  },
  warning: {
    // Moderate (orange) pour warnings
    background: "linear-gradient(135deg, #c0152f 0%, #a01228 100%)",
    boxShadow: "0 4px 12px rgba(192, 21, 47, 0.35)",
  },
  info: {
    // Primary (vert) pour infos
    background: "linear-gradient(135deg, #00c796 0%, #00b386 100%)",
    boxShadow: "0 4px 12px rgba(0, 199, 150, 0.35)",
  },
};

const Notifications: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleOpen = () => {
    setIsOpen(true);
    markAsRead();
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const getIcon = (type: "warning" | "alert" | "info") => {
    const badgeStyle = iconBadgeStyles[type];

    const IconComponent = () => {
      switch (type) {
        case "alert":
          return <CloudRain size={18} strokeWidth={2.5} color="white" />;
        case "warning":
          return <AlertTriangle size={18} strokeWidth={2.5} color="white" />;
        default:
          return <Lightbulb size={18} strokeWidth={2.5} color="white" />;
      }
    };

    return (
      <div
        style={{
          ...badgeStyle,
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        className="icon-badge"
      >
        <IconComponent />
      </div>
    );
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell size={20} className="text-secondary" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Notifications"
        width="md"
      >
        <div
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            padding: "8px 4px",
          }}
        >
          {notifications.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "48px 24px",
                color: "#6b7280",
              }}
            >
              <Bell size={48} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
              <p style={{ fontSize: "14px", fontWeight: 500 }}>
                Aucune notification
              </p>
              <p style={{ fontSize: "12px", marginTop: "4px", opacity: 0.7 }}>
                Vous êtes à jour !
              </p>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  style={{
                    padding: "16px 18px",
                    borderRadius: "12px",
                    background: !notif.read
                      ? "linear-gradient(135deg, rgba(0, 199, 150, 0.08) 0%, rgba(0, 179, 134, 0.05) 100%)"
                      : "#fafafa",
                    border: !notif.read
                      ? "1px solid rgba(0, 199, 150, 0.2)"
                      : "1px solid var(--color-border, #e5e7eb)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 20px rgba(0, 0, 0, 0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(0, 0, 0, 0.04)";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ flexShrink: 0 }}>{getIcon(notif.type)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "8px",
                        }}
                      >
                        <h4
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "var(--color-text-primary, #1b263b)",
                            margin: 0,
                            lineHeight: 1.4,
                          }}
                        >
                          {notif.title}
                        </h4>
                        <span
                          style={{
                            fontSize: "10px",
                            color: "#9ca3af",
                            background: "#f3f4f6",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            fontWeight: 500,
                            whiteSpace: "nowrap",
                            marginLeft: "12px",
                          }}
                        >
                          {notif.time}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: "13px",
                          color: "var(--color-text-secondary, #475569)",
                          margin: 0,
                          lineHeight: 1.6,
                        }}
                      >
                        {notif.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer avec séparateur et bouton stylisé */}
        <div
          style={{
            marginTop: "20px",
            paddingTop: "16px",
            borderTop: "1px solid var(--color-border, #e5e7eb)",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "white",
              background: "linear-gradient(135deg, #00c796 0%, #00b386 100%)",
              border: "none",
              padding: "10px 24px",
              borderRadius: "var(--radius-md, 10px)",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0, 199, 150, 0.3)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(0, 199, 150, 0.4);";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(0, 199, 150, 0.3)";
            }}
          >
            ✓ Tout marquer comme lu
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Notifications;
