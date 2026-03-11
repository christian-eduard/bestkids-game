
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Fix path to point to root .env
dotenv.config({ path: '../.env' });

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'cex',
    password: process.env.DB_PASSWORD || 'bestkids_db',
    database: process.env.DB_DATABASE || 'bestkids_db',
    entities: [path.join(__dirname, 'src/**/*.entity.ts')],
    synchronize: false,
});

async function checkAdmin() {
    try {
        await AppDataSource.initialize();
        console.log('Database connected.');

        const userRepo = AppDataSource.getRepository('User');
        const admin = await userRepo.findOne({ where: { username: 'admin' } });

        if (admin) {
            console.log('✅ Admin user found:', {
                id: admin.id,
                username: admin.username,
                email: admin.email,
                roleId: admin.roleId,
                isActive: admin.isActive
            });

            // Try to login via API
            console.log('Attempting API login for admin...');
            const loginRes = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'admin', password: 'admin123' }) // Trying verify_exercises default pwd
            });

            if (loginRes.ok) {
                const data = await loginRes.json() as any;
                console.log('✅ API Login SUCCESS. Token received.');
                console.log('User Role from Token/Response:', data.user?.roleId || 'N/A');
            } else {
                console.log('❌ API Login FAILED:', loginRes.status, loginRes.statusText);
                const errText = await loginRes.text();
                console.log('Error Body:', errText);
            }

        } else {
            console.log('❌ Admin user NOT FOUND in database.');
        }

    } catch (error: any) {
        console.error('Error:', error);
    } finally {
        await AppDataSource.destroy();
    }
}

checkAdmin();
