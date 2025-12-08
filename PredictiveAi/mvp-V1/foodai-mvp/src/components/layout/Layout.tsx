import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import "../../styles/index.css";

const Layout: React.FC = () => {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-content-wrapper">
        <TopNav />
        <main className="main-content">
          <Outlet />
        </main>
      </div>

      <style>{`
                .layout-container {
                    display: flex;
                    min-height: 100vh;
                    background-color: var(--color-bg);
                }

                .main-content-wrapper {
                    flex: 1;
                    margin-left: 260px; /* Width of sidebar */
                    display: flex;
                    flex-direction: column;
                }

                .main-content {
                    padding: var(--spacing-xl);
                    flex: 1;
                    overflow-y: auto;
                }
            `}</style>
    </div>
  );
};

export default Layout;
