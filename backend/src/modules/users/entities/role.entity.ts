import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @Index()
    name: string; // 'master', 'center_admin', 'teacher', 'parent', 'student'

    @Column({ name: 'display_name' })
    displayName: string; // 'Administrador Master', 'Administrador de Centro', etc.

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'int' })
    level: number; // 1 (student) - 5 (master) para jerarquía

    @Column({ type: 'jsonb', nullable: true })
    permissions: Record<string, boolean>;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
