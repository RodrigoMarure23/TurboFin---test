import { Server as SocketIOServer } from "socket.io";
export let io;
export const initSocket = (httpServer) => {
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
