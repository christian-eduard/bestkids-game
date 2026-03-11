import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Exercise } from '../../exercises/entities/exercise.entity';

@Entity('exercise_attempts')
@Index(['userId', 'exerciseId'])
@Index(['userId', 'createdAt'])
export class ExerciseAttempt {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id' })
    @Index()
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'exercise_id' })
    @Index()
    exerciseId: number;

    @ManyToOne(() => Exercise)
    @JoinColumn({ name: 'exercise_id' })
    exercise: Exercise;

    @Column({ name: 'is_correct' })
    isCorrect: boolean;

    @Column({ name: 'time_spent_seconds', nullable: true })
    timeSpentSeconds: number;

    @Column({ type: 'jsonb', name: 'user_answer', nullable: true })
    userAnswer: any;

    @Column({ name: 'points_earned', default: 0 })
    pointsEarned: number;

    @Column({ name: 'difficulty_level', length: 20, default: 'easy' })
    difficultyLevel: string;

    @Column({ name: 'attempt_number', default: 1 })
    attemptNumber: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
