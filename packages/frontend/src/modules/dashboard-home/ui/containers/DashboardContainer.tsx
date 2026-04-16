import { useState, useEffect, useCallback } from "react";
import { DashboardView } from "../components/DashboardView";
import api from "../../../../api/axios";
import { useAuth } from "../../../../hooks/useAuth";
import { AxiosError } from "axios";
import Swal from "sweetalert2";
import type { Activity } from "../../infrastructure/userActivityService";

// Definimos la interfaz extendida para incluir interacciones
export interface Post {
  id: string;
  content: string;
  created_at: string;
  likes_count: number;
  userId: string;
  sender: string;
  parent_id?: string | null;
  replies?: []; // Para almacenar los subcomentarios del hilo
}

interface ApiResponseItem {
  props: {
    id: string;
    userId: string;
    content: string;
    likesCount: number;
    created_at: string;
    parent_id: string | null;
    username: string;
  };
}

export const DashboardContainer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const { user } = useAuth();

  const swalConfig = {
    background: "#ffffff",
    color: "#1f2937",
    confirmButtonColor: "#e11d48",
  };

  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const [messagesRes, activityRes] = await Promise.all([
        api.get<ApiResponseItem[]>("/api/messages"),
        api.get<Activity[]>("/api/messages/activity"),
      ]);

      console.log("LOG 1: Datos crudos de Activity:", activityRes.data);

      // 1. Filtrar mis publicaciones raíz
      const myRootMessages = messagesRes.data.filter(
        (item) =>
          item.props.userId === user.id && item.props.parent_id === null,
      );

      // 2. Mapear y buscar sus respuestas dentro de activityRes
      const basePosts: Post[] = myRootMessages.map((item) => {
        // Buscamos si este post existe en la actividad para extraer sus replies
        const activityInfo = activityRes.data.find(
          (act) => act.id === item.props.id,
        );

        console.log(
          `LOG 2: Buscando replies para post ${item.props.id}:`,
          activityInfo?.replies,
        );

        return {
          id: item.props.id,
          content: item.props.content,
          created_at: item.props.created_at,
          likes_count: item.props.likesCount,
          userId: item.props.userId,
          parent_id: item.props.parent_id,
          sender: user.username || "Yo",
          // AQUÍ ESTABA EL ERROR: replies: [] siempre estaba vacío
          replies: activityInfo?.replies || [],
        };
      });

      console.log("LOG 3: Posts finales procesados en Container:", basePosts);
      setPosts(basePosts);
      setActivities(activityRes.data);
    } catch (error) {
      console.error("Error al sincronizar el dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, user?.username]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleCreatePost = async (content: string) => {
    setIsLoading(true);
    try {
      await api.post("/api/messages", { content });
      await fetchDashboardData();
      setIsModalOpen(false);
      Swal.fire({
        icon: "success",
        iconColor: "#e11d48",
        title: "¡Publicado!",
        timer: 1500,
        showConfirmButton: false,
        ...swalConfig,
      });
    } catch (error: unknown) {
      let errorMessage = "No se pudo publicar el mensaje";
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.error || errorMessage;
      }
      Swal.fire({
        icon: "error",
        iconColor: "#e11d48",
        title: "Error",
        text: errorMessage,
        ...swalConfig,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardView
      userName={user?.username || "Usuario"}
      posts={posts}
      activities={activities}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      isDrawerOpen={isDrawerOpen}
      setIsDrawerOpen={setIsDrawerOpen}
      onCreatePost={handleCreatePost}
      isLoading={isLoading}
      onRefresh={fetchDashboardData} // Pasar refresh por si los hijos lo necesitan
    />
  );
};
