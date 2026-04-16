import { Request, Response } from "express";
import { LoginUser } from "../../application/LoginUser.js";
import { PgUserRepository } from "@/modules/users/infrastructure/persistence/PgUserRepository.js";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export class LoginUserController {
  async run(req: Request, res: Response) {
    try {
      const { email, password } = LoginSchema.parse(req.body);
      const userRepository = new PgUserRepository();
      const loginUser = new LoginUser(userRepository);

      const result = await loginUser.execute(email, password);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }
}
