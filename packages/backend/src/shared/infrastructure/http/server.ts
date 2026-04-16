import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "../database/PostgresConfig.js";
import { userRouter } from "../../../modules/users/infrastructure/http/UserRoutes.js";
import { messageRouter } from "@/modules/messages/infrastructure/http/MessagesRoutes.js";
import { createServer } from "http";
import { initSocket } from "../realtime/SocketConfig.js";
// Cargar variables de entorno
dotenv.config();

const app: Application = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3006;
initSocket(httpServer); // inicializa el server
// --- Middlewares Globales ---
app.use(cors());
app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);

// --- Health Check & DB Test ---
// Útil para que Railway/Vercel sepan que el servicio está vivo
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "online",
    timestamp: new Date().toISOString(),
  });
});

// Endpoint temporal para validar que el Pool de Postgres funciona
app.get("/api/test-db", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT NOW() as current_time, current_database() as db_name",
    );
    res.json({
      message: "Conexión exitosa con PostgreSQL",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error en /api/test-db:", error);
    res.status(500).json({ error: "No se pudo conectar a la base de datos" });
  }
});

// --- Manejo de Rutas No Encontradas (404) ---
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// --- Inicio del Servidor ---
httpServer.listen(PORT, () => {
  console.log("---------------------------------------------------");
  console.log(`🚀 Feedback Hub Server corriendo en: http://localhost:${PORT}`);
  console.log(`📁 Modo: ${process.env.NODE_ENV || "development"}`);
  console.log("---------------------------------------------------");
});
