import { DataSource } from 'typeorm';
import { Exercise, ExerciseType } from '../../modules/exercises/entities/exercise.entity';
import { Unit } from '../../modules/exercises/entities/unit.entity';
import { World } from '../../modules/worlds/entities/world.entity';
import { UserExerciseResult } from '../../modules/exercises/entities/user-exercise-result.entity';

export async function seedExercisesV2(dataSource: DataSource) {
    const exerciseRepository = dataSource.getRepository(Exercise);
    const unitRepository = dataSource.getRepository(Unit);
    const worldRepository = dataSource.getRepository(World);
    const resultRepository = dataSource.getRepository(UserExerciseResult);

    // 1. Crear o buscar un mundo "Aventura Multimedia"
    let world = await worldRepository.findOne({ where: { name: 'Aventura Multimedia' } });
    if (!world) {
        world = worldRepository.create({
            name: 'Aventura Multimedia',
            description: 'Explora todos los tipos de ejercicios mecánicos',
            icon: '🌟',
            orderIndex: 1,
            pointsToUnlock: 0,
            colorTheme: '#A855F7'
        });
        await worldRepository.save(world);
    }

    // 2. Crear una Unidad "La Gran Demo"
    let unit = await unitRepository.findOne({ where: { title: 'La Gran Demo' } });
    if (!unit) {
        unit = unitRepository.create({
            title: 'La Gran Demo',
            description: 'Prueba las 10 mecánicas del motor educativo',
            worldId: world.id,
            orderIndex: 1,
            difficulty: 1,
            isActive: true
        });
        await unitRepository.save(unit);
    } else {
        // Limpiar ejercicios previos de esta unidad para asegurar un estado limpio
        // Primero eliminamos los resultados para evitar romper FK constraints
        await resultRepository.delete({ unitId: unit.id });
        await exerciseRepository.delete({ unitId: unit.id });
        console.log(`🗑️ Limpiados ejercicios y resultados antiguos de la unidad: ${unit.title}`);
    }

    const exercises = [
        // 1. SEÑALAR_IMAGEN
        {
            type: ExerciseType.SEÑALAR_IMAGEN,
            instruction: "¿Cuál de estos es un perro?",
            content: {
                options: [
                    { id: "1", imageUrl: "https://images.dog.ceo/breeds/retriever-golden/n02099601_3004.jpg", text: "Perro", isCorrect: true },
                    { id: "2", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg", text: "Gato", isCorrect: false },
                    { id: "3", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Cow_female_black_white.jpg/1200px-Cow_female_black_white.jpg", text: "Vaca", isCorrect: false }
                ],
                multipleCorrect: false
            }
        },
        // 2. OPCION_MULTIPLE
        {
            type: ExerciseType.OPCION_MULTIPLE,
            instruction: "Selecciona el número dos",
            content: {
                options: [
                    { id: "1", text: "1", isCorrect: false },
                    { id: "2", text: "2", isCorrect: true },
                    { id: "3", text: "3", isCorrect: false }
                ]
            }
        },
        // 3. VERDADERO_FALSO
        {
            type: ExerciseType.VERDADERO_FALSO,
            instruction: "¿Son el mismo animal?",
            content: {
                stimulusA: { type: 'text', value: '🦁' },
                stimulusB: { type: 'text', value: '🦁' },
                correctAnswer: true
            }
        },
        // 4. ARRASTRAR_SILABAS
        {
            type: ExerciseType.ARRASTRAR_SILABAS,
            instruction: "Forma la palabra GATO",
            content: {
                items: [{ id: "i1", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg", word: "GATO", syllables: ["GA", "TO"], givenSyllables: ["GA", null] }],
                availableSyllables: ["TO", "MA", "LO"]
            }
        },
        // 5. UNIR_LINEAS
        {
            type: ExerciseType.UNIR_LINEAS,
            instruction: "Une cada fruta con su color",
            content: {
                leftItems: [
                    { id: "l1", text: "🍎 (Manzana)" },
                    { id: "l2", text: "🍌 (Plátano)" }
                ],
                rightItems: [
                    { id: "r1", text: "ROJO" },
                    { id: "r2", text: "AMARILLO" }
                ],
                correctPairs: [["l1", "r1"], ["l2", "r2"]]
            }
        },
        // 6. CLASIFICAR_GRUPOS
        {
            type: ExerciseType.CLASIFICAR_GRUPOS,
            instruction: "Pon cada fruta en su canasta",
            content: {
                groups: [
                    { id: "g1", label: "ROJAS" },
                    { id: "g2", label: "AMARILLAS" }
                ],
                items: [
                    { id: "it1", text: "🍎", correctGroupId: "g1" },
                    { id: "it2", text: "🍓", correctGroupId: "g1" },
                    { id: "it3", text: "🍌", correctGroupId: "g2" }
                ]
            }
        },
        // 7. PINTAR
        {
            type: ExerciseType.PINTAR,
            instruction: "Pinta el sol de amarillo",
            content: {
                items: [{ id: "sun", imageUrl: "https://www.freeiconspng.com/uploads/sun-icon-2.png", label: "Sol" }],
                colors: ["#FF0000", "#FFFF00", "#0000FF"],
                correctPairs: [{ itemId: "sun", color: "#FFFF00" }]
            }
        },
        // 8. TECLADO_VIRTUAL
        {
            type: ExerciseType.TECLADO_VIRTUAL,
            instruction: "Escribe la sílaba que falta: PE-___",
            content: {
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Pera_01.jpg/1200px-Pera_01.jpg",
                totalSyllables: 2,
                targetPosition: 1,
                correctSyllable: "RA"
            }
        },
        // 9. AUDIO_SELECCION
        {
            type: ExerciseType.AUDIO_SELECCION,
            instruction: "¿Qué sonido hace la vaca?",
            content: {
                stimulusText: "🐮",
                options: [
                    { id: "a1", audioUrl: "/audio/vaca.mp3", label: "Sonido 1" },
                    { id: "a2", audioUrl: "/audio/perro.mp3", label: "Sonido 2" }
                ],
                multipleCorrect: false
            }
        },
        // 10. COMPLETAR_HUECOS
        {
            type: ExerciseType.COMPLETAR_HUECOS,
            instruction: "Completa la frase",
            content: {
                text: "El sol es de color [gap1] y brilla mucho",
                gaps: [{ id: "gap1", correctAnswer: "amarillo" }],
                imageUrl: "https://www.freeiconspng.com/uploads/sun-icon-2.png"
            }
        }
    ];

    for (const data of exercises) {
        const exercise = exerciseRepository.create({
            ...data,
            unitId: unit.id,
            difficulty: 1,
            points: 10,
            order: exercises.indexOf(data)
        });
        await exerciseRepository.save(exercise);
    }

    console.log('✅ Seeded 10 demo exercises for La Gran Demo unit');
}
