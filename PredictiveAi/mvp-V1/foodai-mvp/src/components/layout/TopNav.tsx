import React from "react";
import Notifications from "./Notifications";
import "../../styles/index.css";
import "./TopNav.css";

const TopNav: React.FC = () => {
  return (
    <header className="top-nav">
      <div className="breadcrumbs">
        <span className="current-page">Dashboard</span>
      </div>

      <div className="top-nav-actions">
        <Notifications />
        <div className="user-profile">
          <div className="avatar">JM</div>
          <span className="username">Jean Martin</span>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
