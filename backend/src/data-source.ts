import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { GamificationProfile } from './modules/gamification/entities/gamification-profile.entity';
import { User } from './modules/users/entities/user.entity';
// Import other entities as needed for a complete data source, or use patterns if possible
// For a quick migration, targeting what we need is usually enough or using the entity path

config({ path: '../.env' });

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'bestkids_user',
    password: process.env.DB_PASSWORD || 'bestkids_password_2024',
    database: process.env.DB_DATABASE || 'bestkids_db',
    synchronize: false,
    logging: true,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
});
