// modules/settings/components/ProfileSection.tsx
import { User, Camera } from "lucide-react";

interface ProfileSectionProps {
  userName: string;
  avatarLabel: string;
  onDeleteClick: () => void;
}

export const ProfileSection = ({
  userName,
  avatarLabel,
  onDeleteClick,
}: ProfileSectionProps) => {
  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-8 space-y-8 shadow-sm">
      {/* Header de Sección */}
      <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
        <div className="p-3 bg-red-50 rounded-2xl text-red-600 shadow-sm shadow-red-600/5">
          <User className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-black text-gray-950 tracking-tight">
          Tu Identidad
        </h3>
      </div>

      <div className="flex flex-col items-center sm:flex-row gap-10">
        {/* Avatar con gradiente Turbofin */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-red-600/20 group-hover:rotate-3 transition-all duration-300">
            {avatarLabel}
          </div>
          <button className="absolute -bottom-2 -right-2 p-3 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-red-600 shadow-xl transition-all active:scale-90">
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {/* Información y Acciones */}
        <div className="flex-1 space-y-6 text-center sm:text-left">
          <div>
            <p className="text-gray-950 font-black text-2xl tracking-tight">
              {userName}
            </p>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
              Socio
            </p>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-start gap-4">
            <button className="px-6 py-3 bg-gray-950 hover:bg-gray-800 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-lg shadow-gray-950/10">
              Cambiar Foto
            </button>

            <button
              onClick={onDeleteClick}
              className="px-6 py-3 text-red-600 hover:bg-red-50 text-xs font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
            >
              Eliminar Cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
