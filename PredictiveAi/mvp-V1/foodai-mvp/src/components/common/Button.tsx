import React from "react";
import clsx from "clsx";
import "../../styles/index.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  className,
  ...props
}) => {
  return (
    <button
      className={clsx("btn", `btn-${variant}`, `btn-${size}`, className)}
      {...props}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children}

      <style>{`
                .btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--spacing-sm);
                    border-radius: var(--radius-md);
                    font-weight: 500;
                    transition: all 0.2s ease;
                    border: 1px solid transparent;
                }
                
                .btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                /* Sizes */
                .btn-sm { font-size: 12px; padding: 4px 12px; height: 32px; }
                .btn-md { font-size: 14px; padding: 8px 16px; height: 40px; }
                .btn-lg { font-size: 16px; padding: 12px 24px; height: 48px; }

                /* Variants */
                .btn-primary {
                    background-color: var(--color-primary);
                    color: white;
                }
                .btn-primary:hover:not(:disabled) {
                    background-color: var(--color-primary-hover);
                }

                .btn-secondary {
                    background-color: var(--color-surface);
                    color: var(--color-text-primary);
                    border-color: var(--color-border);
                }
                .btn-secondary:hover:not(:disabled) {
                    background-color: var(--color-surface-hover);
                    border-color: var(--color-text-secondary);
                }

                .btn-outline {
                    background-color: transparent;
                    border-color: var(--color-primary);
                    color: var(--color-primary);
                }
                .btn-outline:hover:not(:disabled) {
                    background-color: rgba(33, 128, 141, 0.05);
                }
                
                .btn-danger {
                    background-color: var(--color-urgent);
                    color: white;
                }
                
                .btn-ghost {
                    background-color: transparent;
                    color: var(--color-text-secondary);
                }
                .btn-ghost:hover:not(:disabled) {
                    color: var(--color-text-primary);
                    background-color: rgba(0,0,0,0.05);
                }

                .btn-icon {
                    display: flex;
                    align-items: center;
                }
            `}</style>
    </button>
  );
};

export default Button;
