import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

@Entity('area_progress')
@Index(['userId', 'subjectAreaId'], { unique: true })
export class AreaProgress {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id' })
    @Index()
    userId: number;

    @Column({ name: 'subject_area_id' })
    @Index()
    subjectAreaId: number;

    @Column({ name: 'exercises_attempted', default: 0 })
    exercisesAttempted: number;

    @Column({ name: 'exercises_correct', default: 0 })
    exercisesCorrect: number;

    @Column({ name: 'total_points', default: 0 })
    totalPoints: number;

    @Column({ name: 'current_level', default: 1 })
    currentLevel: number;

    @Column({ type: 'float', name: 'accuracy_percentage', default: 0 })
    accuracyPercentage: number;

    @Column({ name: 'time_spent_minutes', default: 0 })
    timeSpentMinutes: number;

    @Column({ type: 'date', name: 'last_activity_date', nullable: true })
    lastActivityDate: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
