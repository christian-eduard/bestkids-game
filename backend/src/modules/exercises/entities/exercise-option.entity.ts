import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exercise } from './exercise.entity';

@Entity('exercise_options')
export class ExerciseOption {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'exercise_id' })
    exerciseId: number;

    @ManyToOne(() => Exercise, (exercise) => exercise.options)
    @JoinColumn({ name: 'exercise_id' })
    exercise: Exercise;

    @Column({ type: 'text' })
    content: string; // Texto o URL de imagen

    @Column({ name: 'is_image', default: false })
    isImage: boolean;

    @Column({ name: 'is_correct', default: false })
    isCorrect: boolean;

    @Column({ name: 'order_index', default: 0 })
    orderIndex: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
