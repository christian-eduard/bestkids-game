-- ============================================
-- BESTKIDS - SEED DATA
-- PostgreSQL seed data for gamification
-- ============================================

-- ============================================
-- AVATARS
-- ============================================
INSERT INTO avatars (name, emoji, image_url, unlock_points_required, unlock_level_required, is_default, created_at) VALUES
('León Valiente', '🦁', NULL, 0, 1, true, NOW()),
('Panda Sabio', '🐼', NULL, 100, 1, false, NOW()),
('Zorro Astuto', '🦊', NULL, 250, 2, false, NOW()),
('Conejo Veloz', '🐰', NULL, 500, 2, false, NOW()),
('Oso Fuerte', '🐻', NULL, 750, 3, false, NOW()),
('Unicornio Mágico', '🦄', NULL, 1000, 3, false, NOW()),
('Dragón Legendario', '🐉', NULL, 1500, 4, false, NOW()),
('Águila Majestuosa', '🦅', NULL, 2000, 4, false, NOW()),
('Delfín Juguetón', '🐬', NULL, 2500, 5, false, NOW()),
('Gato Curioso', '🐱', NULL, 3000, 5, false, NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- ACHIEVEMENTS
-- ============================================
INSERT INTO achievements (name, description, icon, type, category, points_reward, requirement_value, requirement_type, is_secret, is_active, sort_order, created_at) VALUES
-- BRONCE (Fáciles)
('Primer Paso', 'Completa tu primer ejercicio', '🎯', 'bronze', 'exercises', 25, 1, 'count', false, true, 1, NOW()),
('Aprendiz', 'Completa 10 ejercicios', '📚', 'bronze', 'exercises', 50, 10, 'count', false, true, 2, NOW()),
('Racha Inicial', 'Mantén una racha de 3 días', '🔥', 'bronze', 'streak', 50, 3, 'count', false, true, 3, NOW()),
('Primeros Puntos', 'Acumula 100 puntos', '⭐', 'bronze', 'points', 25, 100, 'count', false, true, 4, NOW()),

-- PLATA (Intermedios)
('Estudiante Dedicado', 'Completa 50 ejercicios', '📖', 'silver', 'exercises', 100, 50, 'count', false, true, 10, NOW()),
('Semana Perfecta', 'Mantén una racha de 7 días', '📅', 'silver', 'streak', 100, 7, 'count', false, true, 11, NOW()),
('Cerebro en Acción', 'Acumula 500 puntos', '🧠', 'silver', 'points', 75, 500, 'count', false, true, 12, NOW()),
('Nivel 3', 'Alcanza el nivel 3', '📈', 'silver', 'level', 100, 3, 'count', false, true, 13, NOW()),
('Precisión', '5 respuestas perfectas seguidas', '🎯', 'silver', 'perfect', 100, 5, 'count', false, true, 14, NOW()),

-- ORO (Avanzados)
('Experto', 'Completa 100 ejercicios', '🏆', 'gold', 'exercises', 200, 100, 'count', false, true, 20, NOW()),
('Mes de Constancia', 'Mantén una racha de 30 días', '🌟', 'gold', 'streak', 250, 30, 'count', false, true, 21, NOW()),
('Mil Puntos', 'Acumula 1000 puntos', '💎', 'gold', 'points', 150, 1000, 'count', false, true, 22, NOW()),
('Nivel 5', 'Alcanza el nivel 5', '🚀', 'gold', 'level', 200, 5, 'count', false, true, 23, NOW()),
('Perfeccionista', '20 respuestas perfectas', '✨', 'gold', 'perfect', 200, 20, 'count', false, true, 24, NOW()),

-- DIAMANTE (Élite)
('Maestro', 'Completa 500 ejercicios', '👑', 'diamond', 'exercises', 500, 500, 'count', false, true, 30, NOW()),
('Año de Dedicación', 'Mantén una racha de 100 días', '🔮', 'diamond', 'streak', 500, 100, 'count', false, true, 31, NOW()),
('Leyenda', 'Acumula 10000 puntos', '🌈', 'diamond', 'points', 400, 10000, 'count', false, true, 32, NOW()),
('Nivel 10', 'Alcanza el nivel 10', '⚡', 'diamond', 'level', 500, 10, 'count', false, true, 33, NOW()),

-- ESPECIALES (Secretos)
('Madrugador', 'Completa un ejercicio antes de las 7am', '🌅', 'special', 'speed', 100, 1, 'count', true, true, 40, NOW()),
('Nocturno', 'Completa un ejercicio después de las 10pm', '🌙', 'special', 'speed', 100, 1, 'count', true, true, 41, NOW()),
('Explorador', 'Completa ejercicios de todas las áreas', '🗺️', 'special', 'explorer', 150, 4, 'count', true, true, 42, NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- SUBJECT AREAS (si no existen)
-- ============================================
INSERT INTO subject_areas (name, description, icon, color_hex, is_active, created_at) VALUES
('Matemáticas', 'Números, operaciones y geometría', '➕', '#3B82F6', true, NOW()),
('Ciencias', 'Naturaleza, física y química', '🔬', '#10B981', true, NOW()),
('Lenguaje', 'Lectura, escritura y gramática', '📝', '#8B5CF6', true, NOW()),
('Sociales', 'Historia, geografía y cultura', '🌍', '#F59E0B', true, NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- SAMPLE EXERCISES
-- ============================================
INSERT INTO exercises (subject_area_id, title, description, exercise_type, difficulty_level, content, correct_answer, points, estimated_time_minutes, hints, tags, is_active, created_by, created_at) VALUES
-- Matemáticas
(1, '¿Cuánto es 2 + 2?', 'Suma básica para principiantes', 'multiple_choice', 'easy', 
 '{"question": "¿Cuánto es 2 + 2?", "options": ["3", "4", "5", "6"]}', 
 '{"answer": "4"}', 10, 1, '["Piensa en dos manzanas más dos manzanas"]', '["suma", "básico"]', true, 1, NOW()),

(1, '¿5 es mayor que 3?', 'Comparación de números', 'true_false', 'easy',
 '{"question": "¿5 es mayor que 3?"}',
 '{"answer": true}', 10, 1, '["Cuenta hasta 5 y luego hasta 3"]', '["comparación", "números"]', true, 1, NOW()),

(1, '¿Cuánto es 7 x 8?', 'Multiplicación', 'multiple_choice', 'medium',
 '{"question": "¿Cuánto es 7 x 8?", "options": ["54", "56", "58", "64"]}',
 '{"answer": "56"}', 15, 2, '["7x8 es igual a 7x7 más 7"]', '["multiplicación"]', true, 1, NOW()),

-- Ciencias
(2, '¿Cuál es el planeta más grande?', 'Sistema solar', 'multiple_choice', 'easy',
 '{"question": "¿Cuál es el planeta más grande del sistema solar?", "options": ["Marte", "Tierra", "Júpiter", "Saturno"]}',
 '{"answer": "Júpiter"}', 10, 1, '["Es un gigante gaseoso"]', '["planetas", "astronomía"]', true, 1, NOW()),

(2, '¿El agua hierve a 100°C?', 'Propiedades del agua', 'true_false', 'easy',
 '{"question": "¿El agua hierve a 100 grados centígrados a nivel del mar?"}',
 '{"answer": true}', 10, 1, NULL, '["agua", "temperatura"]', true, 1, NOW()),

-- Lenguaje
(3, '¿Cuál es el sinónimo de feliz?', 'Sinónimos', 'multiple_choice', 'easy',
 '{"question": "¿Cuál es el sinónimo de feliz?", "options": ["Triste", "Contento", "Enojado", "Cansado"]}',
 '{"answer": "Contento"}', 10, 1, NULL, '["sinónimos", "vocabulario"]', true, 1, NOW()),

-- Sociales
(4, '¿Cuál es la capital de España?', 'Geografía', 'multiple_choice', 'easy',
 '{"question": "¿Cuál es la capital de España?", "options": ["Barcelona", "Madrid", "Sevilla", "Valencia"]}',
 '{"answer": "Madrid"}', 10, 1, NULL, '["capitales", "geografía"]', true, 1, NOW()),

-- Nuevos tipos: Drag & Drop
(1, 'Ordena los números', 'Ordena de menor a mayor', 'drag_drop', 'easy',
 '{"question": "Coloca cada número en su posición correcta de menor a mayor", "items": ["5", "2", "8", "1"], "zones": ["1º (menor)", "2º", "3º", "4º (mayor)"]}',
 '{"1º (menor)": "1", "2º": "2", "3º": "5", "4º (mayor)": "8"}', 15, 3, NULL, '["ordenar", "números"]', true, 1, NOW()),

(2, 'Clasifica los animales', 'Animales por su hábitat', 'drag_drop', 'medium',
 '{"question": "Coloca cada animal en su hábitat natural", "items": ["🐟 Pez", "🦁 León", "🐧 Pingüino", "🐸 Rana"], "zones": ["Agua 💧", "Selva 🌴", "Hielo ❄️", "Estanque 🪷"]}',
 '{"Agua 💧": "🐟 Pez", "Selva 🌴": "🦁 León", "Hielo ❄️": "🐧 Pingüino", "Estanque 🪷": "🐸 Rana"}', 20, 3, NULL, '["animales", "hábitat"]', true, 1, NOW()),

-- Nuevos tipos: Matching
(3, 'Relaciona antónimos', 'Encuentra los opuestos', 'matching', 'easy',
 '{"question": "Relaciona cada palabra con su antónimo", "leftItems": [{"id": "1", "text": "Grande"}, {"id": "2", "text": "Frío"}, {"id": "3", "text": "Alto"}], "rightItems": [{"id": "a", "text": "Pequeño"}, {"id": "b", "text": "Caliente"}, {"id": "c", "text": "Bajo"}]}',
 '{"1": "a", "2": "b", "3": "c"}', 15, 2, NULL, '["antónimos", "vocabulario"]', true, 1, NOW()),

(4, 'Países y capitales', 'Relaciona cada país con su capital', 'matching', 'medium',
 '{"question": "Relaciona cada país con su capital", "leftItems": [{"id": "1", "text": "Francia"}, {"id": "2", "text": "Italia"}, {"id": "3", "text": "Alemania"}, {"id": "4", "text": "Portugal"}], "rightItems": [{"id": "a", "text": "París"}, {"id": "b", "text": "Roma"}, {"id": "c", "text": "Berlín"}, {"id": "d", "text": "Lisboa"}]}',
 '{"1": "a", "2": "b", "3": "c", "4": "d"}', 20, 3, NULL, '["capitales", "geografía"]', true, 1, NOW()),

-- Nuevos tipos: Fill Blanks
(3, 'Completa la oración', 'Conjuga el verbo correctamente', 'fill_blanks', 'easy',
 '{"question": "Completa las oraciones con la palabra correcta", "text": "El gato ___ muy rápido. María ___ un libro.", "blanks": [{"id": "1", "correctAnswer": "corre"}, {"id": "2", "correctAnswer": "lee"}], "options": ["corre", "lee", "salta", "escribe"]}',
 '{"1": "corre", "2": "lee"}', 15, 2, NULL, '["verbos", "gramática"]', true, 1, NOW()),

(1, 'Completa la ecuación', 'Operaciones básicas', 'fill_blanks', 'medium',
 '{"question": "Completa los espacios para que la ecuación sea correcta", "text": "10 + ___ = 15, y 20 - ___ = 12", "blanks": [{"id": "1", "correctAnswer": "5"}, {"id": "2", "correctAnswer": "8"}], "options": ["5", "8", "3", "10"]}',
 '{"1": "5", "2": "8"}', 15, 2, NULL, '["suma", "resta"]', true, 1, NOW())

ON CONFLICT DO NOTHING;

SELECT 'Seed data inserted successfully with new exercise types!' as status;
