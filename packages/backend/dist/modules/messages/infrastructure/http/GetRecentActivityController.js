import { GetRecentActivity } from "../../domain/Message.js";
import { PgMessageRepository } from "../persistence/PgMessageRepository.js";
export class GetRecentActivityController {
    async run(req, res) {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: "No autorizado" });
        }
        try {
            const repository = new PgMessageRepository();
            const getRecentActivity = new GetRecentActivity(repository);
            const activity = await getRecentActivity.execute(userId);
            res.status(200).json(activity);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
