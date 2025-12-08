import React, { useState } from "react";
import { Bell, AlertTriangle, TrendingDown, Info, X } from "lucide-react";
import Card from "../common/Card";

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

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) markAsRead();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle size={16} className="text-red-500" />;
      case "warning":
        return <TrendingDown size={16} className="text-orange-500" />;
      default:
        return <Info size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleOpen}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell size={20} className="text-secondary" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
          <Card className="absolute right-0 mt-2 w-80 z-50 shadow-xl p-0 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-3 border-b flex justify-between items-center bg-gray-50">
              <h4 className="font-semibold text-sm">Notifications</h4>
              <button onClick={() => setIsOpen(false)}>
                <X size={14} className="text-secondary" />
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 border-b last:border-0 hover:bg-gray-50 transition-colors ${
                    !notif.read ? "bg-blue-50/50" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="mt-1">{getIcon(notif.type)}</div>
                    <div>
                      <p className="text-sm font-medium text-primary">
                        {notif.title}
                      </p>
                      <p className="text-xs text-secondary mt-1">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-secondary mt-2 font-mono uppercase">
                        {notif.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-2 border-t bg-gray-50 text-center">
              <button className="text-xs text-primary font-medium hover:underline">
                Voir tout
              </button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default Notifications;
