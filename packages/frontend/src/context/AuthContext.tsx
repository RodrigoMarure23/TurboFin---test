import { createContext } from "react";

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  status: "Activo" | "Inactivo";
  avatar_url?: string;
  
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

// Exportación del objeto puro
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
