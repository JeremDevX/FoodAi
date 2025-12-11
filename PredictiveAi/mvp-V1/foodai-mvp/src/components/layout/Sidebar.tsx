import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Brain,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  BookOpen,
} from "lucide-react";
// Styles are imported in Sidebar.css
import "./Sidebar.css";

const Sidebar: React.FC = () => {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Package, label: "Stocks", path: "/stocks" },
    { icon: Brain, label: "Prédictions", path: "/predictions" },
    { icon: BookOpen, label: "Recettes", path: "/recipes" }, // New
    { icon: BarChart3, label: "Analytics", path: "/analytics" }, // Phase 1.5
    { icon: Settings, label: "Paramètres", path: "/settings" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/logo_Komia.svg" alt="KookiA" className="logo-img" />
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <a href="#" className="nav-item">
          <HelpCircle size={20} />
          <span>Support</span>
        </a>
        <button className="nav-item logout-btn">
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
