import { DataSource } from 'typeorm';

const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'cex',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'bestkids_db',
});

async function checkUsers() {
    try {
        await dataSource.initialize();
        const users = await dataSource.query(`
            SELECT id, username, role_id 
            FROM users 
            LIMIT 50;
        `);
        console.log('Test Users:', users);
    } catch (e) {
        console.error(e);
    } finally {
        await dataSource.destroy();
    }
}

checkUsers();
