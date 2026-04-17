import { CreateMessage } from "../../application/CreateMessage.js";
import { PgMessageRepository } from "../persistence/PgMessageRepository.js";
import { io } from "../../../../shared/infrastructure/realtime/SocketConfig.js";
export class PostMessageController {
    async run(req, res) {
        const { content, parentId } = req.body; // parentId si es una respuesta a otro mensaje
        const userId = req.userId;
        const username = req.username; // Extraído de tu AuthMiddleware
        if (!userId) {
            return res
                .status(401)
                .json({ error: "No se encontró el ID de usuario en el token" });
        }
        try {
            const repository = new PgMessageRepository();
            const createMessage = new CreateMessage(repository);
            // Ejecutamos la creación en la DB
            // parentId se pasa para saber si es un mensaje raíz o una respuesta
            const message = await createMessage.execute(userId, content, parentId);
            // --- LÓGICA DE NOTIFICACIÓN REAL-TIME ---
            // 1. Notificación General (para actualizar el feed de todos)
            io.emit("new_message", message);
            // 2. Notificación Específica para la Navbar (Aviso de actividad)
            // Si hay un parentId, significa que alguien está respondiendo a OTRO usuario
            if (parentId) {
                // En un flujo ideal, aquí buscarías el 'owner' del mensaje padre
                // Por ahora, emitimos el evento para que el frontend filtre si le pertenece
                io.emit("notification", {
                    id: Date.now(),
                    type: "REPLY",
                    from: username || "Un colaborador",
                    text: "ha respondido a tu comentario",
                    payload: { messageId: message.id, parentId },
                    time: new Date().toISOString(),
                });
            }
            else {
                // Si es un mensaje nuevo global
                io.emit("notification", {
                    id: Date.now(),
                    type: "NEW_POST",
                    from: username || "Un colaborador",
                    text: "ha publicado un nuevo mensaje",
                    payload: { messageId: message.id },
                    time: new Date().toISOString(),
                });
            }
            res.status(201).json(message);
        }
        catch (error) {
            console.error("Error en PostMessageController:", error);
            res.status(400).json({ error: error.message });
        }
    }
}
