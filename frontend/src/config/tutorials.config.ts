import { TutorialStep } from "@/contexts/TutorialContext";

export const TUTORIAL_CONFIG: Record<string, TutorialStep[]> = {
    // --- ESTUDIANTE (Role 5) ---
    "/dashboard_5": [
        { targetId: "nav-home", title: "¡Bienvenido, Campeón!", content: "Este es tu panel de control. Aquí puedes ver tus estrellas y las tareas más importantes.", position: "right" },
        { targetId: "daily-task", title: "Reto del Día", content: "No olvides completar tu misión diaria para ganar premios especiales.", position: "top" },
        { targetId: "user-profile", title: "Tu Perfil", content: "Haz clic aquí para cambiar tu avatar y ver tus medallas.", position: "top" }
    ],
    "/dashboard/worlds_5": [
        { targetId: "world-map", title: "Mapa del Tesoro", content: "Explora los diferentes planetas y mundos. Cada uno tiene lecciones increíbles.", position: "bottom" },
        { targetId: "level-node", title: "Tus misiones", content: "Haz clic en los puntos del mapa para entrar en las lecciones.", position: "top" }
    ],
    "/dashboard/exercises_5": [
        { targetId: "exercises-grid", title: "Zona de Entrenamiento", content: "Aquí puedes practicar lo que has aprendido. ¡Gana estrellas resolviendo retos!", position: "bottom" }
    ],
    "/dashboard/exercises/id_5": [
        { targetId: "exercise-progress", title: "Tu Avance", content: "Esta barra se llena a medida que avanzas en el reto. ¡Llega hasta el final!", position: "bottom" },
        { targetId: "check-btn", title: "¡Lanzamiento!", content: "Cuando tengas lista tu respuesta, pulsa el cohete para comprobarla.", position: "top" }
    ],

    // --- MASTER ADMIN (Role 1) ---
    "/dashboard/admin_1": [
        { targetId: "nav-home", title: "Consola Master", content: "Desde aquí supervisas el estado global de la plataforma, licencias y actividad total.", position: "right" },
        { targetId: "nav-exercises", title: "Editor de Contenido", content: "Aquí gestionas la biblioteca completa de retos educativos.", position: "right" },
        { targetId: "nav-centers", title: "Control de Centros", content: "Administra los colegios y activa nuevas licencias.", position: "right" }
    ],
    "/dashboard/admin/exercises_1": [
        { targetId: "exercises-title", title: "Gestor de Contenido", content: "Aquí puedes ver, editar y crear nuevos ejercicios. Úsalo para auditar la calidad pedagógica.", position: "bottom" },
        { targetId: "search-input", title: "Filtro rápido", content: "Busca ejercicios por título o por su identificador técnico (ej: drag_drop).", position: "bottom" }
    ],

    // --- ADMIN CENTRO (Role 2) ---
    "/dashboard/admin_2": [
        { targetId: "nav-home", title: "Panel de tu Centro", content: "Revisa las estadísticas de tus alumnos y el rendimiento de tus profesores.", position: "right" },
        { targetId: "nav-users", title: "Gestión Escolar", content: "Crea cuentas para tus alumnos y personal docente.", position: "right" }
    ],
    "/dashboard/admin/centers_2": [
        { targetId: "centers-title", title: "Tu Institución", content: "Aquí puedes actualizar los datos de contacto y dirección de tu centro.", position: "bottom" }
    ],

    // --- PADRE (Role 4) ---
    "/dashboard/parent_4": [
        { targetId: "nav-home", title: "Seguimiento Familiar", content: "Hola. Aquí puedes supervisar el aprendizaje de tus hijos de forma sencilla.", position: "right" },
        { targetId: "child-cards", title: "Tus Hijos", content: "Selecciona a uno de tus hijos para ver su informe detallado de rendimiento.", position: "top" },
        { targetId: "link-button", title: "Añadir más hijos", content: "Usa el código que te entregó el profesor para conectar a otro estudiante.", position: "bottom" }
    ],

    // --- COMÚN / DEFAULT ---
    "/dashboard/admin/users": [
        { targetId: "users-title", title: "Gestión de Usuarios", content: "Crea y edita perfiles. Recuerda que cada rol tiene permisos diferentes.", position: "bottom" },
        { targetId: "new-user-btn", title: "Nuevo Registro", content: "Completa el formulario para dar de alta a un nuevo miembro.", position: "left" }
    ],
    "default": [
        { targetId: "nav-home", title: "Menu Lateral", content: "Muévete por las diferentes secciones de la plataforma desde aquí.", position: "right" },
        { targetId: "help-btn", title: "¿Necesitas Ayuda?", content: "Puedes pulsar este botón en cualquier pantalla para obtener una guía rápida.", position: "top" },
        { targetId: "logout-btn", title: "Salir", content: "Cierra tu sesión de forma segura aquí.", position: "top" }
    ]
};
