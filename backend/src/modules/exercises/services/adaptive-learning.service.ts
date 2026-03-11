import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from '../entities/exercise.entity';

export interface StudentPerformance {
    exerciseId: number;
    isCorrect: boolean;
    timeSpent: number;
    attempts: number;
}

export interface AdaptiveRecommendation {
    nextDifficulty: number;
    recommendedExercises: Exercise[];
    adjustmentReason: string;
    confidenceScore: number;
}

@Injectable()
export class AdaptiveLearningService {
    constructor(
        @InjectRepository(Exercise)
        private exerciseRepository: Repository<Exercise>,
    ) { }

    async analyzePerformance(
        studentId: number,
        recentPerformances: StudentPerformance[],
        currentDifficulty: number,
        unitId: number,
    ): Promise<AdaptiveRecommendation> {
        // Lógica simplificada compatible con la nueva entidad
        const correctCount = recentPerformances.filter(p => p.isCorrect).length;
        const total = recentPerformances.length;
        const successRate = total > 0 ? correctCount / total : 0;

        let nextDifficulty = currentDifficulty;
        let reason = 'Manteniendo nivel actual';

        if (successRate > 0.8 && currentDifficulty < 3) {
            nextDifficulty++;
            reason = '¡Excelente! Subiendo nivel.';
        } else if (successRate < 0.4 && currentDifficulty > 1) {
            nextDifficulty--;
            reason = 'Ajustando nivel para practicar más.';
        }

        const recommended = await this.exerciseRepository.find({
            where: { unitId, difficulty: nextDifficulty, isActive: true },
            take: 3
        });

        return {
            nextDifficulty,
            recommendedExercises: recommended,
            adjustmentReason: reason,
            confidenceScore: 0.8
        };
    }

    async getNextExercise(
        studentId: number,
        unitId: number,
        currentDifficulty: number,
        completedExerciseIds: number[],
    ): Promise<Exercise | null> {
        const query = this.exerciseRepository
            .createQueryBuilder('exercise')
            .where('exercise.unitId = :unitId', { unitId })
            .andWhere('exercise.difficulty = :difficulty', { difficulty: currentDifficulty })
            .andWhere('exercise.isActive = true');

        if (completedExerciseIds.length > 0) {
            query.andWhere('exercise.id NOT IN (:...ids)', { ids: completedExerciseIds });
        }

        return query.orderBy('RANDOM()').getOne();
    }
}
