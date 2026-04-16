import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Componente de orden superior (HOC) para proteger rutas privadas.
 * Verifica el estado de autenticación y maneja el estado de carga
 * para evitar redirecciones falsas durante la hidratación del estado.
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  // Mientras el AuthProvider verifica el token en localStorage o cookies
  if (loading) {
    return (
      <div className="flex items-center justify-center text-white bg-gray-900 min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-400 text-sm animate-pulse">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado tras la carga, redirigimos al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderizamos el contenido (o el Outlet si se usa como Layout)
  return <>{children}</>;
};