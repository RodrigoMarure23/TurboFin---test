// modules/user-management/infrastructure/userActivityService.ts

export type ActivityType =
  | "like_given"
  | "like_received"
  | "post_created"
  | "reply_received"
  | "reply_given";

export interface Activity {
  id: string;
  type: ActivityType;
  targetContent: string;
  userName?: string;
  created_at: string;
  replies: [];
}
export interface RawPostData {
  id: string;
  userId: string;
  content: string;
  created_at: string;
  sender?: string;
  parent_id?: string | null;
}

export const transformPostsToActivities = (
  posts: RawPostData[], // Cambiado de any[] a RawPostData[]
  currentUserId: string,
): Activity[] => {
  return posts
    .filter((post) => post.userId === currentUserId) // Solo mi actividad
    .slice(0, 5) // Las últimas 5 acciones
    .map((post) => ({
      id: post.id,
      // Si tiene parent_id es una respuesta, si no, es un post nuevo
      type: post.parent_id
        ? ("reply_given" as const)
        : ("post_created" as const),
      targetContent:
        post.content.length > 40
          ? `${post.content.substring(0, 40)}...`
          : post.content,
      userName: post.sender || "Yo",
      created_at: post.created_at,
      replies: [],
    }));
};
// Función para transformar tus mensajes de DB en Actividades de UI
