
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

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

async function seedAdmin() {
    try {
        await AppDataSource.initialize();
        console.log('Database connected.');

        const userRepo = AppDataSource.getRepository('User');

        // Check if admin exists
        const existingAdmin = await userRepo.findOne({ where: { username: 'admin' } });
        if (existingAdmin) {
            console.log('Admin already exists.');
            return;
        }

        console.log('Creating admin user...');
        const hashedPassword = await bcrypt.hash('admin123', 10);

        await userRepo.save(userRepo.create({
            username: 'admin',
            email: 'admin@bestkids.com',
            passwordHash: hashedPassword,
            firstName: 'Admin',
            lastName: 'System',
            roleId: 1, // MASTER
            isActive: true
        }));

        console.log('✅ Admin user created successfully.');

    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        await AppDataSource.destroy();
    }
}

seedAdmin();
