import { useState } from "react";
import {
  Heart,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  User,
} from "lucide-react";
export interface Reply {
  id: string;
  content: string;
  sender: string;
  created_at: string;
  likesCount: number;
}

export interface Feedback {
  id: string;
  userId: string;
  content: string;
  sender: string;
  created_at: string;
  likesCount: number;
  parent_id: string | null;
  replies: Reply[];
  username?: string;
}

interface FeedbackCardProps {
  feedback: Feedback;
  onLike: (id: string) => void;
  onReply: (parentId: string) => void;
  onRefresh: () => void;
}

export const FeedbackCard = ({
  feedback,
  onLike,
  onReply,
}: FeedbackCardProps) => {
  const [showReplies, setShowReplies] = useState(false);

  // 1. Extraemos los datos del usuario una sola vez al inicializar
  const [userData] = useState(() => {
    const authUser = localStorage.getItem("auth_user");
    if (authUser) {
      try {
        return JSON.parse(authUser);
      } catch (e) {
        console.error("Error parseando auth_user", e);
      }
    }
    return null;
  });

  const currentUserId = userData?.id || null;
  const currentUsername = userData?.username || null;
  const isOwnMessage = feedback.userId === currentUserId;

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr.replace(" ", "T"));
    return isNaN(date.getTime())
      ? "Fecha no disponible"
      : `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  return (
    <div
      className={`bg-white rounded-3xl p-6 shadow-sm flex flex-col h-full relative transition-all hover:shadow-md border-2 
      ${isOwnMessage ? "border-red-500/20 bg-red-50/5" : "border-gray-100"}`}
    >
      {/* ... Header, Content y Footer (se mantienen igual) ... */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-black uppercase tracking-widest ${isOwnMessage ? "text-red-600" : "text-gray-400"}`}
            >
              {feedback.username}
            </span>
            {isOwnMessage && (
              <span className="bg-red-600 text-[8px] text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <User className="w-2 h-2" /> TÚ
              </span>
            )}
          </div>
          <span className="text-[9px] text-gray-400">
            {formatDateTime(feedback.created_at)}
          </span>
        </div>
      </div>

      <div className="flex-1">
        <p className="text-gray-800 text-lg font-medium leading-tight">
          {feedback.content}
        </p>
      </div>

      {/* Footer / Actions */}
      <div
        className={`flex items-center justify-between mt-6 pt-4 border-t ${isOwnMessage ? "border-red-100" : "border-gray-50"}`}
      >
        <div className="flex items-center gap-4">
          {/* Botón de Like: Bloqueado si es mío */}
          <button
            onClick={() => !isOwnMessage && onLike(feedback.id)}
            disabled={isOwnMessage}
            className={`flex items-center gap-1.5 transition-all 
        ${isOwnMessage ? "text-gray-300 cursor-not-allowed opacity-50" : "text-red-600 hover:scale-110"}`}
          >
            <Heart
              className={`w-4 h-4 ${feedback.likesCount > 0 ? "fill-current" : ""}`}
            />
            <span className="text-sm font-black">{feedback.likesCount}</span>
          </button>

          {/* Contador de Mensajes */}
          <button
            onClick={() => setShowReplies(!showReplies)}
            className={`flex items-center gap-1.5 transition-colors ${showReplies ? "text-blue-600" : "text-gray-400 hover:text-blue-500"}`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-bold">{feedback.replies.length}</span>
          </button>

          {/* --- BLOQUEO DE AUTO-RESPUESTA --- */}
          {/* Solo mostramos "Responder" si:
        1. NO es un mensaje que ya sea una respuesta (!feedback.parent_id)
        2. NO es un mensaje escrito por "MÍ" (!isOwnMessage)
    */}
          {!feedback.parent_id && !isOwnMessage && (
            <button
              onClick={() => onReply(feedback.id)}
              className="flex items-center gap-1.5 text-gray-400 hover:text-green-600 transition-colors"
            >
              <span className="text-[10px] font-black uppercase tracking-tighter">
                Responder
              </span>
            </button>
          )}

          {/* Opcional: Mostrar un texto sutil si es mi mensaje */}
          {isOwnMessage && !feedback.parent_id && (
            <span className="text-[9px] font-bold text-gray-300 uppercase italic tracking-wider">
              Tu publicación
            </span>
          )}
        </div>

        {/* Botón de flecha para desplegar hilos */}
        {feedback.replies.length > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1"
          >
            {showReplies ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        )}
      </div>

      {/* Pop-up de Respuestas */}
      {showReplies && feedback.replies.length > 0 && (
        <div className="absolute top-[100%] left-0 w-full z-20 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest border-b pb-2">
              Hilo de conversación
            </p>
            {feedback.replies.map((reply: Reply) => {
              // Ahora usamos el currentUsername que extrajimos arriba de forma eficiente
              const isOwnReply = reply.sender === currentUsername;
              return (
                <div
                  key={reply.id}
                  className={`group border-l-2 pl-3 transition-colors ${isOwnReply ? "border-red-400 bg-red-50/30" : "border-gray-100"}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span
                      className={`text-[10px] font-bold ${isOwnReply ? "text-red-600" : "text-gray-900"}`}
                    >
                      {reply.sender} {isOwnReply && "(Tú)"}
                    </span>
                    <span className="text-[8px] text-gray-400">
                      {formatDateTime(reply.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mb-2">
                    {reply.content}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
