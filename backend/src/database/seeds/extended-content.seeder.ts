import { DataSource } from 'typeorm';
import { World } from '../../modules/worlds/entities/world.entity';
import { WorldLevel } from '../../modules/worlds/entities/world-level.entity';
import { LevelExercise } from '../../modules/worlds/entities/level-exercise.entity';
import { Avatar } from '../../modules/gamification/entities/avatar.entity';

export class ExtendedContentSeeder {
    public async run(dataSource: DataSource): Promise<void> {
        const worldRepository = dataSource.getRepository(World);
        const levelRepository = dataSource.getRepository(WorldLevel);
        const levelExerciseRepository = dataSource.getRepository(LevelExercise);
        const avatarRepository = dataSource.getRepository(Avatar);

        console.log('🌱 Seeding Extended Gamification Content...');

        // 1. Add New Worlds
        const newWorlds = [
            {
                name: '🏛️ Imperio de la Historia',
                description: 'Viaja en el tiempo y descubre el pasado de la humanidad',
                icon: '⏳',
                colorTheme: '#F5A623',
                orderIndex: 5,
                pointsToUnlock: 2000,
                subjectAreaId: 4, // Ciencias Sociales
                isActive: true,
            },
            {
                name: '🇬🇧 Archipiélago de Inglés',
                description: 'Domina el idioma universal en islas llenas de retos',
                icon: '🚢',
                colorTheme: '#BD10E0',
                orderIndex: 6,
                pointsToUnlock: 3000,
                subjectAreaId: 5, // Inglés
                isActive: true,
            },
        ];

        for (const w of newWorlds) {
            const exists = await worldRepository.findOne({ where: { name: w.name } });
            if (!exists) {
                const world = await worldRepository.save(worldRepository.create(w));

                // Create 5 levels for the new world
                for (let i = 1; i <= 5; i++) {
                    const level = await levelRepository.save(
                        levelRepository.create({
                            worldId: world.id,
                            name: `Nivel ${i}`,
                            description: `Desafíos históricos/idiomáticos ${i}`,
                            levelNumber: i,
                            pointsToUnlock: (i - 1) * 200,
                            starsRequired: i > 1 ? 3 : 0,
                            isActive: true,
                        })
                    );

                    // Link exercises from the subject area
                    const exercises = await dataSource.query(
                        `SELECT id FROM exercises WHERE subject_area_id = $1 AND is_active = true LIMIT 5`,
                        [world.subjectAreaId]
                    );

                    for (let j = 0; j < exercises.length; j++) {
                        await levelExerciseRepository.save(
                            levelExerciseRepository.create({
                                levelId: level.id,
                                exerciseId: exercises[j].id,
                                orderIndex: j,
                                isRequired: true,
                            })
                        );
                    }
                }
            }
        }

        // 2. Add Premium Avatars
        const newAvatars = [
            {
                name: 'Robot B0T',
                emoji: '🤖',
                unlockPointsRequired: 2500,
                unlockLevelRequired: 5,
                isDefault: false,
            },
            {
                name: 'Astronauta Estelar',
                emoji: '👨‍🚀',
                unlockPointsRequired: 5000,
                unlockLevelRequired: 10,
                isDefault: false,
            },
            {
                name: 'Mago Cósmico',
                emoji: '🧙',
                unlockPointsRequired: 10000,
                unlockLevelRequired: 15,
                isDefault: false,
            },
            {
                name: 'Super Niñ@',
                emoji: '🦸',
                unlockPointsRequired: 15000,
                unlockLevelRequired: 20,
                isDefault: false,
            },
        ];

        for (const a of newAvatars) {
            const exists = await avatarRepository.findOne({ where: { name: a.name } });
            if (!exists) {
                await avatarRepository.save(avatarRepository.create(a));
            }
        }

        console.log('✅ Extended Gamification Content seeded successfully!');
    }
}
