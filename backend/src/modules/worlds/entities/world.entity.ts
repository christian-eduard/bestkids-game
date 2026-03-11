import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index,
} from 'typeorm';
import { WorldLevel } from './world-level.entity';

@Entity('worlds')
export class World {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ nullable: true })
    icon: string;

    @Column({ name: 'background_image', nullable: true })
    backgroundImage: string;

    @Column({ name: 'color_theme', default: '#4A90E2' })
    colorTheme: string;

    @Column({ name: 'order_index', default: 0 })
    @Index()
    orderIndex: number;

    @Column({ name: 'points_to_unlock', default: 0 })
    pointsToUnlock: number;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @Column({ name: 'subject_area_id', nullable: true })
    @Index()
    subjectAreaId: number;

    @OneToMany(() => WorldLevel, (level) => level.world)
    levels: WorldLevel[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
