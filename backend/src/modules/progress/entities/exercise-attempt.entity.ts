import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
} from 'typeorm';

@Entity('exercise_attempts')
@Index(['userId', 'exerciseId'])
export class ExerciseAttempt {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id' })
    @Index()
    userId: number;

    @Column({ name: 'exercise_id' })
    @Index()
    exerciseId: number;

    @Column({ type: 'jsonb', name: 'user_answer' })
    userAnswer: any;

    @Column({ name: 'is_correct', default: false })
    isCorrect: boolean;

    @Column({ name: 'points_earned', default: 0 })
    pointsEarned: number;

    @Column({ name: 'time_taken_seconds', nullable: true })
    timeTakenSeconds: number;

    @Column({ name: 'attempt_number', default: 1 })
    attemptNumber: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
