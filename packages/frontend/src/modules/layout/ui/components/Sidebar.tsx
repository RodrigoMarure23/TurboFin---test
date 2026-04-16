// modules/layout/components/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { LayoutDashboard, MessageSquare, Settings, Users } from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: MessageSquare, label: "Feed de Feedback", path: "/dashboard/feed" },
  { icon: Users, label: "Usuarios", path: "/dashboard/users" },
  { icon: Settings, label: "Configuración", path: "/dashboard/settings" },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-100 h-screen fixed left-0 top-16 pt-6 shadow-sm">
      <div className="px-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            end={item.path === "/dashboard"}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-red-50 text-red-600 border border-red-100 shadow-sm shadow-red-600/5"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            {/* El icono cambia de color al estar activo o al hacer hover */}
            <item.icon className={`w-5 h-5 transition-colors duration-200`} />
            <span className="font-bold text-sm tracking-tight">
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>

      {/* Decoración inferior sutil (opcional) */}
      <div className="absolute bottom-20 px-8">
        <div className="h-1 w-8 bg-red-600 rounded-full" />
        <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest mt-4">
          Internal System
        </p>
      </div>
    </aside>
  );
};
