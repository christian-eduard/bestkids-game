
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: '../.env' });

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'cex',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'bestkids_db',
    synchronize: false,
});

async function run() {
    await AppDataSource.initialize();

    console.log('Dropping table exercise_attempts...');
    await AppDataSource.query('DROP TABLE IF EXISTS "exercise_attempts" CASCADE');
    console.log('Dropped.');

    await AppDataSource.destroy();
}

run().catch(console.error);
