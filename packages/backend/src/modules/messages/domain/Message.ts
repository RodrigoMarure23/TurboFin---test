import { MessageRepository } from "./MessageRepository.js";
export interface MessageProps {
  id: string;
  userId: string;
  content: string;
  likesCount: number;
  created_at: Date;
  parent_id?: string;
  messageId?: string; // Para respuestas, el ID del mensaje original al que responden
  username?: string; // Para mostrar el nombre del usuario en la interfaz
}

export class Message {
  constructor(public readonly props: MessageProps) {}

  get id(): string {
    return this.props.id;
  }
  get userId(): string {
    return this.props.userId;
  }
  get content(): string {
    return this.props.content;
  }
  get likesCount(): number {
    return this.props.likesCount;
  }
  get created_at(): Date {
    return this.props.created_at;
  }
  get parent_id(): string | undefined {
    return this.props.parent_id;
  }
  get username(): string | undefined {
    return this.props.username;
  }

  // Lógica de dominio: un mensaje no puede tener likes negativos
  public canBeLiked(): boolean {
    return this.props.likesCount >= 0;
  }
}
export class GetRecentActivity {
  constructor(private repository: MessageRepository) {}

  async execute(userId: string) {
    return await this.repository.getRecentActivity(userId);
  }
}
