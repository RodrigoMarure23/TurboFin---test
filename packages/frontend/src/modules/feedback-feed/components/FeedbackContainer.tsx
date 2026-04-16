// modules/feedback-feed/components/FeedbackContainer.tsx
import { FeedbackList } from "./FeedbackList";
import { useFeedback } from "../hooks/useFeedback";
import api from "../../../api/axios";
import Swal from "sweetalert2";

export const FeedbackContainer = () => {
  // Extraemos 'refresh' (o el nombre que tenga tu función de carga en el hook)
  const { feedbacks, loading, fetchFeedbacks } = useFeedback();
  console.log("feedbackaux: ", feedbacks);
  // Función para manejar el Like desde el Feed Global
  const handleLike = async (messageId: string) => {
    try {
      await api.post(`/api/messages/${messageId}/like`);
      // Refrescamos el feed para ver el nuevo conteo de likes
      fetchFeedbacks();
    } catch (error) {
      console.error("Error al dar like:", error);
      Swal.fire({
        icon: "error",
        title: "Ups...",
        text: "No se pudo procesar tu reacción",
        confirmButtonColor: "#e11d48",
      });
    }
  };
  const handleReply = async (parentId: string) => {
    const { value: text } = await Swal.fire({
      title: "Responder al comentario",
      input: "textarea",
      inputPlaceholder: "Escribe tu respuesta aquí...",
      showCancelButton: true,
      confirmButtonText: "Enviar Respuesta",
      confirmButtonColor: "#e11d48", // El rojo que estás usando
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value) return "¡No puedes enviar una respuesta vacía!";
      },
    });

    if (text) {
      try {
        await api.post("/api/messages/reply", {
          content: text,
          parent_id: parentId,
        });

        Swal.fire({
          icon: "success",
          title: "¡Enviado!",
          text: "Tu respuesta se ha publicado correctamente.",
          timer: 1500,
          showConfirmButton: false,
        });

        fetchFeedbacks(); // Recargamos para ver la respuesta en el hilo
      } catch (error) {
        console.error("Error al responder:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo enviar tu respuesta.",
          confirmButtonColor: "#e11d48",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-100 border-t-red-600"></div>
          <div className="absolute inset-0 rounded-full h-10 w-10 shadow-inner shadow-red-600/10"></div>
        </div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 animate-pulse">
          Cargando Feed
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1 border-l-4 border-red-600 pl-4">
        <h2 className="text-2xl font-black text-gray-950 tracking-tight">
          Feed de Feedback
        </h2>
        <p className="text-sm text-gray-500 font-medium">
          Explora y responde a las interacciones de la comunidad.
        </p>
      </div>

      <div className="pb-10">
        {/* Pasamos la función de like y el refresh a la lista */}
        <FeedbackList
          feedbacks={feedbacks}
          onLike={handleLike}
          onRefresh={fetchFeedbacks}
          onReply={handleReply}
        />
      </div>
    </section>
  );
};
