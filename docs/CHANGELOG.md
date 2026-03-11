# Changelog - BestKids

Registro de cambios y versiones del proyecto.

---

## [2.1.0] - 2024-12-30

### Added
- **Constructor Visual de Ejercicios**: Editores visuales para los 7 tipos de ejercicios.
  - Opción Múltiple, Verdadero/Falso, Unir Líneas, Arrastrar, Secuencia, Completar Huecos, Selección Múltiple.
- **Gamificación Extendida**:
  - 2 nuevos mundos: Imperio de la Historia, Archipiélago de Inglés.
  - 4 avatares premium: Robot, Astronauta, Mago, Superhéroe.
  - Sistema de rachas con bonificación de puntos.
  - Marcos de perfil desbloqueables.
- **Center Dashboard Redesign**: Interfaz Enterprise V4 para directores.
- **Reportes PDF de Centro**: Generación y descarga desde el panel de centro.

### Changed
- `VisualExerciseForm.tsx`: Reescrito con soporte para todos los tipos de ejercicios.
- `GamificationService`: Añadidos métodos `updateStreak()` y `getProfileFrames()`.

### Fixed
- Creación de unidades con payload incompleto (error 500).
- Nombres de propiedades en `GamificationProfile` (`streakDays` → `currentStreakDays`).

---

## [2.0.0] - 2024-12-17

### Added
- **Enterprise Dashboard Redesign**: Admin, Teacher, Parent, Student dashboards.
- **Sistema de Reportes**: PDF y Excel para clases.
- **Tutoriales Interactivos**: Guías paso a paso en todos los dashboards.
- **Dark Mode**: Soporte completo en toda la aplicación.

### Changed
- Migración de UI a componentes Shadcn/UI.
- Optimización de carga de ejercicios.

---

## [1.0.0] - 2024-11-01

### Added
- Lanzamiento inicial de BestKids 2.0.
- 7 tipos de ejercicios interactivos.
- Sistema de gamificación básico.
- Dashboards por rol.
