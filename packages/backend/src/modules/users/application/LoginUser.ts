import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../domain/UserRepository.js";

export class LoginUser {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string, passwordRaw: string) {
    // 1. Buscar usuario por email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Credenciales inválidas"); // Mensaje genérico por seguridad
    }

    // 2. Comparar contraseñas
    const isPasswordValid = await bcrypt.compare(
      passwordRaw,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new Error("Credenciales inválidas");
    }
    console.log("userData: ", user);
    // 3. Generar JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      "secret_fallback_backend", // En producción, usar una variable de entorno
      { expiresIn: "24h" },
    );
    console.log("token generado: ", token);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }
}
