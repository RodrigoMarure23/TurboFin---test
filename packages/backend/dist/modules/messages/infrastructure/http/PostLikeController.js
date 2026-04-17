import { ToggleLike } from "../../application/ToggleLike.js";
import { PgMessageRepository } from "../persistence/PgMessageRepository.js";
import { io } from "../../../../shared/infrastructure/realtime/SocketConfig.js";
export class PostLikeController {
    async run(req, res) {
        const messageId = req.params.messageId;
        const userId = req.userId;
        const username = req.username; // Extraído de tu AuthMiddleware
        if (!userId)
            return res.status(401).json({ error: "No autorizado" });
        try {
            const repository = new PgMessageRepository();
            const toggleLike = new ToggleLike(repository);
            // Ejecutamos la lógica de negocio (Toggle)
            await toggleLike.execute(messageId, userId);
            // 📢 1. Notificación Técnica (Para actualizar contadores en el feed)
            io.emit("message_reaction", { messageId, userId });
            // 🔔 2. Notificación de Usuario (Para la Navbar)
            // Nota: Idealmente podrías obtener el texto del mensaje o el dueño aquí
            io.emit("notification", {
                id: Date.now(),
                type: "LIKE",
                from: username || "Un colaborador",
                text: "reaccionó a tu mensaje",
                payload: {
                    messageId,
                    userId, // Quién dio el like
                },
                time: new Date().toISOString(),
            });
            res.status(200).json({ message: "Like procesado" });
        }
        catch (error) {
            console.error("Error en PostLikeController:", error);
            res.status(400).json({ error: error.message });
        }
    }
}
