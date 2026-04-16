import { useState, useEffect } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import { socket } from "../../../../api/socket";
import { LogOut, User as UserIcon, Bell, X, Zap } from "lucide-react";
interface Notification {
  id: string;
  text: string;
  time: string;
  type: string;
}
export const Navbar = () => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    // 1. Conectar el socket al montar el componente
    socket.connect();

    // 2. Escuchar el evento 'notification' que configuramos en los Controllers
    socket.on("notification", (data) => {
      // Solo agregamos la notificación si no es una acción propia
      if (data.from !== user?.username) {
        setNotifications((prev) => [
          {
            id: data.id,
            text: `${data.from} ${data.text}`,
            time: "Ahora mismo",
            type: data.type,
          },
          ...prev,
        ]);
        setHasUnread(true);

        // Opcional: Sonido de notificación
        // new Audio('/notification.mp3').play().catch(() => {});
      }
    });

    // Limpieza al desmontar
    return () => {
      socket.off("notification");
      socket.disconnect();
    };
  }, [user?.username]);

  const handleOpenNotifications = () => {
    setShowNotifications(!showNotifications);
    setHasUnread(false); // Limpiamos el punto rojo al abrir
  };

  return (
    <nav className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 fixed w-full top-0 z-50 shadow-sm shadow-gray-100/50">
      <div className="flex items-center gap-3">
        <div className="bg-red-600 p-2 rounded-xl shadow-md shadow-red-600/20">
          <Bell className="text-white w-5 h-5" />
        </div>
        <div className="flex items-center">
          <span className="text-gray-950 font-bold text-xl tracking-tighter">
            Feedback Hub
          </span>
          <span className="w-1 h-5 ml-1 bg-red-600 animate-pulse hidden md:block" />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative">
          <button
            onClick={handleOpenNotifications}
            className={`p-2 rounded-xl transition-all relative ${
              showNotifications
                ? "bg-red-50 text-red-600"
                : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
            }`}
          >
            <Bell className="w-5 h-5" />
            {/* Punto rojo dinámico: solo aparece si hay nuevas notificaciones */}
            {hasUnread && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-white animate-bounce" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-[2rem] shadow-2xl shadow-gray-950/10 overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                  <Zap className="w-3 h-3 text-red-600" /> Actividad Reciente
                </span>
                <button onClick={() => setShowNotifications(false)}>
                  <X className="w-4 h-4 text-gray-300 hover:text-red-600" />
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-4 hover:bg-red-50/30 transition-colors border-b border-gray-50 last:border-0 cursor-pointer group"
                    >
                      <p className="text-sm font-bold text-gray-950 group-hover:text-red-600 transition-colors">
                        {n.text}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-wider">
                        {n.time}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                      Sin notificaciones
                    </p>
                  </div>
                )}
              </div>

              <div className="p-3 bg-white text-center">
                <button
                  onClick={() => setNotifications([])}
                  className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-950 transition-colors"
                >
                  Limpiar historial
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-2.5 px-4 py-1.5 bg-gray-50 rounded-full border border-gray-100 group transition-all hover:bg-white hover:border-red-100">
          <UserIcon className="text-gray-400 w-4 h-4 group-hover:text-red-600 transition-colors" />
          <span className="text-gray-700 text-sm font-bold tracking-tight">
            {user?.username || "invitado"}
          </span>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 text-gray-400 hover:text-red-600 transition-all text-xs font-black uppercase tracking-widest active:scale-95"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Cerrar Sesión</span>
        </button>
      </div>
    </nav>
  );
};
