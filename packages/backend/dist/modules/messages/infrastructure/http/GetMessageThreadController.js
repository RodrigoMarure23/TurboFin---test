import { PgMessageRepository } from "../persistence/PgMessageRepository.js";
export class GetMessageThreadController {
    async run(req, res) {
        const { messageId } = req.params;
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
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
