import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { User } from "../domain/User.js";
export class RegisterUser {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(username, email, passwordRaw, role) {
        // 1. Validar si el usuario ya existe
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error("El correo electrónico ya está registrado");
        }
        // 2. Hashear la contraseña (Seguridad)
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(passwordRaw, saltRounds);
        // 3. Crear la entidad de dominio
        const user = new User({
            id: uuidv4(),
            username,
            email,
            passwordHash,
            role: role.toLowerCase() === "admin" ? "admin" : "user",
        });
        // 4. Persistir en la DB
        await this.userRepository.save(user);
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        };
    }
}
