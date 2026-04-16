// modules/user-management/containers/UsersManagementContainer.tsx
import { useState } from "react";
import { UsersTable } from "../components/UsersTable";
import { useUsers } from "../../hooks/useUsers";
import { Zap, Search, UserPlus, Loader2 } from "lucide-react";
import type { User } from "../../../../context/AuthContext";
import { useAuth } from "../../../../hooks/useAuth";
import Swal from "sweetalert2";

interface Colab {
  username: string;
  interactions: number;
}

export const UsersManagementContainer = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { user: currentUser } = useAuth();
  console.log("currentUser:", currentUser);
  const { users, topCollaborators, toggleStatus, isLoading, createUser } =
    useUsers();

  const isAdmin = currentUser?.role === "admin";

  const filteredUsers = users.filter(
    (user: User) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // 🔥 SweetAlert para crear usuario
  const handleCreateUser = async () => {
    if (!isAdmin) {
      Swal.fire({
        icon: "info",
        title: "Acción restringida",
        text: "Solo los administradores pueden crear usuarios.",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    const { value: formValues } = await Swal.fire({
      title: "Nuevo Usuario",
      html: `
        <input id="swal-username" class="swal2-input" placeholder="Username">
        <input id="swal-email" class="swal2-input" placeholder="Email">
        <input id="swal-password" type="password" class="swal2-input" placeholder="Password">
        <select id="swal-role" class="swal2-select">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      `,
      confirmButtonText: "Crear Usuario",
      confirmButtonColor: "#111827",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      focusConfirm: false,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const username = (
          document.getElementById("swal-username") as HTMLInputElement
        ).value;
        const email = (
          document.getElementById("swal-email") as HTMLInputElement
        ).value;
        const password = (
          document.getElementById("swal-password") as HTMLInputElement
        ).value;
        const role = (document.getElementById("swal-role") as HTMLSelectElement)
          .value;

        if (!username || !email || !password) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
          return;
        }

        try {
          await createUser({ username, email, password, role });
          return true;
        } catch (error: any) {
          Swal.showValidationMessage(error.message || "Error al crear usuario");
        }
      },
      customClass: {
        popup: "rounded-2xl",
        confirmButton:
          "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest",
        cancelButton:
          "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest",
      },
    });

    if (formValues) {
      Swal.fire({
        icon: "success",
        title: "Usuario creado",
        text: "El usuario fue registrado correctamente",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-10">
        <div className="space-y-2 relative pl-6">
          <div className="absolute left-0 top-1 bottom-1 w-1.5 bg-red-600 rounded-full" />
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black text-gray-950 tracking-tighter">
              Gestión de Usuarios
            </h1>

            <span
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border
              ${
                isAdmin
                  ? "bg-red-50 text-red-600 border-red-100"
                  : "bg-gray-100 text-gray-500 border-gray-200"
              }`}
            >
              {isAdmin ? "Admin View" : "User View"}
            </span>
          </div>

          <p className="text-gray-500 font-medium">
            Supervisa la actividad y gestiona permisos de la red institucional.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Buscador */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-red-600 transition-colors" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              className="bg-white border border-gray-200 text-gray-950 pl-11 pr-5 py-3 rounded-2xl w-full sm:w-72 outline-none focus:border-red-200 focus:ring-4 focus:ring-red-600/5 transition-all placeholder:text-gray-300 text-sm font-medium shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Botón crear usuario */}
          <button
            onClick={handleCreateUser}
            disabled={!isAdmin}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl
              ${
                isAdmin
                  ? "bg-gray-950 hover:bg-gray-800 text-white shadow-gray-950/10"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
              }`}
          >
            <UserPlus className="w-4 h-4" />
            Nuevo Usuario
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Tabla */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm min-h-[400px] flex flex-col">
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  Sincronizando Base de Datos...
                </p>
              </div>
            ) : (
              <UsersTable users={filteredUsers} onToggleStatus={toggleStatus} />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="text-gray-400 font-black text-[10px] mb-8 flex items-center gap-2 uppercase tracking-[0.2em]">
              <Zap className="w-4 h-4 text-red-600" />
              Mejores Colaboradores
            </h3>

            <div className="space-y-6">
              {topCollaborators.length > 0 ? (
                topCollaborators.map((colab: Colab) => (
                  <div key={colab.username} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white font-black">
                      {colab.username.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-950">
                        {colab.username}
                      </p>
                      <p className="text-[10px] text-gray-400 font-black uppercase">
                        {colab.interactions} Interacciones
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-300 text-center">
                  Sin actividad reciente
                </p>
              )}
            </div>
          </div>

          <div className="bg-red-600 rounded-[2.5rem] p-8 text-white">
            <p className="text-4xl font-black">84%</p>
            <p className="text-xs mt-2">
              Incremento en participación esta semana
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersManagementContainer;
