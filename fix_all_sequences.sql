-- Fix completo para resetear todas las secuencias de IDs
-- Este problema ocurre cuando se insertan datos con IDs específicos en el seed

-- Resetear secuencia de centers
SELECT setval(pg_get_serial_sequence('centers', 'id'), COALESCE((SELECT MAX(id) FROM centers), 0) + 1, false);

-- Resetear secuencia de users
SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM users), 0) + 1, false);

-- Resetear secuencia de roles
SELECT setval(pg_get_serial_sequence('roles', 'id'), COALESCE((SELECT MAX(id) FROM roles), 0) + 1, false);

-- Resetear secuencia de classes
SELECT setval(pg_get_serial_sequence('classes', 'id'), COALESCE((SELECT MAX(id) FROM classes), 0) + 1, false);

-- Resetear secuencia de courses
SELECT setval(pg_get_serial_sequence('courses', 'id'), COALESCE((SELECT MAX(id) FROM courses), 0) + 1, false);

-- Resetear secuencia de units
SELECT setval(pg_get_serial_sequence('units', 'id'), COALESCE((SELECT MAX(id) FROM units), 0) + 1, false);

-- Resetear secuencia de exercises
SELECT setval(pg_get_serial_sequence('exercises', 'id'), COALESCE((SELECT MAX(id) FROM exercises), 0) + 1, false);

-- Resetear secuencia de worlds
SELECT setval(pg_get_serial_sequence('worlds', 'id'), COALESCE((SELECT MAX(id) FROM worlds), 0) + 1, false);

-- Resetear secuencia de levels
SELECT setval(pg_get_serial_sequence('levels', 'id'), COALESCE((SELECT MAX(id) FROM levels), 0) + 1, false);

-- Resetear secuencia de avatars
SELECT setval(pg_get_serial_sequence('avatars', 'id'), COALESCE((SELECT MAX(id) FROM avatars), 0) + 1, false);

-- Resetear secuencia de store_items
SELECT setval(pg_get_serial_sequence('store_items', 'id'), COALESCE((SELECT MAX(id) FROM store_items), 0) + 1, false);

-- Resetear secuencia de achievements
SELECT setval(pg_get_serial_sequence('achievements', 'id'), COALESCE((SELECT MAX(id) FROM achievements), 0) + 1, false);

-- Mostrar mensaje de confirmación
SELECT 'All sequences reset successfully!' as status;
