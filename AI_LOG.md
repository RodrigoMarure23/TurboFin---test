# AI_LOG.md - Real-Time Feedback Hub Challenge

## Información del Desarrollador

- Nombre: Rodrigo Marure Sánchez
- Rol: Full Stack Web Developer / Ingeniero en Computación
- Fecha de Inicio: 9 de Abril, 2026

---

## Fase 1: Configuración de Infraestructura y Conectividad

### 1. Definición del Esquema de Base de Datos

**Decisión:** Refactorización del esquema inicial para transicionar de un modelo basado en atributos (`author_name`) a uno basado en relaciones (`user_id UUID`).

**Razón:** Garantizar integridad referencial y trazabilidad completa de acciones.

**Cambio Técnico:**

- Uso de llaves foráneas
- Implementación de `ON DELETE CASCADE` para evitar registros huérfanos

---

### 2. Arquitectura de Software (Backend)

**Decisión:** Adopción de Screaming Architecture

**Razón:** Permitir que la estructura del proyecto refleje el dominio del negocio y no las herramientas.

**Implementación:**

- Separación en capas: `domain`, `application`, `infrastructure`
- Módulos desacoplados: Users, Messages, Likes

---

### 3. Gestión de Dependencias y Monorepo

**Decisión:** Uso de NPM Workspaces

**Razón:** Centralizar el repositorio manteniendo separación de entornos (frontend/backend).

---

### 4. Resolución de Conflictos Técnicos

- Error TS1259 / TS1192 → `esModuleInterop`
- Deprecaciones TS → migración a `Node16 moduleResolution`
- Error ESM → migración de `ts-node` a `tsx`

**Aprendizaje:** Priorizar herramientas compatibles con el ecosistema moderno de Node.js.

---

### 5. Conectividad y Performance

**Decisión:** Uso de connection pooling (`pg`)

**Razón:** Mejorar rendimiento en escenarios concurrentes (WebSockets)

---

## Fase 2: Implementación de Dominio y Lógica de Negocio

### 1. Principios de Arquitectura

**Decisión:** Aplicación de DIP (Dependency Inversion Principle)

**Resultado:** Independencia de la base de datos

---

### 2. Persistencia

**Decisión:** Uso de SQL crudo (sin ORM)

**Razón:**

- Control total sobre queries
- Evitar sobrecarga de abstracción
- Optimización directa de performance

---

### 3. Autenticación y Seguridad

- Implementación de JWT (stateless)
- Uso de bcrypt para hashing
- Respuestas genéricas para evitar enumeración de usuarios
- Manejo de secretos mediante variables de entorno

---

### 4. Middleware y Seguridad

**Decisión:** Middleware centralizado de autenticación

**Impacto:**

- Separación de responsabilidades
- Seguridad transversal en toda la app

---

### 5. Sistema de Feedback (Mensajes)

- Endpoint público (`GET`)
- Endpoint protegido (`POST`)
- Validación mediante caso de uso (`CreateMessage`)

**Optimización:**

- Uso de JOIN para evitar problema N+1

---

### 6. Debugging Crítico

Errores resueltos:

- Error 42703 (columnas inconsistentes)
- Desalineación entre DB (`snake_case`) y TS (`camelCase`)

**Solución:**

- Normalización + uso de alias en SQL

---

## Fase 3: Tiempo Real y Experiencia de Usuario

### 1. WebSockets

**Tecnología:** Socket.io

**Decisión:** Servidor híbrido (HTTP + WS)

**Eventos implementados:**

- `new_message`
- `message_reaction`

**Impacto:**

- Eliminación de polling
- Actualización en tiempo real (Push-based)

---

### 2. Sistema de Likes (Toggle)

**Decisión:** Lógica atómica en DB

**Resultado:**

- UX simplificada (un solo endpoint)
- Consistencia en concurrencia

---

## Fase 4: Frontend y Experiencia de Usuario

### 1. Arquitectura Frontend

- React + Vite
- Separación de contexto y lógica de estado

---

### 2. Estado y Autenticación

**Optimización:**

- Persistencia con Lazy Initialization
- Interceptores Axios para tokens

---

### 3. Integración en Tiempo Real

- Cliente Socket.io sincronizado con backend
- Actualización automática de mensajes y likes

---

### 4. Resolución de Problemas

- Tailwind JIT issues → configuración corregida
- Migración a Tailwind v4 (`@tailwindcss/postcss`)

---

## Fase 5: Despliegue y Consideraciones Productivas

### 1. Estrategia de Deploy

- Frontend: Netlify
- Backend: preparado para Vercel / Google Cloud

---

### 2. Escalabilidad

**Consideraciones:**

- Separación de servicios
- Posibilidad de horizontal scaling
- Preparación para observabilidad

---

### 3. Evolución del Sistema

- Integración con pipelines ETL
- Análisis de comportamiento de usuarios
- Métricas en tiempo real

---

## Resultado Final

### Funcionalidades implementadas

- Autenticación completa
- CRUD de usuarios, mensajes y likes
- Sistema en tiempo real
- Arquitectura desacoplada
- Base de datos optimizada

---

## Decisiones Clave

| Decisión               | Impacto                          |
| ---------------------- | -------------------------------- |
| Screaming Architecture | Escalabilidad y mantenibilidad   |
| SQL crudo              | Performance y control            |
| WebSockets             | UX en tiempo real                |
| JWT                    | Autenticación segura y stateless |

---

## Reflexión Final

Este proyecto fue abordado no solo como una prueba técnica, sino como un sistema real listo para evolucionar a producción.

Se priorizó:

- Calidad de arquitectura sobre velocidad
- Escalabilidad sobre soluciones rápidas
- Claridad en decisiones técnicas

Cada problema encontrado fue tratado como una oportunidad para alinear la solución con estándares de la industria.

---

## Notas para el Evaluador

- El sistema está diseñado para ser fácilmente extensible
- Las decisiones técnicas están justificadas en este documento
- Existen áreas intencionalmente preparadas para escalar (cloud, analytics, etc.)
