"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function getVariantClasses(variant: ButtonVariant): string {
  switch (variant) {
    case "primary":
      return "bg-blue-600 text-white border-blue-600 hover:bg-blue-700";
    case "secondary":
      return "bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200";
    case "danger":
      return "bg-red-600 text-white border-red-600 hover:bg-red-700";
    case "ghost":
      return "bg-transparent text-gray-700 border-gray-600 hover:bg-gray-100";
    default:
      return "bg-blue-600 text-white border-blue-600 hover:bg-blue-700";
  }
}

function getSizeClasses(size: ButtonSize): string {
  switch (size) {
    case "sm":
      return "px-3 py-1.5 text-sm";
    case "md":
      return "px-4 py-2 text-sm";
    case "lg":
      return "px-5 py-2.5 text-base";
    default:
      return "px-4 py-2 text-sm";
  }
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  className = "",
  leftIcon,
  rightIcon,
  type = "button",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={[
        "inline-flex items-center justify-center rounded border font-medium transition",
        "disabled:opacity-50 disabled:cursor-not-allowed rounded-md",
        getVariantClasses(variant),
        getSizeClasses(size),
        className,
      ].join(" ")}
      {...props}
    >
      {!isLoading && leftIcon ? (
        <span className="inline-flex pe-1">{leftIcon}</span>
      ) : null}
      <span>{isLoading ? "Cargando..." : children}</span>
      {!isLoading && rightIcon ? (
        <span className="inline-flex">{rightIcon}</span>
      ) : null}
    </button>
  );
}
