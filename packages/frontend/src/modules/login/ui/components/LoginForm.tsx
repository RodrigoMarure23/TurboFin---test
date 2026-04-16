// modules/auth/components/LoginForm.tsx
import React, { useState, useEffect } from "react";

interface LoginFormProps {
  isLogin: boolean;
  setIsLogin: (val: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  formState: {
    username?: string;
    email: string;
    password: string;
  };
  setters: {
    setUsername: (val: string) => void;
    setEmail: (val: string) => void;
    setPassword: (val: string) => void;
  };
  isLoading: boolean;
}

// Iconos SVG minimalistas integrados (Evita dependencias externas innecesarias)
const MailIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const LockIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

export const LoginForm = ({
  isLogin,
  setIsLogin,
  onSubmit,
  formState,
  setters,
  isLoading,
}: LoginFormProps) => {
  const fullText = isLogin ? "Feedback Hub" : "Crear Cuenta";
  const [displayedText, setDisplayedText] = useState("");

  // Lógica de animación corregida y estabilizada
  useEffect(() => {
    setDisplayedText("");
    let i = 0;

    // Delay inicial para evitar que se coma letras al montar el componente
    const startTimeout = setTimeout(() => {
      const typingInterval = setInterval(() => {
        if (i < fullText.length) {
          // Usamos substring para garantizar que tome la cadena desde el inicio
          setDisplayedText(fullText.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, 75);

      return () => clearInterval(typingInterval);
    }, 150);

    return () => clearTimeout(startTimeout);
  }, [isLogin, fullText]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {/* Card Principal - Blanco con sombra suave corporativa */}
      <div className="max-w-md w-full p-10 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-3 mb-10">
          <div className="h-12 flex items-center justify-center">
            <h1 className="text-3xl font-bold tracking-tighter text-gray-950">
              {displayedText}
              <span className="w-1.5 h-8 ml-1 bg-red-600 inline-block animate-pulse align-middle" />
            </h1>
          </div>

          <p className="text-gray-500 text-sm leading-relaxed">
            {isLogin
              ? "Accede a tu panel corporativo de Feedback"
              : "Regístrate en la red de colaboración interna"}
          </p>
        </div>

        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors duration-300">
                  <UserIcon />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Nombre de usuario"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/10 transition-all"
                  value={formState.username || ""}
                  onChange={(e) => setters.setUsername(e.target.value)}
                />
              </div>
            )}

            <div className="relative group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors duration-300">
                <MailIcon />
              </div>
              <input
                type="email"
                required
                placeholder="Correo corporativo"
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/10 transition-all"
                value={formState.email}
                onChange={(e) => setters.setEmail(e.target.value)}
              />
            </div>

            <div className="relative group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors duration-300">
                <LockIcon />
              </div>
              <input
                type="password"
                required
                placeholder="Contraseña"
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/10 transition-all"
                value={formState.password}
                onChange={(e) => setters.setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
            <button
              type="button"
              className="text-red-600 hover:text-red-700 transition-colors"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Registrarse" : "Ya tengo cuenta"}
            </button>
            {isLogin && (
              <a
                href="#"
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                ¿Olvidaste tu clave?
              </a>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/10 active:scale-[0.98]"
          >
            {isLoading
              ? "Validando..."
              : isLogin
                ? "Ingresar al Hub"
                : "Confirmar Registro"}
          </button>
        </form>
      </div>
    </div>
  );
};
