import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdaptiveProgress } from './entities/adaptive-progress.entity';
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
            progress = this.progressRepo.create({
                userId,
                subjectAreaId,
                currentLevel: 1, // NIVEL_MEDIO approx
                consecutiveCorrect: 0,
                consecutiveIncorrect: 0,
                totalExercises: 0,
                correctExercises: 0,
            });
        }

        progress.totalExercises += 1;
        if (isCorrect) {
            progress.correctExercises += 1;
            progress.consecutiveCorrect += 1;
            progress.consecutiveIncorrect = 0;
        } else {
            progress.consecutiveCorrect = 0;
            progress.consecutiveIncorrect += 1;
        }

        progress.accuracyPercentage = (progress.correctExercises / progress.totalExercises) * 100;

        let levelChanged = false;
        if (progress.consecutiveCorrect >= 5 && progress.currentLevel < 3) {
            progress.currentLevel += 1;
            progress.consecutiveCorrect = 0;
            levelChanged = true;
        } else if (progress.consecutiveIncorrect >= 5 && progress.currentLevel > 1) {
            progress.currentLevel -= 1;
            progress.consecutiveIncorrect = 0;
            levelChanged = true;
        }

        await this.progressRepo.save(progress);

        return {
            currentLevel: progress.currentLevel,
            levelChanged,
            accuracyPercentage: progress.accuracyPercentage,
        };
    }

    async getRecommendedExercises(userId: number, subjectAreaId: number) {
        // Obtenemos ejercicios de cualquier unidad para simplificar compatibilidad
        return this.exerciseRepo.find({
            take: 10,
        });
    }

    async getStudentProgress(userId: number) {
        return this.progressRepo.find({
            where: { userId },
        });
    }
}
