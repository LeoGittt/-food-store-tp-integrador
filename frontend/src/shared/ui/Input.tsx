import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <label className="block mb-3">
      <span className="block text-sm mb-1">{label}</span>
      <input className="border border-gray-400 rounded px-2 py-1 w-full" {...props} />
      {error && <span className="text-sm text-red-600">{error}</span>}
    </label>
  );
}
