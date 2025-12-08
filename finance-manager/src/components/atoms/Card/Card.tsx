"use client";

import { HTMLAttributes, forwardRef } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
  gradient?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = "default",
      padding = "md",
      hoverable = false,
      gradient = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseStyles = "rounded-xl transition-all duration-200";

    const variants = {
      default: `
        bg-[var(--bg-secondary)] 
        border border-[var(--border-primary)]
      `,
      glass: `
        bg-[var(--bg-glass)]
        backdrop-blur-md
        border border-[var(--border-primary)]
        shadow-[var(--shadow-primary)]
      `,
      elevated: `
        bg-[var(--bg-secondary)]
        border border-[var(--border-primary)]
        shadow-lg
      `,
    };

    const paddings = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    const hoverStyles = hoverable
      ? "hover:shadow-xl hover:scale-[1.02] cursor-pointer"
      : "";

    return (
      <div
        ref={ref}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${paddings[padding]}
          ${hoverStyles}
          ${className}
          relative overflow-hidden
        `}
        {...props}
      >
        {gradient && (
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ background: "var(--gradient-primary)" }}
            aria-hidden="true"
          />
        )}
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);

Card.displayName = "Card";
