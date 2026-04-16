// modules/user-management/components/UsersTable.tsx
import type { User } from "../../../../context/AuthContext";
import { Info } from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "../../../../context/useAuth"; // ajusta la ruta si es necesario

interface UsersTableProps {
  users: User[];
  onToggleStatus: (id: string, currentStatus: string) => void;
}

export const UsersTable = ({ users, onToggleStatus }: UsersTableProps) => {
  const { user: currentUser } = useAuth();

  const isAdmin = currentUser?.role === "admin";

  const showInfoAlert = () => {
    Swal.fire({
      title: "Acción restringida",
      text: "Solo los administradores pueden cambiar el estado de los usuarios.",
      icon: "info",
      confirmButtonText: "Entendido",
      confirmButtonColor: "#dc2626",
      background: "#ffffff",
      color: "#111827",
      iconColor: "#dc2626",
      showCloseButton: true,
      customClass: {
        popup: "rounded-2xl",
        confirmButton:
          "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest",
      },
    });
  };

  const handleToggle = (userId: string, status: string) => {
    if (!isAdmin) {
      showInfoAlert();
      return;
    }

    onToggleStatus(userId, status);
  };

  return (
    <div className="w-full overflow-x-auto custom-scrollbar">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50/50 border-b border-gray-100">
          <tr>
            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              Colaborador
            </th>
            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              Rol
            </th>
            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
              Estado
              <button
                onClick={showInfoAlert}
                className="text-gray-400 hover:text-red-600 transition-colors"
                title="Información"
              >
                <Info className="w-4 h-4" />
              </button>
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-50">
          {users.map((user: User) => {
            const isDisabled = !isAdmin;

            return (
              <tr
                key={user.id}
                className="hover:bg-red-50/30 transition-all group"
              >
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-950 flex items-center justify-center text-[10px] font-black text-white group-hover:bg-red-600 transition-colors">
                      {user.username.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-950">
                        {user.username}
                      </p>
                      <p className="text-xs text-gray-400 font-medium">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-8 py-5 text-xs font-bold text-gray-600">
                  {user.role}
                </td>

                <td className="px-8 py-5">
                  <button
                    onClick={() => handleToggle(user.id, user.status)}
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors
                      
                      ${
                        user.status === "Activo"
                          ? "bg-green-50 text-green-600 border-green-100"
                          : "bg-red-50 text-red-600 border-red-100"
                      }

                      ${
                        isDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : user.status === "Activo"
                            ? "hover:bg-green-100"
                            : "hover:bg-red-100"
                      }
                    `}
                  >
                    {user.status}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
