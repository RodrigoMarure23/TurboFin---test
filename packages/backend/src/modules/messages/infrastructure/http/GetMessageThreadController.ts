// modules/messages/infrastructure/http/GetMessageThreadController.ts
import { Request, Response } from "express";
import { PgMessageRepository } from "../persistence/PgMessageRepository.js";

export class GetMessageThreadController {
  async run(req: Request, res: Response) {
    const { messageId } = req.params as unknown as { messageId: string };
    console.log("idEncontrado");
    try {
      const repository = new PgMessageRepository();
      const thread = await repository.getMessageThread(messageId);

      if (thread.length === 0) {
        return res.status(404).json({ error: "Mensaje no encontrado" });
      }

      // Opcional: Podrías agruparlos aquí en un JSON anidado
      // Por ahora devolvemos el array plano que es más fácil de manejar con un "map" en React
      res.status(200).json(thread);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
