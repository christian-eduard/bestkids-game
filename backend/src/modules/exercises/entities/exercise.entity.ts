import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

export enum ExerciseType {
    MULTIPLE_CHOICE = 'multiple_choice',
    DRAG_DROP = 'drag_drop',
    MATCHING = 'matching',
    FILL_BLANKS = 'fill_blanks',
    SEQUENCE = 'sequence',
    TRUE_FALSE = 'true_false',
    MULTI_SELECT = 'multi_select',
}

export enum DifficultyLevel {
    EASY = 'easy',
    MEDIUM = 'medium',
    HARD = 'hard',
}

@Entity('exercises')
@Index(['subjectAreaId', 'isActive'])
@Index(['exerciseType', 'difficultyLevel'])
export class Exercise {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'subject_area_id' })
    @Index()
    subjectAreaId: number;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({
        type: 'enum',
        enum: ExerciseType,
        name: 'exercise_type',
    })
    @Index()
    exerciseType: ExerciseType;

    @Column({
        type: 'enum',
        enum: DifficultyLevel,
        name: 'difficulty_level',
        default: DifficultyLevel.MEDIUM,
    })
    @Index()
    difficultyLevel: DifficultyLevel;

    @Column({ type: 'jsonb' })
    content: any; // Contenido específico por tipo de ejercicio

    @Column({ type: 'jsonb', name: 'correct_answer', nullable: true })
    correctAnswer?: any;

    @Column({ type: 'int', default: 10 })
    points: number;

    @Column({ type: 'int', name: 'estimated_time_minutes', nullable: true })
    estimatedTimeMinutes: number;

    @Column({ type: 'jsonb', nullable: true })
    hints: string[]; // Array de pistas

    @Column({ type: 'jsonb', nullable: true })
    tags: string[]; // Tags para búsqueda

    @Column({ name: 'is_active', default: true })
    @Index()
    isActive: boolean;

    @Column({ name: 'created_by' })
    createdBy: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Academic Structure Relation
    @Column({ name: 'unit_id', nullable: true })
    @Index()
    unitId: number;

    @ManyToOne(() => require('../../courses/entities/unit.entity').Unit, (unit: any) => unit.exercises, { nullable: true })
    @JoinColumn({ name: 'unit_id' })
    unit?: any;

    // Direct Course Relation (optional, for quick assignment)
    @Column({ name: 'course_id', nullable: true })
    @Index()
    courseId: number;

    @ManyToOne(() => require('../../courses/entities/course.entity').Course, { nullable: true })
    @JoinColumn({ name: 'course_id' })
    course?: any;
}
