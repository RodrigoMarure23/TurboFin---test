import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";

export let io: SocketIOServer;

export const initSocket = (httpServer: HTTPServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*", // En producción, usa tu dominio de frontend
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`📡 Nuevo cliente conectado: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`❌ Cliente desconectado: ${socket.id}`);
    });
  });

  return io;
};
