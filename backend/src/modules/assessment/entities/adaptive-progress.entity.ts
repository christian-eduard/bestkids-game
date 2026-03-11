import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SubjectArea } from '../../exercises/entities/subject-area.entity';
import { DifficultyLevel } from '../enums/difficulty-level.enum';

@Entity('adaptive_progress')
export class AdaptiveProgress {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    subjectAreaId: number;

    @ManyToOne(() => SubjectArea)
    @JoinColumn({ name: 'subjectAreaId' })
    subjectArea: SubjectArea;

    @Column({
        type: 'enum',
        enum: DifficultyLevel,
        default: DifficultyLevel.NIVEL_MEDIO
    })
    currentLevel: DifficultyLevel;

    @Column({ type: 'int', default: 0 })
    consecutiveCorrect: number; // Contador para subir de nivel (max 5)

    @Column({ type: 'int', default: 0 })
    consecutiveIncorrect: number; // Contador para bajar de nivel (max 5)

    @Column({ type: 'int', default: 0 })
    totalExercises: number;

    @Column({ type: 'int', default: 0 })
    correctExercises: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
    accuracyPercentage: number;

    @UpdateDateColumn()
    lastUpdated: Date;

    @CreateDateColumn()
    createdAt: Date;
}
