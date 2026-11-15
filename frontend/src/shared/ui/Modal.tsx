import type { ReactNode } from "react";

interface ModalProps {
  abierto: boolean;
  titulo: string;
  onCerrar: () => void;
  children: ReactNode;
}

export function Modal({ abierto, titulo, onCerrar, children }: ModalProps) {
  if (!abierto) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded p-4 w-full max-w-lg max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold">{titulo}</h2>
          <button onClick={onCerrar}>Cerrar</button>
        </div>
        {children}
      </div>
    </div>
  );
}
