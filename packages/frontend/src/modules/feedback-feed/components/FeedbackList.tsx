import { FeedbackCard } from "./FeedbackCard";
export interface BackendFeedbackItem {
  props: {
    id: string;
    userId: string;
    content: string;
    likesCount: number;
    created_at: string;
    parent_id: string | null;
    username?: string;
    sender?: string;
  };
}

// Estructura para el componente Reply
export interface Reply {
  id: string;
  content: string;
  sender: string;
  created_at: string;
  likesCount: number;
}

// Estructura para el Feedback principal (con sus hijos)
export interface Feedback {
  id: string;
  userId: string;
  content: string;
  sender: string;
  created_at: string;
  likesCount: number;
  username?: string;
  parent_id: string | null;
  replies: Reply[];
}
interface FeedbackListProps {
  feedbacks: BackendFeedbackItem[]; // Recibe el array de objetos con 'props'
  onLike: (id: string) => void;
  onRefresh: () => void;
  onReply: (parentId: string) => void; // Nueva prop para manejar respuestas
}
export const FeedbackList = ({
  feedbacks,
  onLike,
  onRefresh,
  onReply,
}: FeedbackListProps) => {
  // 1. Extraemos solo la data limpia para facilitar la manipulación
  const rawItems = feedbacks.map((f) => f.props);

  // 2. Normalización y agrupación jerárquica
  const structuredFeedbacks: Feedback[] = rawItems
    .filter((item) => !item.parent_id) // Obtenemos solo los comentarios principales (raíces)
    .map((parent) => {
      // 3. Buscamos TODOS los hijos que tengan como parent_id el ID de este padre
      const children: Reply[] = rawItems
        .filter((child) => child.parent_id === parent.id) // Relación ID => PARENT_ID
        .map((child) => ({
          id: child.id,
          content: child.content,
          sender: child.username || "Usuario",
          created_at: child.created_at,
          likesCount: child.likesCount,
        }))
        // Opcional: Ordenar respuestas por fecha ascendente para que el hilo tenga sentido
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        );

      return {
        id: parent.id,
        userId: parent.userId,
        content: parent.content,
        sender: parent.username || "Usuario",
        created_at: parent.created_at,
        likesCount: parent.likesCount,
        parent_id: parent.parent_id,
        username: parent.username || "Usuario",
        replies: children, // Aquí se inyectan los hijos encontrados
      };
    });

  // Renderizado...
  if (structuredFeedbacks.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center">
        <p className="text-gray-400 font-medium italic text-sm">
          No hay feedback disponible.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
      {structuredFeedbacks.map((item) => (
        <FeedbackCard
          key={item.id}
          feedback={item}
          onLike={onLike}
          onRefresh={onRefresh}
          onReply={onReply}
        />
      ))}
    </div>
  );
};
