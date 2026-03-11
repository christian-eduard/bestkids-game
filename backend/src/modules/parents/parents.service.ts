import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ExerciseAttempt } from '../exercises/entities/exercise-attempt.entity';

@Injectable()
export class ParentsService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(ExerciseAttempt)
        private attemptRepository: Repository<ExerciseAttempt>,
    ) { }

    async linkChild(parentId: number, studentCode: string) {
        const student = await this.userRepository.findOne({
            where: { studentCode, roleId: 5 }, // Ensure it's a student
        });

        if (!student) {
            throw new Error('Student not found with this code');
        }

        if (student.parentId && student.parentId !== parentId) {
            throw new Error('Student is already linked to another parent');
        }

        student.parentId = parentId;
        return this.userRepository.save(student);
    }

    async getMyChildren(parentId: number) {
        return this.userRepository.find({
            where: { parentId, roleId: 5 }, // STUDENT role
        });
    }

    async getChildProgress(childId: number) {
        const child = await this.userRepository.findOne({
            where: { id: childId, roleId: 5 },
        });

        if (!child) {
            return null;
        }

        const weeklyStats = await this.getWeeklyStats(childId);
        const subjectProgress = await this.getSubjectProgress(childId);
        const recentAchievements = await this.getRecentAchievements(childId);

        return {
            child,
            weeklyStats,
            subjectProgress,
            recentAchievements,
        };
    }

    private async getWeeklyStats(childId: number) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const weekAttempts = await this.attemptRepository.find({
            where: {
                userId: childId,
                createdAt: { $gte: oneWeekAgo } as any,
            },
        });

        const correctAttempts = weekAttempts.filter(a => a.isCorrect).length;
        const totalPoints = weekAttempts.reduce((sum, a) => sum + a.pointsEarned, 0);
        const totalTime = weekAttempts.reduce((sum, a) => sum + (a.timeSpentSeconds || 0), 0);

        // Calculate streak
        const streak = this.calculateStreak(weekAttempts);

        return {
            exercisesCompleted: weekAttempts.length,
            pointsEarned: totalPoints,
            studyTime: Math.round(totalTime / 60), // minutes
            streak,
            successRate: weekAttempts.length > 0
                ? Math.round((correctAttempts / weekAttempts.length) * 100)
                : 0,
        };
    }

    private async getSubjectProgress(childId: number) {
        // Get all attempts grouped by subject
        const attempts = await this.attemptRepository
            .createQueryBuilder('attempt')
            .leftJoin('attempt.exercise', 'exercise')
            .leftJoin('exercise.subjectArea', 'subject')
            .select('subject.name', 'subjectName')
            .addSelect('COUNT(*)', 'total')
            .addSelect('SUM(CASE WHEN attempt.isCorrect THEN 1 ELSE 0 END)', 'correct')
            .where('attempt.userId = :childId', { childId })
            .groupBy('subject.name')
            .getRawMany();

        return attempts.map(a => ({
            subject: a.subjectName,
            progress: Math.round((parseInt(a.correct) / parseInt(a.total)) * 100),
            total: parseInt(a.total),
        }));
    }

    private async getRecentAchievements(childId: number) {
        // TODO: Get from achievements table when implemented
        return [
            { name: '10 días de racha', date: new Date(), icon: '🔥' },
            { name: 'Maestro de sumas', date: new Date(), icon: '⭐' },
        ];
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
}
