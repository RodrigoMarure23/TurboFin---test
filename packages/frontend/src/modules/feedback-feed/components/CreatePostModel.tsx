// modules/feedback-feed/components/CreatePostModal.tsx
import { useState } from "react";
import { X, Send, MessageSquarePlus } from "lucide-react";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string) => void;
}

export const CreatePostModal = ({
  isOpen,
  onClose,
  onSubmit,
}: CreatePostModalProps) => {
  const [content, setContent] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-gray-100 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header - Limpio y con acento rojo */}
        <div className="flex justify-between items-center p-6 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-50 rounded-xl text-red-600 shadow-sm shadow-red-600/5">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-gray-950 tracking-tight">
              Nuevo Feedback
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all active:scale-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="relative">
            <textarea
              autoFocus
              className="w-full h-44 bg-gray-50/50 text-gray-800 p-5 rounded-2xl border border-gray-100 focus:border-red-200 focus:ring-4 focus:ring-red-600/5 outline-none resize-none transition-all placeholder:text-gray-400 font-medium leading-relaxed"
              placeholder="¿En qué estás pensando? Compártelo con los demás o pregunta aquí..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            {/* Indicador visual de foco estilo Login */}
            <div
              className={`absolute left-0 top-4 w-1 h-6 bg-red-600 rounded-r-full transition-opacity ${content ? "opacity-0" : "opacity-100 animate-pulse"}`}
            />
          </div>

          <div className="flex justify-end items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
            >
              Cancelar
            </button>

            {/* Botón Principal Rojo */}
            <button
              type="submit"
              disabled={!content.trim()}
              className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-red-600/20 active:scale-95"
            >
              <Send className="w-4 h-4" />
              Publicar ahora
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
