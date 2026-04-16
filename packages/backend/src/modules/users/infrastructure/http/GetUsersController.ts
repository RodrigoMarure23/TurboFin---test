import { Request, Response } from "express";
import { PgUserRepository } from "../persistence/PgUserRepository.js";
import { User } from "../../domain/User.js";

export class GetUsersController {
  constructor(private userRepository: PgUserRepository) {}

  async run(req: Request, res: Response) {
    try {
      // Obtenemos todos los usuarios para la tabla principal
      const users = await this.userRepository.findAll();

      // Obtenemos el top de colaboradores (ej. los 2 mejores como en la imagen)
      const topCollaborators = await this.userRepository.getTopCollaborators(2);

      // Mapeamos los usuarios a un formato simple para la respuesta
      const usersData = users.map((user: User) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        avatarUrl: user.avatar_url,
      }));

      return res.status(200).json({
        users: usersData,
        topCollaborators,
      });
    } catch (error) {
      console.error("Error en GetUsersController:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
