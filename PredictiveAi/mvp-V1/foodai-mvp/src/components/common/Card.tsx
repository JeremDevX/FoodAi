import React from "react";
import clsx from "clsx";
import "../../styles/index.css";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className, title, action }) => {
  return (
    <div className={clsx("card-component", className)}>
      {(title || action) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {action && <div className="card-action">{action}</div>}
        </div>
      )}
      <div className="card-content">{children}</div>

      <style>{`
                .card-component {
                    background-color: var(--color-surface);
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-md);
                    box-shadow: var(--shadow-sm);
                    overflow: hidden;
                }

                .card-header {
                    padding: var(--spacing-md) var(--spacing-lg);
                    border-bottom: 1px solid var(--color-border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .card-title {
                    font-size: var(--font-size-lg);
                    font-weight: 600;
                    color: var(--color-text-primary);
                    margin: 0;
                }

                .card-content {
                    padding: var(--spacing-lg);
                }
            `}</style>
    </div>
  );
};

export default Card;
