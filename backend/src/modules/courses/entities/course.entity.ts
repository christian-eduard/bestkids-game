import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Unit } from '../../exercises/entities/unit.entity';

@Entity('courses')
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string; // e.g., "Matemáticas 1º Primaria"

    @Column({ nullable: true })
    description: string;

    @Column()
    level: string; // e.g., "1st Grade"

    @Column({ name: 'subject_area', nullable: true })
    subjectArea: string; // 'math', 'science', etc.

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @OneToMany(() => Unit, (unit) => unit.course)
    units: Unit[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
