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

@Entity('messages')
@Index(['recipientId', 'isRead', 'createdAt'])
@Index(['senderId', 'createdAt'])
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'sender_id' })
    @Index()
    senderId: number;

    @Column({ name: 'recipient_id' })
    @Index()
    recipientId: number;

    @Column()
    subject: string;

    @Column({ type: 'text' })
    content: string;

    @Column({ name: 'is_read', default: false })
    @Index()
    isRead: boolean;

    @Column({ name: 'read_at', type: 'timestamp', nullable: true })
    readAt: Date;

    @Column({ name: 'parent_message_id', nullable: true })
    parentMessageId: number | null;

    @Column({ name: 'is_deleted_by_sender', default: false })
    isDeletedBySender: boolean;

    @Column({ name: 'is_deleted_by_recipient', default: false })
    isDeletedByRecipient: boolean;

    @Column({ name: 'is_announcement', default: false })
    isAnnouncement: boolean;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'sender_id' })
    sender: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'recipient_id' })
    recipient: User;

    @ManyToOne(() => Message, { nullable: true })
    @JoinColumn({ name: 'parent_message_id' })
    parentMessage: Message;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
