import type { Feedback } from "../domain/feedback";

// Datos dummy que simulan la unión de las tablas 'messages' y 'users'
const DUMMY_FEEDBACKS: Feedback[] = [
  {
    id: "39a71876-ea75-4518-8536-9a0579dde403",
    content: "La nueva actualización del dashboard está increíble, muy fluida.",
    sender: "rodrigo_dev",
    created_at: new Date().toISOString(),
    likes_count: 5, // Basado en tu tabla messages
  },
  {
    id: "39a71876-ea75-4518-8536-9a0579dde403",
    content: "Me gustaría poder exportar los reportes en formato PDF.",
    sender: "ana_manager",
    created_at: new Date(Date.now() - 86400000).toISOString(), // Ayer
    likes_count: 2,
  },
  {
    id: "39a71876-ea75-4518-8536-9a0579dde403",
    content: "¿Es posible cambiar el tema a color oscuro en toda la app?",
    sender: "user_test",
    created_at: new Date(Date.now() - 172800000).toISOString(), // Hace 2 días
    likes_count: 10,
  },
];

export const getFeedbacks = async (): Promise<Feedback[]> => {
  // Simulamos un retraso de red de 800ms para probar tus estados de carga (Spinners)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(DUMMY_FEEDBACKS);
    }, 800);
  });

  /* Cuando tu backend esté listo, el código será:
    const response = await api.get("/feedback");
    return response.data;
  */
};
