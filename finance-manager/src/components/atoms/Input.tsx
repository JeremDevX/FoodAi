import React, { forwardRef } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, icon, id, className = "", required, ...props },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-label="requis">
                *
              </span>
            )}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div
              className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-secondary)" }}
            >
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            required={required}
            aria-required={required}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            className={`w-full ${
              icon ? "pl-10" : "pl-4"
            } pr-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] disabled:opacity-50 disabled:cursor-not-allowed ${
              error
                ? "border-2 border-red-500 focus:border-red-500"
                : "border border-[var(--border-primary)]"
            } ${className}`}
            style={{
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
            }}
            {...props}
          />
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="mt-2 text-sm text-red-500"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="mt-2 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
