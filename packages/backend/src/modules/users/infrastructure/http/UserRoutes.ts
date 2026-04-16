import { Router } from "express";
import { PostUserController } from "./PostUserController.js";
import { LoginUserController } from "./LoginUserController.js";
import { GetUsersController } from "./GetUsersController.js"; // Nuevo
import { PgUserRepository } from "../persistence/PgUserRepository.js"; // Importa tu repo

const userRouter = Router();

// Ingesta de dependencias
const userRepository = new PgUserRepository();
const postUserController = new PostUserController();
const loginUserController = new LoginUserController();
const getUsersController = new GetUsersController(userRepository); // Nuevo

// Rutas existentes
userRouter.post("/register", (req, res) => postUserController.run(req, res));
userRouter.post("/login", (req, res) => loginUserController.run(req, res));

// --- NUEVAS RUTAS ---

// Obtener lista de usuarios y mejores colaboradores
userRouter.get("/", (req, res) => getUsersController.run(req, res));

// (Opcional) Ruta para cambiar el estado del usuario (Activo/Inactivo)
userRouter.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  await userRepository.updateStatus(id, status);
  res.status(200).json({ message: "Estado actualizado" });
});

export { userRouter };
