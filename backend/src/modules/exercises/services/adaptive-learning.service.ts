import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise, DifficultyLevel } from '../entities/exercise.entity';

export interface StudentPerformance {
    exerciseId: number;
    isCorrect: boolean;
    timeSpent: number; // seconds
    attempts: number;
}

export interface AdaptiveRecommendation {
    nextDifficulty: DifficultyLevel;
    recommendedExercises: Exercise[];
    adjustmentReason: string;
    confidenceScore: number;
}

@Injectable()
export class AdaptiveLearningService {
    // Configuración del algoritmo
    private readonly ADJUSTMENT_THRESHOLD = 5; // Ajustar cada N intentos
    private readonly SUCCESS_THRESHOLD = 0.8; // 80% para subir dificultad
    private readonly STRUGGLE_THRESHOLD = 0.4; // 40% para bajar dificultad
    private readonly TIME_FACTOR_WEIGHT = 0.2; // Peso del tiempo en la evaluación

    constructor(
        @InjectRepository(Exercise)
        private exerciseRepository: Repository<Exercise>,
    ) { }

    /**
     * Calcula el rendimiento del estudiante y recomienda ajustes
     */
    async analyzePerformance(
        studentId: number,
        recentPerformances: StudentPerformance[],
        currentDifficulty: DifficultyLevel,
        subjectAreaId: number,
    ): Promise<AdaptiveRecommendation> {
        // Necesitamos al menos ADJUSTMENT_THRESHOLD intentos para ajustar
        if (recentPerformances.length < this.ADJUSTMENT_THRESHOLD) {
            return {
                nextDifficulty: currentDifficulty,
                recommendedExercises: await this.getExercisesForDifficulty(
                    currentDifficulty,
                    subjectAreaId,
                ),
                adjustmentReason: `Necesitas ${this.ADJUSTMENT_THRESHOLD - recentPerformances.length} ejercicios más para ajustar`,
                confidenceScore: 0.5,
            };
        }

        // Calcular métricas
        const successRate = this.calculateSuccessRate(recentPerformances);
        const avgTimeScore = this.calculateTimeScore(recentPerformances);
        const combinedScore = successRate * (1 - this.TIME_FACTOR_WEIGHT) + avgTimeScore * this.TIME_FACTOR_WEIGHT;

        // Determinar nuevo nivel
        let nextDifficulty = currentDifficulty;
        let adjustmentReason = '';

        if (combinedScore >= this.SUCCESS_THRESHOLD) {
            nextDifficulty = this.increaseDifficulty(currentDifficulty);
            adjustmentReason = `¡Excelente! ${Math.round(successRate * 100)}% de aciertos. Subiendo dificultad.`;
        } else if (combinedScore <= this.STRUGGLE_THRESHOLD) {
            nextDifficulty = this.decreaseDifficulty(currentDifficulty);
            adjustmentReason = `Vamos a practicar un poco más. Ajustando dificultad para ayudarte.`;
        } else {
            adjustmentReason = `Buen progreso (${Math.round(successRate * 100)}%). Manteniendo nivel actual.`;
        }

        const recommendedExercises = await this.getExercisesForDifficulty(
            nextDifficulty,
            subjectAreaId,
        );

        return {
            nextDifficulty,
            recommendedExercises,
            adjustmentReason,
            confidenceScore: Math.min(recentPerformances.length / 10, 1),
        };
    }

    /**
     * Obtiene el siguiente ejercicio óptimo para el estudiante
     */
    async getNextExercise(
        studentId: number,
        subjectAreaId: number,
        currentDifficulty: DifficultyLevel,
        completedExerciseIds: number[],
    ): Promise<Exercise | null> {
        const query = this.exerciseRepository
            .createQueryBuilder('exercise')
            .where('exercise.subjectAreaId = :subjectAreaId', { subjectAreaId })
            .andWhere('exercise.difficultyLevel = :difficulty', { difficulty: currentDifficulty })
            .andWhere('exercise.isActive = true');

        // Excluir ejercicios ya completados
        if (completedExerciseIds.length > 0) {
            query.andWhere('exercise.id NOT IN (:...completedIds)', {
                completedIds: completedExerciseIds,
            });
        }

        // Ordenar por random para variedad
        const exercises = await query.orderBy('RANDOM()').limit(1).getMany();

        if (exercises.length === 0) {
            // Si no hay ejercicios en esta dificultad, buscar en siguiente
            const nextDifficulty = this.increaseDifficulty(currentDifficulty);
            if (nextDifficulty !== currentDifficulty) {
                return this.getNextExercise(studentId, subjectAreaId, nextDifficulty, completedExerciseIds);
            }
            return null;
        }

        return exercises[0];
    }

    /**
     * Calcula la tasa de éxito
     */
    private calculateSuccessRate(performances: StudentPerformance[]): number {
        if (performances.length === 0) return 0;
        const correct = performances.filter((p) => p.isCorrect).length;
        return correct / performances.length;
    }

    /**
     * Calcula un score basado en el tiempo (más rápido = mejor, normalizado)
     */
    private calculateTimeScore(performances: StudentPerformance[]): number {
        if (performances.length === 0) return 0.5;

        // Tiempo esperado por ejercicio: 60 segundos
        const expectedTime = 60;
        const avgTime = performances.reduce((sum, p) => sum + p.timeSpent, 0) / performances.length;

        // Si terminó más rápido, mejor score (max 1.0)
        // Si tardó más, peor score (min 0)
        const timeRatio = expectedTime / avgTime;
        return Math.min(Math.max(timeRatio, 0), 1);
    }

    /**
     * Sube un nivel de dificultad
     */
    private increaseDifficulty(current: DifficultyLevel): DifficultyLevel {
        switch (current) {
            case DifficultyLevel.EASY:
                return DifficultyLevel.MEDIUM;
            case DifficultyLevel.MEDIUM:
                return DifficultyLevel.HARD;
            case DifficultyLevel.HARD:
                return DifficultyLevel.HARD; // Ya es máximo
            default:
                return current;
        }
    }

    /**
     * Baja un nivel de dificultad
     */
    private decreaseDifficulty(current: DifficultyLevel): DifficultyLevel {
        switch (current) {
            case DifficultyLevel.HARD:
                return DifficultyLevel.MEDIUM;
            case DifficultyLevel.MEDIUM:
                return DifficultyLevel.EASY;
            case DifficultyLevel.EASY:
                return DifficultyLevel.EASY; // Ya es mínimo
            default:
                return current;
        }
    }

    /**
     * Obtiene ejercicios para una dificultad específica
     */
    private async getExercisesForDifficulty(
        difficulty: DifficultyLevel,
        subjectAreaId: number,
        limit: number = 5,
    ): Promise<Exercise[]> {
        return this.exerciseRepository.find({
            where: {
                subjectAreaId,
                difficultyLevel: difficulty,
                isActive: true,
            },
            take: limit,
            order: { id: 'ASC' },
        });
    }
}
