# BESTKIDS — CONTEXTO DEL PROYECTO

## Qué es
Plataforma educativa SaaS gamificada basada en modelo RtI (Response to Intervention).
Identifica alumnos en riesgo académico y adapta el contenido pedagógico.

## Stack
- Frontend: Next.js 16, App Router, Tailwind CSS, Framer Motion, Radix UI
- Backend: NestJS 11, TypeORM, PostgreSQL 15
- Docker Compose para orquestación local

## Roles
1. Estudiante - accede a mundos y ejercicios
2. Familia - monitoreo de progreso
3. Profesor - gestión de aulas y reportes
4. Administrador - gestión del centro
5. Master - control global

## Modelo pedagógico
- Los contenidos se organizan en UNIDADES (no ejercicios sueltos)
- Cada UNIDAD pertenece a un MUNDO (Matemáticas o Lenguaje)
- Los ejercicios dentro de una unidad tienen nivel de dificultad 1-3 (Tier RtI)
- Sistema adaptativo: 3 errores seguidos = baja dificultad, 3 aciertos = sube

## Tipos de ejercicio que debe soportar el motor
1. Opción múltiple (texto)
2. Señalar (imagen/audio/vídeo como enunciado, imágenes como opciones)
3. Escritura libre (el alumno escribe la respuesta)
4. Completar huecos

## Estado actual del proyecto
- Auth, dashboards y tienda: COMPLETOS
- Motor de ejercicios: NO EXISTE, hay que construirlo desde cero
- Columna `coins` en GamificationProfile: FALTA (bug pendiente)
- getUserTotalPoints en worlds.service.ts: retorna 0 hardcoded (bug crítico)

## Reglas de desarrollo
- NUNCA crear archivos fuera de los módulos existentes sin preguntar
- SIEMPRE usar TypeORM con migraciones, nunca syncronize:true en producción
- Los nuevos endpoints SIEMPRE deben documentarse en Swagger
- El frontend SIEMPRE valida roles antes de renderizar componentes
