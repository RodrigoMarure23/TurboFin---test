import { Message } from "../domain/Message.js";

export interface MessageRepository {
  save(message: Message): Promise<void>; // Unificamos postMessage/postReply en save
  findAll(): Promise<Message[]>; // Antes getmessages
  findById(id: string): Promise<Message | null>;
  getMessageThread(messageId: string): Promise<any[]>;
  toggleLike(messageId: string, userId: string): Promise<{ added: boolean }>;
  getRecentActivity(userId: string): Promise<any[]>; // Nueva función para obtener actividad reciente
}
