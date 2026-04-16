// modules/shared/components/ActionModal.tsx
import { AlertTriangle, X } from "lucide-react";

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ActionModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: ActionModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white border border-gray-100 w-full max-w-md rounded-[2rem] p-10 shadow-2xl relative animate-in zoom-in-95 duration-300">
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-300 hover:text-red-600 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-6">
          {/* Icono de Alerta - Rojo Turbofin Soft */}
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-600 shadow-inner">
            <AlertTriangle className="w-10 h-10" />
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-black text-gray-950 tracking-tight">
              {title}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed font-medium px-4">
              {message}
            </p>
          </div>

          <div className="flex w-full gap-4 pt-4">
            {/* Cancelar - Estilo Secundario */}
            <button
              onClick={onClose}
              className="flex-1 px-4 py-4 bg-gray-50 text-gray-400 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-100 hover:text-gray-600 transition-all active:scale-95"
            >
              Cancelar
            </button>

            {/* Confirmar - Rojo Turbofin */}
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-95"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
