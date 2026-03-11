import { DataSource } from 'typeorm';

const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'cex',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'bestkids_db',
});

async function check() {
    try {
        await dataSource.initialize();
        const result = await dataSource.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'gamification_profiles';
        `);
        console.log('Columns in gamification_profiles:', result);
    } catch (e) {
        console.error(e);
    } finally {
        await dataSource.destroy();
    }
}

check();
