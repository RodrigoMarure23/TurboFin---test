import { Request, Response } from "express";
import { RegisterUser } from "../../application/RegisterUser.js";
import { PgUserRepository } from "../persistence/PgUserRepository.js";
import { z } from "zod";

// Esquema de validación para la entrada de datos
const RegisterSchema = z.object({
  username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  email: z.string().email("Formato de correo inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  role: z.enum(["admin", "user"]).default("user"),
});

export class PostUserController {
  async run(req: Request, res: Response) {
    try {
      // 1. Validar el body con Zod
      const validatedData = RegisterSchema.parse(req.body);

      // 2. Inyección de dependencias (Manual para el reto)
      const userRepository = new PgUserRepository();
      const registerUser = new RegisterUser(userRepository);

      // 3. Ejecutar caso de uso
      const user = await registerUser.execute(
        validatedData.username,
        validatedData.email,
        validatedData.password,
        validatedData.role,
      );

      // 4. Respuesta exitosa
      res.status(201).json({
        message: "Usuario registrado con éxito",
        user,
      });
    } catch (error: any) {
      // Manejo de errores de validación de Zod
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Error de validación",
          details: error,
        });
      }

      // Manejo de errores de lógica de negocio (ej. email duplicado)
      res.status(400).json({ error: error.message });
    }
  }
}
