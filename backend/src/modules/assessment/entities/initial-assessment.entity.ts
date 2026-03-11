import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SubjectArea } from '../../exercises/entities/subject-area.entity';
import { DifficultyLevel } from '../enums/difficulty-level.enum';
import { RtiLevel } from '../enums/rti-level.enum';

@Entity('initial_assessments')
export class InitialAssessment {
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

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
    score: number; // 0-10

    @Column({ type: 'int', default: 0 })
    totalQuestions: number;

    @Column({ type: 'int', default: 0 })
    correctAnswers: number;

    @Column({
        type: 'enum',
        enum: DifficultyLevel,
        default: DifficultyLevel.NIVEL_MEDIO
    })
    difficultyLevel: DifficultyLevel;

    @Column({
        type: 'enum',
        enum: RtiLevel,
        default: RtiLevel.LEVEL_2_SELECTIVE
    })
    rtiLevel: RtiLevel;

    @Column({ default: false })
    completed: boolean;

    @CreateDateColumn()
    completedAt: Date;
}
