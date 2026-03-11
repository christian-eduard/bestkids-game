# 🎮 BestKids 2.0 - Plataforma Educativa Gamificada

Plataforma educativa moderna desarrollada con **Next.js**, **NestJS** y **PostgreSQL**, optimizada para niños de 6-12 años.

## 🚀 Stack Tecnológico

### Frontend
- **Next.js 14+** (App Router)
- **React 18+**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animaciones)
- **React Query** (gestión de estado servidor)
- **Zustand** (gestión de estado cliente)

### Backend
- **NestJS 10+**
- **TypeScript**
- **TypeORM** (ORM)
- **PostgreSQL 15+**
- **Passport.js + JWT** (autenticación)
- **Class Validator** (validación)
- **Swagger** (documentación API)

### Base de Datos
- **PostgreSQL 15+**
- **Redis** (caching, opcional)

## 📁 Estructura del Proyecto

```
nuevo-proyecto/
├── frontend/          # Aplicación Next.js
├── backend/           # Aplicación NestJS
├── database/          # Migraciones y seeds
├── infra/             # Scripts de infraestructura
└── docs/              # Documentación
```

## 🛠️ Configuración Inicial

### 1. Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Docker y Docker Compose (para desarrollo local)
- PostgreSQL 15+ (o usar Docker)

### 2. Instalación

```bash
# Clonar el repositorio
cd nuevo-proyecto

# Copiar variables de entorno
cp .env.example .env

# Iniciar base de datos (Docker)
docker-compose up -d postgres

# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

### 3. Configurar Base de Datos

```bash
# Ejecutar migraciones
cd backend
npm run migration:run

# Ejecutar seeds (datos iniciales)
npm run seed:run
```

### 4. Iniciar Desarrollo

```bash
# Terminal 1: Backend
cd backend
npm run start:dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

**URLs de desarrollo:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Docs (Swagger): http://localhost:3001/api/docs
- pgAdmin: http://localhost:5050

## 👥 Roles de Usuario

1. **👑 Master**: Control total del sistema
2. **🏫 Centro**: Gestión de centro educativo
3. **👨‍🏫 Docente**: Gestión de estudiantes y asignaciones
4. **👨‍👩‍👧‍👦 Padre**: Seguimiento de hijos
5. **👨‍🎓 Estudiante**: Dashboard gamificado y ejercicios

## 🎯 Funcionalidades Principales

### Sistema de Gamificación
- ✅ Puntos diarios (meta: 500 puntos)
- ✅ 5 niveles progresivos
- ✅ 7 tipos de medallas
- ✅ 10 avatares desbloqueables
- ✅ Sistema de rachas

### Tipos de Ejercicios
1. Multiple Choice
2. Drag & Drop
3. Matching
4. Fill Blanks
5. Sequence
6. Multi Select
7. True/False

### Dashboards Especializados
- Dashboard Estudiante (gamificado)
- Dashboard Docente (gestión de clase)
- Dashboard Padre (seguimiento)
- Dashboard Centro (administración local)
- Dashboard Master (control total)

## 🧪 Testing

```bash
# Backend - Tests unitarios
cd backend
npm run test

# Backend - Tests E2E
npm run test:e2e

# Frontend - Tests unitarios
cd frontend
npm run test

# Frontend - Tests E2E (Playwright)
npm run test:e2e
```

## 📦 Despliegue en Plesk

### 1. Preparar Build de Producción

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
```

### 2. Configurar en Plesk

**Frontend (Next.js):**
- Tipo: Aplicación Node.js
- Comando de inicio: `npm run start`
- Puerto: 3000
- Variables de entorno: Configurar desde panel Plesk

**Backend (NestJS):**
- Tipo: Aplicación Node.js
- Comando de inicio: `npm run start:prod`
- Puerto: 3001
- Variables de entorno: Configurar desde panel Plesk

**PostgreSQL:**
- Crear base de datos desde panel Plesk
- Importar dump de datos
- Configurar credenciales en variables de entorno

Ver documentación completa en: [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

## 📚 Documentación

- [Arquitectura del Sistema](./docs/ARCHITECTURE.md)
- [Tipos de Ejercicios](./docs/EXERCISE_TYPES.md) ⭐ **Nuevo**
- [Sistema de Gamificación](./docs/GAMIFICATION.md) ⭐ **Nuevo**
- [Guía de Despliegue](./docs/DEPLOYMENT.md)
- [Manual de Usuario](./docs/USER_MANUAL.md)
- [Optimización BD](./docs/DATABASE_OPTIMIZATION.md)
- [Changelog](./docs/CHANGELOG.md) ⭐ **Nuevo**
- [Documentación de API](http://localhost:3001/api/docs)

## 🤝 Contribución

Este es un proyecto privado. Para contribuir:

1. Crear una rama desde `main`
2. Hacer cambios y commits
3. Crear Pull Request
4. Esperar revisión y aprobación

## 📄 Licencia

Propietario: Pronexus  
Todos los derechos reservados © 2025

## 📞 Soporte

Para soporte técnico, contactar a:
- Email: dev@pronexus.es
-

---

**Versión**: 2.0.0  
**Última actualización**: Diciembre 2025
