import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ResourceType {
    IMAGE = 'image',
    VIDEO = 'video',
    LINK = 'link',
    FILE = 'file',
}

@Entity('resources')
export class Resource {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({
        type: 'enum',
        enum: ResourceType,
        default: ResourceType.IMAGE,
    })
    type: ResourceType;

    @Column()
    url: string; // Path or external URL

    @Column({ nullable: true })
    category: string;

    @Column({ type: 'jsonb', nullable: true })
    metadata: any; // e.g., size, resolution, duration

    @Column({ name: 'created_by' })
    createdBy: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by' })
    creator: User;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
