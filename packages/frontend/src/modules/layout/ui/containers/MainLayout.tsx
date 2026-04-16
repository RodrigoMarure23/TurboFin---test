// modules/layout/components/MainLayout.tsx
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  return (
    // Fondo general en gray-50 para coincidir con el fondo del login
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <Navbar />

      <div className="flex flex-1 pt-16">
        <Sidebar />

        {/* Cambios realizados:
            1. bg-gray-50: Consistencia con el login
            2. text-gray-900: Tipografía oscura para alta legibilidad en fondo claro.
            3. shadow-inner: Un toque de profundidad para separar el contenido del Sidebar.
        */}
        <main className="flex-1 ml-64 p-8 text-gray-900 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
            {/* Contenedor de transición para animar la entrada de las vistas 
               similar a la duración del LoginForm (500ms)
            */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
