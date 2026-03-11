-- DEMO CONTENT SEED
-- AVATARES
INSERT INTO avatars (name, emoji, price, unlock_points_required, unlock_level_required, is_default, collection, rarity) VALUES
('León Valiente', '🦁', 0, 0, 1, true, 'Animales', 'Común'),
('Panda Sabio', '🐼', 100, 100, 1, false, 'Animales', 'Común'),
('Zorro Astuto', '🦊', 250, 250, 2, false, 'Animales', 'Raro'),
('Conejo Veloz', '🐰', 500, 500, 2, false, 'Animales', 'Raro'),
('Oso Fuerte', '🐻', 750, 750, 3, false, 'Animales', 'Raro'),
('Robot Héroe', '🤖', 500, 500, 1, false, 'Sci-Fi', 'Raro'),
('Ninja Bot', '🥷', 5000, 5000, 10, false, 'Sci-Fi', 'Épico'),
('Mago Supremo', '🧙', 2500, 2500, 5, false, 'Fantasía', 'Legendario'),
('Princesa Smart', '👸', 0, 0, 1, false, 'Fantasía', 'Raro'),
('Explorador', '🧭', 250, 250, 1, false, 'Aventura', 'Común'),
('El Artista', '🎨', 600, 600, 1, false, 'Profesiones', 'Nuevo'),
('Astronauta', '👨‍🚀', 1000, 1000, 4, false, 'Sci-Fi', 'Épico'),
('Detective', '🕵️', 400, 400, 2, false, 'Profesiones', 'Común'),
('Superhéroe', '🦸', 1500, 1500, 5, false, 'Héroes', 'Legendario'),
('Dinosaurio Rex', '🦖', 3000, 3000, 8, false, 'Prehistoria', 'Épico');
-- ACTUALIZAR ESTUDIANTES (DEMO MODE)
-- Asignar puntos y monedas a todos los usuarios con rol 'student'
UPDATE gamification_profiles 
SET 
  total_points = CASE WHEN total_points < 1000 THEN 2500 ELSE total_points END,
  current_level = CASE WHEN current_level < 2 THEN 5 ELSE current_level END,
  coins = CASE WHEN coins < 500 THEN 5000 ELSE coins END
FROM users 
WHERE gamification_profiles.user_id = users.id 
AND users."role_id" = (SELECT id FROM roles WHERE name = 'student' LIMIT 1);

-- ITEMS DE TIENDA (Corección unlockLevel -> unlock_level)
INSERT INTO store_items (name, type, cost, description, "unlock_level", "imageUrl") VALUES
('Poción de Sabiduría', 'powerup', 50, 'Duplica los puntos por 30 min', 1, '/assets/potions/xp-boost.png'),
('Escudo Anti-Error', 'powerup', 100, 'Protege tu racha de una respuesta incorrecta', 1, '/assets/powerups/shield.png'),
('Tema Galáctico', 'theme', 200, 'Fondo espacial para tu dashboard', 2, '/assets/themes/galaxy.png'),
('Tema Submarino', 'theme', 200, 'Fondo del océano para tu dashboard', 2, '/assets/themes/underwater.png'),
('Marco Dorado', 'avatar_frame', 500, 'Marco brillante para tu avatar', 5, '/assets/frames/gold.png'),
('Marco Neón', 'avatar_frame', 300, 'Marco luminoso futurista', 3, '/assets/frames/neon.png'),
('Mascota Dragón', 'sticker', 1000, 'Sticker de dragón', 5, '/assets/pets/dragon.png')
ON CONFLICT DO NOTHING;

-- AVATARES
INSERT INTO avatars (name, emoji, price, unlock_points_required, unlock_level_required, is_default, collection, rarity) VALUES
('León Valiente', '🦁', 0, 0, 1, true, 'Animales', 'Común'),
('Panda Sabio', '🐼', 100, 100, 1, false, 'Animales', 'Común'),
('Zorro Astuto', '🦊', 250, 250, 2, false, 'Animales', 'Raro'),
('Conejo Veloz', '🐰', 500, 500, 2, false, 'Animales', 'Raro'),
('Oso Fuerte', '🐻', 750, 750, 3, false, 'Animales', 'Raro'),
('Robot Héroe', '🤖', 500, 500, 1, false, 'Sci-Fi', 'Raro'),
('Ninja Bot', '🥷', 5000, 5000, 10, false, 'Sci-Fi', 'Épico'),
('Mago Supremo', '🧙', 2500, 2500, 5, false, 'Fantasía', 'Legendario'),
('Princesa Smart', '👸', 0, 0, 1, false, 'Fantasía', 'Raro'),
('Explorador', '🧭', 250, 250, 1, false, 'Aventura', 'Común'),
('El Artista', '🎨', 600, 600, 1, false, 'Profesiones', 'Nuevo'),
('Astronauta', '👨‍🚀', 1000, 1000, 4, false, 'Sci-Fi', 'Épico'),
('Detective', '🕵️', 400, 400, 2, false, 'Profesiones', 'Común'),
('Superhéroe', '🦸', 1500, 1500, 5, false, 'Héroes', 'Legendario'),
('Dinosaurio Rex', '🦖', 3000, 3000, 8, false, 'Prehistoria', 'Épico')
ON CONFLICT DO NOTHING;

-- Fix User Inventory inserts (using user_id snake_case)
INSERT INTO user_inventory ("user_id", "item_id", "quantity", "acquired_at")
SELECT u.id, (SELECT id FROM store_items LIMIT 1), 1, NOW()
FROM users u
WHERE u."role_id" = (SELECT id FROM roles WHERE name = 'student' LIMIT 1)
AND NOT EXISTS (SELECT 1 FROM user_inventory ui WHERE ui."user_id" = u.id);
