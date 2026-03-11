import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  console.log('🌱 Starting seed...');

  try {
    // 1. Create Roles
    console.log('Creating roles...');
    const roles = await dataSource.query(`
      INSERT INTO roles (name, "displayName", description) VALUES
      ('student', 'Estudiante', 'Rol para estudiantes'),
      ('parent', 'Padre/Tutor', 'Rol para padres y tutores'),
      ('teacher', 'Profesor', 'Rol para profesores'),
      ('admin', 'Administrador', 'Rol para administradores del sistema'),
      ('master', 'Master', 'Rol super admin')
      ON CONFLICT (name) DO NOTHING
      RETURNING id, name;
    `);
    console.log('✅ Roles created');

    // Get role IDs
    const roleMap = await dataSource.query(`SELECT id, name FROM roles`);
    const getRoleId = (name: string) => roleMap.find((r: any) => r.name === name)?.id;

    // 2. Create Users
    console.log('Creating users...');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await dataSource.query(`
      INSERT INTO users (username, email, password, "fullName", "roleId", "academicLevel", "placementTestTaken") VALUES
      ('admin', 'admin@bestkids.com', $1, 'Admin Master', $2, 'ADVANCED', true),
      ('teacher1', 'teacher@bestkids.com', $1, 'Prof. García', $3, 'ADVANCED', true),
      ('parent1', 'parent@bestkids.com', $1, 'Juan Pérez', $4, 'BEGINNER', false),
      ('student1', 'student@bestkids.com', $1, 'María López', $5, 'INTERMEDIATE', false)
      ON CONFLICT (username) DO NOTHING;
    `, [hashedPassword, getRoleId('admin'), getRoleId('teacher'), getRoleId('parent'), getRoleId('student')]);
    console.log('✅ Users created');

    // 3. Create Gamification Profiles
    console.log('Creating gamification profiles...');
    const users = await dataSource.query(`SELECT id, username FROM users`);

    for (const user of users) {
      await dataSource.query(`
        INSERT INTO gamification_profiles ("user_id", "total_points", "current_streak_days", "current_level")
        VALUES ($1, 0, 0, 1)
        ON CONFLICT ("user_id") DO NOTHING;
      `, [user.id]);
    }
    console.log('✅ Gamification profiles created');

    // 4. Create sample Store Items
    console.log('Creating store items...');
    await dataSource.query(`
      INSERT INTO store_items (name, type, cost, "imageUrl", description, "unlockLevel") VALUES
      ('Avatar Espacial', 'avatar', 100, '/assets/avatars/space.png', 'Avatar de astronauta', 1),
      ('Marco Dorado', 'frame', 200, '/assets/frames/gold.png', 'Marco dorado premium', 5),
      ('Tema Oscuro', 'theme', 150, '/assets/themes/dark.png', 'Modo oscuro', 3)
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Store items created');

    // 5. Create sample Center
    console.log('Creating centers...');
    await dataSource.query(`
      INSERT INTO centers (name, address, city, country) VALUES
      ('Colegio Demo', 'Calle Principal 123', 'Madrid', 'España')
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Centers created');

    console.log('🎉 Seed completed successfully!');
    console.log('\n📝 Credentials created:');
    console.log('Admin: admin / admin123');
    console.log('Teacher: teacher1 / admin123');
    console.log('Parent: parent1 / admin123');
    console.log('Student: student1 / admin123');

  } catch (error) {
    console.error('❌ Error during seed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
