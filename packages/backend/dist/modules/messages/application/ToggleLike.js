export class ToggleLike {
    constructor(messageRepository) {
        this.messageRepository = messageRepository;
    }
    /**
     * Ejecuta la lógica de dar o quitar un like.
     * @param messageId ID del mensaje que recibe la reacción
     * @param userId ID del usuario que realiza la acción
     */
    async execute(messageId, userId) {
        // 1. Validaciones de negocio (opcional)
        if (!messageId || !userId) {
            throw new Error("El ID del mensaje y del usuario son obligatorios");
        }
        // 2. Delegar la persistencia al repositorio.
        // El repositorio se encargará de la lógica "Toggle" (Insertar si no existe, borrar si existe)
        // para mantener la atomicidad en la base de datos.
        await this.messageRepository.toggleLike(messageId, userId);
    }
}
