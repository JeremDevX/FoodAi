"use client";

import { useEffect } from "react";
import { useFinanceStore } from "@/lib/store";
import { initializeDatabase } from "@/lib/database";
import { useAutoBackup } from "@/hooks/useAutoBackup";
import { useLocalStorageSync } from "@/hooks/useLocalStorageSync";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import UltimateSidebar from "@/components/Layout/UltimateSidebar";
import UltimateHeader from "@/components/Layout/UltimateHeader";
import UltimateFinancialPulse from "@/components/Dashboard/UltimateFinancialPulse";
import UltimateMonthlyOverview from "@/components/Dashboard/UltimateMonthlyOverview";
import RecentTransactions from "@/components/Dashboard/RecentTransactions";
import GoalsOverview from "@/components/Dashboard/GoalsOverview";
import TransactionManager from "@/components/Transactions/TransactionManager";
import GoalsManager from "@/components/Goals/GoalsManager";
import AnalyticsDashboard from "@/components/Analytics/AnalyticsDashboard";
import UltimateSettings from "@/components/Settings/UltimateSettings";

export default function Home() {
  const { currentView, loadData } = useFinanceStore();

  // Initialize hooks
  useErrorHandler();
  useAutoBackup();
  useLocalStorageSync();

  useEffect(() => {
    // Initialize database and load data (only once on client)
    initializeDatabase()
      .then(() => {
        loadData();
      })
      .catch((error) => {
        console.error("Failed to initialize app:", error);
      });
  }, [loadData]);

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <div className="space-y-8">
            <UltimateFinancialPulse />
            <UltimateMonthlyOverview />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RecentTransactions />
              <GoalsOverview />
            </div>
          </div>
        );
      case "transactions":
        return <TransactionManager />;
      case "goals":
        return <GoalsManager />;
      case "analytics":
        return <AnalyticsDashboard />;
      case "settings":
        return <UltimateSettings />;
      default:
        return (
          <div className="space-y-8">
            <UltimateFinancialPulse />
            <UltimateMonthlyOverview />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RecentTransactions />
              <GoalsOverview />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Ultimate Sidebar */}
      <div className="flex-shrink-0">
        <UltimateSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Ultimate Header */}
        <UltimateHeader />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6" role="main">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
}
