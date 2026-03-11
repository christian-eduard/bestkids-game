import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ExerciseAttempt } from '../progress/entities/exercise-attempt.entity';
import { Assignment } from '../assignments/entities/assignment.entity';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(ExerciseAttempt)
        private attemptsRepository: Repository<ExerciseAttempt>,
        @InjectRepository(Assignment)
        private assignmentsRepository: Repository<Assignment>,
    ) { }

    async getSystemStats() {
        // Users stats
        const totalUsers = await this.usersRepository.count();
        const students = await this.usersRepository.count({ where: { roleId: 1 } });
        const teachers = await this.usersRepository.count({ where: { roleId: 2 } });
        const parents = await this.usersRepository.count({ where: { roleId: 3 } });

        // Activity stats (last 24h)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const activeToday = await this.usersRepository.count({
            where: { lastLoginAt: MoreThanOrEqual(yesterday) }
        });

        // Content stats
        const totalAttempts = await this.attemptsRepository.count();
        const totalAssignments = await this.assignmentsRepository.count();

        return {
            users: {
                total: totalUsers,
                students,
                teachers,
                parents,
                activeToday
            },
            content: {
                totalAttempts,
                totalAssignments
            }
        };
    }

    async getActivityTrend(days: number = 7) {
        // Get attempts count per day for the last X days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const attempts = await this.attemptsRepository.createQueryBuilder('attempt')
            .select("DATE(attempt.createdAt) as date")
            .addSelect("COUNT(*) as count")
            .where("attempt.createdAt >= :startDate", { startDate })
            .groupBy("DATE(attempt.createdAt)")
            .orderBy("date", "ASC")
            .getRawMany();

        // Fill missing days with 0
        const result = [];
        for (let d = 0; d < days; d++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + d);
            const dateStr = date.toISOString().split('T')[0];

            const found = attempts.find(a => {
                // Postgres DATE returns string YYYY-MM-DD or Date object depending on driver config
                // We handle string comparison safely
                const aDate = new Date(a.date).toISOString().split('T')[0];
                return aDate === dateStr;
            });

            result.push({
                date: dateStr,
                count: found ? parseInt(found.count) : 0
            });
        }

        return result;
    }
    async getAdvancedStats() {
        const totalUsers = await this.usersRepository.count();

        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        const activeWeekly = await this.usersRepository.count({
            where: { lastLoginAt: MoreThanOrEqual(weekAgo) }
        });

        // Completion Rate
        const totalAttempts = await this.attemptsRepository.count();
        // Using isCorrect as success indicator
        const successfulAttempts = await this.attemptsRepository.count({ where: { isCorrect: true } });

        // Risk Users (Inactive > 14 days)
        // We need to query users who haven't logged in recently but are not new (created > 14 days ago)
        const riskUsers = await this.usersRepository.createQueryBuilder('user')
            .where('user.lastLoginAt < :twoWeeksAgo', { twoWeeksAgo })
            .andWhere('user.createdAt < :twoWeeksAgo', { twoWeeksAgo })
            .getCount();

        return {
            retentionRate: totalUsers > 0 ? Math.round((activeWeekly / totalUsers) * 100) : 0,
            completionRate: totalAttempts > 0 ? Math.round((successfulAttempts / totalAttempts) * 100) : 0,
            riskUsersCount: riskUsers,
            avgSessionDuration: 18, // Mocked average (minutes) based on legacy data
            activeWeekly
        };
    }
}
