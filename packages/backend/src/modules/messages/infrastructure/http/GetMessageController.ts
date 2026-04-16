import { Request, Response } from "express";
import { PgMessageRepository } from "../persistence/PgMessageRepository.js";

export class GetMessagesController {
  async run(_req: Request, res: Response) {
    try {
      const repository = new PgMessageRepository();
      const messages = await repository.findAll();

      res.status(200).json(messages);
    } catch (error: any) {
      console.log("error: ", error);
      res.status(500).json({ error: "Error al obtener los mensajes" });
    }
  }
}
