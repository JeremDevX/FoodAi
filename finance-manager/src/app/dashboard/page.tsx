"use client";

import UltimateFinancialPulse from "@/components/Dashboard/UltimateFinancialPulse";
import UltimateMonthlyOverview from "@/components/Dashboard/UltimateMonthlyOverview";
import RecentTransactions from "@/components/Dashboard/RecentTransactions";
import GoalsOverview from "@/components/Dashboard/GoalsOverview";

export default function DashboardPage() {
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
