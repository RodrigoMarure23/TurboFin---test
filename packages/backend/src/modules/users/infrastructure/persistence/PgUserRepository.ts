import { pool } from "../../../../shared/infrastructure/database/PostgresConfig.js";
import { User } from "../../domain/User.js";
import { UserRepository } from "../../domain/UserRepository.js";
export interface CollaboratorStats {
  username: string;
  avatarUrl: string | null;
  interactions: number; // Cambiado a string para evitar problemas de tipo con COUNT
}
interface Row {
  username: string;
  avatar_url: string | null;
  interactions: string;
  email: string;
  password_hash: string;
  role: "user" | "admin" | undefined;
  created_at: Date;
  status: "active" | "inactive" | undefined;
  id: string;
}
export class PgUserRepository implements UserRepository {
  async save(user: User): Promise<void> {
    const query = `
      INSERT INTO users (id, username, email, password_hash, role)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id) DO UPDATE 
      SET username = EXCLUDED.username, email = EXCLUDED.email;
    `;
    const values = [
      user.id,
      user.username,
      user.email,
      user.passwordHash,
      user.role,
    ];
    await pool.query(query, values);
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE email = $1";
    const res = await pool.query(query, [email]);

    if (res.rows.length === 0) return null;

    const row = res.rows[0];
    return new User({
      id: row.id,
      username: row.username,
      email: row.email,
      role: row.role,
      passwordHash: row.password_hash,
      created_at: row.created_at,
    });
  }

  async findById(id: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE id = $1";
    const res = await pool.query(query, [id]);

    if (res.rows.length === 0) return null;

    const row = res.rows[0];
    return new User({
      id: row.id,
      username: row.username,
      email: row.email,
      passwordHash: row.password_hash,
      created_at: row.created_at,
    });
  }
  async findAll(): Promise<User[]> {
    const query = "SELECT * FROM users ORDER BY created_at DESC";
    const res = await pool.query(query);

    return res.rows.map(
      (row: Row) =>
        new User({
          id: row.id,
          username: row.username,
          email: row.email,
          passwordHash: row.password_hash,
          role: row.role, // Admin, Editor, Manager, etc.
          status: row.status, // Activo, Inactivo
          avatar_url: row.avatar_url, // URL de la imagen de perfil
          created_at: row.created_at,
        }),
    );
  }

  /**
   * Calcula los mejores colaboradores basados en la tabla de mensajes (o feedback)
   * Esto alimenta el componente "MEJORES COLABORADORES" (image_e14461.png)
   */
  // packages/backend/src/modules/users/infrastructure/persistence/PgUserRepository.ts

  async getTopCollaborators(limit: number = 2): Promise<CollaboratorStats[]> {
    // Corregimos: tabla 'messages' y columna 'user_id'
    const query = `
    SELECT 
      u.username, 
      u.avatar_url, 
      COUNT(m.id) as interactions
    FROM public.users u
    LEFT JOIN public.messages m ON u.id = m.user_id
    GROUP BY u.id, u.username, u.avatar_url
    ORDER BY interactions DESC
    LIMIT $1
  `;
    const res = await pool.query(query, [limit]);

    return res.rows.map((row: Row) => ({
      username: row.username,
      avatarUrl: row.avatar_url,
      interactions: parseInt(row.interactions, 10),
    }));
  }

  /**
   * Actualiza el estado o rol (Acciones en la tabla de usuarios)
   */
  async updateStatus(id: string, status: "Activo" | "Inactivo"): Promise<void> {
    const query = "UPDATE users SET status = $1 WHERE id = $2";
    await pool.query(query, [status, id]);
  }
}
