"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed touch-target";

    const variants = {
      primary: `
        bg-[var(--color-accent)] 
        text-white 
        hover:opacity-90 
        focus:ring-[var(--color-accent)]
        shadow-sm hover:shadow-md
      `,
      secondary: `
        bg-[var(--bg-secondary)] 
        text-[var(--text-primary)] 
        border border-[var(--border-primary)]
        hover:bg-[var(--bg-tertiary)]
        focus:ring-[var(--color-accent)]
      `,
      danger: `
        bg-[var(--color-danger)] 
        text-white 
        hover:opacity-90
        focus:ring-[var(--color-danger)]
        shadow-sm hover:shadow-md
      `,
      ghost: `
        bg-transparent
        text-[var(--text-primary)]
        hover:bg-[var(--bg-secondary)]
        focus:ring-[var(--color-accent)]
      `,
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm min-h-[36px]",
      md: "px-4 py-2.5 text-base min-h-[44px]",
      lg: "px-6 py-3 text-lg min-h-[48px]",
    };

    return (
      <button
        ref={ref}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        disabled={disabled || isLoading}
        style={{
          transform: disabled || isLoading ? "none" : undefined,
        }}
        {...props}
      >
        {isLoading ? (
          <div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
            role="status"
            aria-label="Chargement"
          />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
