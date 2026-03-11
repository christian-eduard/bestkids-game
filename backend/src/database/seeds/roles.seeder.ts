import { DataSource } from 'typeorm';
import { Role } from '../../modules/users/entities/role.entity';

export class RolesSeeder {
    public async run(dataSource: DataSource): Promise<void> {
        const roleRepository = dataSource.getRepository(Role);

        // Limpiar roles existentes para asegurar IDs específicos
        // Usamos query nativa para reiniciar secuencias si es necesario o simplemente borrar y insertar con IDs fijos
        await dataSource.query('TRUNCATE TABLE roles CASCADE');

        const roles = [
            { id: 1, name: 'master', displayName: 'Master', description: 'Super Administrador del Sistema', level: 100 },
            { id: 2, name: 'admin', displayName: 'Administrador', description: 'Administrador de Centro', level: 80 },
            { id: 3, name: 'teacher', displayName: 'Profesor', description: 'Rol para docentes', level: 60 },
            { id: 4, name: 'parent', displayName: 'Padre', description: 'Rol para padres y tutores', level: 40 },
            { id: 5, name: 'student', displayName: 'Estudiante', description: 'Rol para alumnos', level: 20 },
        ];

        for (const roleData of roles) {
            await roleRepository.save(roleRepository.create(roleData));
        }

        console.log('✅ Roles re-establecidos (1: Master, ..., 5: Student)');
    }
}
