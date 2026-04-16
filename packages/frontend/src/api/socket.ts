import { io } from "socket.io-client";

const URL = import.meta.env.VITE_API_URL;

// Configuramos el socket para que no se conecte automáticamente
// hasta que tengamos el componente listo
export const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket"],
});
