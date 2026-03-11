
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User, AcademicLevel } from '../users/entities/user.entity';
import { Exercise, DifficultyLevel } from '../exercises/entities/exercise.entity';
import { ExerciseAttempt } from '../progress/entities/exercise-attempt.entity';

@Injectable()
export class EvaluationsService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Exercise)
        private exercisesRepository: Repository<Exercise>,
        @InjectRepository(ExerciseAttempt)
        private attemptsRepository: Repository<ExerciseAttempt>,
    ) { }

    async generatePlacementTest() {
        // Simple logic: Get 2 easy, 2 medium, 2 hard exercises
        // In a real app, this would be more complex or randomized from a specific 'placement' pool

        const easy = await this.exercisesRepository.find({
            where: { difficultyLevel: DifficultyLevel.EASY, isActive: true },
            take: 2,
        });

        const medium = await this.exercisesRepository.find({
            where: { difficultyLevel: DifficultyLevel.MEDIUM, isActive: true },
            take: 2,
        });

        const hard = await this.exercisesRepository.find({
            where: { difficultyLevel: DifficultyLevel.HARD, isActive: true },
            take: 2,
        });

        // If not enough exercises, just return what we have
        const testExercises = [...easy, ...medium, ...hard];

        // Shuffle
        return testExercises.sort(() => Math.random() - 0.5);
    }

    async submitPlacementTest(userId: number, answers: { exerciseId: number, isCorrect: boolean }[]) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        let correctCount = 0;
        let totalWeight = 0;
        let earnedWeight = 0;

        // Fetch exercises to get difficulty
        const exercises = await this.exercisesRepository.find({
            where: { id: In(answers.map(a => a.exerciseId)) }
        });

        for (const answer of answers) {
            const exercise = exercises.find(e => e.id === answer.exerciseId);
            if (!exercise) continue;

            const weight = exercise.difficultyLevel === DifficultyLevel.HARD ? 3 :
                exercise.difficultyLevel === DifficultyLevel.MEDIUM ? 2 : 1;

            totalWeight += weight;
            if (answer.isCorrect) {
                correctCount++;
                earnedWeight += weight;
            }

            // Save attempt record (optional given placement test nature, but good for tracking)
            const attempt = this.attemptsRepository.create({
                userId,
                exerciseId: exercise.id,
                isCorrect: answer.isCorrect,
                pointsEarned: answer.isCorrect ? exercise.points : 0,
                attemptNumber: 1
            });
            await this.attemptsRepository.save(attempt);
        }

        const scorePercentage = totalWeight > 0 ? (earnedWeight / totalWeight) * 100 : 0;

        // Determine Level
        let newLevel = AcademicLevel.BEGINNER;
        if (scorePercentage >= 80) newLevel = AcademicLevel.ADVANCED;
        else if (scorePercentage >= 50) newLevel = AcademicLevel.INTERMEDIATE;

        // Update User
        user.academicLevel = newLevel;
        user.placementTestTaken = true;
        await this.usersRepository.save(user);

        return {
            level: newLevel,
            score: scorePercentage,
            message: `Evaluación completada. Tu nivel asignado es: ${newLevel}`
        };
    }
}
