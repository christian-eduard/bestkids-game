import { DataSource } from 'typeorm';
import { Exercise, ExerciseType, DifficultyLevel } from '../../modules/exercises/entities/exercise.entity';

export class ExercisesSeeder {
    public async run(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(Exercise);

        // Check if already seeded - REMOVED to allow updates
        // const count = await repository.count();
        // if (count > 0) {
        //     console.log('Exercises already seeded. Skipping...');
        //     return;
        // }

        const exercises: Partial<Exercise>[] = [
            // ==========================================
            // MATEMÁTICAS  - subject_area_id: 1
            // ==========================================
            {
                subjectAreaId: 1,
                title: 'Suma Básica 1-10',
                description: 'Aprende a sumar números del 1 al 10',
                exerciseType: ExerciseType.MULTIPLE_CHOICE,
                difficultyLevel: DifficultyLevel.EASY,
                content: {
                    question: '¿Cuánto es 5 + 3?',
                    options: ['6', '7', '8', '9'],
                    correctAnswer: 2, // index 2 = '8'
                    explanation: 'Si tienes 5 manzanas y te dan 3 más, tendrás 8 manzanas en total.',
                },
                points: 10,
                estimatedTimeMinutes: 2,
                hints: ['Puedes contar con tus dedos', 'Suma de 5 en 5: 5 + 3 = 8'],
                tags: ['suma', 'números', 'básico'],
                createdBy: 1,
                isActive: true,
            },
            {
                subjectAreaId: 1,
                title: 'Suma de Dos Cifras',
                description: 'Aprende a sumar números de dos cifras',
                exerciseType: ExerciseType.MULTIPLE_CHOICE,
                difficultyLevel: DifficultyLevel.MEDIUM,
                content: {
                    question: '¿Cuánto es 15 + 27?',
                    options: ['40', '42', '45', '50'],
                    correctAnswer: 1, // '42'
                    explanation: 'Para sumar 15 + 27: 10 + 20 = 30, luego 5 + 7 = 12, total = 42',
                },
                points: 15,
                estimatedTimeMinutes: 3,
                hints: ['Suma primero las decenas, luego las unidades', '15 + 20 = 35, luego + 7'],
                tags: ['suma', 'dos cifras', 'intermedio'],
                createdBy: 1,
                isActive: true,
            },
            {
                subjectAreaId: 1,
                title: 'Resta Simple',
                description: 'Aprende a restar números del 1 al 20',
                exerciseType: ExerciseType.MULTIPLE_CHOICE,
                difficultyLevel: DifficultyLevel.EASY,
                content: {
                    question: '¿Cuánto es 20 - 8?',
                    options: ['10', '11', '12', '13'],
                    correctAnswer: 2, // '12'
                    explanation: 'Si tienes 20 caramelos y comes 8, te quedan 12 caramelos.',
                },
                points: 10,
                estimatedTimeMinutes: 2,
                hints: ['Cuenta hacia atrás desde 20', 'Piensa en 20 - 10 = 10, pero restas solo 8'],
                tags: ['resta', 'números', 'básico'],
                createdBy: 1,
                isActive: true,
            },
            {
                subjectAreaId: 1,
                title: 'Ordenar Números',
                description: 'Ordena los números de menor a mayor',
                exerciseType: ExerciseType.SEQUENCE,
                difficultyLevel: DifficultyLevel.EASY,
                content: {
                    question: '¿Puedes ordenar estos números de menor a mayor?',
                    items: [
                        { id: 'item1', value: 5, text: '5' },
                        { id: 'item2', value: 2, text: '2' },
                        { id: 'item3', value: 8, text: '8' },
                        { id: 'item4', value: 1, text: '1' },
                        { id: 'item5', value: 3, text: '3' },
                    ],
                    correctOrder: ['item4', 'item2', 'item5', 'item1', 'item3'], // 1, 2, 3, 5, 8
                    orderType: 'ascending',
                },
                points: 20,
                estimatedTimeMinutes: 4,
                hints: ['Busca el número más pequeño primero', 'Ordena: 1, 2, 3, 5, 8'],
                tags: ['ordenar', 'números', 'secuencia'],
                createdBy: 1,
                isActive: true,
            },
            {
                subjectAreaId: 1,
                title: 'Formas Geométricas',
                description: 'Identifica círculos, triángulos y cuadrados',
                exerciseType: ExerciseType.MULTIPLE_CHOICE,
                difficultyLevel: DifficultyLevel.EASY,
                content: {
                    question: '¿Cuántos lados tiene un triángulo?',
                    options: ['2', '3', '4', '5'],
                    correctAnswer: 1, // '3'
                    explanation: 'Un triángulo tiene 3 lados, 3 vértices y la suma de sus ángulos es 180°.',
                },
                points: 10,
                estimatedTimeMinutes: 2,
                hints: ['Piensa en la forma de "tri" = tres', 'Cuenta los lados de un triángulo dibujado'],
                tags: ['geometría', 'formas', 'básico'],
                createdBy: 1,
                isActive: true,
            },
            {
                subjectAreaId: 1,
                title: 'Multiplicación Básica',
                description: 'Aprende las tablas del 2 y el 3',
                exerciseType: ExerciseType.MULTIPLE_CHOICE,
                difficultyLevel: DifficultyLevel.MEDIUM,
                content: {
                    question: '¿Cuánto es 3 × 4?',
                    options: ['10', '11', '12', '13'],
                    correctAnswer: 2, // '12'
                    explanation: '3 × 4 significa 3 + 3 + 3 + 3 = 12. O 4 grupos de 3.',
                },
                points: 15,
                estimatedTimeMinutes: 3,
                hints: ['Suma 3 cuatro veces', '3 + 3 = 6, + 3 = 9, + 3 = 12'],
                tags: ['multiplicación', 'tablas', 'intermedio'],
                createdBy: 1,
                isActive: true,
            },
            {
                subjectAreaId: 1,
                title: 'División Simple',
                description: 'Aprende a dividir números pequeños',
                exerciseType: ExerciseType.MULTIPLE_CHOICE,
                difficultyLevel: DifficultyLevel.HARD,
                content: {
                    question: '¿Cuánto es 12 ÷ 3?',
                    options: ['2', '3', '4', '5'],
                    correctAnswer: 2, // '4'
                    explanation: 'Si repartes 12 caramelos entre 3 amigos, cada uno recibe 4.',
                },
                points: 20,
                estimatedTimeMinutes: 4,
                hints: ['¿Cuántas veces cabe el 3 en el 12?', '3 + 3 + 3 + 3 = 12, entonces 12 ÷ 3 = 4'],
                tags: ['división', 'repartir', 'avanzado'],
                createdBy: 1,
                isActive: true,
            },
            {
                subjectAreaId: 1,
                title: 'Comparar Números',
                description: 'Aprende a comparar cuál número es mayor',
                exerciseType: ExerciseType.MULTIPLE_CHOICE,
                difficultyLevel: DifficultyLevel.EASY,
                content: {
                    question: '¿Cuál número es MAYOR: 15 o 18?',
                    options: ['15', '18', 'Son iguales', 'No se puede saber'],
                    correctAnswer: 1, // '18'
                    explanation: '18 es mayor que 15. 18 - 15 = 3, hay una diferencia de 3.',
                },
                points: 10,
                estimatedTimeMinutes: 2,
                hints: ['El número más grande es mayor', 'Cuenta de 15 hacia arriba hasta 18'],
                tags: ['comparar', 'mayor/menor', 'básico'],
                createdBy: 1,
                isActive: true,
            },

            // ==========================================
            // LENGUA Y LITERATURA - subject_area_id: 2
            // ==========================================
            {
                subjectAreaId: 2,
                title: 'Identificar Vocales',
                description: 'Encuentra las vocales en diferentes palabras',
                exerciseType: ExerciseType.MULTIPLE_CHOICE,
                difficultyLevel: DifficultyLevel.EASY,
                content: {
                    question: '¿Cuántas vocales tiene la palabra "ESCUELA"?',
                    options: ['2', '3', '4', '5'],
                    correctAnswer: 2, // '4'
                    explanation: 'La palabra ESCUELA tiene 4 vocales: E, U, E, A',
                },
                points: 10,
                estimatedTimeMinutes: 2,
                hints: ['Las vocales son A, E, I, O, U', 'Cuenta: E-S-C-U-E-L-A'],
                tags: ['vocales', 'letras', 'básico'],
                createdBy: 1,
                isActive: true,
            },
            {
                subjectAreaId: 2,
                title: 'Completar Oración',
                description: 'Completa la oración con la palabra correcta',
                exerciseType: ExerciseType.FILL_BLANKS,
                difficultyLevel: DifficultyLevel.MEDIUM,
                content: {
                    question: '¿Qué palabra falta?',
                    text: 'El {blank0} es un animal que tiene cuatro patas.',
                    blanks: [
                        {
                            id: 'blank0',
                            correctAnswers: ['gato', 'perro', 'caballo'],
                            caseSensitive: false,
                            hint: 'Animal doméstico',
                        },
                    ],
                },
                points: 15,
                estimatedTimeMinutes: 3,
                hints: ['Piensa en un animal doméstico', 'Puede ser mascota'],
                tags: ['completar', 'animales', 'oraciones'],
                createdBy: 1,
                isActive: true,
            },
            {
                subjectAreaId: 2,
                title: 'Formar Frase Correcta',
                description: 'Arrastra las palabras para formar una frase',
                exerciseType: ExerciseType.DRAG_DROP,
                difficultyLevel: DifficultyLevel.MEDIUM,
                content: {
                    question: '¿Cómo se forma la oración correcta?',
                    words: [
                        { id: 'w1', text: 'El', order: 1 },
                        { id: 'w2', text: 'gato', order: 2 },
                        { id: 'w3', text: 'come', order: 3 },
                        { id: 'w4', text: 'pescado', order: 4 },
                    ],
                    correctSequence: ['w1', 'w2', 'w3', 'w4'],
                },
                points: 20,
                estimatedTimeMinutes: 4,
                hints: ['Empieza con el artículo "El"', 'Orden: Artículo - Sujeto - Verbo - Objeto'],
                tags: ['sintaxis', 'oraciones', 'ordenar'],
                createdBy: 1,
                isActive: true,
            },
            {
                subjectAreaId: 2,
                title: 'Sinónimos',
                description: 'Encuentra palabras con significado similar',
                exerciseType: ExerciseType.MATCHING,
                difficultyLevel: DifficultyLevel.HARD,
                content: {
                    question: 'Une cada palabra con su sinónimo',
                    leftColumn: [
                        { id: 'l1', text: 'Grande' },
                        { id: 'l2', text: 'Feliz' },
                        { id: 'l3', text: 'Rápido' },
                        { id: 'l4', text: 'Bonito' },
                    ],
                    rightColumn: [
                        { id: 'r1', text: 'Hermoso' },
                        { id: 'r2', text: 'Veloz' },
                        { id: 'r3', text: 'Enorme' },
                        { id: 'r4', text: 'Alegre' },
                    ],
                    correctPairs: [
                        { left: 'l1', right: 'r3' }, // Grande - Enorme
                        { left: 'l2', right: 'r4' }, // Feliz - Alegre
                        { left: 'l3', right: 'r2' }, // Rápido - Veloz
                        { left: 'l4', right: 'r1' }, // Bonito - Hermoso
                    ],
                },
                points: 25,
                estimatedTimeMinutes: 5,
                hints: ['Los sinónimos son palabras con significado parecido', 'Grande = Enorme'],
                tags: ['sinónimos', 'vocabulario', 'avanzado'],
                createdBy: 1,
                isActive: true,
            },
            {
                subjectAreaId: 2,
                title: 'Plurales',
                description: 'Aprende a formar el plural de las palabras',
                exerciseType: ExerciseType.MULTIPLE_CHOICE,
                difficultyLevel: DifficultyLevel.MEDIUM,
                content: {
                    question: '¿Cuál es el plural de "libro"?',
                    options: ['libres', 'libros', 'libroes', 'libraros'],
                    correctAnswer: 1, // 'libros'
                    explanation: 'Para formar el plural de "libro" añadimos -s: libros',
                },
                points: 15,
                estimatedTimeMinutes: 2,
                hints: ['Añade una letra al final', 'Piensa en "muchos libro..."'],
                tags: ['plurales', 'gramática', 'básico'],
                createdBy: 1,
                isActive: true,
            },
            {
                subjectAreaId: 2,
                title: 'Artículos El/La',
                description: 'Aprende a usar correctamente los artículos',
                exerciseType: ExerciseType.MULTI_SELECT,
                difficultyLevel: DifficultyLevel.EASY,
                content: {
                    question: '¿Cuáles palabras usan el artículo "LA"? (Selecciona todas)',
                    options: [
                        { id: 'opt1', text: 'Casa', correct: true },
                        { id: 'opt2', text: 'Perro', correct: false },
                        { id: 'opt3', text: 'Mesa', correct: true },
                        { id: 'opt4', text: 'Gato', correct: false },
                        { id: 'opt5', text: 'Ventana', correct: true },
                    ],
                },
                points: 20,
                estimatedTimeMinutes: 3,
                hints: ['LA es fem inino', 'LA casa, LA mesa, LA ventana'],
                tags: ['artículos', 'género', 'gramática'],
                createdBy: 1,
                isActive: true,
            },
            {
                subjectAreaId: 2,
                title: 'Comprensión Lectora Simple',
                description: 'Lee y responde preguntas sobre el texto',
                exerciseType: ExerciseType.MULTIPLE_CHOICE,
                difficultyLevel: DifficultyLevel.MEDIUM,
                content: {
                    passage: 'Mar the tiene un gato llamado Michi. Michi es naranja y le gusta dormir todo el día. Su comida favorita es el pescado.',
                    question: '¿De qué color es Michi?',
                    options: ['Blanco', 'Naranja', 'Negro', 'Gris'],
                    correctAnswer: 1, // 'Naranja'
                    explanation: 'En el texto dice: "Michi es naranja"',
                },
                points: 15,
                estimatedTimeMinutes: 3,
                hints: ['Lee con atención el texto', 'Busca la palabra "color" o "es"'],
                tags: ['comprensión', 'lectura', 'intermedio'],
                createdBy: 1,
                isActive: true,
            },

            // ==========================================
            // CIENCIAS NATURALES - subject_area_id: 3
            // ==========================================
            {
                subjectAreaId: 3,
                title: 'Partes de una Planta',
                description: 'Aprende las partes principales de las plantas',
                exerciseType: ExerciseType.MATCHING,
                difficultyLevel: DifficultyLevel.EASY,
                content: {
                    question: 'Une cada parte con su función',
                    leftColumn: [
                        { id: 'l1', text: 'Raíz' },
                        { id: 'l2', text: 'Tallo' },
                        { id: 'l3', text: 'Hojas' },
                        { id: 'l4', text: 'Flor' },
                    ],
                    rightColumn: [
                        { id: 'r1', text: 'Hacen la fotosíntesis' },
                        { id: 'r2', text: 'Reproduce la planta' },
                        { id: 'r3', text: 'Absorbe agua' },
                        { id: 'r4', text: 'Sostiene la planta' },
                    ],
                    correctPairs: [
                        { left: 'l1', right: 'r3' }, // Raíz - Absorbe agua
                        { left: 'l2', right: 'r4' }, // Tallo - Sostiene
                        { left: 'l3', right: 'r1' }, // Hojas - Fotosíntesis
                        { left: 'l4', right: 'r2' }, // Flor - Reproducción
                    ],
                },
                points: 20,
                estimatedTimeMinutes: 4,
                hints: ['La raíz está en la tierra', 'Las hojas son verdes y captan la luz'],
                tags: ['plantas', 'naturaleza', 'biología'],
                createdBy: 1,
                isActive: true,
            },
            {
                subjectAreaId: 3,
                title: 'Estados del Agua',
                description: 'Aprende los tres estados del agua',
                exerciseType: ExerciseType.MULTIPLE_CHOICE,
                difficultyLevel: DifficultyLevel.MEDIUM,
                content: {
                    question: '¿A qué temperatura se congela el agua?',
                    options: ['0°C', '10°C', '25°C', '100°C'],
                    correctAnswer: 0, // '0°C'
                    explanation: 'El agua se congela a 0 grados Celsius y se convierte en hielo.',
                },
                points: 15,
                estimatedTimeMinutes: 3,
                hints: ['Piensa en el freezer', 'Es la temperatura más baja de las opciones'],
                tags: ['agua', 'física', 'estados'],
                createdBy: 1,
                isActive: true,
            },
            {
                subjectAreaId: 3,
                title: 'Cadena Alimentaria',
                description: 'Ordena la cadena alimentaria correctamente',
                exerciseType: ExerciseType.SEQUENCE,
                difficultyLevel: DifficultyLevel.HARD,
                content: {
                    question: 'Ordena la cadena alimentaria desde el productor hasta el depredador',
                    items: [
                        { id: 'item1', value: 1, text: 'Planta' },
                        { id: 'item2', value: 2, text: 'Saltamontes' },
                        { id: 'item3', value: 3, text: 'Pájaro' },
                        { id: 'item4', value: 4, text: 'Gato' },
                    ],
                    correctOrder: ['item1', 'item2', 'item3', 'item4'],
                    orderType: 'custom',
                },
                points: 25,
                estimatedTimeMinutes: 5,
                hints: ['Empieza con el productor (planta)', 'Orden: Planta → Herbívoro → Carnívoro pequeño → Carnívoro grande'],
                tags: ['ecosistema', 'cadena alimentaria', 'avanzado'],
                createdBy: 1,
                isActive: true,
            },
            {
                subjectAreaId: 3,
                title: 'Animales Vertebrados',
                description: 'Identifica cuáles animales son vertebrados',
                exerciseType: ExerciseType.MULTI_SELECT,
                difficultyLevel: DifficultyLevel.MEDIUM,
                content: {
                    question: '¿Cuáles de estos animales son VERTEBRADOS? (Selecciona todos)',
                    options: [
                        { id: 'opt1', text: 'Perro', correct: true },
                        { id: 'opt2', text: 'Medusa', correct: false },
                        { id: 'opt3', text: 'Gato', correct: true },
                        { id: 'opt4', text: 'Lombriz', correct: false },
                        { id: 'opt5', text: 'Pájaro', correct: true },
                        { id: 'opt6', text: 'Pez', correct: true },
                    ],
                },
                points: 20,
                estimatedTimeMinutes: 4,
                hints: ['Los vertebrados tienen columna vertebral', 'Mamíferos, aves y peces son vertebrados'],
                tags: ['animales', 'clasificación', 'vertebrados'],
                createdBy: 1,
                isActive: true,
            },
            {
                subjectAreaId: 3,
                title: 'El Sistema Solar',
                description: 'Aprende sobre los planetas',
                exerciseType: ExerciseType.TRUE_FALSE,
                difficultyLevel: DifficultyLevel.EASY,
                content: {
                    statements: [
                        {
                            id: 's1',
                            text: 'El Sol es una estrella',
                            correctAnswer: true,
                            explanation: 'El Sol es una estrella que da luz y calor a la Tierra.',
                        },
                        {
                            id: 's2',
                            text: 'La Tierra es el planeta más grande',
                            correctAnswer: false,
                            explanation: 'Júpiter es el planeta más grande del Sistema Solar.',
                        },
                        {
                            id: 's3',
                            text: 'La Luna gira alrededor de la Tierra',
                            correctAnswer: true,
                            explanation: 'La Luna es el satélite natural de la Tierra.',
                        },
                    ],
                },
                points: 15,
                estimatedTimeMinutes: 3,
                hints: ['El Sol brilla con luz propia', 'Júpiter es gigante comparado con la Tierra'],
                tags: ['espacio', 'planetas', 'astronomía'],
                createdBy: 1,
                isActive: true,
            },

            // ==========================================
            // CIENCIAS SOCIALES - subject_area_id: 4
            // ==========================================
            {
                subjectAreaId: 4,
                title: 'Continentes del Mundo',
                description: 'Aprende los 5 continentes principales',
                exerciseType: ExerciseType.MULTIPLE_CHOICE,
                difficultyLevel: DifficultyLevel.MEDIUM,
                content: {
                    question: '¿Cuántos continentes hay en el mundo?',
                    options: ['4', '5', '6', '7'],
                    correctAnswer: 3, // '7'
                    explanation: 'Los 7 continentes son: África, América, Asia, Europa, Oceanía, Antártida.',
                },
                points: 15,
                estimatedTimeMinutes: 3,
                hints: ['Hay más de 5', 'Incluye la Antártida'],
                tags: ['geografía', 'continentes', 'mundo'],
                createdBy: 1,
                isActive: true,
            },
            {
                subjectAreaId: 4,
                title: 'Capitales de España',
                description: 'Relaciona comunidades con sus capitales',
                exerciseType: ExerciseType.MATCHING,
                difficultyLevel: DifficultyLevel.HARD,
                content: {
                    question: 'Une cada comunidad autónoma con su capital',
                    leftColumn: [
                        { id: 'l1', text: 'Andalucía' },
                        { id: 'l2', text: 'Cataluña' },
                        { id: 'l3', text: 'Madrid' },
                        { id: 'l4', text: 'Galicia' },
                    ],
                    rightColumn: [
                        { id: 'r1', text: 'Santiago de Compostela' },
                        { id: 'r2', text: 'Sevilla' },
                        { id: 'r3', text: 'Barcelona' },
                        { id: 'r4', text: 'Madrid' },
                    ],
                    correctPairs: [
                        { left: 'l1', right: 'r2' }, // Andalucía - Sevilla
                        { left: 'l2', right: 'r3' }, // Cataluña - Barcelona
                        { left: 'l3', right: 'r4' }, // Madrid - Madrid
                        { left: 'l4', right: 'r1' }, // Galicia - Santiago
                    ],
                },
                points: 25,
                estimatedTimeMinutes: 5,
                hints: ['Cataluña está en el noreste', 'Madrid es capital de España y de su comunidad'],
                tags: ['geografía', 'España', 'capitales'],
                createdBy: 1,
                isActive: true,
            },
            {
                subjectAreaId: 4,
                title: 'Épocas Históricas',
                description: 'Ordena las épocas de la historia',
                exerciseType: ExerciseType.SEQUENCE,
                difficultyLevel: DifficultyLevel.HARD,
                content: {
                    question: 'Ordena las épocas históricas de más antigua a más reciente',
                    items: [
                        { id: 'item1', value: 1, text: 'Prehistoria' },
                        { id: 'item2', value: 2, text: 'Edad Antigua' },
                        { id: 'item3', value: 3, text: 'Edad Media' },
                        { id: 'item4', value: 4, text: 'Edad Moderna' },
                        { id: 'item5', value: 5, text: 'Edad Contemporánea' },
                    ],
                    correctOrder: ['item1', 'item2', 'item3', 'item4', 'item5'],
                    orderType: 'chronological',
                },
                points: 30,
                estimatedTimeMinutes: 5,
                hints: ['Empieza con la Prehistoria', 'Terminacon la Contemporánea (hoy)'],
                tags: ['historia', 'épocas', 'cronología'],
                createdBy: 1,
                isActive: true,
            },
            {
                subjectAreaId: 4,
                title: 'Símbolos Patrios',
                description: 'Conoce los símbolos de España',
                exerciseType: ExerciseType.TRUE_FALSE,
                difficultyLevel: DifficultyLevel.EASY,
                content: {
                    statements: [
                        {
                            id: 's1',
                            text: 'La bandera de España tiene los colores rojo y amarillo',
                            correctAnswer: true,
                            explanation: 'La bandera española tiene franjas rojas y amarillas.',
                        },
                        {
                            id: 's2',
                            text: 'El himno de España tiene letra oficial',
                            correctAnswer: false,
                            explanation: 'El himno nacional de España no tiene letra oficial.',
                        },
                    ],
                },
                points: 10,
                estimatedTimeMinutes: 2,
                hints: ['Los colores de la selección española', 'El himno es solo música'],
                tags: ['cultura', 'símbolos', 'España'],
                createdBy: 1,
                isActive: true,
            },
            // ==========================================
            // PRUEBAS DE ROBUSTEZ (Para validar DragDropExercise.tsx)
            // ==========================================
            {
                subjectAreaId: 1,
                title: 'ROBUST: Ordenar Números (Variante items)',
                description: 'Prueba de motor con esquema variante',
                exerciseType: ExerciseType.DRAG_DROP,
                difficultyLevel: DifficultyLevel.EASY,
                content: {
                    question: 'Ordena estos números de menor a mayor',
                    items: [
                        { id: 'v1', value: 10, text: 'Diez' },
                        { id: 'v2', value: 20, text: 'Veinte' },
                        { id: 'v3', value: 30, text: 'Treinta' },
                    ],
                    correctOrder: ['v1', 'v2', 'v3'],
                },
                points: 50,
                estimatedTimeMinutes: 1,
                hints: ['V1 es el más pequeño'],
                tags: ['robusto', 'test'],
                createdBy: 1,
                isActive: true,
            },
            {
                subjectAreaId: 2,
                title: 'ROBUST: Frase Mezclada (Variante Words con Strings)',
                description: 'Prueba de motor con palabras como strings planos',
                exerciseType: ExerciseType.DRAG_DROP,
                difficultyLevel: DifficultyLevel.MEDIUM,
                content: {
                    question: 'Forma la frase: El sol brilla',
                    words: [
                        { id: 's1', text: 'El' },
                        { id: 's2', text: 'sol' },
                        { id: 's3', text: 'brilla' },
                    ],
                    correctSequence: ['s1', 's2', 's3'],
                },
                points: 50,
                estimatedTimeMinutes: 1,
                hints: ['El empieza con mayúscula'],
                tags: ['robusto', 'test'],
                createdBy: 1,
                isActive: true,
            },
        ];

        // Save or Update exercises
        console.log('  Upserting exercises...');
        for (const exData of exercises) {
            const existing = await repository.findOne({ where: { title: exData.title } });
            if (existing) {
                // Update existing
                await repository.save({ ...existing, ...exData });
            } else {
                // Create new
                await repository.save(repository.create(exData));
            }
        }

        const allExercises = await repository.find();
        console.log(`✅ Seeded/Updated ${allExercises.length} exercises.`);
        console.log(` - Matemáticas: ${allExercises.filter(e => e.subjectAreaId === 1).length}`);
        console.log(` - Lengua: ${allExercises.filter(e => e.subjectAreaId === 2).length}`);
        console.log(` - Ciencias Naturales: ${allExercises.filter(e => e.subjectAreaId === 3).length}`);
        console.log(` - Ciencias Sociales: ${allExercises.filter(e => e.subjectAreaId === 4).length}`);

    }
}
