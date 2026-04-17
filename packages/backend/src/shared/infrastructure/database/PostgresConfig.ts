import { Pool, QueryResult } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Verificación inicial de conexión
pool.query("SELECT NOW()", (err: Error | null, res: QueryResult) => {
  if (err) {
    console.error("❌ Error conectando a PostgreSQL:", err.stack);
  } else {
    console.log("✅ PostgreSQL Conectado:", res.rows[0].now);
  }
});
