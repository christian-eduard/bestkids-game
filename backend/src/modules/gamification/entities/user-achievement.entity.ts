import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Achievement } from './achievement.entity';

@Entity('user_achievements')
@Index(['userId', 'achievementId'], { unique: true })
export class UserAchievement {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id' })
    @Index()
    userId: number;

    @Column({ name: 'achievement_id' })
    @Index()
    achievementId: number;

    @ManyToOne(() => Achievement)
    @JoinColumn({ name: 'achievement_id' })
    achievement: Achievement;

    @Column({ name: 'unlocked_at' })
    unlockedAt: Date;

    @Column({ name: 'progress_current', default: 0 })
    progressCurrent: number;

    @Column({ name: 'progress_target', default: 1 })
    progressTarget: number;

    @Column({ name: 'is_claimed', default: false })
    isClaimed: boolean; // Si el usuario ha reclamado la recompensa

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
