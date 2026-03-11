-- Semillado de la Tienda de BestKids
-- Tipos: avatar_frame, theme, sticker, powerup

-- Insertar Marcos de Avatar
INSERT INTO store_items (name, description, type, cost, "imageUrl", is_active, created_at, updated_at)
VALUES 
('Marco Galáctico', 'Un marco brillante con estrellas y nebulosas para tu perfil.', 'avatar_frame', 500, '/Users/cex/.gemini/antigravity/brain/a557678d-6136-42f6-81cc-aa8176416f32/avatar_frame_galaxy_1767044167309.png', true, NOW(), NOW()),
('Marco Natural', 'Vibra con la naturaleza usando este marco lleno de hojas y flores.', 'avatar_frame', 300, '/Users/cex/.gemini/antigravity/brain/a557678d-6136-42f6-81cc-aa81764179851.png', true, NOW(), NOW());

-- Insertar Stickers
INSERT INTO store_items (name, description, type, cost, "imageUrl", is_active, created_at, updated_at)
VALUES 
('Dragón Feliz', 'Un pequeño dragón para alegrar tu perfil.', 'sticker', 200, 'https://placehold.co/200x200/png?text=Dragon', true, NOW(), NOW()),
('Robot Amigable', 'Un robot que te saluda en cada aventura.', 'sticker', 250, 'https://placehold.co/200x200/png?text=Robot', true, NOW(), NOW());

-- Temas (Pendiente generar imágenes)
INSERT INTO store_items (name, description, type, cost, "imageUrl", is_active, created_at, updated_at)
VALUES 
('Mundo Submarino', 'Cambia el aspecto de tu dashboard al fondo del océano.', 'theme', 1500, 'https://placehold.co/400x200/png?text=Ocean', true, NOW(), NOW());
