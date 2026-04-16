// modules/auth/containers/LoginContainer.tsx
import { useState } from "react";
import api from "../../../../api/axios";
import { useAuth } from "../../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { LoginForm } from "../components/LoginForm";
import Swal from "sweetalert2";

export const LoginContainer = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // --- CONFIGURACIÓN DE COLORES TURBOFIN ---
  const swalConfig = {
    background: "#ffffff", // Blanco para el fondo
    color: "#1f2937", // Gris oscuro para el texto (Slate-800)
    confirmButtonColor: "#e11d48", // Rojo corporativo (Rose-600)
    cancelButtonColor: "#6b7280", // Gris para botones secundarios (Gray-500)
    customClass: {
      popup: "border-radius-lg",
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const endpoint = isLogin ? "api/users/login" : "api/users/register";
    const payload = isLogin
      ? { email, password }
      : { username, email, password };

    try {
      const response = await api.post(endpoint, payload);

      if (isLogin) {
        login(response.data.token, response.data.user);

        // Toast elegante en blanco y rojo
        Swal.fire({
          icon: "success",
          iconColor: "#e11d48", // Ícono en rojo
          title: "¡Bienvenido!",
          text: `Hola, ${response.data.user.username}`,
          timer: 1500,
          showConfirmButton: false,
          ...swalConfig,
        });

        navigate("/dashboard");
      } else {
        await Swal.fire({
          icon: "success",
          iconColor: "#e11d48",
          title: "¡Cuenta creada!",
          text: "Tu registro fue exitoso. Ya puedes iniciar sesión.",
          confirmButtonText: "Ir al Login",
          ...swalConfig,
        });
        setIsLogin(true);
      }
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;

      Swal.fire({
        icon: "error",
        iconColor: "#e11d48",
        title: "Error",
        text: err.response?.data?.error || "Error de autenticación",
        ...swalConfig,
        confirmButtonColor: "#1f2937", // Botón oscuro para contraste en error
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginForm
      isLogin={isLogin}
      setIsLogin={setIsLogin}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      formState={{ username, email, password }}
      setters={{ setUsername, setEmail, setPassword }}
    />
  );
};
