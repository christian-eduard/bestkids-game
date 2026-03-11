"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Book, ChevronDown, ChevronUp, Users, GraduationCap, School, Settings, Gamepad2, FileText, Layers } from "lucide-react";
import { useState } from "react";

const DOCS_BY_ROLE: Record<number, { title: string; sections: { title: string; icon: any; content: string }[] }> = {
    1: { // Master
        title: "Guía del Administrador Master",
        sections: [
            {
                title: "Panel de Control",
                icon: Settings,
                content: `El Dashboard Master te muestra:
• **Usuarios Totales**: Cantidad de usuarios registrados en la plataforma.
• **Centros Activos**: Número de centros educativos conectados.
• **Estudiantes en Riesgo**: Alumnos que requieren intervención (RtI Tier 3).
• **Retención Semanal**: Porcentaje de usuarios activos esta semana.

Desde aquí puedes monitorear la salud general del sistema.`
            },
            {
                title: "Gestión de Centros",
                icon: School,
                content: `Administra los centros educativos:
1. **Ver Centros**: Lista de todos los centros registrados.
2. **Crear Centro**: Añade nuevos centros con nombre, dirección y contacto.
3. **Asignar Administrador**: Designa un usuario como Admin de Centro (roleId 2).
4. **Ver Estadísticas**: Accede a métricas de cada centro.`
            },
            {
                title: "Gestión de Usuarios",
                icon: Users,
                content: `Administra todos los usuarios del sistema:
• **Filtros**: Por rol, centro o estado.
• **Crear Usuario**: Formulario con todos los campos necesarios.
• **Editar/Eliminar**: Modifica datos o desactiva cuentas.
• **Resetear Contraseña**: Envía email de recuperación.`
            },
            {
                title: "Curriculum y Ejercicios",
                icon: Layers,
                content: `Gestiona el contenido educativo:

**Cursos y Unidades**
1. Ve a "Curriculum" en el menú lateral.
2. Crea un Curso (ej. "Matemáticas 3º").
3. Añade Unidades dentro del curso.

**Constructor Visual de Ejercicios**
1. Selecciona una Unidad.
2. Click en "AÑADIR EJERCICIO".
3. Elige el tipo (7 disponibles):
   - Opción Múltiple
   - Verdadero/Falso
   - Unir Líneas
   - Arrastrar y Soltar
   - Ordenar Secuencia
   - Completar Huecos
   - Selección Múltiple
4. Usa el Editor Visual para configurar.
5. Click "CONFIRMAR Y CREAR".`
            },
            {
                title: "Sistema de Gamificación",
                icon: Gamepad2,
                content: `El sistema de gamificación incluye:

**Puntos y Niveles**
- Los estudiantes ganan puntos por completar ejercicios.
- Fórmula: Puntos para subir = Nivel × 1000

**Mundos Temáticos**
- 6 mundos desbloqueables por puntos.
- Cada mundo tiene niveles con ejercicios.

**Avatares**
- Avatares base gratuitos.
- Avatares premium por puntos/nivel.

**Rachas**
- Bonus de 10% por día consecutivo (máx 50%).
- Se reinicia si el estudiante no entra.

**Marcos de Perfil**
- Novato (0 pts) → BestKid Master (50,000 pts)`
            },
            {
                title: "Reportes",
                icon: FileText,
                content: `Genera reportes en PDF/Excel:
1. Ve a "Reportes" en el menú.
2. Selecciona el tipo de reporte.
3. Elige el periodo (semanal, mensual).
4. Click en "Descargar PDF" o "Descargar Excel".

**Tipos de reportes:**
- Reporte de Centro
- Reporte de Clase
- Reporte Individual`
            }
        ]
    },
    2: { // Center
        title: "Guía del Administrador de Centro",
        sections: [
            {
                title: "Mi Centro",
                icon: School,
                content: `Administra tu centro educativo:
• **Dashboard**: Métricas de tu centro.
• **Profesores**: Lista de docentes asignados.
• **Clases**: Grupos de estudiantes.
• **Estadísticas**: Rendimiento global del centro.`
            },
            {
                title: "Gestión de Usuarios",
                icon: Users,
                content: `Gestiona los usuarios de tu centro:
• Solo puedes ver/editar usuarios de tu centro.
• Puedes crear profesores y vincular padres.
• Los estudiantes son creados por profesores.`
            },
            {
                title: "Reportes de Centro",
                icon: FileText,
                content: `Descarga reportes de tu centro:
1. Ve a "Reportes".
2. Selecciona el periodo.
3. Descarga en PDF o Excel.

Incluye: Total estudiantes, progreso por clase, RtI distribution.`
            }
        ]
    },
    3: { // Teacher
        title: "Guía del Profesor",
        sections: [
            {
                title: "Mis Clases",
                icon: GraduationCap,
                content: `Gestiona tus grupos de estudiantes:
1. Ve a "Mis Clases" para ver tus grupos.
2. Haz click en una clase para ver estudiantes.
3. Usa "Reporte" para ver progreso individual.

**Crear una clase:**
1. Click en "Nueva Clase".
2. Ingresa nombre (ej. "4ºA Matemáticas").
3. Comparte el código con tus alumnos.`
            },
            {
                title: "Asignaciones",
                icon: Layers,
                content: `Asigna ejercicios a tus estudiantes:
1. Ve a "Asignaciones".
2. Click en "Nueva Asignación".
3. Selecciona el mundo/nivel o ejercicios específicos.
4. Elige los estudiantes o toda la clase.
5. Configura fecha límite (opcional).
6. Click "Asignar".

Los estudiantes verán las tareas en su dashboard.`
            },
            {
                title: "Reportes de Clase",
                icon: FileText,
                content: `Analiza el progreso de tus estudiantes:
1. Ve a "Reportes".
2. Selecciona una clase.
3. Ve métricas: promedio, distribución RtI, tiempo.
4. Descarga en PDF/Excel.

**Indicadores RtI:**
- 🟢 Tier 1: Progreso adecuado
- 🟡 Tier 2: Requiere apoyo
- 🔴 Tier 3: Intervención urgente`
            }
        ]
    },
    4: { // Parent
        title: "Guía para Familias",
        sections: [
            {
                title: "Vincular a tu Hijo",
                icon: Users,
                content: `Para ver el progreso de tu hijo:
1. Inicia sesión con tu cuenta de Padre.
2. Click en "Vincular Hijo".
3. Ingresa el código de estudiante (ej. BK-8X922).
4. ¡Listo! Verás su tarjeta en el dashboard.

El código lo proporciona el profesor.`
            },
            {
                title: "Ver Progreso",
                icon: GraduationCap,
                content: `Monitorea el aprendizaje de tu hijo:
• **Nivel Actual**: Qué tan avanzado está.
• **Puntos**: Cuánto ha ganado esta semana.
• **Racha**: Días consecutivos de estudio.
• **Gráficas**: Progreso por materia.

Click en "Ver Reporte Completo" para más detalles.`
            },
            {
                title: "Mensajes",
                icon: FileText,
                content: `Comunícate con el profesor:
1. Ve a "Mensajes".
2. Selecciona una conversación o inicia una nueva.
3. Escribe y envía tu mensaje.

Recibirás notificaciones cuando haya respuesta.`
            }
        ]
    }
};

export default function DocsPage() {
    const { user } = useAuth();
    const roleId = user?.roleId || 5;
    const [openSections, setOpenSections] = useState<number[]>([0]);

    // Student shouldn't see this page
    if (roleId === 5) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500">Esta página no está disponible para estudiantes.</p>
            </div>
        );
    }

    const docs = DOCS_BY_ROLE[roleId] || DOCS_BY_ROLE[1];

    const toggleSection = (idx: number) => {
        setOpenSections(prev =>
            prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-8 transition-colors">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl">
                        <Book className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">{docs.title}</h1>
                        <p className="text-slate-500 dark:text-slate-400">Consulta esta guía para dominar todas las funciones</p>
                    </div>
                </div>

                {/* Sections */}
                <div className="space-y-4">
                    {docs.sections.map((section, idx) => {
                        const Icon = section.icon;
                        const isOpen = openSections.includes(idx);
                        return (
                            <div key={idx} className="bg-white/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                                <button
                                    onClick={() => toggleSection(idx)}
                                    className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-blue-500/10 rounded-xl">
                                            <Icon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                                        </div>
                                        <span className="text-lg font-bold text-slate-900 dark:text-white">{section.title}</span>
                                    </div>
                                    {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                                </button>
                                {isOpen && (
                                    <div className="px-5 pb-5 pt-2">
                                        <div className="prose prose-slate dark:prose-invert prose-sm max-w-none">
                                            <pre className="whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-300 bg-transparent p-0 m-0 text-sm leading-relaxed">
                                                {section.content}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
