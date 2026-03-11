import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('mentoring_sessions')
export class MentoringSession {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'tutor_id' })
    tutorId: number;

    @Column({ name: 'student_id' })
    studentId: number;

    @Column({ type: 'timestamp' })
    scheduledAt: Date;

    @Column({ default: 'scheduled' })
    status: string; // scheduled, completed, cancelled

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ nullable: true })
    meetingLink: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'tutor_id' })
    tutor: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'student_id' })
    student: User;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
