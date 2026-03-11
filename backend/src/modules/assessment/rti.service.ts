import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InitialAssessment } from './entities/initial-assessment.entity';
import { AdaptiveProgress } from './entities/adaptive-progress.entity';
import { RtiLevel } from './enums/rti-level.enum';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RtiService {
    constructor(
        @InjectRepository(InitialAssessment)
        private assessmentRepo: Repository<InitialAssessment>,
        @InjectRepository(AdaptiveProgress)
        private progressRepo: Repository<AdaptiveProgress>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) { }

    async calculateOverallRtiLevel(userId: number): Promise<RtiLevel> {
        // Obtener resultados de evaluación inicial
        const assessments = await this.assessmentRepo.find({
            where: { userId, completed: true },
        });

        if (assessments.length === 0) {
            return RtiLevel.LEVEL_2_SELECTIVE; // Por defecto nivel 2 hasta completar evaluación
        }

        // Calcular promedio de precisión
        const averageAccuracy = assessments.reduce((sum, a) => {
            return sum + ((a.correctAnswers / a.totalQuestions) * 100);
        }, 0) / assessments.length;

        // Determinar nivel RtI basado en precisión promedio
        if (averageAccuracy >= 70) return RtiLevel.LEVEL_1_UNIVERSAL; // Verde
        if (averageAccuracy >= 40) return RtiLevel.LEVEL_2_SELECTIVE; // Amarillo
        return RtiLevel.LEVEL_3_INTENSIVE; // Rojo - requiere intervención

    }

    async getRtiLevelBySubject(userId: number, subjectAreaId: number): Promise<RtiLevel> {
        const assessment = await this.assessmentRepo.findOne({
            where: { userId, subjectAreaId, completed: true },
        });

        if (!assessment) {
            return RtiLevel.LEVEL_2_SELECTIVE;
        }

        return assessment.rtiLevel;
    }

    async getStudentsByRtiLevel(teacherId: number, targetLevel?: RtiLevel) {
        // Obtener estudiantes del docente
        // Esta implementación asume que existe una relación teacher-students
        const query = this.userRepo
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.initialAssessments', 'assessment')
            .where('user.roleId = :roleId', { roleId: 1 }); // Estudiantes

        const students = await query.getMany();

        // Calcular nivel RtI de cada estudiante
        const studentsWithRti = await Promise.all(
            students.map(async (student) => {
                const rtiLevel = await this.calculateOverallRtiLevel(student.id);
                return { ...student, rtiLevel };
            })
        );

        // Filtrar por nivel si se especifica
        if (targetLevel) {
            return studentsWithRti.filter(s => s.rtiLevel === targetLevel);
        }

        return studentsWithRti;
    }

    async generateInterventionPlan(userId: number) {
        const assessments = await this.assessmentRepo.find({
            where: { userId, completed: true },
            relations: ['subjectArea'],
        });

        const rtiLevel = await this.calculateOverallRtiLevel(userId);

        // Identificar áreas de bajo rendimiento
        const weakAreas = assessments
            .filter(a => a.rtiLevel === RtiLevel.LEVEL_3_INTENSIVE)
            .map(a => a.subjectArea.name);

        let recommendedActions = [];

        switch (rtiLevel) {
            case RtiLevel.LEVEL_1_UNIVERSAL:
                recommendedActions = [
                    'Continuar con ejercicios del plan de trabajo regular',
                    'Desafíos adicionales para mantener motivación',
                    'Participación en actividades de enriquecimiento',
                ];
                break;

            case RtiLevel.LEVEL_2_SELECTIVE:
                recommendedActions = [
                    'Intervención en grupo pequeño 2-3 veces por semana',
                    'Ejercicios adicionales en áreas específicas',
                    'Monitoreo semanal de progreso',
                    `Enfoque en: ${weakAreas.join(', ')}`,
                ];
                break;

            case RtiLevel.LEVEL_3_INTENSIVE:
                recommendedActions = [
                    '⚠️ INTERVENCIÓN INTENSIVA REQUERIDA',
                    'Sesiones individuales diarias (15-20 min)',
                    'Plan de intervención personalizado',
                    'Evaluación diagnóstica completa recomendada',
                    `Áreas críticas: ${weakAreas.join(', ')}`,
                    'Comunicación frecuente con padres y especialistas',
                ];
                break;
        }

        return {
            userId,
            rtiLevel,
            weakAreas,
            recommendedActions,
            nextReviewDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 semanas
        };
    }
}
