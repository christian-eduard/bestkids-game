import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AreaProgress } from './entities/area-progress.entity';
import { ExerciseAttempt } from './entities/exercise-attempt.entity';

@Injectable()
export class ProgressService {
    constructor(
        @InjectRepository(AreaProgress)
        private areaProgressRepository: Repository<AreaProgress>,
        @InjectRepository(ExerciseAttempt)
        private attemptRepository: Repository<ExerciseAttempt>,
    ) { }

    // ============================================
    // AREA PROGRESS METHODS
    // ============================================

    async getAreaProgress(userId: number, subjectAreaId: number) {
        let progress = await this.areaProgressRepository.findOne({
            where: { userId, subjectAreaId },
        });

        if (!progress) {
            progress = this.areaProgressRepository.create({ userId, subjectAreaId });
            await this.areaProgressRepository.save(progress);
        }

        return progress;
    }

    async getAllAreasProgress(userId: number) {
        return this.areaProgressRepository.find({
            where: { userId },
            order: { subjectAreaId: 'ASC' },
        });
    }

    async updateAreaProgress(
        userId: number,
        subjectAreaId: number,
        isCorrect: boolean,
        points: number,
    ) {
        const progress = await this.getAreaProgress(userId, subjectAreaId);

        progress.exercisesAttempted++;
        if (isCorrect) {
            progress.exercisesCorrect++;
        }
        progress.totalPoints += points;
        progress.accuracyPercentage = (progress.exercisesCorrect / progress.exercisesAttempted) * 100;
        progress.lastActivityDate = new Date();

        // Level up logic per area
        const pointsPerLevel = 500;
        progress.currentLevel = Math.floor(progress.totalPoints / pointsPerLevel) + 1;

        return this.areaProgressRepository.save(progress);
    }

    // ============================================
    // EXERCISE ATTEMPT METHODS
    // ============================================

    async recordAttempt(
        userId: number,
        exerciseId: number,
        userAnswer: any,
        isCorrect: boolean,
        pointsEarned: number,
        timeTakenSeconds?: number,
    ) {
        // Get attempt number
        const previousAttempts = await this.attemptRepository.count({
            where: { userId, exerciseId },
        });

        const attempt = this.attemptRepository.create({
            userId,
            exerciseId,
            userAnswer,
            isCorrect,
            pointsEarned,
            timeTakenSeconds,
            attemptNumber: previousAttempts + 1,
        });

        return this.attemptRepository.save(attempt);
    }

    async getAttemptHistory(userId: number, limit = 50) {
        return this.attemptRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }

    async getExerciseAttempts(userId: number, exerciseId: number) {
        return this.attemptRepository.find({
            where: { userId, exerciseId },
            order: { attemptNumber: 'ASC' },
        });
    }

    async getRecentActivity(userId: number, days = 7) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        return this.attemptRepository
            .createQueryBuilder('attempt')
            .where('attempt.userId = :userId', { userId })
            .andWhere('attempt.createdAt >= :startDate', { startDate })
            .select([
                'DATE(attempt.createdAt) as date',
                'COUNT(*) as attempts',
                'SUM(CASE WHEN attempt.isCorrect THEN 1 ELSE 0 END) as correct',
                'SUM(attempt.pointsEarned) as points',
            ])
            .groupBy('DATE(attempt.createdAt)')
            .orderBy('date', 'ASC')
            .getRawMany();
    }
}
