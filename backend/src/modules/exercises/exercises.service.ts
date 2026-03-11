import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './entities/exercise.entity';
import { SubjectArea } from './entities/subject-area.entity';
import { ExerciseAttempt } from './entities/exercise-attempt.entity';
import { GamificationService } from '../gamification/gamification.service';

@Injectable()
export class ExercisesService {
    constructor(
        @InjectRepository(Exercise)
        private exerciseRepository: Repository<Exercise>,
        @InjectRepository(SubjectArea)
        private subjectAreaRepository: Repository<SubjectArea>,
        @InjectRepository(ExerciseAttempt)
        private attemptRepository: Repository<ExerciseAttempt>,
        private gamificationService: GamificationService,
    ) { }


    async findAllSubjectAreas() {
        return this.subjectAreaRepository.find({
            where: { isActive: true },
            order: { orderIndex: 'ASC' },
        });
    }

    async findAll() {
        // We need to join course and unit to get their names
        const exercises = await this.exerciseRepository.find({
            where: { isActive: true },
            order: { subjectAreaId: 'ASC', title: 'ASC' },
            relations: ['course', 'unit'],
            // Select all needed fields plus relations
        });

        // Flatten for frontend convenience if needed, or frontend handles nested objects.
        // The frontend interface expects courseName and unitName.
        return exercises.map(ex => ({
            ...ex,
            courseName: ex.course?.title,
            unitName: ex.unit?.title
        }));
    }

    async findBySubject(subjectId: number) {
        return this.exerciseRepository.find({
            where: { subjectAreaId: subjectId, isActive: true },
            order: { difficultyLevel: 'ASC', title: 'ASC' },
            select: ['id', 'title', 'description', 'exerciseType', 'difficultyLevel', 'points', 'estimatedTimeMinutes', 'subjectAreaId'], // Exclude content/answer initially if needed, but for list we usually need meta
        });
    }

    async findOne(id: number) {
        const exercise = await this.exerciseRepository.findOne({ leftJoinAndSelect: { subjectArea: 'subjectArea' }, where: { id } } as any);
        if (!exercise) {
            throw new NotFoundException(`Exercise #${id} not found`);
        }
        // Remove correct answer from response to prevent cheating if strictly needed,
        // but for now we might send it to frontend for immediate validation or keep it hidden.
        // Let's hide correct_answer for now.
        const { correctAnswer, ...exerciseData } = exercise;
        return exerciseData;
    }

    async submitAttempt(userId: number, exerciseId: number, answer: any, timeSpent?: number) {
        const exercise = await this.exerciseRepository.findOne({ where: { id: exerciseId } });
        if (!exercise) {
            throw new NotFoundException(`Exercise #${exerciseId} not found`);
        }

        // Calculate attempt number
        const previousAttempts = await this.attemptRepository.count({
            where: { userId, exerciseId },
        });
        const attemptNumber = previousAttempts + 1;

        // Simplistic grading logic
        const isCorrect = JSON.stringify(answer) === JSON.stringify(exercise.correctAnswer);

        let earnedPoints = 0;
        if (isCorrect) {
            earnedPoints = exercise.points;
            await this.gamificationService.addPoints(userId, earnedPoints);
        }

        // Save attempt to database
        const attempt = this.attemptRepository.create({
            userId,
            exerciseId,
            isCorrect,
            timeSpentSeconds: timeSpent,
            userAnswer: answer,
            pointsEarned: earnedPoints,
            difficultyLevel: exercise.difficultyLevel,
            attemptNumber,
        });

        await this.attemptRepository.save(attempt);

        return {
            isCorrect,
            earnedPoints,
            correctAnswer: exercise.correctAnswer,
            feedback: isCorrect ? '¡Excelente trabajo!' : 'Sigue intentándolo',
            timeSpent,
            attemptNumber,
        };
    }

    /**
     * Get IDs of exercises completed (correctly answered at least once) by user
     */
    async getCompletedExerciseIds(userId: number): Promise<number[]> {
        const completedAttempts = await this.attemptRepository
            .createQueryBuilder('attempt')
            .select('DISTINCT attempt.exerciseId', 'exerciseId')
            .where('attempt.userId = :userId', { userId })
            .andWhere('attempt.isCorrect = true')
            .getRawMany();

        return completedAttempts.map((a) => a.exerciseId);
    }

    /**
     * Get recent performance data for adaptive algorithm
     */
    async getRecentPerformances(userId: number, limit: number = 5): Promise<any[]> {
        const recentAttempts = await this.attemptRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: limit,
        });

        return recentAttempts.map((attempt) => ({
            exerciseId: attempt.exerciseId,
            isCorrect: attempt.isCorrect,
            timeSpent: attempt.timeSpentSeconds || 0,
            attempts: attempt.attemptNumber,
        }));
    }

    /**
     * Get all attempts for a user
     */
    async getAllAttempts(userId: number): Promise<ExerciseAttempt[]> {
        return this.attemptRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }

    async create(data: Partial<Exercise>): Promise<Exercise> {

        const exercise = this.exerciseRepository.create(data);
        return this.exerciseRepository.save(exercise);
    }

    async update(id: number, data: Partial<Exercise>): Promise<Exercise> {
        await this.exerciseRepository.update(id, data);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.exerciseRepository.delete(id);
    }
}


