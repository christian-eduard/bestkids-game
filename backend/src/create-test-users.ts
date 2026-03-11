import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'cex',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'bestkids_db',
});

async function createTestUsers() {
    try {
        await dataSource.initialize();
        const passwordHash = await bcrypt.hash('admin123', 10);

        // Check and create admin
        const adminExists = await dataSource.query(`SELECT id FROM users WHERE username = 'admin'`);
        if (adminExists.length === 0) {
            await dataSource.query(`
                INSERT INTO users (username, email, password_hash, first_name, last_name, role_id, is_active, created_at)
                VALUES ('admin', 'admin@bestkids.com', $1, 'Admin', 'System', 1, true, NOW())
                ON CONFLICT (email) DO NOTHING
            `, [passwordHash]);
            console.log('Created admin user (or skipped if email exists)');
        }

        // Check and create teacher1
        const teacherExists = await dataSource.query(`SELECT id FROM users WHERE username = 'teacher1'`);
        if (teacherExists.length === 0) {
            await dataSource.query(`
                INSERT INTO users (username, email, password_hash, first_name, last_name, role_id, is_active, created_at)
                VALUES ('teacher1', 'teacher1@bestkids.com', $1, 'Profesor', 'Prueba', 3, true, NOW())
                ON CONFLICT (email) DO NOTHING
            `, [passwordHash]);
            console.log('Created teacher1 user');
        }

        // Check and create parent1
        const parentExists = await dataSource.query(`SELECT id FROM users WHERE username = 'parent1'`);
        if (parentExists.length === 0) {
            await dataSource.query(`
                INSERT INTO users (username, email, password_hash, first_name, last_name, role_id, is_active, created_at)
                VALUES ('parent1', 'parent1@bestkids.com', $1, 'Padre', 'Prueba', 4, true, NOW())
                ON CONFLICT (email) DO NOTHING
            `, [passwordHash]);
            console.log('Created parent1 user');
        }

        // Get parent1 id for student
        const parent1 = await dataSource.query(`SELECT id FROM users WHERE username = 'parent1'`);
        const parentId = parent1.length > 0 ? parent1[0].id : null;

        // Check and create student1
        const studentExists = await dataSource.query(`SELECT id FROM users WHERE username = 'student1'`);
        if (studentExists.length === 0) {
            await dataSource.query(`
                INSERT INTO users (username, email, password_hash, first_name, last_name, role_id, parent_id, student_code, is_active, created_at)
                VALUES ('student1', 'student1@bestkids.com', $1, 'Estudiante', 'Prueba', 5, $2, 'BK-TEST1', true, NOW())
                ON CONFLICT (email) DO NOTHING
            `, [passwordHash, parentId]);
            console.log('Created student1 user');
        }

        console.log('✅ Test users created successfully');

        // Verify
        const testUsers = await dataSource.query(`
            SELECT username, role_id FROM users 
            WHERE username IN ('admin', 'teacher1', 'parent1', 'student1')
        `);
        console.log('Test users:', testUsers);

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await dataSource.destroy();
    }
}

createTestUsers();
