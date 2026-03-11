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

export enum ReportReason {
    OFFENSIVE_CONTENT = 'offensive_content',
    HARASSMENT = 'harassment',
    SPAM = 'spam',
    OTHER = 'other'
}

@Entity('moderation_reports')
export class ModerationReport {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'reporter_id' })
    reporterId: number;

    @Column({ name: 'reported_user_id', nullable: true })
    reportedUserId: number;

    @Column({
        type: 'enum',
        enum: ReportReason,
    })
    reason: ReportReason;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'content_ref', nullable: true })
    contentReference: string; // e.g., "message_123"

    @Column({ default: 'pending' })
    status: string; // pending, resolved, dismissed

    @ManyToOne(() => User)
    @JoinColumn({ name: 'reporter_id' })
    reporter: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'reported_user_id' })
    reportedUser: User;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
