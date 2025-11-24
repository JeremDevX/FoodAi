import React from "react";
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/atoms";

export interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  gradient?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  gradient = "from-blue-500 to-indigo-600",
}) => {
  return (
    <Card
      variant="glass"
      className="relative overflow-hidden transition-all duration-200 hover:scale-[1.02]"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`}
      />
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-4">
          <div
            className="p-3 rounded-lg"
            style={{ background: "var(--bg-glass)" }}
          >
            <Icon className="h-6 w-6" style={{ color }} />
          </div>
        </div>
        <div>
          <div
            className="text-base font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            {title}
          </div>
          <div className="text-3xl font-bold" style={{ color }}>
            {value}
          </div>
        </div>
      </div>
    </Card>
  );
};
