import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "EUR"): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

import { useFinanceStore } from "@/lib/store";

// Hook pour formater avec la devise des settings
export function useFormatCurrency() {
  const { settings } = useFinanceStore();
  const currency = settings?.currency || "EUR";

  return (amount: number) => formatCurrency(amount, currency);
}

// Helper pour normaliser les dates (string | Date -> Date)
export function normalizeDate(date: Date | string): Date {
  if (date instanceof Date) {
    return date;
  }
  return new Date(date);
}

// Helper pour formater les dates avec les settings
export function useDateFormatter() {
  const { settings } = useFinanceStore();

  return {
    formatDate: (date: Date | string) => formatDate(normalizeDate(date)),
    formatShortDate: (date: Date | string) =>
      formatShortDate(normalizeDate(date)),
  };
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function calculatePercentage(current: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((current / total) * 100);
}

export function getMonthName(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", { month: "long" }).format(date);
}

export function getFinancialColor(amount: number): string {
  if (amount > 0) return "text-success";
  if (amount < 0) return "text-danger";
  return "text-gray-600";
}

export function getPulseColor(
  status: "healthy" | "warning" | "danger"
): string {
  switch (status) {
    case "healthy":
      return "text-success";
    case "warning":
      return "text-warning";
    case "danger":
      return "text-danger";
    default:
      return "text-gray-600";
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function parseCSV(text: string): string[][] {
  const lines = text.split("\n");
  return lines.map((line) => {
    const result = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  });
}

export function downloadFile(
  content: string,
  filename: string,
  type = "text/plain"
) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
