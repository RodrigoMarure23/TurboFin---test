// modules/settings/components/SecuritySection.tsx
import { Lock, RefreshCw } from "lucide-react";

export const SecSection = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-8 space-y-8 shadow-sm">
      {/* Header de Seguridad */}
      <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
        <div className="p-3 bg-red-50 rounded-2xl text-red-600 shadow-sm shadow-red-600/5">
          <Lock className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-black text-gray-950 tracking-tight">
            Seguridad
          </h3>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.1em] mt-0.5">
            Último cambio: hace 3 meses
          </p>
        </div>
      </div>

      <form className="space-y-6">
        <div className="grid gap-6">
          {/* Input: Contraseña Actual */}
          <div className="space-y-2 relative">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Contraseña Actual
            </label>
            <input
              type="password"
              className="w-full bg-gray-50/50 border border-gray-100 text-gray-800 px-5 py-3.5 rounded-2xl outline-none focus:border-red-200 focus:ring-4 focus:ring-red-600/5 transition-all placeholder:text-gray-300 font-medium"
              placeholder="••••••••"
            />
          </div>

          {/* Input: Nueva Contraseña */}
          <div className="space-y-2 relative">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Nueva Contraseña
            </label>
            <input
              type="password"
              className="w-full bg-gray-50/50 border border-gray-100 text-gray-800 px-5 py-3.5 rounded-2xl outline-none focus:border-red-200 focus:ring-4 focus:ring-red-600/5 transition-all placeholder:text-gray-300 font-medium"
              placeholder="Mín. 8 caracteres"
            />
          </div>
        </div>

        {/* Botón Principal - Negro Corporativo para variar del rojo del header */}
        <button className="w-full mt-4 flex items-center justify-center gap-3 bg-gray-950 hover:bg-gray-800 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-gray-950/10 active:scale-[0.97]">
          <RefreshCw className="w-4 h-4" />
          Actualizar Credenciales
        </button>
      </form>
    </div>
  );
};
