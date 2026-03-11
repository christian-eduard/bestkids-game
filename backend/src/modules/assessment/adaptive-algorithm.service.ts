import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdaptiveProgress } from './entities/adaptive-progress.entity';
import { DifficultyLevel } from './enums/difficulty-level.enum';
import { Exercise } from '../exercises/entities/exercise.entity';

@Injectable()
export class AdaptiveAlgorithmService {
    constructor(
        @InjectRepository(AdaptiveProgress)
        private progressRepo: Repository<AdaptiveProgress>,
        @InjectRepository(Exercise)
        private exerciseRepo: Repository<Exercise>,
    ) { }

    async trackResult(userId: number, subjectAreaId: number, isCorrect: boolean) {
        let progress = await this.progressRepo.findOne({
            where: { userId, subjectAreaId },
        });

        if (!progress) {
            // Crear progreso inicial
            progress = this.progressRepo.create({
                userId,
                subjectAreaId,
                currentLevel: DifficultyLevel.NIVEL_MEDIO,
                consecutiveCorrect: 0,
                consecutiveIncorrect: 0,
                totalExercises: 0,
                correctExercises: 0,
            });
        }

        // Actualizar estadísticas
        progress.totalExercises += 1;
        if (isCorrect) {
            progress.correctExercises += 1;
            progress.consecutiveCorrect += 1;
            progress.consecutiveIncorrect = 0; // Reset contador de incorrectas
        } else {
            progress.consecutiveCorrect = 0; // Reset contador de correctas
            progress.consecutiveIncorrect += 1;
        }

        // Calcular porcentaje de precisión
        progress.accuracyPercentage = (progress.correctExercises / progress.totalExercises) * 100;

        // **ALGORITMO ADAPTATIVO: Cada 5 ejercicios consecutivos**
        let levelChanged = false;

        // ✅ 5 correctas consecutivas → SUBE DE NIVEL
        if (progress.consecutiveCorrect >= 5 && progress.currentLevel < DifficultyLevel.NIVEL_ALTO) {
            progress.currentLevel += 1;
            progress.consecutiveCorrect = 0; // Reset
            levelChanged = true;
        }

        // ❌ 5 incorrectas consecutivas → BAJA DE NIVEL
        if (progress.consecutiveIncorrect >= 5 && progress.currentLevel > DifficultyLevel.NIVEL_BAJO) {
            progress.currentLevel -= 1;
            progress.consecutiveIncorrect = 0; // Reset
            levelChanged = true;
        }

        await this.progressRepo.save(progress);

        return {
            currentLevel: progress.currentLevel,
            levelChanged,
            consecutiveCorrect: progress.consecutiveCorrect,
            consecutiveIncorrect: progress.consecutiveIncorrect,
            accuracyPercentage: progress.accuracyPercentage,
        };
    }

    async getRecommendedExercises(userId: number, subjectAreaId: number) {
        const progress = await this.progressRepo.findOne({
            where: { userId, subjectAreaId },
        });

        const targetLevel = progress?.currentLevel || DifficultyLevel.NIVEL_MEDIO;

        // Obtener ejercicios directamente del repositorio (simplified)
        // En producción, aquí se filtraría por nivel de dificultad
        const exercises = await this.exerciseRepo.find({
            where: { subjectAreaId },
            take: 10,
        });

        return exercises;
    }

    async getStudentProgress(userId: number) {
        return this.progressRepo.find({
            where: { userId },
            relations: ['subjectArea'],
        });
    }
}
