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
import { World } from './world.entity';
import { LevelExercise } from './level-exercise.entity';

@Entity('world_levels')
export class WorldLevel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'world_id' })
    @Index()
    worldId: number;

    @ManyToOne(() => World, (world) => world.levels)
    @JoinColumn({ name: 'world_id' })
    world: World;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'level_number' })
    @Index()
    levelNumber: number;

    @Column({ name: 'points_to_unlock', default: 0 })
    pointsToUnlock: number;

    @Column({ name: 'stars_required', default: 0 })
    starsRequired: number;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @OneToMany(() => LevelExercise, (levelExercise) => levelExercise.level)
    exercises: LevelExercise[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
