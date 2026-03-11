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
import { Course } from './course.entity';
// Import Exercise if we invert relation, or just keep ID here. 
// Ideally Exercise belongs to Unit.
import { Exercise } from '../../exercises/entities/exercise.entity';

@Entity('units')
@Index(['courseId', 'orderIndex'])
export class Unit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string; // e.g., "Geometría Básica"

    @Column({ nullable: true })
    description: string;

    @Column({ name: 'course_id' })
    courseId: number;

    @Column({ name: 'order_index', default: 0 })
    orderIndex: number;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @ManyToOne(() => Course, (course) => course.units)
    @JoinColumn({ name: 'course_id' })
    course: Course;

    @OneToMany(() => Exercise, (exercise) => exercise.unit)
    exercises: Exercise[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
