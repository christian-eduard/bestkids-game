import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { Unit } from './unit.entity';
import { ExerciseOption } from './exercise-option.entity';

export enum ExerciseType {
    SEÑALAR_IMAGEN = 'SEÑALAR_IMAGEN',
    OPCION_MULTIPLE = 'OPCION_MULTIPLE',
    VERDADERO_FALSO = 'VERDADERO_FALSO',
    ARRASTRAR_SILABAS = 'ARRASTRAR_SILABAS',
    UNIR_LINEAS = 'UNIR_LINEAS',
    CLASIFICAR_GRUPOS = 'CLASIFICAR_GRUPOS',
    PINTAR = 'PINTAR',
    TECLADO_VIRTUAL = 'TECLADO_VIRTUAL',
    AUDIO_SELECCION = 'AUDIO_SELECCION',
    COMPLETAR_HUECOS = 'COMPLETAR_HUECOS'
}

@Entity('exercises')
export class Exercise {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'subject_area_id', nullable: true })
    @Index()
    subjectAreaId: number;

    @Column({ name: 'unit_id', nullable: true })
    @Index()
    unitId: number;

    @ManyToOne(() => Unit, (unit) => unit.exercises)
    @JoinColumn({ name: 'unit_id' })
    unit: Unit;

    @Column({
        type: 'enum',
        enum: ExerciseType
    })
    type: ExerciseType;

    @Column({ type: 'text' })
    instruction: string; // Enunciado / Pregunta

    @Column({ name: 'instruction_audio_url', nullable: true })
    instructionAudioUrl: string;

    @Column({ name: 'background_image_url', nullable: true })
    backgroundImageUrl: string;

    @Column({ name: 'background_color', nullable: true })
    backgroundColor: string;

    @Column({ type: 'int', default: 1 })
    difficulty: number; // 1, 2, 3

    @Column({ type: 'int', default: 10 })
    points: number;

    @Column({ type: 'int', default: 0 })
    order: number;

    @Column({ type: 'jsonb' })
    content: any; // Estructura específica por tipo

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relación heredada de la versión anterior para no romper seeds/proyectos actuales si se usan
    @OneToMany(() => ExerciseOption, (option) => option.exercise, { cascade: true })
    options: ExerciseOption[];
}
