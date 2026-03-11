
import { DataSource } from 'typeorm';

export async function seedDemoContent(dataSource: DataSource) {
    console.log('🌱 Starting Demo Content Seed...');

    try {
        // 1. Seed Avatars (More variety)
        console.log('Creating avatars...');
        await dataSource.query(`
      INSERT INTO avatars (name, emoji, price, unlock_points_required, unlock_level_required, is_default, collection, rarity) VALUES
      ('León Valiente', '🦁', 0, 0, 1, true, 'Animales', 'Común'),
      ('Panda Sabio', '🐼', 100, 100, 1, false, 'Animales', 'Común'),
      ('Zorro Astuto', '🦊', 250, 250, 2, false, 'Animales', 'Raro'),
      ('Conejo Veloz', '🐰', 500, 500, 2, false, 'Animales', 'Raro'),
      ('Robot Héroe', '🤖', 500, 500, 1, false, 'Sci-Fi', 'Raro'),
      ('Ninja Bot', '🥷', 5000, 5000, 10, false, 'Sci-Fi', 'Épico'),
      ('Mago Supremo', '🧙', 2500, 2500, 5, false, 'Fantasía', 'Legendario'),
      ('Princesa Smart', '👸', 0, 0, 1, false, 'Fantasía', 'Raro'),
      ('Explorador', '🧭', 250, 250, 1, false, 'Aventura', 'Común'),
      ('El Artista', '🎨', 600, 600, 1, false, 'Profesiones', 'Nuevo')
      ON CONFLICT DO NOTHING;
    `);

        // 2. Seed Store Items (For Inventory)
        console.log('Creating store items...');
        await dataSource.query(`
      INSERT INTO store_items (name, type, cost, description, "unlockLevel", "imageUrl") VALUES
      ('Poción de Sabiduría', 'potion', 50, 'Duplica los puntos por 30 min', 1, '/assets/potions/xp-boost.png'),
      ('Escudo Anti-Error', 'powerup', 100, 'Protege tu racha de una respuesta incorrecta', 1, '/assets/powerups/shield.png'),
      ('Tema Galáctico', 'theme', 200, 'Fondo espacial para tu dashboard', 2, '/assets/themes/galaxy.png'),
      ('Marco Dorado', 'frame', 500, 'Marco brillante para tu avatar', 5, '/assets/frames/gold.png')
      ON CONFLICT DO NOTHING;
    `);

        // 3. Seed Achievements (Definitions)
        console.log('Creating achievements...');
        await dataSource.query(`
      INSERT INTO achievements (name, description, icon, type, category, points_reward, requirement_value, requirement_type, is_active) VALUES
      ('Primer Paso', 'Completa tu primer ejercicio', '🎯', 'bronze', 'exercises', 25, 1, 'count', true),
      ('Racha de Fuego', 'Mantén una racha de 3 días', '🔥', 'bronze', 'streak', 50, 3, 'count', true),
      ('Cerebrito', 'Acumula 500 puntos', '🧠', 'silver', 'points', 100, 500, 'count', true),
      ('Leyenda', 'Alcanza el nivel 10', '👑', 'gold', 'level', 500, 10, 'count', true)
      ON CONFLICT DO NOTHING;
    `);

        // 4. Update Student Balances (Give them money/XP for demo)
        console.log('Updating student balances...');
        // Get role ID for 'student'
        const roles = await dataSource.query(`SELECT id FROM roles WHERE name = 'student'`);
        if (roles.length > 0) {
            const studentRoleId = roles[0].id;

            // Update all users with role 'student'
            await dataSource.query(`
        UPDATE gamification_profiles 
        SET 
          total_points = CASE WHEN total_points < 1000 THEN 1250 ELSE total_points END,
          current_level = CASE WHEN current_level < 2 THEN 3 ELSE current_level END,
          coins = CASE WHEN coins < 500 THEN 1000 ELSE coins END
        FROM users 
        WHERE gamification_profiles.user_id = users.id 
        AND users."roleId" = $1;
      `, [studentRoleId]);
        }

        console.log('✅ Demo content seeded successfully!');
    } catch (error) {
        console.error('❌ Error seeding demo content:', error);
    }
}
