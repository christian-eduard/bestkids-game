-- Fix DEFINITIVO para resetear todas las secuencias de IDs
-- Usando 'true' como tercer parámetro para que nextval() devuelva el siguiente valor correcto

-- Resetear secuencia de centers (siguiente será MAX+1)
SELECT setval(pg_get_serial_sequence('centers', 'id'), (SELECT COALESCE(MAX(id), 0) FROM centers), true);

-- Resetear secuencia de users (siguiente será MAX+1)
SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT COALESCE(MAX(id), 0) FROM users), true);

-- Resetear secuencia de roles (siguiente será MAX+1)
SELECT setval(pg_get_serial_sequence('roles', 'id'), (SELECT COALESCE(MAX(id), 0) FROM roles), true);

-- Resetear secuencia de classes (siguiente será MAX+1)
SELECT setval(pg_get_serial_sequence('classes', 'id'), (SELECT COALESCE(MAX(id), 0) FROM classes), true);

-- Resetear secuencia de courses (siguiente será MAX+1)
SELECT setval(pg_get_serial_sequence('courses', 'id'), (SELECT COALESCE(MAX(id), 0) FROM courses), true);

-- Resetear secuencia de units (siguiente será MAX+1)
SELECT setval(pg_get_serial_sequence('units', 'id'), (SELECT COALESCE(MAX(id), 0) FROM units), true);

-- Resetear secuencia de exercises (siguiente será MAX+1)
SELECT setval(pg_get_serial_sequence('exercises', 'id'), (SELECT COALESCE(MAX(id), 0) FROM exercises), true);

-- Resetear secuencia de worlds (siguiente será MAX+1)
SELECT setval(pg_get_serial_sequence('worlds', 'id'), (SELECT COALESCE(MAX(id), 0) FROM worlds), true);

-- Resetear secuencia de avatars (siguiente será MAX+1)
SELECT setval(pg_get_serial_sequence('avatars', 'id'), (SELECT COALESCE(MAX(id), 0) FROM avatars), true);

-- Resetear secuencia de store_items (siguiente será MAX+1)
SELECT setval(pg_get_serial_sequence('store_items', 'id'), (SELECT COALESCE(MAX(id), 0) FROM store_items), true);

-- Resetear secuencia de achievements (siguiente será MAX+1)
SELECT setval(pg_get_serial_sequence('achievements', 'id'), (SELECT COALESCE(MAX(id), 0) FROM achievements), true);

-- Mostrar mensaje de confirmación
SELECT 'All sequences DEFINITIVELY reset!' as status;
