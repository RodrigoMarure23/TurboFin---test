import { Heart, MessageCircle, Clock, PlusCircle, Share2 } from "lucide-react";
import type {
  Activity,
  ActivityType,
} from "../../infrastructure/userActivityService";
import type { LucideIcon } from "lucide-react";
interface ActivityTimelineProps {
  activities: Activity[];
}

// 1. Configuración estandarizada de tipos de actividad
const ACTIVITY_CONFIG: Record<
  ActivityType,
  {
    icon: LucideIcon;
    color: string;
    getLabel: (u?: string, t?: string) => string;
  }
> = {
  like_given: {
    icon: Heart,
    color: "bg-red-600",
    getLabel: (_, target) => `Te gustó el comentario: "${target}"`,
  },
  like_received: {
    icon: Heart,
    color: "bg-pink-500",
    getLabel: (user) => `A ${user} le gustó tu publicación`,
  },
  post_created: {
    icon: PlusCircle,
    color: "bg-blue-600",
    getLabel: () => `Realizaste una nueva publicación`,
  },
  reply_given: {
    icon: MessageCircle,
    color: "bg-gray-950",
    getLabel: (_, target) => `Respondiste a: "${target}"`,
  },
  reply_received: {
    icon: Share2,
    color: "bg-green-600",
    getLabel: (user) => `${user} respondió a tu publicación`,
  },
};

export const ActivityTimeline = ({ activities }: ActivityTimelineProps) => {
  // ELIMINADO: Ya no declaramos 'activities' localmente para usar las que vienen por props

  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm h-full">
      {/* Header */}
      <h3 className="text-gray-950 font-black text-lg mb-8 flex items-center gap-3 tracking-tight">
        <div className="p-2 bg-red-50 rounded-xl">
          <Clock className="w-5 h-5 text-red-600" />
        </div>
        Tu Actividad Reciente
      </h3>

      <div className="space-y-8 relative">
        {/* Línea conectora */}
        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-50" />

        {activities.length > 0 ? (
          activities.map((act) => {
            // Obtenemos la configuración según el tipo (fallback a post_created si hay error)
            const config =
              ACTIVITY_CONFIG[act.type] || ACTIVITY_CONFIG.post_created;
            const Icon = config.icon;

            return (
              <div key={act.id} className="flex gap-5 relative group">
                {/* Icono dinámico */}
                <div
                  className={`z-10 p-2.5 rounded-xl border-4 border-white shadow-sm transition-transform group-hover:scale-110 text-white ${config.color}`}
                >
                  <Icon className="w-3 h-3 fill-current" />
                </div>

                {/* Texto dinámico basado en la estandarización */}
                <div className="flex flex-col justify-center">
                  <p className="text-gray-700 text-sm font-bold tracking-tight group-hover:text-gray-950 transition-colors">
                    {config.getLabel(act.userName, act.targetContent)}
                  </p>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.15em] mt-1.5">
                    {act.created_at}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-400 text-sm italic">
              No hay actividad que mostrar
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
