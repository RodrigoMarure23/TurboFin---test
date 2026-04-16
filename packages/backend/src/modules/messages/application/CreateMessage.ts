import { v4 as uuidv4 } from "uuid";
import { Message } from "../domain/Message.js";
import { MessageRepository } from "../domain/MessageRepository.js";

export class CreateMessage {
  constructor(private messageRepository: MessageRepository) {}

  async execute(
    userId: string,
    content: string,
    parent_id?: string,
  ): Promise<Message> {
    if (!content || content.trim().length < 10) {
      throw new Error("El mensaje debe tener al menos 10 caracteres");
    }
    console.log("aqui: ", parent_id);
    const message = new Message({
      id: uuidv4(),
      userId,
      content,
      likesCount: 0,
      created_at: new Date(),
      parent_id: parent_id || undefined, // Si no viene parent_id, lo dejamos como undefined
    });

    await this.messageRepository.save(message);
    return message;
  }
}
