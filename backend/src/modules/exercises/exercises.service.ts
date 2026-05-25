import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Exercise, ExerciseType } from './entities/exercise.entity';
import { Unit } from './entities/unit.entity';
import { UserExerciseResult } from './entities/user-exercise-result.entity';
import { GamificationService } from '../gamification/gamification.service';
import { SubjectArea } from './entities/subject-area.entity';

@Injectable()
export class ExercisesService {
    constructor(
        @InjectRepository(Exercise)
        private exerciseRepository: Repository<Exercise>,
        @InjectRepository(Unit)
        private unitRepository: Repository<Unit>,
        @InjectRepository(UserExerciseResult)
        private resultRepository: Repository<UserExerciseResult>,
        @InjectRepository(SubjectArea)
        private subjectAreaRepository: Repository<SubjectArea>,
        private gamificationService: GamificationService,
    ) { }

    async getUnitsByWorld(worldId: number) {
        return this.unitRepository.find({
            where: { worldId, isActive: true },
            order: { orderIndex: 'ASC' },
            relations: ['exercises']
        });
    }

    async getExercisesByUnit(unitId: number, userId: number) {
        // 1. Dificultad adaptativa
        const recommendedDifficulty = await this.getUserAdaptiveDifficulty(userId, unitId);

        // 2. Obtener ejercicios filtrados
        const exercises = await this.exerciseRepository.find({
            where: { unitId, difficulty: recommendedDifficulty, isActive: true },
            order: { order: 'ASC' }
        });

        // 3. Progreso del usuario en esta unidad
        const results = await this.resultRepository.find({
            where: { userId, unitId },
            select: ['id', 'isCorrect', 'xpEarned']
        });

        const completed = results.length;
        const correct = results.filter(r => r.isCorrect).length;
        const totalXp = results.reduce((sum, r) => sum + r.xpEarned, 0);

        return {
            exercises,
            recommendedDifficulty,
            userProgress: {
                completed,
                correct,
                totalXp
            }
        };
    }

    async getUserAdaptiveDifficulty(userId: number, unitId: number): Promise<number> {
        const recentResults = await this.resultRepository.find({
            where: { userId, unitId },
            order: { createdAt: 'DESC' },
            take: 3,
            relations: ['exercise']
        });

        if (recentResults.length < 3) return 1;

        const lastDifficulty = recentResults[0].exercise?.difficulty || 1;
        const allCorrect = recentResults.every(r => r.isCorrect);
        const allIncorrect = recentResults.every(r => !r.isCorrect);

        if (allCorrect && lastDifficulty < 3) return lastDifficulty + 1;
        if (allIncorrect && lastDifficulty > 1) return lastDifficulty - 1;

        return lastDifficulty;
    }

    async submitAnswer(userId: number, exerciseId: number, userAnswer: any, responseTimeMs: number) {
        const exercise = await this.exerciseRepository.findOne({
            where: { id: exerciseId }
        });

        if (!exercise) throw new NotFoundException('Ejercicio no encontrado');

        const isCorrect = this.validateAnswer(exercise, userAnswer);

        // Puntos base = dificultad * 10
        let xpEarned = isCorrect ? (exercise.difficulty * 10) : 0;

        // Bonus velocidad (< 5 seg)
        if (isCorrect && responseTimeMs < 5000) {
            xpEarned += 5;
        }

        if (xpEarned > 0) {
            await this.gamificationService.addPoints(userId, xpEarned);
            await this.gamificationService.addCoins(userId, exercise.difficulty * 5);
        }

        const previousAttempts = await this.resultRepository.count({ where: { userId, exerciseId } });

        const result = this.resultRepository.create({
            userId,
            exerciseId,
            unitId: exercise.unitId,
            isCorrect,
            responseTimeMs,
            userAnswer,
            attemptNumber: previousAttempts + 1,
            xpEarned
        });

        await this.resultRepository.save(result);

        return {
            isCorrect,
            xpEarned,
            feedback: isCorrect ? '¡Excelente trabajo!' : '¡Vuelve a intentarlo!',
            correctAnswer: this.getCorrectAnswerFeedback(exercise)
        };
    }

    private validateAnswer(exercise: Exercise, answer: any): boolean {
        const { type, content } = exercise;

        switch (type) {
            case ExerciseType.SEÑALAR_IMAGEN: {
                const correctIds = content.options.filter((o: any) => o.isCorrect).map((o: any) => o.id);
                if (content.multipleCorrect) {
                    return Array.isArray(answer) &&
                        answer.length === correctIds.length &&
                        answer.every(id => correctIds.includes(id));
                }
                return answer === correctIds[0];
            }

            case ExerciseType.OPCION_MULTIPLE: {
                const correctId = content.options.find((o: any) => o.isCorrect)?.id;
                return answer === correctId;
            }

            case ExerciseType.VERDADERO_FALSO:
                return answer === content.correctAnswer;

            case ExerciseType.ARRASTRAR_SILABAS:
                return JSON.stringify(answer) === JSON.stringify(content.items.map((i: any) => i.word));

            case ExerciseType.UNIR_LINEAS: {
                const pairs = answer as Array<[string, string]>;
                return pairs.length === content.correctPairs.length &&
                    pairs.every(p => content.correctPairs.some((cp: any) => cp[0] === p[0] && cp[1] === p[1]));
            }

            case ExerciseType.CLASIFICAR_GRUPOS: {
                const assignments = answer as Array<{ itemId: string, groupId: string }>;
                return assignments.every((a: any) => {
                    const item = content.items.find((i: any) => i.id === a.itemId);
                    return item && item.correctGroupId === a.groupId;
                });
            }

            case ExerciseType.PINTAR: {
                const assignments = answer as Array<{ itemId: string, color: string }>;
                return assignments.every((a: any) => {
                    const pair = content.correctPairs.find((p: any) => p.itemId === a.itemId);
                    return pair && pair.color === a.color;
                });
            }

            case ExerciseType.TECLADO_VIRTUAL:
                return String(answer).toLowerCase().trim() === String(content.correctSyllable).toLowerCase().trim();

            case ExerciseType.AUDIO_SELECCION: {
                const correctIds = content.options.filter((o: any) => o.isCorrect).map((o: any) => o.id);
                if (content.multipleCorrect) {
                    return Array.isArray(answer) &&
                        answer.length === correctIds.length &&
                        answer.every(id => correctIds.includes(id));
                }
                return answer === correctIds[0];
            }

            case ExerciseType.COMPLETAR_HUECOS: {
                const answers = answer as Record<string, string>;
                return content.gaps.every((g: any) =>
                    answers[g.id]?.toLowerCase().trim() === g.correctAnswer.toLowerCase().trim()
                );
            }

            default:
                return false;
        }
    }

    private getCorrectAnswerFeedback(exercise: Exercise): any {
        // En producción retornaríamos una representación amigable de la respuesta correcta
        return null;
    }

    async createUnit(data: Partial<Unit>) {
        const unit = this.unitRepository.create(data);
        return this.unitRepository.save(unit);
    }

    async createExercise(data: Partial<Exercise>) {
        const exercise = this.exerciseRepository.create(data);
        return this.exerciseRepository.save(exercise);
    }

    async getExercisesRaw(unitId: number) {
        return this.exerciseRepository.find({
            where: { unitId },
            order: { order: 'ASC', createdAt: 'ASC' }
        });
    }

    async updateUnit(id: number, data: Partial<Unit>) {
        await this.unitRepository.update(id, data);
        return this.unitRepository.findOne({ where: { id } });
    }

    async deleteUnit(id: number) {
        // Manually cascade delete results and exercises to avoid foreign key errors
        await this.resultRepository.delete({ unitId: id });
        await this.exerciseRepository.delete({ unitId: id });
        return this.unitRepository.delete(id);
    }

    async updateExercise(id: number, data: Partial<Exercise>) {
        await this.exerciseRepository.update(id, data);
        return this.exerciseRepository.findOne({ where: { id } });
    }

    async deleteExercise(id: number) {
        // Drop related results first
        await this.resultRepository.delete({ exerciseId: id });
        return this.exerciseRepository.delete(id);
    }

    async findOne(id: number) {
        return this.exerciseRepository.findOne({ where: { id } });
    }

    async duplicateExercise(id: number) {
        const original = await this.exerciseRepository.findOne({ where: { id } });
        if (!original) throw new NotFoundException('Ejercicio no encontrado');

        const { id: _id, createdAt, updatedAt, ...data } = original as any;
        const duplicate = this.exerciseRepository.create({
            ...data,
            instruction: `${original.instruction || ''} (Copia)`.trim(),
        });
        return this.exerciseRepository.save(duplicate);
    }

    async getUserStats(userId: number) {
        const stats = await this.resultRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' }
        });
        return stats;
    }

    async getSubjectAreas() {
        return this.subjectAreaRepository.find({
            where: { isActive: true },
            order: { orderIndex: 'ASC' }
        });
    }
}
