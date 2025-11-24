import React, { forwardRef } from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "glass" | "elevated";
  hover?: boolean;
  padding?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = "glass",
      hover = false,
      padding = true,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "rounded-xl transition-all duration-200 border border-[var(--border-primary)]";

    const variantStyles = {
      glass: "glass-card backdrop-blur-md",
      elevated: "bg-[var(--bg-secondary)] shadow-[var(--shadow-primary)]",
    };

    const hoverStyles = hover
      ? "hover:shadow-[var(--shadow-hover)] hover:scale-[1.01] cursor-pointer"
      : "";

    const paddingStyle = padding ? "p-6" : "";

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${paddingStyle} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
