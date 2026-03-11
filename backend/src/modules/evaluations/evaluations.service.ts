import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User, AcademicLevel } from '../users/entities/user.entity';
import { Exercise } from '../exercises/entities/exercise.entity';
import { UserExerciseResult } from '../exercises/entities/user-exercise-result.entity';

@Injectable()
export class EvaluationsService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Exercise)
        private exercisesRepository: Repository<Exercise>,
        @InjectRepository(UserExerciseResult)
        private attemptsRepository: Repository<UserExerciseResult>,
    ) { }

    async generatePlacementTest() {
        const easy = await this.exercisesRepository.find({
            where: { difficulty: 1, isActive: true },
            take: 2,
        });

        const medium = await this.exercisesRepository.find({
            where: { difficulty: 2, isActive: true },
            take: 2,
        });

        const hard = await this.exercisesRepository.find({
            where: { difficulty: 3, isActive: true },
            take: 2,
        });

        const testExercises = [...easy, ...medium, ...hard];
        return testExercises.sort(() => Math.random() - 0.5);
    }

    async submitPlacementTest(userId: number, answers: { exerciseId: number, isCorrect: boolean }[]) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        let totalWeight = 0;
        let earnedWeight = 0;

        const exercises = await this.exercisesRepository.find({
            where: { id: In(answers.map(a => a.exerciseId)) }
        });

        for (const answer of answers) {
            const exercise = exercises.find(e => e.id === answer.exerciseId);
            if (!exercise) continue;

            totalWeight += exercise.difficulty;
            if (answer.isCorrect) {
                earnedWeight += exercise.difficulty;
            }

            const attempt = this.attemptsRepository.create({
                userId,
                exerciseId: exercise.id,
                isCorrect: answer.isCorrect,
                responseTimeMs: 5000 // Valor por defecto para tests
            });
            await this.attemptsRepository.save(attempt);
        }

        const scorePercentage = totalWeight > 0 ? (earnedWeight / totalWeight) * 100 : 0;

        let newLevel = AcademicLevel.BEGINNER;
        if (scorePercentage >= 80) newLevel = AcademicLevel.ADVANCED;
        else if (scorePercentage >= 50) newLevel = AcademicLevel.INTERMEDIATE;

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
