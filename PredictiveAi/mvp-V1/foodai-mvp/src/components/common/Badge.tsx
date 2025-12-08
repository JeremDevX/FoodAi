import React from "react";
import clsx from "clsx";
import type { ProductStatus } from "../../utils/mockData";
import "../../styles/index.css";

interface BadgeProps {
  status?: ProductStatus;
  label: string;
  color?: string; // Hex override
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ status, label, color, className }) => {
  // Determine class based on status if provided
  const statusClass = status ? `badge-${status}` : "";

  return (
    <span
      className={clsx("badge", statusClass, className)}
      style={
        color
          ? { backgroundColor: color + "20", color: color, borderColor: color }
          : {}
      }
    >
      {status === "urgent" && <span className="dot urgent"></span>}
      {status === "moderate" && <span className="dot moderate"></span>}
      {status === "optimal" && <span className="dot optimal"></span>}
      {label}

      <style>{`
                .badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 4px 10px;
                    border-radius: var(--radius-full);
                    font-size: var(--font-size-sm);
                    font-weight: 500;
                    border: 1px solid transparent;
                }

                .badge-urgent {
                    background-color: rgba(192, 21, 47, 0.1);
                    color: var(--color-urgent);
                    border-color: rgba(192, 21, 47, 0.2);
                }

                .badge-moderate {
                    background-color: rgba(168, 75, 47, 0.1);
                    color: var(--color-moderate);
                    border-color: rgba(168, 75, 47, 0.2);
                }

                .badge-optimal {
                    background-color: rgba(34, 139, 91, 0.1);
                    color: var(--color-optimal);
                    border-color: rgba(34, 139, 91, 0.2);
                }

                .dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                }
                .dot.urgent { background-color: var(--color-urgent); }
                .dot.moderate { background-color: var(--color-moderate); }
                .dot.optimal { background-color: var(--color-optimal); }
            `}</style>
    </span>
  );
};

export default Badge;
