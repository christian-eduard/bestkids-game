import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('gamification_profiles')
export class GamificationProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id', unique: true })
    @Index()
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'total_points', default: 0 })
    @Index()
    totalPoints: number;

    @Column({ name: 'current_level', default: 1 })
    @Index()
    currentLevel: number;

    @Column({ name: 'experience_points', default: 0 })
    experiencePoints: number;

    @Column({ name: 'daily_points', default: 0 })
    dailyPoints: number;

    @Column({ name: 'weekly_points', default: 0 })
    weeklyPoints: number;

    @Column({ name: 'monthly_points', default: 0 })
    monthlyPoints: number;

    @Column({ name: 'current_streak_days', default: 0 })
    currentStreakDays: number;

    @Column({ name: 'longest_streak_days', default: 0 })
    longestStreakDays: number;

    @Column({ name: 'exercises_completed', default: 0 })
    exercisesCompleted: number;

    @Column({ name: 'exercises_correct', default: 0 })
    exercisesCorrect: number;

    @Column({ name: 'perfect_scores', default: 0 })
    perfectScores: number;

    @Column({ name: 'coins', default: 0 })
    coins: number;

    @Column({ name: 'selected_avatar_id', nullable: true })
    selectedAvatarId: number;

    @Column({ type: 'date', name: 'last_activity_date', nullable: true })
    @Index()
    lastActivityDate: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Computed properties
    get dailyGoal(): number {
        return 500;
    }

    get dailyProgress(): number {
        return Math.min((this.dailyPoints / this.dailyGoal) * 100, 100);
    }

    get pointsForNextLevel(): number {
        return this.currentLevel * 1000;
    }

    get levelProgress(): number {
        return (this.experiencePoints / this.pointsForNextLevel) * 100;
    }

    get accuracy(): number {
        if (this.exercisesCompleted === 0) return 0;
        return Math.round((this.exercisesCorrect / this.exercisesCompleted) * 100);
    }
}
