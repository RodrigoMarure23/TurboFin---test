import { MessageSquare, Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CreatePostModal } from "../../../feedback-feed/components/CreatePostModel";
import { ActivityTimeline } from "./ActivityTimeline";
import { MyPosts } from "../../../feedback-feed/components/MyPosts";
import type { Activity } from "../../infrastructure/userActivityService";

// Definición de la interfaz Post actualizada
export interface Post {
  id: string;
  content: string;
  created_at: string;
  likes_count: number;
  userId: string;
  sender: string;
  username?: string;
  parent_id?: string | null;
  interactions?: number;
  replies?: []; // Definido como any[] para soportar data cruda o procesada
}

interface DashboardViewProps {
  userName: string;
  posts: Post[];
  activities: Activity[];
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  onCreatePost: (content: string) => void;
  onRefresh: () => void; // Nueva prop para refrescar datos
  isLoading: boolean;
}

export const DashboardView = ({
  userName,
  posts,
  activities,
  isModalOpen,
  setIsModalOpen,
  isDrawerOpen,
  setIsDrawerOpen,
  onCreatePost,
  onRefresh, // Recibimos el orquestador de datos
  isLoading,
}: DashboardViewProps) => {
  // 1. Identificamos los posts raíz (comentarios principales)
  const rootPosts = posts.filter((p) => !p.parent_id);

  // 2. Construimos la jerarquía real para el Drawer
  // Nota: Si el backend ya trae los hilos por post, esta lógica se simplifica
  const postsWithReplies = posts.map((p) => {
    console.log(
      `LOG 4: Renderizando post ${p.id} con ${p.replies?.length} replies`,
    );
    return {
      ...p,
      interactions: p.replies?.length || 0,
      username: p.username || p.sender || "Usuario",
      replies: p.replies || [],
    };
  });
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Sección */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-950 tracking-tight">
            Hola de nuevo, {userName}
          </h1>
          <p className="text-gray-500 mt-1">
            {isLoading
              ? "Actualizando..."
              : "Esto es lo que ha pasado desde tu última visita."}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/10 active:scale-95 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
          Publicar comentario
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickStat
              title="Mis Posts"
              value={rootPosts.length.toString()}
              icon={MessageSquare}
              color="red"
              onClick={() => setIsDrawerOpen(true)}
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <ActivityTimeline activities={activities} />
        </div>
      </div>

      {/* Modales y Drawers */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onCreatePost}
      />

      <MyPosts
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        posts={postsWithReplies}
        onRefresh={onRefresh} // Los hijos ahora pueden disparar el refresh del contenedor
      />
    </div>
  );
};

// Subcomponente QuickStat (Se mantiene igual pero optimizado visualmente)
interface QuickStatProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: "red" | "gray";
  onClick?: () => void;
}

const QuickStat = ({
  title,
  value,
  icon: Icon,
  color,
  onClick,
}: QuickStatProps) => {
  const theme = {
    red: {
      bg: "bg-red-50",
      text: "text-red-600",
      border: "hover:border-red-200",
      iconBg: "bg-red-100",
    },
    gray: {
      bg: "bg-white",
      text: "text-gray-400",
      border: "hover:border-gray-200",
      iconBg: "bg-gray-50",
    },
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all ${
        onClick
          ? `cursor-pointer ${theme[color].border} active:scale-[0.97]`
          : ""
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`p-3 rounded-xl ${theme[color].iconBg} transition-colors`}
        >
          <Icon className={`w-5 h-5 ${theme[color].text}`} />
        </div>
        <div>
          <p className="text-gray-400 text-[10px] uppercase tracking-[0.15em] font-black">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};
