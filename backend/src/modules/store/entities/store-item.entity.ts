import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum StoreItemType {
    AVATAR_FRAME = 'avatar_frame',
    THEME = 'theme',
    STICKER = 'sticker',
    POWERUP = 'powerup', // e.g. "Double Points for 1 hour"
}

@Entity('store_items')
export class StoreItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({
        type: 'enum',
        enum: StoreItemType,
        default: StoreItemType.STICKER
    })
    type: StoreItemType;

    @Column({ type: 'int' })
    cost: number; // Points required

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ name: 'unlock_level', default: 1 })
    unlockLevel: number;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
