import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { World } from '../../worlds/entities/world.entity';
import { Exercise } from './exercise.entity';
import { Course } from '../../courses/entities/course.entity';

@Entity('units')
export class Unit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'world_id', nullable: true })
    @Index()
    worldId: number;

    @Column({ name: 'course_id', nullable: true })
    @Index()
    courseId: number;

    @Column({ name: 'order_index', default: 0 })
    orderIndex: number;

    @Column({ type: 'int', default: 1 }) // 1: Fácil, 2: Medio, 3: Difícil
    difficulty: number;

    @Column({ name: 'cover_image_url', nullable: true })
    coverImageUrl: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @ManyToOne(() => World, { nullable: true })
    @JoinColumn({ name: 'world_id' })
    world: World;

    @ManyToOne(() => Course, { nullable: true })
    @JoinColumn({ name: 'course_id' })
    course: Course;

    @OneToMany(() => Exercise, (exercise) => exercise.unit)
    exercises: Exercise[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
