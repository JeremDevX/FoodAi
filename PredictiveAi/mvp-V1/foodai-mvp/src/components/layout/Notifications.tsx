import React, { useState } from "react";
import { Bell, AlertTriangle, TrendingDown, Info } from "lucide-react";
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

  const getIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle size={16} className="text-urgent" />;
      case "warning":
        return <TrendingDown size={16} className="text-moderate" />;
      default:
        return <Info size={16} className="text-primary" />;
    }
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
        width="sm"
      >
        <div className="max-h-80 overflow-y-auto -mx-6 -mt-2">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-secondary">
              Aucune notification
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`px-6 py-4 border-b last:border-0 hover:bg-gray-50 transition-colors ${
                  !notif.read ? "bg-blue-50/30" : ""
                }`}
              >
                <div className="flex gap-3">
                  <div className="mt-1 flex-shrink-0">
                    {getIcon(notif.type)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">
                      {notif.title}
                    </p>
                    <p className="text-xs text-secondary mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-secondary mt-2 font-mono uppercase tracking-wide">
                      {notif.time}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="pt-4 border-t text-center -mx-6 -mb-2 pb-2">
          <button className="text-xs text-primary font-medium hover:underline">
            Tout marquer comme lu
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Notifications;
