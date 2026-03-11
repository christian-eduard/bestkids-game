import { DataSource } from 'typeorm';
import { World } from '../../modules/worlds/entities/world.entity';
import { Unit } from '../../modules/exercises/entities/unit.entity';
import { Exercise, ExerciseType } from '../../modules/exercises/entities/exercise.entity';

export class ExercisesSeeder {
    public async run(dataSource: DataSource): Promise<void> {
        const worldRepo = dataSource.getRepository(World);
        const unitRepo = dataSource.getRepository(Unit);
        const exerciseRepo = dataSource.getRepository(Exercise);

        // 1. Obtener o crear mundos
        let mathWorld = await worldRepo.findOne({ where: { name: 'Matemáticas' } });
        if (!mathWorld) {
            mathWorld = await worldRepo.save(worldRepo.create({
                name: 'Matemáticas',
                description: 'El mundo de los números y la lógica',
                orderIndex: 0,
                colorTheme: '#4A90E2',
                pointsToUnlock: 0
            }));
        }

        let langWorld = await worldRepo.findOne({ where: { name: 'Lenguaje' } });
        if (!langWorld) {
            langWorld = await worldRepo.save(worldRepo.create({
                name: 'Lenguaje',
                description: 'Explora el poder de las palabras',
                orderIndex: 1,
                colorTheme: '#F5A623',
                pointsToUnlock: 0
            }));
        }

        // 2. UNIDADES MATEMÁTICAS
        const mathUnit1 = await this.getOrCreateUnit(unitRepo, mathWorld.id, 'Números y Conteo', 0);

        // Ejercicios Matemática Unidad 1 - Usando el nuevo modelo JSONB
        await exerciseRepo.save(exerciseRepo.create({
            unitId: mathUnit1.id,
            type: ExerciseType.OPCION_MULTIPLE,
            instruction: '¿Cuántas manzanas hay?',
            difficulty: 1,
            points: 10,
            content: {
                options: [
                    { id: "1", text: "1", isCorrect: false },
                    { id: "2", text: "3", isCorrect: true },
                    { id: "3", text: "5", isCorrect: false }
                ]
            }
        }));

        await exerciseRepo.save(exerciseRepo.create({
            unitId: mathUnit1.id,
            type: ExerciseType.SEÑALAR_IMAGEN,
            instruction: 'Selecciona el grupo con 2 elementos',
            difficulty: 1,
            points: 10,
            content: {
                options: [
                    { id: "1", imageUrl: "/placeholders/group1.png", isCorrect: false },
                    { id: "2", imageUrl: "/placeholders/group2.png", isCorrect: true },
                    { id: "3", imageUrl: "/placeholders/group3.png", isCorrect: false }
                ],
                multipleCorrect: false
            }
        }));

        // 3. UNIDADES LENGUAJE
        const langUnit1 = await this.getOrCreateUnit(unitRepo, langWorld.id, 'Letras y Sonidos', 0);

        await exerciseRepo.save(exerciseRepo.create({
            unitId: langUnit1.id,
            type: ExerciseType.COMPLETAR_HUECOS,
            instruction: '¿Con qué letra empieza la palabra "Oso"?',
            difficulty: 1,
            points: 10,
            content: {
                text: "[gap1]so",
                gaps: [{ id: "gap1", correctAnswer: "O" }]
            }
        }));

        console.log('✅ Exercises Seeding complete');
    }

    private async getOrCreateUnit(repo: any, worldId: number, title: string, orderIndex: number) {
        let unit = await repo.findOne({ where: { worldId, title } });
        if (!unit) {
            unit = await repo.save(repo.create({ worldId, title, orderIndex }));
        }
        return unit;
    }
}
