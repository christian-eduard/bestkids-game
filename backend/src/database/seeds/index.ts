import 'reflect-metadata';
import { config } from 'dotenv';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { SubjectAreaSeeder } from './subject-area.seeder';
import { ExercisesSeeder } from './exercises.seeder';
import { UsersSeeder } from './users.seeder';
import { WorldsSeeder } from './worlds.seeder';
import { StoreSeeder } from './store.seeder';
import { ExtendedContentSeeder } from './extended-content.seeder';
import { RolesSeeder } from './roles.seeder';
import { seedExercisesV2 } from './exercises_v2.seeder';

// Load environment variables
config({ path: path.join(__dirname, '../../../.env') });

async function runSeeders() {
    console.log('🌱 Starting database seeding...\n');

    // Create data source
    const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT || '5432'),
        username: process.env.DATABASE_USER || 'bestkids_user',
        password: process.env.DATABASE_PASSWORD || 'bestkids_password_2024',
        database: process.env.DATABASE_NAME || 'bestkids_db',
        entities: [__dirname + '/../../modules/**/entities/*.entity{.ts,.js}'],
        synchronize: false,
        logging: false,
    });

    try {
        // Initialize connection
        await dataSource.initialize();
        console.log('✅ Database connection established\n');

        // Run seeders in order
        const seeders = [
            { name: 'Roles', seeder: new RolesSeeder() },
            { name: 'Subject Areas', seeder: new SubjectAreaSeeder() },
            { name: 'Exercises', seeder: new ExercisesSeeder() },
            { name: 'Users & Centers', seeder: new UsersSeeder() },
            { name: 'Store Items', seeder: new StoreSeeder() },
            { name: 'Worlds & Levels', seeder: new WorldsSeeder() },
            { name: 'Extended Gamification', seeder: new ExtendedContentSeeder() },
        ];

        for (const { name, seeder } of seeders) {
            console.log(`📦 Seeding ${name} starting...`);
            await seeder.run(dataSource);
            console.log(`✅ Seeding ${name} finished\n`);
        }

        console.log('📦 Seeding V2 Demo Exercises starting...');
        await seedExercisesV2(dataSource);
        console.log('✅ Seeding V2 Demo Exercises finished\n');

        console.log('🎉 Database seeding completed successfully!\n');
    } catch (error) {
        console.error('❌ Error during seeding:', error);
        process.exit(1);
    } finally {
        // Close connection
        if (dataSource.isInitialized) {
            await dataSource.destroy();
            console.log('👋 Database connection closed');
        }
    }
}

// Run seeders
runSeeders();
