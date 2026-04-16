AI_LOG.md - Real-Time Feedback Hub Challenge
Información del Desarrollador
Nombre: Rodrigo Marure Sánchez

Rol: Full Stack Web Developer / Ingeniero en Computación

Fecha de Inicio: 9 de Abril, 2026

Fase 1: Configuración de Infraestructura y Conectividad

1. Definición del Esquema de Base de Datos
   Decisión: Refactorización del esquema inicial para transicionar de un modelo basado en atributos (author_name) a uno basado en relaciones íntegras (user_id UUID).

Razón: Garantizar la integridad referencial y permitir la trazabilidad total de las acciones de los usuarios en el sistema.

Cambio Técnico: Se implementó ON DELETE CASCADE en las llaves foráneas para mantener la base de datos libre de registros huérfanos.

2. Arquitectura de Software (Backend)
   Decisión: Adopción de Screaming Architecture.

Razón: Facilitar la escalabilidad y el desacoplamiento. La estructura permite identificar la intención del sistema (Módulos de Usuarios, Mensajes, Likes) independientemente de las herramientas externas.

Implementación: Organización de carpetas en domain, application, e infrastructure dentro de cada módulo.

3. Gestión de Dependencias y Monorepo
   Decisión: Configuración de NPM Workspaces.

Razón: Centralizar la gestión de paquetes permitiendo que el Frontend (React + Vite) y el Backend (Node + TS) compartan el mismo repositorio pero mantengan entornos de ejecución (node_modules) aislados.

4. Resolución de Conflictos Técnicos (Troubleshooting)
   Problema: Error TS1259 y TS1192 al importar Express/Cors.

Solución: Activación de esModuleInterop en el tsconfig.json.

Problema: Advertencias de deprecación en TypeScript 5.x (baseUrl y moduleResolution: node10).

Solución: Modernización del archivo de configuración a los estándares de TypeScript 7.0 (futuro), estableciendo module y moduleResolution en Node16.

Justificación: Evitar deuda técnica inmediata y asegurar compatibilidad con el ecosistema de Node.js moderno.

5. Conectividad y Health Check
   Decisión: Implementación de un Connection Pool con la librería pg.

Razón: Optimizar el manejo de conexiones simultáneas, vital para el rendimiento en aplicaciones de tiempo real (WebSockets).

Herramientas de Desarrollo: Configuración de nodemon con ts-node para un ciclo de desarrollo ágil y reinicios automáticos ante cambios en el código.

Próximos Pasos (Fase 2)
[ ] Definición de Entidades de Dominio (User.ts, Message.ts).

[ ] Creación de Interfaces de Repositorio para persistencia.

[ ] Implementación de lógica de autenticación segura (Bcrypt + JWT).

Notas para el evaluador:
"Durante esta fase, se priorizó la estabilidad del entorno de desarrollo. Cada error de configuración de TypeScript fue tratado como una oportunidad para alinear el proyecto con las mejores prácticas de la industria, asegurando un tipado fuerte y una resolución de módulos consistente."

Decisión: Implementación de Entidades y Repositorios de Dominio (DIP - Dependency Inversion Principle).
Razón: Al definir interfaces para los repositorios en la capa de dominio, el sistema se vuelve independiente de la base de datos. Si mañana decides cambiar Postgres por MongoDB, la lógica de negocio (casos de uso) no cambiaría ni una línea de código.

Decisión: Implementación de persistencia mediante SQL Crudo (Raw SQL).
Razón: Se evitó el uso de ORMs (como Prisma o TypeORM) para eliminar la sobrecarga de abstracción y demostrar un control total sobre las consultas, optimizando el rendimiento y evitando el problema de "N+1" consultas. Además, permite un tipado manual más riguroso entre la capa de infraestructura y el dominio.

Problema: Error ERR_UNKNOWN_FILE_EXTENSION al intentar ejecutar archivos .ts en un proyecto configurado como ESM ("type": "module").
Causa: El cargador por defecto de Node.js no reconoce la extensión .ts y espera archivos .js o .mjs.
Solución: Se integró el cargador experimental de ts-node/esm mediante el flag --loader en la configuración de nodemon. Esto permite la transpilación "on-the-fly" respetando la resolución de módulos de ECMAScript.

Paso: Modularización de la capa de transporte (HTTP).
Decisión: Implementación de UserRoutes.ts utilizando express.Router().
Razón: Seguir el patrón de delegación de responsabilidades. El archivo server.ts actúa únicamente como punto de entrada y configuración global, delegando la definición de endpoints específicos a sus respectivos módulos de infraestructura. Esto mejora la mantenibilidad y reduce la complejidad cognitiva del código.

Problema: Crash del servidor con error [Object: null prototype] en Node v22.17.1 al usar ts-node/esm.
Causa: Incompatibilidad de los cargadores (loaders) experimentales de ts-node con las APIs internas de las versiones más recientes de Node.js.
Solución: Migración a tsx (TypeScript Execute) como motor de ejecución en desarrollo.
Ventajas: tsx ofrece una resolución de módulos ESM nativa más robusta, es significativamente más rápido que ts-node y no requiere flags experimentales de Node para funcionar correctamente en la versión 22.

Paso: Implementación de Autenticación basada en JWT.
Decisión: Uso de jsonwebtoken para la gestión de sesiones stateless.
Seguridad: Se implementó una respuesta de error genérica ("Credenciales inválidas") tanto para usuarios no encontrados como para contraseñas incorrectas, evitando la enumeración de usuarios por parte de atacantes.
Arquitectura: El secreto del JWT se maneja mediante variables de entorno para cumplir con los estándares de Twelve-Factor App.

Paso: Implementación de Middleware de Seguridad y Persistencia de Mensajes.
Decisión: Creación de un authMiddleware centralizado para la protección de rutas mediante el esquema Bearer Token.
Razón: Desacoplar la lógica de validación de identidad de los controladores, permitiendo que la seguridad sea una preocupación transversal (Cross-Cutting Concern).
Optimización SQL: Se implementó un JOIN en la consulta de mensajes para reducir el número de peticiones a la base de datos (evitando el problema N+1), mejorando la eficiencia del sistema de feedback.

Paso: Implementación de enrutamiento modular para Mensajes.
Decisión: Uso del patrón Middleware Chain para proteger el endpoint de creación de mensajes.
Razón: Asegurar que la lógica de negocio de "publicar feedback" solo sea accesible para entidades autenticadas, mientras se mantiene la consulta de mensajes como una operación de lectura pública para maximizar el alcance del Hub.
Estructura: Separación clara entre los métodos POST (escritura/protegido) y GET (lectura/público).

Paso: Implementación de controladores para el flujo de Feedback.
Decisión: Ubicación estratégica de controladores en la capa infrastructure/http para cumplir con el principio de separación de preocupaciones (SoC).
Lógica de Aplicación: Se creó el caso de uso CreateMessage que encapsula la validación de contenido y la generación de UUIDs, asegurando que la entidad de dominio sea válida antes de persistirla.
Integración: El PostMessageController utiliza el tipo extendido AuthRequest para acceder de forma segura al ID del usuario autenticado, cerrando el ciclo entre seguridad y funcionalidad.

Problema: Error 42703 (Undefined Column) en el módulo de mensajes.
Causa: Discrepancia entre el nombre de la columna en la consulta SQL (user_id) y la definición física en la tabla de PostgreSQL.
Solución: Sincronización del esquema de base de datos utilizando snake_case para columnas y aplicación de alias en la consulta SQL para mantener la compatibilidad con las interfaces de TypeScript (camelCase).
Lección: Siempre verificar el DDL (Data Definition Language) antes de implementar consultas complejas con JOINS.

Hito: Validación exitosa de la capa de persistencia de Mensajes.
Resultado: Endpoint GET /api/messages responde con éxito (HTTP 200) y devuelve una estructura de datos consistente con el esquema de dominio.
Estado: Infraestructura HTTP y de Base de Datos sincronizada. Listo para proceder con la implementación de funcionalidades extendidas (Real-time / Reacciones).

Paso: Integración de WebSockets mediante Socket.io.
Decisión: Implementación de un servidor híbrido (HTTP + WS) para habilitar comunicación bidireccional en tiempo real.
Arquitectura: Se centralizó la configuración en SocketConfig.ts para permitir que cualquier controlador del sistema pueda emitir eventos sin crear dependencias circulares.
Funcionalidad: Implementación del evento new_message que automatiza el refresco de datos en el cliente sin peticiones adicionales (Push Strategy).

Diseño de Interacción: Implementación de lógica de Toggle Like.
Optimización SQL: Uso de ON CONFLICT (...) DO DELETE (o manejo lógico equivalente) para simplificar la experiencia de usuario: un solo endpoint para dar y quitar reacciones.
Sincronización: Emisión del evento message_reaction vía Socket.io para asegurar que todos los clientes vean la actualización del contador de likes instantáneamente.

Bug: Error 42703 en tabla likes.
Causa: Columna user_id no encontrada debido a una discrepancia entre la definición DDL y el Query DML.
Solución: Normalización de la tabla likes a snake_case y ajuste del repositorio para manejar el "Toggle" de forma atómica.
Lección: Mantener una convención de nomenclatura única (snake_case en DB, camelCase en TS) y usar alias en los SELECT para evitar estos roces.

Incidencia: Fallo crítico de npx para inicializar dependencias de CSS.
Resolución: Creación manual de archivos de configuración de Tailwind y PostCSS para bypass de errores del gestor de paquetes.
Infraestructura Front: Configuración inicial de clientes Axios y Socket.io-client con soporte para interceptores de autenticación y variables de entorno.

Refactor de Arquitectura Front: Desacoplamiento de definiciones de contexto y lógica de provisión de estado.
Corrección: Eliminación de advertencias de ESLint sobre Fast Refresh y variables no utilizadas.
Optimización: Implementación de persistencia de sesión síncrona mediante Lazy State Initialization, eliminando la necesidad de estados de carga adicionales para la hidratación.

Debug: Error de renderizado de estilos JIT (Just-In-Time) de Tailwind.
Causa probable: Falta de directivas @tailwind en index.css o rutas de content mal configuradas en tailwind.config.js.
Solución: Verificación de la cadena de compilación PostCSS -> Vite -> Tailwind.

Fix: Error de compatibilidad PostCSS en Tailwind CSS v4.
Causa: Uso de tailwindcss directamente como plugin de PostCSS (obsoleto en v4).
Acción: Instalación de @tailwindcss/postcss y migración de directivas @tailwind a @import "tailwindcss".
Resultado: Pipeline de estilos restaurado bajo la nueva arquitectura v4.
