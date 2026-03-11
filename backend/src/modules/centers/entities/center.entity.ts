import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('centers')
export class Center {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @Index()
    code: string;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ nullable: true })
    city: string;

    @Column({ name: 'postal_code', nullable: true })
    postalCode: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    email: string;

    @Column({ name: 'director_name', nullable: true })
    directorName: string;

    @Column({ name: 'logo_url', nullable: true })
    logoUrl: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relations
    @OneToMany(() => User, (user) => user.center)
    users: User[];
}
