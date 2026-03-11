import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Class } from '../classes/entities/class.entity';
import { ExerciseAttempt } from '../exercises/entities/exercise-attempt.entity';

@Injectable()
export class TeachersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Class)
        private classRepository: Repository<Class>,
        @InjectRepository(ExerciseAttempt)
        private attemptRepository: Repository<ExerciseAttempt>,
    ) { }

    async getMyClasses(teacherId: number) {
        return this.classRepository.find({
            where: { teacherId },
            relations: ['students'],
        });
    }

    async getClassDetails(classId: number, teacherId: number) {
        const classEntity = await this.classRepository.findOne({
            where: { id: classId, teacherId },
            relations: ['students'],
        });

        if (!classEntity) {
            return null;
        }

        // Get students with their RtI tier
        const studentsWithStats = await Promise.all(
            (classEntity.students || []).map(async (student) => {
                const stats = await this.getStudentStats(student.id);
                return {
                    ...student,
                    stats,
                };
            })
        );

        // Group by tier
        const tier1 = studentsWithStats.filter(s => s.stats.rtiTier === 1);
        const tier2 = studentsWithStats.filter(s => s.stats.rtiTier === 2);
        const tier3 = studentsWithStats.filter(s => s.stats.rtiTier === 3);

        return {
            ...classEntity,
            students: studentsWithStats,
            tierDistribution: {
                tier1: tier1.length,
                tier2: tier2.length,
                tier3: tier3.length,
            },
            tier1Students: tier1,
            tier2Students: tier2,
            tier3Students: tier3,
        };
    }

    async getStudentDetails(studentId: number) {
        const student = await this.userRepository.findOne({
            where: { id: studentId, roleId: 5 }, // STUDENT role
        });

        if (!student) {
            return null;
        }

        const stats = await this.getStudentStats(studentId);
        const recentActivity = await this.getStudentRecentActivity(studentId);
        const alerts = await this.getStudentAlerts(studentId, stats);

        return {
            ...student,
            stats,
            recentActivity,
            alerts,
        };
    }

    async getStudentsByTier(teacherId: number, tier: 1 | 2 | 3) {
        const classes = await this.getMyClasses(teacherId);
        const allStudents = classes.flatMap(c => c.students || []);

        const studentsWithTier = await Promise.all(
            allStudents.map(async (student) => {
                const stats = await this.getStudentStats(student.id);
                return { ...student, stats };
            })
        );

        return studentsWithTier.filter(s => s.stats.rtiTier === tier);
    }

    // ============ HELPERS ============

    private async getStudentStats(studentId: number) {
        const attempts = await this.attemptRepository.find({
            where: { userId: studentId },
            order: { createdAt: 'DESC' },
            take: 20,
        });

        if (attempts.length === 0) {
            return {
                totalAttempts: 0,
                correctAttempts: 0,
                successRate: 0,
                rtiTier: 1,
                lastActivity: null as Date | null,
                streak: 0,
            };
        }

        const correctAttempts = attempts.filter(a => a.isCorrect).length;
        const successRate = Math.round((correctAttempts / attempts.length) * 100);

        // Calculate RtI tier
        let rtiTier: 1 | 2 | 3 = 1;
        if (successRate < 40) rtiTier = 3;
        else if (successRate < 60) rtiTier = 2;

        // Calculate streak (consecutive days with activity)
        const streak = this.calculateStreak(attempts);

        return {
            totalAttempts: attempts.length,
            correctAttempts,
            successRate,
            rtiTier,
            lastActivity: attempts[0]?.createdAt || null,
            streak,
        };
    }

    private async getStudentRecentActivity(studentId: number) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const thisWeek = new Date(today);
        thisWeek.setDate(thisWeek.getDate() - 7);

        const todayAttempts = await this.attemptRepository.count({
            where: {
                userId: studentId,
                createdAt: { $gte: today } as any,
            },
        });

        const weekAttempts = await this.attemptRepository.count({
            where: {
                userId: studentId,
                createdAt: { $gte: thisWeek } as any,
            },
        });

        return {
            today: todayAttempts,
            thisWeek: weekAttempts,
        };
    }

    private async getStudentAlerts(studentId: number, stats: any) {
        const alerts: string[] = [];

        // Alert if tier dropped
        if (stats.rtiTier === 2) {
            alerts.push('⚠️ Estudiante en Tier 2 - Necesita apoyo moderado');
        } else if (stats.rtiTier === 3) {
            alerts.push('🚨 Estudiante en Tier 3 - Requiere intervención intensiva');
        }

        // Alert if no recent activity
        if (stats.lastActivity) {
            const daysSinceActivity = Math.floor(
                (Date.now() - new Date(stats.lastActivity).getTime()) / (1000 * 60 * 60 * 24)
            );
            if (daysSinceActivity >= 3) {
                alerts.push(`📅 ${daysSinceActivity} días sin conectar`);
            }
        }

        // Alert if low success rate
        if (stats.successRate < 50) {
            alerts.push(`📉 Tasa de éxito baja (${stats.successRate}%)`);
        }

        return alerts;
    }

    private calculateStreak(attempts: ExerciseAttempt[]): number {
        if (attempts.length === 0) return 0;

        const dates = attempts.map(a => {
            const d = new Date(a.createdAt);
            d.setHours(0, 0, 0, 0);
            return d.getTime();
        });

        const uniqueDates = [...new Set(dates)].sort((a, b) => b - a);

        let streak = 1;
        for (let i = 0; i < uniqueDates.length - 1; i++) {
            const diff = (uniqueDates[i] - uniqueDates[i + 1]) / (1000 * 60 * 60 * 24);
            if (diff === 1) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }

    async getClassPerformanceEvolution(classId: number, teacherId: number) {
        const classEntity = await this.classRepository.findOne({
            where: { id: classId, teacherId },
            relations: ['students'],
        });

        if (!classEntity || !classEntity.students.length) {
            return [];
        }

        const studentIds = classEntity.students.map(s => s.id);

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 14);
        startDate.setHours(0, 0, 0, 0);

        const attempts = await this.attemptRepository.createQueryBuilder('attempt')
            .where('attempt.user_id IN (:...studentIds)', { studentIds })
            .andWhere('attempt.created_at >= :startDate', { startDate })
            .orderBy('attempt.created_at', 'ASC')
            .getMany();

        const dailyData: Record<string, { total: number; correct: number }> = {};

        // Initialize last 14 days
        for (let i = 0; i < 14; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            dailyData[dateStr] = { total: 0, correct: 0 };
        }

        attempts.forEach(attempt => {
            const dateStr = new Date(attempt.createdAt).toISOString().split('T')[0];
            if (dailyData[dateStr]) {
                dailyData[dateStr].total++;
                if (attempt.isCorrect) dailyData[dateStr].correct++;
            }
        });

        return Object.entries(dailyData)
            .map(([date, data]) => ({
                date,
                successRate: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
                totalAttempts: data.total,
            }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }
}
