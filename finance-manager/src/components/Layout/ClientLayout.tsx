"use client";

import { useEffect } from "react";
import { useFinanceStore } from "@/lib/store";
import { initializeDatabase } from "@/lib/database";
import { useAutoBackup } from "@/hooks/useAutoBackup";
import { useLocalStorageSync } from "@/hooks/useLocalStorageSync";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import UltimateSidebar from "@/components/Layout/UltimateSidebar";
import UltimateHeader from "@/components/Layout/UltimateHeader";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loadData } = useFinanceStore();

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

  return (
    <div className="flex h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Skip Links for keyboard navigation */}
      <a
        href="#main-content"
        className="wcag-skip-link"
        style={{
          position: "absolute",
          top: "-40px",
          left: "6px",
          background: "var(--wcag-focus)",
          color: "white",
          padding: "8px 16px",
          borderRadius: "4px",
          textDecoration: "none",
          fontWeight: "bold",
          zIndex: 10000,
        }}
      >
        Aller au contenu principal
      </a>

      {/* Ultimate Sidebar */}
      <div className="flex-shrink-0">
        <UltimateSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Ultimate Header */}
        <UltimateHeader />

        {/* Content */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-6"
          role="main"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
