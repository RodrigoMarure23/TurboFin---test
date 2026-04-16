/**
 * Representa la estructura de un Feedback en el frontend.
 * Combina datos de la tabla 'messages' y el 'username' del autor (tabla 'users').
 */
export interface Feedback {
  id: string; // uuid de la tabla messages
  content: string; // content de la tabla messages
  sender: string; // username obtenido mediante el JOIN con la tabla users
  likes_count: number; // likes_count de la tabla messages
  created_at: string; // created_at (formateado como ISO string para el frontend)
  parent_id?: string | null; // parent_id de la tabla messages, para identificar si es un post raíz o una respuesta
  // Opcional: podrías agregar campos extra que calcules en el backend
  hasLiked?: boolean; // Para saber si el usuario actual ya le dio like
}

export interface FeedbackResponse {
  id: string;
  messageId: string; // Referencia al mensaje original
  content: string;
  sender: string;
  created_at: string;
}

// Definición del dominio para un Post
export interface Post {
  id: string;
  content: string;
  created_at: string;
  likes_count: number;
  sender: string;
  avatar?: string;
}
