import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InitialAssessment } from './entities/initial-assessment.entity';
import { AdaptiveProgress } from './entities/adaptive-progress.entity';
import { RtiLevel, getRtiLevelFromScore } from './enums/rti-level.enum';
import { DifficultyLevel, getDifficultyLevelFromScore } from './enums/difficulty-level.enum';
import { Exercise } from '../exercises/entities/exercise.entity';
import { SubjectArea } from '../exercises/entities/subject-area.entity';

@Injectable()
export class AssessmentService {
    constructor(
        @InjectRepository(InitialAssessment)
        private assessmentRepo: Repository<InitialAssessment>,
        @InjectRepository(AdaptiveProgress)
        private adaptiveRepo: Repository<AdaptiveProgress>,
        @InjectRepository(Exercise)
        private exerciseRepo: Repository<Exercise>,
        @InjectRepository(SubjectArea)
        private subjectAreaRepo: Repository<SubjectArea>,
    ) { }

    async startInitialAssessment(userId: number) {
        // Verificar si ya completó la evaluación
        const existing = await this.isAssessmentComplete(userId);
        if (existing) {
            throw new Error('Initial assessment already completed');
        }

        // Obtener todas las áreas temáticas
        const subjectAreas = await this.subjectAreaRepo.find();

        // Crear registros de evaluación para cada área
        const assessments = [];
        for (const area of subjectAreas) {
            const assessment = this.assessmentRepo.create({
                userId,
                subjectAreaId: area.id,
                totalQuestions: 4, // 4 preguntas por área
                correctAnswers: 0,
                score: 0,
                completed: false,
            });
            assessments.push(await this.assessmentRepo.save(assessment));
        }

        return {
            message: 'Initial assessment started',
            totalQuestions: subjectAreas.length * 4,
            subjectAreas: subjectAreas.map(a => a.name),
        };
    }

    async getAssessmentExercises(userId: number) {
        const assessments = await this.assessmentRepo.find({
            where: { userId, completed: false },
            relations: ['subjectArea'],
        });

        if (assessments.length === 0) {
            return { exercises: [] as Exercise[], message: 'Assessment completed or not started' };
        }

        // Obtener 4 ejercicios por cada área pendiente (nivel medio)
        const exercises: Exercise[] = [];
        for (const assessment of assessments) {
            const areaExercises = await this.exerciseRepo.find({
                where: {
                    subjectAreaId: assessment.subjectAreaId,
                    // difficulty: 'MEDIO', // Field removed as it doesn't exist in Exercise entity
                },
                take: 4,
            });
            exercises.push(...areaExercises);
        }

        return { exercises, total: exercises.length };
    }

    async submitAssessmentAnswer(userId: number, exerciseId: number, isCorrect: boolean) {
        // Buscar el ejercicio para saber su área temática
        const exercise = await this.exerciseRepo.findOne({
            where: { id: exerciseId },
            relations: ['subjectArea'],
        });

        if (!exercise) {
            throw new Error('Exercise not found');
        }

        // Actualizar assessment de esa área
        const assessment = await this.assessmentRepo.findOne({
            where: { userId, subjectAreaId: exercise.subjectAreaId, completed: false },
        });

        if (!assessment) {
            throw new Error('Assessment not found or already completed');
        }

        // Incrementar respuestas correctas si aplica
        if (isCorrect) {
            assessment.correctAnswers += 1;
        }

        // Calcular score (0-10)
        assessment.score = (assessment.correctAnswers / assessment.totalQuestions) * 10;

        // Determinar nivel de dificultad y RtI
        assessment.difficultyLevel = getDifficultyLevelFromScore(assessment.score);
        assessment.rtiLevel = getRtiLevelFromScore((assessment.score / 10) * 100); // Convertir a porcentaje

        // Verificar si terminó todas las preguntas de esta área
        const answeredQuestions = await this.getAnsweredQuestionCount(userId, assessment.subjectAreaId);
        if (answeredQuestions >= assessment.totalQuestions) {
            assessment.completed = true;
            assessment.completedAt = new Date();
        }

        await this.assessmentRepo.save(assessment);

        return {
            correct: isCorrect,
            currentScore: assessment.score,
            completed: assessment.completed,
        };
    }

    async isAssessmentComplete(userId: number): Promise<boolean> {
        const total = await this.assessmentRepo.count({ where: { userId } });
        const completed = await this.assessmentRepo.count({ where: { userId, completed: true } });
        return total > 0 && total === completed;
    }

    async getAssessmentProgress(userId: number) {
        const assessments = await this.assessmentRepo.find({
            where: { userId },
            relations: ['subjectArea'],
        });

        const total = assessments.length * 4; // 4 preguntas por área
        const answered = assessments.reduce((sum, a) => sum + a.correctAnswers + (a.totalQuestions - a.correctAnswers), 0);

        return {
            totalQuestions: total,
            answeredQuestions: answered,
            progressPercentage: (answered / total) * 100,
            completed: await this.isAssessmentComplete(userId),
        };
    }

    async getAssessmentResults(userId: number) {
        const assessments = await this.assessmentRepo.find({
            where: { userId, completed: true },
            relations: ['subjectArea'],
        });

        if (assessments.length === 0) {
            throw new Error('Assessment not completed yet');
        }

        const overallScore = assessments.reduce((sum, a) => sum + a.score, 0) / assessments.length;

        return {
            userId,
            overallScore,
            subjectResults: assessments.map(a => ({
                subjectArea: a.subjectArea.name,
                score: a.score,
                difficultyLevel: a.difficultyLevel,
                rtiLevel: a.rtiLevel,
                recommendedExercises: this.getRecommendedExerciseLevel(a.difficultyLevel),
            })),
            avatarUnlocked: true,
            completedAt: new Date(),
        };
    }

    private async getAnsweredQuestionCount(userId: number, subjectAreaId: number): Promise<number> {
        // Esta es una implementación simplificada
        // En producción, deberías trackear cada respuesta individual
        return 4; // Simulación
    }

    private getRecommendedExerciseLevel(level: DifficultyLevel): string {
        switch (level) {
            case DifficultyLevel.NIVEL_BAJO:
                return 'Ejercicios de nivel básico para reforzar fundamentos';
            case DifficultyLevel.NIVEL_MEDIO_BAJO:
                return 'Ejercicios de nivel medio-bajo con apoyo adicional';
            case DifficultyLevel.NIVEL_MEDIO:
                return 'Ejercicios de nivel medio con progresión gradual';
            case DifficultyLevel.NIVEL_MEDIO_ALTO:
                return 'Ejercicios de nivel medio-alto con desafíos moderados';
            case DifficultyLevel.NIVEL_ALTO:
                return 'Ejercicios avanzados con desafíos complejos';
        }
    }
}
