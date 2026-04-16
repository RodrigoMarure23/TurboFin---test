import { useState } from "react";
import {
  X,
  MessageSquare,
  Heart,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from "lucide-react";

// 1. Estructura de una respuesta
interface Reply {
  id: string;
  content: string;
  username: string;
  created_at: string;
}

// 2. Estructura del Post principal
export interface PostWithReplies {
  id: string;
  content: string;
  created_at: string;
  likes_count: number;
  interactions: number;
  username: string;
  replies: Reply[];
}

// 3. Props actualizadas incluyendo onRefresh
interface MyPostsProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void; // Prop para disparar el re-fetch de datos
  posts: PostWithReplies[];
  isLoading?: boolean; // Opcional: para mostrar estado de carga en el botón
}

export const MyPosts = ({
  isOpen,
  onClose,
  onRefresh,
  posts,
  isLoading,
}: MyPostsProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  console.log("postsaux", posts);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-lg bg-gray-50 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header del Drawer */}
        <div className="p-6 bg-white border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <MessageSquare className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Mis Publicaciones
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Botón de Refrescar Datos */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-600 transition-all disabled:opacity-50"
              title="Actualizar lista"
            >
              <RefreshCw
                className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Listado de Posts */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <p className="text-gray-400 italic text-sm">
                No has publicado nada aún.
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:border-red-100"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-gray-800 text-lg font-medium mb-6">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-red-600 font-bold">
                        <Heart className="w-4 h-4 fill-current" />
                        <span className="text-sm">{post.likes_count}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-400 font-medium">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm">{post.interactions}</span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setExpandedId(expandedId === post.id ? null : post.id)
                      }
                      className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider transition-colors ${
                        expandedId === post.id
                          ? "text-red-600"
                          : "text-gray-400 hover:text-red-600"
                      }`}
                    >
                      {expandedId === post.id ? "OCULTAR" : "INTERACCIONES"}
                      {expandedId === post.id ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Sección de Respuestas */}
                {expandedId === post.id && (
                  <div className="bg-gray-50/50 p-6 border-t border-gray-50 space-y-4 animate-in slide-in-from-top-2">
                    <p className="text-[10px] font-black text-gray-400 text-center uppercase tracking-[0.2em] mb-4">
                      Respuestas Recientes
                    </p>

                    {post.replies && post.replies.length > 0 ? (
                      post.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-3"
                        >
                          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 uppercase">
                            {reply.username.substring(0, 2)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <p className="text-xs font-bold text-gray-900">
                                {reply.username}
                              </p>
                              <span className="text-[9px] text-gray-400">
                                {(() => {
                                  if (!reply.created_at)
                                    return "Fecha no disponible";

                                  // Normalizamos el string para asegurar compatibilidad con el constructor Date
                                  const dateStr = String(
                                    reply.created_at,
                                  ).replace(" ", "T");
                                  const date = new Date(dateStr);

                                  if (isNaN(date.getTime()))
                                    return "Fecha no disponible";

                                  // Opción 1: Usando toLocaleString para un formato rápido (Fecha + Hora)
                                  // Resultado aprox: 14/4/2026, 12:21:42
                                  return date.toLocaleString();

                                  /* Opción 2: Si quieres un formato personalizado más estricto:
       const fecha = date.toLocaleDateString();
       const hora = date.toTimeString().split(' ')[0]; // Extrae HH:mm:ss
       return `${fecha} ${hora}`; 
    */
                                })()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-xs text-gray-400 italic py-4">
                        No hay respuestas aún para esta publicación.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
