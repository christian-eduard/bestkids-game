import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Unique
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('student_tutors')
@Unique(['studentId', 'tutorId'])
export class StudentTutor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'student_id' })
    studentId: number;

    @Column({ name: 'tutor_id' })
    tutorId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'student_id' })
    student: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'tutor_id' })
    tutor: User;

    @CreateDateColumn({ name: 'assigned_at' })
    assignedAt: Date;
}
