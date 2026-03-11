import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { WorldLevel } from './world-level.entity';
import { Exercise } from '../../exercises/entities/exercise.entity';

@Entity('level_exercises')
export class LevelExercise {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'level_id' })
    @Index()
    levelId: number;

    @ManyToOne(() => WorldLevel, (level) => level.exercises)
    @JoinColumn({ name: 'level_id' })
    level: WorldLevel;

    @Column({ name: 'exercise_id' })
    @Index()
    exerciseId: number;

    @ManyToOne(() => Exercise)
    @JoinColumn({ name: 'exercise_id' })
    exercise: Exercise;

    @Column({ name: 'order_index', default: 0 })
    orderIndex: number;

    @Column({ name: 'is_required', default: true })
    isRequired: boolean;
}
