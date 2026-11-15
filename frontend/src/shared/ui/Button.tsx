import type { ButtonHTMLAttributes } from "react";

export function Button({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`border border-gray-700 rounded px-3 py-1 hover:bg-gray-100 disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
