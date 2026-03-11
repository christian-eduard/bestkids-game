import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
    Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Center } from '../../centers/entities/center.entity';

@Entity('classes')
export class Class {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ name: 'teacher_id' })
    @Index()
    teacherId: number;

    @Column({ name: 'center_id', nullable: true })
    @Index()
    centerId: number;

    @Column({ name: 'academic_year', nullable: true })
    academicYear: string;

    @Column({ nullable: true })
    grade: string; // e.g. "5th Grade", "6th Grade"

    @Column({ nullable: true })
    section: string; // e.g. "A", "B"

    @Column({ default: true, name: 'is_active' })
    isActive: boolean;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'teacher_id' })
    teacher: User;

    @ManyToOne(() => Center)
    @JoinColumn({ name: 'center_id' })
    center: Center;

    @OneToMany(() => User, (user) => user.class)
    students: User[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
