// modules/messages/infrastructure/persistence/PgMessageRepository.ts
import { pool } from "../../../../shared/infrastructure/database/PostgresConfig.js";
import { Message } from "../../domain/Message.js";
import { MessageRepository } from "../../domain/MessageRepository.js";
interface Row {
  id: string;
  user_id: string;
  content: string;
  likes_count: number;
  created_at: Date;
  parent_id: string | null;
  username: string; // Se agrega el username directamente en la consulta
}
export class PgMessageRepository implements MessageRepository {
  async save(message: Message): Promise<void> {
    const query = `
      INSERT INTO messages (id, user_id, content, parent_id)
      VALUES ($1, $2, $3, $4)
    `;
    await pool.query(query, [
      message.id,
      message.userId,
      message.content,
      message.parent_id || null,
    ]);
  }

  async findById(id: string): Promise<Message | null> {
    const res = await pool.query("SELECT * FROM messages WHERE id = $1", [id]);
    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    return new Message({
      id: row.id,
      userId: row.user_id,
      content: row.content,
      likesCount: row.likes_count,
      created_at: row.created_at,
      parent_id: row.parent_id,

    });
  }

  async toggleLike(
    messageId: string,
    userId: string,
  ): Promise<{ added: boolean }> {
    // 1. Intentar insertar el like
    const insertQuery = `
      INSERT INTO likes (user_id, message_id) 
      VALUES ($1, $2)
      ON CONFLICT (user_id, message_id) DO NOTHING
      RETURNING *;
    `;

    const res = await pool.query(insertQuery, [userId, messageId]);

    // 2. Si no insertó nada (rowCount 0), es porque ya existía, entonces lo borramos
    if (res.rowCount === 0) {
      await pool.query(
        "DELETE FROM likes WHERE user_id = $1 AND message_id = $2",
        [userId, messageId],
      );
      return { added: false };
    }

    return { added: true };
  }

  async findAll(): Promise<any[]> {
    const query = `
    SELECT m.*, u.username 
    FROM messages m 
    JOIN users u ON m.user_id = u.id 
    ORDER BY m.created_at DESC
  `;

    const res = await pool.query(query);

    // Un solo map para transformar cada fila en la instancia que necesitas
    return res.rows.map((row: any) => {
      return new Message({
        id: row.id,
        userId: row.user_id,
        content: row.content,
        likesCount: row.likes_count,
        created_at: row.created_at,
        parent_id: row.parent_id,
        username: row.username, // Se inyecta directamente aquí
      });
    });
  }

  async getMessageThread(messageId: string): Promise<any[]> {
    const query = `
      WITH RECURSIVE message_tree AS (
          SELECT id, user_id, content, parent_id, created_at, likes_count
          FROM messages WHERE id = $1
          UNION ALL
          SELECT m.id, m.user_id, m.content, m.parent_id, m.created_at, m.likes_count
          FROM messages m
          INNER JOIN message_tree mt ON m.parent_id = mt.id
      )
      SELECT m.*, u.username 
      FROM message_tree m
      JOIN users u ON m.user_id = u.id
      ORDER BY m.created_at ASC;
    `;
    const result = await pool.query(query, [messageId]);
    return result.rows;
  }
  async getRecentActivity(userId: string): Promise<any[]> {
    const query = `
    WITH base_activity AS (
        -- 1. Tus publicaciones y respuestas
        (SELECT 
            m.id, 
            CASE WHEN m.parent_id IS NULL THEN 'post_created' ELSE 'reply_given' END as type,
            m.content as "targetContent",
            u.username as "userName",
            m.created_at as "createdAt",
            m.id as thread_root_id -- Para publicaciones propias, ellas son la raíz
        FROM messages m
        JOIN users u ON m.user_id = u.id
        WHERE m.user_id = $1)

        UNION ALL

        -- 2. Likes recibidos
        (SELECT 
            l.message_id as id,
            'like_received' as type,
            m.content as "targetContent",
            u.username as "userName",
            l.created_at as "createdAt",
            m.id as thread_root_id
        FROM likes l
        JOIN messages m ON l.message_id = m.id
        JOIN users u ON l.user_id = u.id
        WHERE m.user_id = $1 AND l.user_id != $1)
    ),
    recent_events AS (
        SELECT * FROM base_activity
        ORDER BY "createdAt" DESC
        LIMIT 10
    )
    -- 3. Unimos los eventos con sus respuestas (hilos)
    SELECT 
        re.*,
        COALESCE(
            (SELECT json_agg(replies_all ORDER BY replies_all.created_at ASC)
             FROM (
                SELECT r.id, r.user_id, r.content, r.parent_id, r.created_at, r.likes_count, ru.username
                FROM messages r
                JOIN users ru ON r.user_id = ru.id
                WHERE r.parent_id = re.id -- Trae los hijos directos de este evento
             ) replies_all
            ), '[]'
        ) as replies
    FROM recent_events re;
  `;

    const res = await pool.query(query, [userId]);
    return res.rows;
  }
}
