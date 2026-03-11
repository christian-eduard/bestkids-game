
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

async function restoreAdmin() {
    try {
        await AppDataSource.initialize();
        console.log('Database connected.');

        const userRepo = AppDataSource.getRepository('User');

        // Find by email, including soft-deleted ones
        const admin = await userRepo.findOne({
            where: { email: 'admin@bestkids.com' },
            withDeleted: true
        });

        const hashedPassword = await bcrypt.hash('admin123', 10);

        if (admin) {
            console.log('Admin found (Email match). Updating...', admin);
            admin.username = 'admin';
            admin.passwordHash = hashedPassword;
            admin.roleId = 1; // MASTER
            admin.isActive = true;
            admin.deletedAt = null; // Restore if deleted
            await userRepo.save(admin);
            console.log('✅ Admin user UPDATED and RESTORED.');
        } else {
            console.log('Admin not found by email. Creating new...');
            await userRepo.save(userRepo.create({
                username: 'admin',
                email: 'admin@bestkids.com',
                passwordHash: hashedPassword,
                firstName: 'Admin',
                lastName: 'System',
                roleId: 1, // MASTER
                isActive: true
            }));
            console.log('✅ Admin user CREATED.');
        }

    } catch (error) {
        console.error('Error restoring admin:', error);
    } finally {
        await AppDataSource.destroy();
    }
}

restoreAdmin();
