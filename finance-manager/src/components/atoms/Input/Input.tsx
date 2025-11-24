"use client";

import { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = true,
      required,
      id,
      className = "",
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className={`space-y-2 ${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            {label}
            {required && (
              <span
                className="ml-1"
                style={{ color: "var(--color-danger)" }}
                aria-label="requis"
              >
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div
              className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-tertiary)" }}
              aria-hidden="true"
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`
              w-full px-4 py-3 rounded-lg transition-all duration-200
              min-h-[44px]
              ${leftIcon ? "pl-10" : ""}
              ${rightIcon ? "pr-10" : ""}
              focus:outline-none focus:ring-2 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
            `}
            style={{
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              border: `2px solid ${
                error ? "var(--color-danger)" : "var(--border-primary)"
              }`,
            }}
            aria-required={required}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            {...props}
          />

          {rightIcon && (
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-tertiary)" }}
              aria-hidden="true"
            >
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p
            id={errorId}
            className="text-sm font-medium"
            style={{ color: "var(--color-danger)" }}
            role="alert"
          >
            {error}
          </p>
        )}

        {!error && helperText && (
          <p
            id={helperId}
            className="text-sm"
            style={{ color: "var(--text-tertiary)" }}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
