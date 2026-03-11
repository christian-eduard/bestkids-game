import { DataSource } from 'typeorm';
import { World } from '../../modules/worlds/entities/world.entity';
import { WorldLevel } from '../../modules/worlds/entities/world-level.entity';
import { LevelExercise } from '../../modules/worlds/entities/level-exercise.entity';

export class WorldsSeeder {
    public async run(dataSource: DataSource): Promise<void> {
        const worldRepository = dataSource.getRepository(World);
        const levelRepository = dataSource.getRepository(WorldLevel);
        const levelExerciseRepository = dataSource.getRepository(LevelExercise);

        // Check if already seeded
        const count = await worldRepository.count();
        if (count > 0) {
            console.log('Worlds already seeded. Skipping...');
            return;
        }

        // Create Worlds
        const worlds = [
            {
                name: '🌟 Mundo de los Números',
                description: 'Aventuras matemáticas llenas de diversión',
                icon: '🔢',
                colorTheme: '#667eea',
                orderIndex: 1,
                pointsToUnlock: 0,
                subjectAreaId: 1, // Matemáticas
                isActive: true,
            },
            {
                name: '📚 Reino de las Letras',
                description: 'Explora el mágico mundo de la lectura',
                icon: '📖',
                colorTheme: '#F8E71C',
                orderIndex: 2,
                pointsToUnlock: 500,
                subjectAreaId: 2, // Lengua
                isActive: true,
            },
            {
                name: '🔬 Planeta Ciencias',
                description: 'Descubre los secretos de la naturaleza',
                icon: '🌍',
                colorTheme: '#7ED321',
                orderIndex: 3,
                pointsToUnlock: 1000,
                subjectAreaId: 3, // Ciencias Naturales
                isActive: true,
            },
            {
                name: '🎨 Galaxia Creativa',
                description: 'Expresa tu arte y creatividad',
                icon: '🎭',
                colorTheme: '#FF6B9D',
                orderIndex: 4,
                pointsToUnlock: 1500,
                subjectAreaId: 6, // Arte
                isActive: true,
            },
        ];

        const createdWorlds = await worldRepository.save(worldRepository.create(worlds));
        console.log(`✅ Created ${createdWorlds.length} worlds`);

        // Create Levels for each world
        let totalLevels = 0;
        let totalLevelExercises = 0;

        for (const world of createdWorlds) {
            // Create 5 levels per world
            for (let i = 1; i <= 5; i++) {
                const level = await levelRepository.save(
                    levelRepository.create({
                        worldId: world.id,
                        name: `Nivel ${i}`,
                        description: `Desafíos del nivel ${i}`,
                        levelNumber: i,
                        pointsToUnlock: (i - 1) * 100,
                        starsRequired: i > 1 ? 2 : 0,
                        isActive: true,
                    })
                );

                totalLevels++;

                // Assign 3-5 exercises to each level
                // Get exercises from the world's subject area
                const exercises = await dataSource.query(
                    `SELECT id FROM exercises WHERE subject_area_id = $1 AND is_active = true LIMIT 5`,
                    [world.subjectAreaId]
                );

                for (let j = 0; j < exercises.length && j < 5; j++) {
                    await levelExerciseRepository.save(
                        levelExerciseRepository.create({
                            levelId: level.id,
                            exerciseId: exercises[j].id,
                            orderIndex: j,
                            isRequired: true,
                        })
                    );
                    totalLevelExercises++;
                }
            }
        }

        console.log(`✅ Created ${totalLevels} levels`);
        console.log(`✅ Assigned ${totalLevelExercises} exercises to levels`);
    }
}
