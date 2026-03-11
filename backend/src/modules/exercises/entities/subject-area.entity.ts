import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

@Entity('subject_areas')
export class SubjectArea {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string; // 'Matemáticas', 'Lengua', 'Ciencias', 'Historia'

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column()
    icon: string; // 'calculator', 'book', 'flask', 'landmark'

    @Column({ name: 'color_hex' })
    colorHex: string; // '#FF6B6B', '#4ECDC4', etc.

    @Column({ name: 'order_index', default: 0 })
    orderIndex: number;

    @Column({ name: 'is_active', default: true })
    @Index()
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
