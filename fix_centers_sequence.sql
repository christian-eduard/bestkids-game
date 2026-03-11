-- Fix para resetear la secuencia de IDs de la tabla centers
-- Este problema ocurre cuando se insertan datos con IDs específicos

-- Resetear la secuencia al valor máximo actual + 1
SELECT setval(pg_get_serial_sequence('centers', 'id'), COALESCE((SELECT MAX(id) FROM centers), 0) + 1, false);
