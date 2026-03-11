import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { StoreItem } from './store-item.entity';

@Entity('user_inventory')
export class UserInventory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id' })
    userId: number;

    @Column({ name: 'item_id' })
    itemId: number;

    @Column({ name: 'is_equipped', default: false })
    isEquipped: boolean;

    @CreateDateColumn({ name: 'acquired_at' })
    acquiredAt: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => StoreItem)
    @JoinColumn({ name: 'item_id' })
    item: StoreItem;
}
