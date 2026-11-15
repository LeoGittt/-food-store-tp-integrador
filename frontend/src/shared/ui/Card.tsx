import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
}

export function Card({ children }: CardProps) {
  return <div className="border border-gray-300 rounded p-4">{children}</div>;
}
