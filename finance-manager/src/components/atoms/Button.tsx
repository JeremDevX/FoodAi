import React, { forwardRef } from "react";
import { LucideIcon } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      icon: Icon,
      iconPosition = "left",
      fullWidth = false,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variantStyles = {
      primary:
        "bg-[var(--color-accent)] text-[var(--text-on-accent)] hover:opacity-90 focus:ring-[var(--color-accent)] shadow-sm hover:shadow-md",
      secondary:
        "bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:opacity-80 border border-[var(--border-primary)] focus:ring-[var(--color-accent)]",
      ghost:
        "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] focus:ring-[var(--color-accent)]",
    };

    const widthStyle = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${variantStyles[variant]} ${widthStyle} ${className}`}
        {...props}
      >
        {Icon && iconPosition === "left" && <Icon className="h-4 w-4" />}
        {children && <span>{children}</span>}
        {Icon && iconPosition === "right" && <Icon className="h-4 w-4" />}
      </button>
    );
  }
);

Button.displayName = "Button";
