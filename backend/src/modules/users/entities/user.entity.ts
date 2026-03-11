import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Index,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { Center } from '../../centers/entities/center.entity';
import { Class } from '../../classes/entities/class.entity';

export enum AcademicLevel {
    BEGINNER = 'beginner',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced',
}

@Entity('users')
@Index(['email'], { unique: true, where: '"deleted_at" IS NULL' })
@Index(['username'], { unique: true, where: '"deleted_at" IS NULL' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: AcademicLevel,
        name: 'academic_level',
        default: AcademicLevel.BEGINNER
    })
    academicLevel: AcademicLevel;

    @Column({ name: 'placement_test_taken', default: false })
    placementTestTaken: boolean;

    @Column({ name: 'role_id' })
    @Index()
    roleId: number;

    @Column({ name: 'center_id', nullable: true })
    @Index()
    centerId: number;

    @ManyToOne(() => Center, (center) => center.users)
    @JoinColumn({ name: 'center_id' })
    center: Center;

    @Column({ name: 'parent_id', nullable: true })
    @Index()
    parentId: number;

    @ManyToOne(() => User, (user) => user.children)
    @JoinColumn({ name: 'parent_id' })
    parent: User;

    @OneToMany(() => User, (user) => user.parent)
    children: User[];

    @Column({ name: 'class_id', nullable: true })
    @Index()
    classId: number;

    @ManyToOne(() => Class, (cls) => cls.students)
    @JoinColumn({ name: 'class_id' })
    class: Class;

    @Column({ unique: true })
    username: string;

    @Column({ name: 'student_code', unique: true, nullable: true })
    studentCode: string;

    @Column({ name: 'password_hash', select: false })
    passwordHash: string;

    @Column({ unique: true })
    email: string;

    @Column({ name: 'first_name' })
    firstName: string;

    @Column({ name: 'last_name' })
    lastName: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ type: 'date', name: 'birth_date', nullable: true })
    birthDate: Date;

    @Column({ name: 'avatar_id', nullable: true })
    avatarId: number;

    @Column({ name: 'equipped_frame_id', nullable: true })
    equippedFrameId: number;

    @Column({ name: 'equipped_theme_id', nullable: true })
    equippedThemeId: number;

    @Column({ name: 'language_code', default: 'es', length: 5 })
    languageCode: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @Column({ type: 'timestamp', name: 'last_login_at', nullable: true })
    @Index()
    lastLoginAt: Date;

    @Column({ name: 'last_login_ip', nullable: true })
    lastLoginIp: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;

    // Computed properties
    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }
}
