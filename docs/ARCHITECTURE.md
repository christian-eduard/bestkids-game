# Arquitectura del Sistema - BestKids 2.0

## Visión General
BestKids 2.0 sigue una arquitectura **Monorepo Modular** desacoplada. El frontend y backend son aplicaciones separadas que se comunican vía API RESTful. El sistema está diseñado para ser "Cloud Agnostic" pero optimizado para despliegues tradicionales (VPS/Plesk) o contenerizados (Docker).

---

## 1. Backend (The Core)
**Tecnología**: NestJS (Node.js framework).

### Patrones de Diseño
*   **Modularidad**: Cada dominio (Users, Store, Education) es un módulo aislado.
*   **Controller-Service-Repository**: Separación estricta de responsabilidades.
    *   *Controller*: Recibe HTTP, valida DTOs.
    *   *Service*: Lógica de negocio pura.
    *   *Repository/Entity*: Acceso a datos (TypeORM).
*   **Guards & Strategys**: Seguridad transversal usando JWT Passport Strategy.

### Diagrama de Datos (ERD Simplificado)
*   `User` (1) <-> (N) `UserInventory`
*   `User` (1) <-> (1) `GamificationProfile`
*   `Class` (1) <-> (N) `User` (Students)
*   `Course` (1) <-> (N) `Unit` <-> (N) `Exercise`

---

## 2. Frontend (The Client)
**Tecnología**: Next.js 14 (App Router).

### Estructura de Directorios
*   `/app`: Rutas y Vistas (Pages).
*   `/components`:
    *   `/ui`: Componentes base (Botones, Inputs) reutilizables (Atomic Design).
    *   `/gamification`: Componentes específicos de juego (Avatar, Medallas).
    *   `/exercises`: Motores de ejercicios interactivos.
*   `/lib`: Utilidades, cliente API (Axios wrapper), constantes.
*   `/contexts`: Estado global ligero (Toast, Auth).

### Estrategia de Renderizado
*   **CSR (Client Side Rendering)**: Para dashboards interactivos y ejercicios.
*   **SSR (Server Side Rendering)**: Para landing pages y contenido SEO (preparado para el futuro).

---

## 3. Integraciones Externas
*   **Base de Datos**: PostgreSQL 15.
*   **Almacenamiento**: Local (carpeta `uploads/`) o preparado para S3.
*   **Notificaciones**: In-app polling (actual) -> WebSocket Gateway (futuro).

## 4. Seguridad
*   **Hash de Contraseñas**: Bcrypt.
*   **Protección API**: Rate Limiting, CORS, Helmet Headers.
*   **Roles**: Decoradores personalizados `@Roles('admin', 'teacher')` para control de acceso fino.
