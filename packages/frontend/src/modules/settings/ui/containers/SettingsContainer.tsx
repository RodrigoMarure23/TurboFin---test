// modules/settings/containers/SettingsContainer.jsx
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { ProfileSection } from "../components/ProfileSelection";
import { ActionModal } from "../components/ActionModal";
import { SecSection } from "../components/SecSection";

export const SettingsContainer = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const currentUser = {
    name: "rodrigo_admin",
    avatar: "RA",
  };

  const handleDeletePhoto = () => {
    console.log("Eliminando foto de perfil...");
    setIsDeleteModalOpen(false);
  };

  return (
    // Se añade un fondo gris ultra-tenue para resaltar las tarjetas blancas
    <div className="min-h-screen bg-[#F8F9FA] px-4 py-8 md:px-10 lg:px-16 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header - Alineación a la izquierda con acento rojo lateral */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-12 relative">
          <div className="relative pl-6">
            {/* El "Cursor" rojo de Turbofin al lado del título */}
            <div className="absolute left-0 top-1 bottom-1 w-1.5 bg-red-600 rounded-full" />
            <h1 className="text-4xl font-black text-gray-950 tracking-tighter">
              Configuración
            </h1>
            <p className="text-gray-500 mt-2 font-medium max-w-md">
              Ajusta los parámetros de tu perfil y credenciales de acceso al
              sistema interno.
            </p>
          </div>

          {/* Badge de Seguridad con estilo de "Píldora" corporativa */}
          <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50">
            <div className="p-2.5 bg-red-50 rounded-2xl text-red-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Estado de Red
              </span>
              <span className="text-sm font-black text-gray-950">
                Seguridad Activa
              </span>
            </div>
          </div>
        </div>

        {/* Grid Principal - Ajustado para que las tarjetas tengan la misma altura visual */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch pb-24">
          {/* Identidad Visual */}
          <div className="bg-white rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
            <ProfileSection
              userName={currentUser.name}
              avatarLabel={currentUser.avatar}
              onDeleteClick={() => setIsDeleteModalOpen(true)}
            />
          </div>

          {/* Gestión de Credenciales */}
          <div className="bg-white rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
            <SecSection />
          </div>
        </div>
      </div>

      <ActionModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeletePhoto}
        title="¿Confirmar eliminación?"
        message="Esta acción restablecerá tu identidad visual al estado por defecto. ¿Deseas continuar?"
      />
    </div>
  );
};
