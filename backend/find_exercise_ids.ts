
import { DataSource } from 'typeorm';
import { Exercise } from './src/modules/exercises/entities/exercise.entity';
import { SubjectArea } from './src/modules/exercises/entities/subject-area.entity';
import { User } from './src/modules/users/entities/user.entity';
import { Center } from './src/modules/centers/entities/center.entity';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env' });
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_DATABASE:', process.env.DB_DATABASE);

// If still empty, try loading from .env explicitly using fs to debug path issues
import * as fs from 'fs';
import * as path from 'path';
const envPath = path.resolve(__dirname, '../.env');
console.log('Looking for .env at:', envPath);
if (fs.existsSync(envPath)) {
    console.log('.env file found.');
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
} else {
    console.log('.env file NOT found.');
}


const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'cex',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'bestkids_db',
    entities: [path.join(__dirname, 'src/**/*.entity.ts')],
    synchronize: false,
});

async function findIds() {
    await AppDataSource.initialize();
    const repo = AppDataSource.getRepository(Exercise);

    const titles = [
        'Ordenar Números', // Sequence
        'Completar Oración', // Fill Blanks
        'Formar Frase Correcta', // Drag Drop
        'Sinónimos', // Matching
        'Artículos El/La', // Multi Select
        'El Sistema Solar' // True False
    ];

    console.log("Searching for IDs...");
    for (const title of titles) {
        const ex = await repo.findOne({ where: { title } });
        if (ex) {
            console.log(`[${ex.exerciseType}] "${ex.title}": ID ${ex.id}`);
        } else {
            console.log(`❌ "${title}" NOT FOUND`);
        }
    }

    await AppDataSource.destroy();
}

findIds().catch(console.error);
