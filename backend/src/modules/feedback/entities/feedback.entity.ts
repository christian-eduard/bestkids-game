import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('feedback')
export class Feedback {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    message: string;

    @Column({ length: 50, default: 'sugerencia' })
    category: string;

    @Column({ length: 255, nullable: true })
    page: string;

    @Column({ name: 'user_agent', type: 'text', nullable: true })
    userAgent: string;

    @Column({ name: 'user_id', nullable: true })
    userId: number;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'text', nullable: true })
    screenshot: string;

    @Column({ name: 'is_read', default: false })
    isRead: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
