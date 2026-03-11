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
import { Exercise } from '../../exercises/entities/exercise.entity';
import { Class } from '../../classes/entities/class.entity';

export enum AssignmentStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    OVERDUE = 'overdue',
}

@Entity('assignments')
@Index(['studentId', 'status'])
@Index(['teacherId', 'createdAt'])
export class Assignment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'teacher_id' })
    @Index()
    teacherId: number;

    @Column({ name: 'student_id' })
    @Index()
    studentId: number;

    @Column({ name: 'exercise_id' })
    exerciseId: number;

    @Column({ name: 'class_id', nullable: true })
    @Index()
    classId: number;

    @Column({ nullable: true })
    title: string;

    @Column({ type: 'text', nullable: true })
    instructions: string;

    @Column({
        type: 'enum',
        enum: AssignmentStatus,
        default: AssignmentStatus.PENDING,
    })
    @Index()
    status: AssignmentStatus;

    @Column({ type: 'timestamp', name: 'due_date', nullable: true })
    dueDate: Date;

    @Column({ type: 'timestamp', name: 'started_at', nullable: true })
    startedAt: Date;

    @Column({ type: 'timestamp', name: 'completed_at', nullable: true })
    completedAt: Date;

    @Column({ type: 'int', nullable: true })
    score: number;

    @Column({ type: 'int', name: 'time_spent_seconds', nullable: true })
    timeSpentSeconds: number;

    @Column({ type: 'int', nullable: true })
    attempts: number;

    @Column({ type: 'jsonb', name: 'student_answer', nullable: true })
    studentAnswer: any;

    @Column({ type: 'text', nullable: true })
    feedback: string;

    @Column({ name: 'is_graded', default: false })
    isGraded: boolean;

    @Column({ name: 'points_awarded', type: 'int', nullable: true })
    pointsAwarded: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'teacher_id' })
    teacher: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'student_id' })
    student: User;

    @ManyToOne(() => Exercise)
    @JoinColumn({ name: 'exercise_id' })
    exercise: Exercise;

    @ManyToOne(() => Class)
    @JoinColumn({ name: 'class_id' })
    class: Class;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
