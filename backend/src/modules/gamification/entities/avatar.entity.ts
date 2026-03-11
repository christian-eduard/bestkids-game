import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
} from 'typeorm';

@Entity('avatars')
export class Avatar {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    emoji: string; // '🦁', '🐼', '🦊', '🐰', '🐻', '🦄', '🐉', '🦅', '🐬', '🐱'

    @Column({ name: 'image_url', nullable: true })
    imageUrl: string;

    @Column({ name: 'unlock_points_required', default: 0 })
    unlockPointsRequired: number;

    @Column({ name: 'unlock_level_required', default: 1 })
    unlockLevelRequired: number;

    @Column({ default: 0 })
    price: number;

    @Column({ nullable: true })
    collection: string;

    @Column({ nullable: true })
    rarity: string;

    @Column({ name: 'is_default', default: false })
    @Index()
    isDefault: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
