import { LoginUser } from "../../application/LoginUser.js";
import { PgUserRepository } from "../persistence/PgUserRepository.js";
import { z } from "zod";
const LoginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "La contraseña es requerida"),
});
export class LoginUserController {
    async run(req, res) {
        try {
            const { email, password } = LoginSchema.parse(req.body);
            const userRepository = new PgUserRepository();
            const loginUser = new LoginUser(userRepository);
            const result = await loginUser.execute(email, password);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
}
