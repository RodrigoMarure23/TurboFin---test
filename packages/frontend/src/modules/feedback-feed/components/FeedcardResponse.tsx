// modules/feedback-feed/components/FeedCardResponse.tsx
import { useState } from "react";
import { Send, X } from "lucide-react";

interface FeedCardResponseProps {
  onSend: (content: string) => void;
  onCancel: () => void;
}

export const FeedCardResponse = ({
  onSend,
  onCancel,
}: FeedCardResponseProps) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="ml-6 md:ml-12 mt-3 animate-in fade-in slide-in-from-top-2 duration-300"
    >
      {/* Contenedor: Blanco con borde sutil y sombra suave */}
      <div className="bg-white border border-red-100 p-4 rounded-2xl shadow-lg shadow-red-600/5">
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe tu respuesta aquí..."
          className="w-full bg-transparent text-gray-700 text-sm outline-none resize-none min-h-[100px] placeholder:text-gray-300 font-medium leading-relaxed"
        />

        <div className="flex justify-end gap-3 mt-3 pt-3 border-t border-gray-50">
          {/* Botón Cancelar - Estilo minimalista */}
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-600 transition-colors"
          >
            <X className="w-3 h-3" />
            Cancelar
          </button>

          {/* Botón Enviar - Rojo Turbofin */}
          <button
            type="submit"
            disabled={!text.trim()}
            className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-[11px] font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-red-600/10 active:scale-95"
          >
            <Send className="w-3 h-3" />
            Enviar respuesta
          </button>
        </div>
      </div>
    </form>
  );
};
