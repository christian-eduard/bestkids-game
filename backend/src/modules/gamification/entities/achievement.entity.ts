import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
} from 'typeorm';

export enum AchievementType {
    BRONZE = 'bronze',
    SILVER = 'silver',
    GOLD = 'gold',
    DIAMOND = 'diamond',
    SPECIAL = 'special',
}

export enum AchievementCategory {
    EXERCISES = 'exercises',
    STREAK = 'streak',
    POINTS = 'points',
    LEVEL = 'level',
    PERFECT = 'perfect',
    SPEED = 'speed',
    EXPLORER = 'explorer',
}

@Entity('achievements')
@Index(['type', 'category'])
export class Achievement {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column()
    icon: string; // Emoji o nombre de icono

    @Column({
        type: 'enum',
        enum: AchievementType,
        default: AchievementType.BRONZE,
    })
    @Index()
    type: AchievementType;

    @Column({
        type: 'enum',
        enum: AchievementCategory,
        default: AchievementCategory.EXERCISES,
    })
    @Index()
    category: AchievementCategory;

    @Column({ name: 'points_reward', default: 50 })
    pointsReward: number;

    @Column({ name: 'requirement_value', default: 1 })
    requirementValue: number; // Valor necesario para desbloquear

    @Column({ name: 'requirement_type', default: 'count' })
    requirementType: string; // 'count', 'streak', 'score', etc.

    @Column({ name: 'is_secret', default: false })
    isSecret: boolean;

    @Column({ name: 'is_active', default: true })
    @Index()
    isActive: boolean;

    @Column({ name: 'sort_order', default: 0 })
    sortOrder: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
