import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { WorldLevel } from './world-level.entity';

@Entity('user_level_progress')
export class UserLevelProgress {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id' })
    @Index()
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'level_id' })
    @Index()
    levelId: number;

    @ManyToOne(() => WorldLevel)
    @JoinColumn({ name: 'level_id' })
    level: WorldLevel;

    @Column({ name: 'is_completed', default: false })
    isCompleted: boolean;

    @Column({ name: 'stars_earned', default: 0 })
    starsEarned: number;

    @Column({ name: 'exercises_completed', default: 0 })
    exercisesCompleted: number;

    @Column({ name: 'total_exercises', default: 0 })
    totalExercises: number;

    @Column({ name: 'is_unlocked', default: false })
    isUnlocked: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
