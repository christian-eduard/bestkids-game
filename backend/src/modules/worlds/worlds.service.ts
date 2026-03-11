import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { World } from './entities/world.entity';
import { WorldLevel } from './entities/world-level.entity';
import { LevelExercise } from './entities/level-exercise.entity';
import { UserLevelProgress } from './entities/user-level-progress.entity';

@Injectable()
export class WorldsService {
    constructor(
        @InjectRepository(World)
        private worldRepository: Repository<World>,
        @InjectRepository(WorldLevel)
        private levelRepository: Repository<WorldLevel>,
        @InjectRepository(LevelExercise)
        private levelExerciseRepository: Repository<LevelExercise>,
        @InjectRepository(UserLevelProgress)
        private progressRepository: Repository<UserLevelProgress>,
    ) { }

    // ============ WORLDS ============

    async findAllWorlds() {
        return this.worldRepository.find({
            where: { isActive: true },
            order: { orderIndex: 'ASC' },
            relations: ['levels'],
        });
    }

    async findWorldsForStudent(userId: number) {
        const worlds = await this.findAllWorlds();

        // Get user's total points to determine unlocked worlds
        const userPoints = await this.getUserTotalPoints(userId);

        return worlds.map(world => ({
            ...world,
            isUnlocked: userPoints >= world.pointsToUnlock,
            progress: this.calculateWorldProgress(world, userId),
        }));
    }

    async findOneWorld(id: number) {
        const world = await this.worldRepository.findOne({
            where: { id },
            relations: ['levels', 'levels.exercises'],
        });

        if (!world) {
            throw new NotFoundException(`World #${id} not found`);
        }

        return world;
    }

    async createWorld(data: Partial<World>) {
        const world = this.worldRepository.create(data);
        return this.worldRepository.save(world);
    }

    async updateWorld(id: number, data: Partial<World>) {
        await this.worldRepository.update(id, data);
        return this.findOneWorld(id);
    }

    async deleteWorld(id: number) {
        await this.worldRepository.delete(id);
    }

    // ============ LEVELS ============

    async findLevelsByWorld(worldId: number) {
        return this.levelRepository.find({
            where: { worldId, isActive: true },
            order: { levelNumber: 'ASC' },
            relations: ['exercises', 'exercises.exercise'],
        });
    }

    async findLevelById(id: number) {
        const level = await this.levelRepository.findOne({
            where: { id },
            relations: ['exercises', 'exercises.exercise', 'world'],
        });

        if (!level) {
            throw new NotFoundException(`Level #${id} not found`);
        }

        return level;
    }

    async findLevelsForStudent(worldId: number, userId: number) {
        const levels = await this.findLevelsByWorld(worldId);

        // Get user progress for each level
        const progressData = await this.progressRepository.find({
            where: { userId },
        });

        const progressMap = new Map(
            progressData.map(p => [p.levelId, p])
        );

        return levels.map((level, index) => {
            const progress = progressMap.get(level.id);
            const previousLevel = index > 0 ? levels[index - 1] : null;
            const previousProgress = previousLevel ? progressMap.get(previousLevel.id) : null;

            // Level is unlocked if:
            // 1. It's the first level, OR
            // 2. Previous level is completed
            const isUnlocked = index === 0 || (previousProgress?.isCompleted ?? false);

            return {
                ...level,
                isUnlocked,
                progress: progress || {
                    isCompleted: false,
                    starsEarned: 0,
                    exercisesCompleted: 0,
                    totalExercises: level.exercises?.length || 0,
                },
            };
        });
    }

    async createLevel(data: Partial<WorldLevel>) {
        const level = this.levelRepository.create(data);
        return this.levelRepository.save(level);
    }

    async updateLevel(id: number, data: Partial<WorldLevel>) {
        await this.levelRepository.update(id, data);
        return this.levelRepository.findOne({ where: { id } });
    }

    async deleteLevel(id: number) {
        await this.levelRepository.delete(id);
    }

    // ============ LEVEL EXERCISES ============

    async addExerciseToLevel(levelId: number, exerciseId: number, orderIndex: number = 0) {
        const levelExercise = this.levelExerciseRepository.create({
            levelId,
            exerciseId,
            orderIndex,
        });
        return this.levelExerciseRepository.save(levelExercise);
    }

    async removeExerciseFromLevel(levelId: number, exerciseId: number) {
        await this.levelExerciseRepository.delete({ levelId, exerciseId });
    }

    // ============ USER PROGRESS ============

    async updateUserProgress(userId: number, levelId: number, exerciseCompleted: boolean) {
        let progress = await this.progressRepository.findOne({
            where: { userId, levelId },
        });

        if (!progress) {
            // Create initial progress
            const level = await this.levelRepository.findOne({
                where: { id: levelId },
                relations: ['exercises'],
            });

            progress = this.progressRepository.create({
                userId,
                levelId,
                totalExercises: level?.exercises?.length || 0,
                exercisesCompleted: 0,
                starsEarned: 0,
                isUnlocked: true,
            });
        }

        if (exerciseCompleted) {
            progress.exercisesCompleted += 1;

            // Calculate stars (1-3 based on performance)
            const completionRate = progress.exercisesCompleted / progress.totalExercises;
            if (completionRate >= 1) {
                progress.starsEarned = 3;
                progress.isCompleted = true;
            } else if (completionRate >= 0.66) {
                progress.starsEarned = 2;
            } else if (completionRate >= 0.33) {
                progress.starsEarned = 1;
            }
        }

        return this.progressRepository.save(progress);
    }

    async getUserProgress(userId: number) {
        return this.progressRepository.find({
            where: { userId },
            relations: ['level', 'level.world'],
        });
    }

    // ============ HELPERS ============

    private async getUserTotalPoints(userId: number): Promise<number> {
        // TODO: Get from GamificationProfile
        // For now, return mock value
        return 0;
    }

    private async calculateWorldProgress(world: World, userId: number): Promise<number> {
        const levels = world.levels || [];
        if (levels.length === 0) return 0;

        const progressData = await this.progressRepository.find({
            where: { userId },
        });

        const completedLevels = progressData.filter(p =>
            levels.some(l => l.id === p.levelId) && p.isCompleted
        ).length;

        return Math.round((completedLevels / levels.length) * 100);
    }
}
