// modules/messages/infrastructure/http/PostReplyController.ts
import { Response } from "express";
import { AuthRequest } from "../../../../shared/infrastructure/http/AuthMiddleware.js";
import { CreateMessage } from "../../application/CreateMessage.js";
import { PgMessageRepository } from "../persistence/PgMessageRepository.js";
import { io } from "../../../../shared/infrastructure/realtime/SocketConfig.js";

export class PostReplyController {
  async run(req: AuthRequest, res: Response) {
    const { content, parent_id } = req.body;
    const userId = req.userId;
    const username = req.username; // Extraído de tu AuthMiddleware

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (!parent_id) {
      return res
        .status(400)
        .json({ error: "Falta parent_id para la respuesta" });
    }

    try {
      const repository = new PgMessageRepository();
      const createMessage = new CreateMessage(repository);

      const message = await createMessage.execute(userId, content, parent_id);

      // 1. 📢 EVENTO TÉCNICO (Para actualizar el árbol de comentarios en el feed)
      io.emit("new_reply", {
        id: message.id,
        content: message.content,
        userId: message.userId,
        parent_id: message.parent_id,
        created_at: message.props.created_at,
      });

      // 2. 🔔 EVENTO DE NOTIFICACIÓN (Para la Navbar)
      // Usamos el formato estandarizado que ya entienden tus otros controladores
      io.emit("notification", {
        id: Date.now(),
        type: "REPLY",
        from: username || "Un colaborador",
        text: "respondió a tu comentario",
        payload: {
          messageId: message.id,
          parent_id: parent_id,
        },
        time: new Date().toISOString(),
      });

      res.status(201).json(message);
    } catch (error: any) {
      console.error("Error en PostReplyController:", error.message);
      res.status(400).json({ error: error.message });
    }
  }
}
