import { Injectable } from '@nestjs/common';

export enum RtiTier {
    TIER_1 = 1, // 80-100% - Sin intervención, progreso normal
    TIER_2 = 2, // 50-79% - Intervención moderada
    TIER_3 = 3, // 0-49% - Intervención intensiva
}

export interface RtiClassification {
    tier: RtiTier;
    tierLabel: string;
    tierColor: string;
    successRate: number;
    recommendation: string;
    interventionNeeded: boolean;
    lastUpdated: Date;
}

export interface StudentMetrics {
    totalExercises: number;
    correctExercises: number;
    avgTimePerExercise: number;
    consecutiveFailures: number;
    lastActivityDate: Date;
    weeklyProgress: number; // % change from last week
}

@Injectable()
export class RtiClassificationService {
    // Umbrales de clasificación
    private readonly TIER_1_THRESHOLD = 0.80; // 80%+ = Tier 1
    private readonly TIER_2_THRESHOLD = 0.50; // 50-79% = Tier 2
    // < 50% = Tier 3

    // Factores adicionales
    private readonly CONSECUTIVE_FAILURES_WEIGHT = 0.1;
    private readonly INACTIVITY_DAYS_THRESHOLD = 7;

    /**
     * Clasifica a un estudiante en un Tier RtI
     */
    classifyStudent(metrics: StudentMetrics): RtiClassification {
        // Calcular tasa de éxito base
        const successRate = metrics.totalExercises > 0
            ? metrics.correctExercises / metrics.totalExercises
            : 0;

        // Ajustar por fallos consecutivos (penalización)
        const consecutiveFailurePenalty = Math.min(
            metrics.consecutiveFailures * this.CONSECUTIVE_FAILURES_WEIGHT,
            0.2
        );
        const adjustedSuccessRate = Math.max(0, successRate - consecutiveFailurePenalty);

        // Determinar tier
        let tier: RtiTier;
        let tierLabel: string;
        let tierColor: string;
        let recommendation: string;

        if (adjustedSuccessRate >= this.TIER_1_THRESHOLD) {
            tier = RtiTier.TIER_1;
            tierLabel = 'Nivel 1 - Excelente';
            tierColor = '#22c55e'; // green
            recommendation = 'Progreso excelente. Continuar con ejercicios del nivel actual o avanzar.';
        } else if (adjustedSuccessRate >= this.TIER_2_THRESHOLD) {
            tier = RtiTier.TIER_2;
            tierLabel = 'Nivel 2 - Necesita Apoyo';
            tierColor = '#f59e0b'; // yellow/amber
            recommendation = 'Se recomienda práctica adicional y ejercicios de refuerzo.';
        } else {
            tier = RtiTier.TIER_3;
            tierLabel = 'Nivel 3 - Intervención Intensiva';
            tierColor = '#ef4444'; // red
            recommendation = 'Se requiere atención individualizada y ejercicios básicos de refuerzo.';
        }

        // Verificar inactividad
        const daysSinceLastActivity = this.getDaysSince(metrics.lastActivityDate);
        if (daysSinceLastActivity > this.INACTIVITY_DAYS_THRESHOLD && tier === RtiTier.TIER_1) {
            // Degradar si hay mucha inactividad
            tier = RtiTier.TIER_2;
            tierLabel = 'Nivel 2 - Inactivo';
            tierColor = '#f59e0b';
            recommendation = 'El estudiante ha estado inactivo. Se recomienda retomar la práctica.';
        }

        return {
            tier,
            tierLabel,
            tierColor,
            successRate: Math.round(adjustedSuccessRate * 100),
            recommendation,
            interventionNeeded: tier >= RtiTier.TIER_2,
            lastUpdated: new Date(),
        };
    }

    /**
     * Genera recomendaciones de intervención basadas en el tier
     */
    getInterventionPlan(tier: RtiTier): string[] {
        switch (tier) {
            case RtiTier.TIER_1:
                return [
                    'Continuar con el currículo regular',
                    'Ofrecer ejercicios de enriquecimiento opcionales',
                    'Permitir avanzar a temas más desafiantes',
                ];

            case RtiTier.TIER_2:
                return [
                    'Asignar ejercicios adicionales de refuerzo (2-3 por semana)',
                    'Reducir temporalmente la dificultad de los ejercicios',
                    'Notificar a los padres sobre el progreso',
                    'Revisar conceptos básicos que puedan estar fallando',
                    'Considerar tutorías en pequeño grupo',
                ];

            case RtiTier.TIER_3:
                return [
                    'Intervención individualizada urgente',
                    'Reunión con padres y tutor',
                    'Evaluación diagnóstica para identificar lagunas',
                    'Ejercicios personalizados en nivel más básico',
                    'Seguimiento diario por parte del docente',
                    'Considerar apoyo especializado',
                ];

            default:
                return [];
        }
    }

    /**
     * Calcula los días desde una fecha
     */
    private getDaysSince(date: Date): number {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    /**
     * Obtiene el color CSS para un tier
     */
    getTierColor(tier: RtiTier): string {
        switch (tier) {
            case RtiTier.TIER_1:
                return 'bg-green-100 text-green-800 border-green-300';
            case RtiTier.TIER_2:
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case RtiTier.TIER_3:
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    }

    /**
     * Obtiene el emoji para un tier
     */
    getTierEmoji(tier: RtiTier): string {
        switch (tier) {
            case RtiTier.TIER_1:
                return '🌟';
            case RtiTier.TIER_2:
                return '⚠️';
            case RtiTier.TIER_3:
                return '🚨';
            default:
                return '❓';
        }
    }
}
