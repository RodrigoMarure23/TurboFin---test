// modules/messages/infrastructure/http/GetRecentActivityController.ts
import { Response } from "express";
import { AuthRequest } from "../../../../shared/infrastructure/http/AuthMiddleware.js";
import { GetRecentActivity } from "../../domain/Message.js";
import { PgMessageRepository } from "../persistence/PgMessageRepository.js";

export class GetRecentActivityController {
  async run(req: AuthRequest, res: Response) {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "No autorizado" });
    }

    try {
      const repository = new PgMessageRepository();
      const getRecentActivity = new GetRecentActivity(repository);

      const activity = await getRecentActivity.execute(userId);

      res.status(200).json(activity);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
