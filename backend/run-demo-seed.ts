
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { DataSource } from 'typeorm';
import { seedDemoContent } from './src/database/seeds/demo-content.seeder';

async function runSeed() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);

    await seedDemoContent(dataSource);

    await app.close();
}

runSeed();
