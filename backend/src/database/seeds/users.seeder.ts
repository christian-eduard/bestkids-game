import { DataSource } from 'typeorm';
import { User } from '../../modules/users/entities/user.entity';
import { Center } from '../../modules/centers/entities/center.entity';
import * as bcrypt from 'bcrypt';

// Role IDs from PRO_roles table
const ROLE_IDS = {
    MASTER: 1,
    CENTER_ADMIN: 2,
    TEACHER: 3,
    PARENT: 4,
    STUDENT: 5,
};

export class UsersSeeder {
    public async run(dataSource: DataSource): Promise<void> {
        const userRepository = dataSource.getRepository(User);
        const centerRepository = dataSource.getRepository(Center);

        // Limpiar para asegurar un estado limpio sin duplicados
        await dataSource.query('TRUNCATE TABLE users, centers CASCADE');
        console.log('🗑️ Tablas users y centers limpiadas');

        const hashedPassword = await bcrypt.hash('password123', 10);

        // Create Centers first
        const centers = [
            { code: 'CEIP-SM-001', name: 'CEIP San Miguel', address: 'Calle Principal 1, Madrid', phone: '912345678', isActive: true },
            { code: 'CEIP-SA-002', name: 'CEIP Santa Ana', address: 'Avenida Central 45, Barcelona', phone: '934567890', isActive: true },
            { code: 'CEIP-EP-003', name: 'CEIP El Prado', address: 'Plaza Mayor 12, Valencia', phone: '963456789', isActive: true },
            { code: 'CEIP-LO-004', name: 'CEIP Los Olivos', address: 'Calle Verde 23, Sevilla', phone: '954321098', isActive: true },
            { code: 'CEIP-LE-005', name: 'CEIP La Esperanza', address: 'Paseo del Sol 8, Málaga', phone: '952123456', isActive: true },
        ];

        const createdCenters = await centerRepository.save(centerRepository.create(centers));
        console.log(`✅ Created ${createdCenters.length} centers`);

        // Create Teachers (20)
        const teacherNames = [
            { name: 'María', surname: 'García López' },
            { name: 'José', surname: 'Martínez Ruiz' },
            { name: 'Carmen', surname: 'Fernández Sánchez' },
            { name: 'Antonio', surname: 'González Pérez' },
            { name: 'Isabel', surname: 'Rodríguez Moreno' },
            { name: 'Francisco', surname: 'López Jiménez' },
            { name: 'Ana', surname: 'Hernández Díaz' },
            { name: 'Manuel', surname: 'Sánchez Romero' },
            { name: 'Pilar', surname: 'Ruiz Torres' },
            { name: 'David', surname: 'Jiménez Navarro' },
            { name: 'Laura', surname: 'Moreno Castro' },
            { name: 'Carlos', surname: 'Álvarez Ortiz' },
            { name: 'Elena', surname: 'Romero Delgado' },
            { name: 'Javier', surname: 'Torres Vega' },
            { name: 'Marta', surname: 'Ramírez Molina' },
            { name: 'Pedro', surname: 'Serrano Gil' },
            { name: 'Lucía', surname: 'Blanco Medina' },
            { name: 'Miguel', surname: 'Castro Ortega' },
            { name: 'Sara', surname: 'Vargas Ramos' },
            { name: 'Raúl', surname: 'Iglesias Herrera' },
        ];

        const teachers: Partial<User>[] = teacherNames.map((t, i) => ({
            username: `teacher.${t.name.toLowerCase()}${i + 1}`,
            passwordHash: hashedPassword,
            email: `${t.name.toLowerCase()}.${t.surname.split(' ')[0].toLowerCase()}@bestkids.com`,
            firstName: t.name,
            lastName: t.surname,
            roleId: ROLE_IDS.TEACHER,
            centerId: createdCenters[i % createdCenters.length].id,
            isActive: true,
        }));

        const createdTeachers = await userRepository.save(userRepository.create(teachers));
        console.log(`✅ Created ${createdTeachers.length} teachers`);

        // Create Parents (30)
        const parentNames = [
            'Alberto Ruiz', 'Beatriz Soto', 'Carlos Vega', 'Diana Mora', 'Eduardo Gil',
            'Francisca Ortiz', 'Gonzalo Ramos', 'Helena Castro', 'Ignacio Herrera', 'Julia Medina',
            'Luis Navarro', 'Mónica Delgado', 'Nicolás Ortega', 'Olivia Molina', 'Pablo Serrano',
            'Raquel Blanco', 'Sergio Iglesias', 'Teresa Vargas', 'Víctor Romero', 'Yolanda Torres',
            'Adrián Jiménez', 'Belén Moreno', 'Cristina Álvarez', 'Daniel Sánchez', 'Eva Hernández',
            'Fernando López', 'Gloria Rodríguez', 'Hugo González', 'Inés Fernández', 'Jorge Martínez',
        ];

        const parents: Partial<User>[] = parentNames.map((fullName, i) => {
            const [name, surname] = fullName.split(' ');
            return {
                username: `parent.${name.toLowerCase()}${i + 1}`,
                passwordHash: hashedPassword,
                email: `${name.toLowerCase()}.${surname.toLowerCase()}@email.com`,
                firstName: name,
                lastName: surname,
                roleId: ROLE_IDS.PARENT,
                centerId: createdCenters[i % createdCenters.length].id,
                isActive: true,
            };
        });

        const createdParents = await userRepository.save(userRepository.create(parents));
        console.log(`✅ Created ${createdParents.length} parents`);

        // Create Students (50)
        const studentFirstNames = [
            'Lucas', 'Emma', 'Mateo', 'Sofía', 'Hugo', 'Martina', 'Leo', 'Lucía',
            'Daniel', 'María', 'Pablo', 'Paula', 'Alejandro', 'Valeria', 'Álvaro', 'Carmen',
            'Adrián', 'Carla', 'Diego', 'Ana', 'Mario', 'Elena', 'Javier', 'Laura',
            'Manuel', 'Claudia', 'Sergio', 'Noa', 'Iker', 'Julia', 'Marc', 'Alba',
            'Gonzalo', 'Marta', 'Rubén', 'Sara', 'Nicolás', 'Daniela', 'Marcos', 'Irene',
            'Raúl', 'Andrea', 'Antonio', 'Natalia', 'Carlos', 'Alicia', 'David', 'Rocío',
            'Iván', 'Clara',
        ];

        const studentSurnames = [
            'García', 'Martínez', 'López', 'Sánchez', 'González', 'Pérez', 'Rodríguez', 'Fernández',
            'Gómez', 'Díaz', 'Ruiz', 'Hernández', 'Jiménez', 'Moreno', 'Álvarez', 'Romero',
        ];

        const students: Partial<User>[] = studentFirstNames.map((name, i) => {
            const surname = studentSurnames[i % studentSurnames.length];
            return {
                username: `student.${name.toLowerCase()}${i + 1}`,
                passwordHash: hashedPassword,
                email: `${name.toLowerCase()}.${surname.toLowerCase()}${i}@student.bestkids.com`,
                firstName: name,
                lastName: surname,
                roleId: ROLE_IDS.STUDENT,
                centerId: createdCenters[i % createdCenters.length].id,
                parentId: createdParents[Math.floor(i / 2) % createdParents.length].id,
                isActive: true,
            };
        });

        const createdStudents = await userRepository.save(userRepository.create(students));
        console.log(`✅ Created ${createdStudents.length} students`);

        // Create specific Test Users for Quick Access
        const testPassword = await bcrypt.hash('admin123', 10);

        // 1. MASTER (SuperAdmin)
        await userRepository.save(userRepository.create({
            username: 'master',
            email: 'master@bestkids.com',
            passwordHash: testPassword,
            firstName: 'Master',
            lastName: 'System',
            roleId: ROLE_IDS.MASTER,
            isActive: true
        }));

        // 2. CENTER ADMIN (Administrador de Centro)
        await userRepository.save(userRepository.create({
            username: 'admin',
            email: 'admin@bestkids.com',
            passwordHash: testPassword,
            firstName: 'Admin',
            lastName: 'Centro',
            roleId: ROLE_IDS.CENTER_ADMIN,
            centerId: createdCenters[0].id,
            isActive: true
        }));

        // 3. TEACHER
        await userRepository.save(userRepository.create({
            username: 'teacher1',
            email: 'teacher1@bestkids.com',
            passwordHash: testPassword,
            firstName: 'Profesor',
            lastName: 'Prueba',
            roleId: ROLE_IDS.TEACHER,
            centerId: createdCenters[0].id,
            isActive: true
        }));

        // 4. PARENT
        const testParent = await userRepository.save(userRepository.create({
            username: 'parent1',
            email: 'parent1@bestkids.com',
            passwordHash: testPassword,
            firstName: 'Padre',
            lastName: 'Prueba',
            roleId: ROLE_IDS.PARENT,
            centerId: createdCenters[0].id,
            isActive: true
        }));

        // 5. STUDENT
        await userRepository.save(userRepository.create({
            username: 'student1',
            email: 'student1@bestkids.com',
            passwordHash: testPassword,
            firstName: 'Estudiante',
            lastName: 'Prueba',
            roleId: ROLE_IDS.STUDENT,
            parentId: testParent.id,
            centerId: createdCenters[0].id,
            isActive: true,
            studentCode: 'BK-TEST1'
        }));

        console.log('✅ Created manual test users (master, admin, teacher1, parent1, student1)');
        console.log(`\n🔑 Credenciales DEMO (password: admin123):`);
        console.log(`  - Master: master`);
        console.log(`  - Admin Centro: admin`);
        console.log(`  - Profesor: teacher1`);
        console.log(`  - Padre: parent1`);
        console.log(`  - Estudiante: student1`);
    }
}
