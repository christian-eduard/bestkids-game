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
        const existing = await this.isAssessmentComplete(userId);
        if (existing) throw new Error('Initial assessment already completed');

        const subjectAreas = await this.subjectAreaRepo.find();
        const assessments = [];
        for (const area of subjectAreas) {
            const assessment = this.assessmentRepo.create({
                userId,
                subjectAreaId: area.id,
                totalQuestions: 4,
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

        const exercises: Exercise[] = [];
        for (const assessment of assessments) {
            // Buscamos ejercicios de nivel medio (2) para el diagnóstico
            const areaExercises = await this.exerciseRepo.find({
                where: { difficulty: 2 },
                take: 4,
            });
            exercises.push(...areaExercises);
        }

        return { exercises, total: exercises.length };
    }

    async submitAssessmentAnswer(userId: number, exerciseId: number, isCorrect: boolean) {
        const exercise = await this.exerciseRepo.findOne({
            where: { id: exerciseId },
            relations: ['unit', 'unit.world']
        });

        if (!exercise) throw new Error('Exercise not found');

        // Nota: El assessment inicial era por SubjectArea, mantengo compatibilidad básica
        // Aunque la nueva arquitectura usa Worlds/Units.
        const assessment = await this.assessmentRepo.findOne({
            where: { userId, completed: false },
        });

        if (!assessment) throw new Error('Assessment not found or already completed');

        if (isCorrect) assessment.correctAnswers += 1;
        assessment.score = (assessment.correctAnswers / assessment.totalQuestions) * 10;

        // Simulación: terminamos tras X preguntas
        assessment.completed = assessment.correctAnswers >= assessment.totalQuestions;
        if (assessment.completed) assessment.completedAt = new Date();

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
        const assessments = await this.assessmentRepo.find({ where: { userId } });
        const total = assessments.length * 4;
        const answered = assessments.reduce((sum, a) => sum + a.correctAnswers, 0);

        return {
            totalQuestions: total,
            answeredQuestions: answered,
            progressPercentage: total > 0 ? (answered / total) * 100 : 0,
            completed: await this.isAssessmentComplete(userId),
        };
    }

    async getAssessmentResults(userId: number) {
        const assessments = await this.assessmentRepo.find({
            where: { userId, completed: true },
        });

        if (assessments.length === 0) throw new Error('Assessment not completed yet');

        const overallScore = assessments.reduce((sum, a) => sum + a.score, 0) / assessments.length;

        return {
            userId,
            overallScore,
            completedAt: new Date(),
        };
    }
}
