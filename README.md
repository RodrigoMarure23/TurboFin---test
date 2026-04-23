# 🚀 Real-Time Feedback Hub – Full Stack Challenge

## 📌 Descripción
Aplicación full stack para la publicación de mensajes y reacciones (likes) en tiempo real.

El sistema fue diseñado priorizando:
- Escalabilidad
- Desacoplamiento
- Mantenibilidad
- Experiencia en tiempo real

Además de cumplir con todos los requerimientos de la prueba, se implementaron funcionalidades adicionales orientadas a un entorno más cercano a producción.

---

## ✅ Cumplimiento de Requisitos

### ✔ Funcionalidades
- Feed de mensajes  
- Publicación de mensajes  
- Sistema de likes  
- Actualización en tiempo real (WebSockets)  

### ✔ Stack
- Frontend: React + Vite  
- Backend: Node.js  
- DB: PostgreSQL (SQL puro)  
- WebSockets: Socket.io  

### ✔ Entregables
- README.md  
- AI_LOG.md  
- Script SQL  
- .env.example  
- Repositorio GitHub  
- URL desplegada  

---

## 🏗️ Arquitectura

```
root/
├── packages/
│   ├── frontend/
│   └── backend/
├── sql/
│   └── schema.sql
├── README.md
├── AI_LOG.md
└── package.json
```

---

## ⚙️ Backend

Arquitectura basada en **casos de uso**:
- Lógica desacoplada
- Acceso a datos independiente
- Fácil mantenimiento

👉 Cambios en DB no afectan lógica de negocio.

---

## 💻 Frontend

Arquitectura modular:
- UI
- Dominio
- Infraestructura

Flujo:
UI → Use Cases → Infraestructura → Backend

---

## 🗄️ Base de Datos

Ubicación:
```
/sql/schema.sql
```

---

## 🚀 Funcionalidades

### 🔐 Autenticación
- Login con email/password  
- Mensajes de error/éxito  
- Recuperación (dummy escalable)  

### 👤 Roles
- Registro → user  
- Admin solo desde backend  

**Permisos:**
- Admin: crear, activar/desactivar  
- User: acceso limitado  

---

### 🏠 Dashboard
- Crear comentarios  
- Ver "Mis posts"  
- Actividad reciente  

---

### 🌐 Feed en Tiempo Real

- Ver todos los comentarios  
- Dar likes / comentar  

⚡ **Tiempo real:**
Cada acción:
1. Backend procesa  
2. Emite evento con Socket.io  
3. Clientes reciben actualización inmediata  

👉 Sin recargar la app

---

### 👥 Usuarios
- Control por roles  
- Admin gestiona usuarios  

---

### ⚙️ Configuración
- Cambiar imagen  
- Eliminar cuenta  
- Cambiar contraseña  

---

## ⚡ Decisiones Técnicas

- Arquitectura por casos de uso  
- Separación frontend/backend  
- WebSockets (no polling)  
- Base lista para escalar (ETL, IA)  

---

## 🚀 Instalación y Ejecución

### 1. Clonar repositorio
```
git clone https://github.com/RodrigoMarure23/TurboFin---test/
cd TurboFin---test
```

---

## 💻 Frontend
```
cd packages/frontend
npm install
npm run dev
```

---

## ⚙️ Backend
```
cd packages/backend
npm install
npm run dev
```

---

## 🗄️ Base de Datos

Para replicar en local:

1. Crear base de datos PostgreSQL  
2. Ejecutar:
```
sql/schema.sql
```

3. Configurar `.env` backend:
```
DATABASE_URL=
JWT_SECRET=
PORT=
```

---

## 🔐 Variables de Entorno Frontend
```
VITE_API_URL=
```

---

## 🌐 Despliegue

- Frontend: Netlify  
- Backend: Railway  
- Base de datos: PostgreSQL (conectada desde entorno local)

### 🧠 Nota técnica
El backend desplegado en Railway se conecta a una base de datos PostgreSQL local, lo que demuestra la flexibilidad del sistema para integrarse con diferentes fuentes de datos.

Este enfoque permite escalar hacia:
- Bases de datos en la nube  
- ETLs  
- Analítica en tiempo real  

sin modificar la lógica de negocio.

---

## 🤖 Uso de IA
Ver:
```
AI_LOG.md
```

Incluye:
- Prompts
- Decisiones
- Problemas
- Aprendizajes

---

## 📈 Extras

- Sistema de roles  
- Dashboard  
- Gestión de usuarios  
- Configuración  
- Arquitectura escalable  

---

## 🧠 Conclusión

El proyecto cumple con los requisitos y está preparado para escalar a un entorno real.

---

## 📬 Creador

Rodrigo Marure Sanchez
Full Stack Developer
