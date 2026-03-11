import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Exercise } from './exercise.entity';
import { Unit } from './unit.entity';

@Entity('user_exercise_results')
@Index(['userId', 'exerciseId'])
export class UserExerciseResult {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id' })
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'exercise_id' })
    exerciseId: number;

    @ManyToOne(() => Exercise)
    @JoinColumn({ name: 'exercise_id' })
    exercise: Exercise;

    @Column({ name: 'unit_id', nullable: true })
    @Index()
    unitId: number;

    @ManyToOne(() => Unit)
    @JoinColumn({ name: 'unit_id' })
    unit: Unit;

    @Column({ name: 'is_correct' })
    isCorrect: boolean;

    @Column({ name: 'response_time_ms' })
    responseTimeMs: number;

    @Column({ name: 'attempt_number', default: 1 })
    attemptNumber: number;

    @Column({ type: 'jsonb', name: 'user_answer', nullable: true })
    userAnswer: any;

    @Column({ name: 'xp_earned', default: 0 })
    xpEarned: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
