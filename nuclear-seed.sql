-- NUCLEAR SEED (Reset & Correct) v12 - Added Courses & Units

-- 1. CLEANUP
TRUNCATE TABLE 
    level_exercises,
    world_levels,
    worlds,
    assignments, 
    exercises,
    units,
    courses,
    user_inventory, 
    gamification_profiles, 
    store_items, 
    avatars, 
    subject_areas, 
    users, 
    classes, 
    roles, 
    centers 
CASCADE;

-- Reset Sequences
ALTER SEQUENCE roles_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE centers_id_seq RESTART WITH 1;
ALTER SEQUENCE store_items_id_seq RESTART WITH 1;
ALTER SEQUENCE avatars_id_seq RESTART WITH 1;
ALTER SEQUENCE classes_id_seq RESTART WITH 1;
ALTER SEQUENCE courses_id_seq RESTART WITH 1;
ALTER SEQUENCE units_id_seq RESTART WITH 1;
ALTER SEQUENCE exercises_id_seq RESTART WITH 1;
ALTER SEQUENCE assignments_id_seq RESTART WITH 1;
ALTER SEQUENCE worlds_id_seq RESTART WITH 1;
ALTER SEQUENCE world_levels_id_seq RESTART WITH 1;
ALTER SEQUENCE level_exercises_id_seq RESTART WITH 1;

-- 2. ROLES
INSERT INTO roles (id, name, "display_name", description, level) VALUES
(1, 'master', 'Master Admin', 'Super Administrador', 5),
(2, 'admin', 'Admin Centro', 'Administrador de Centro', 4),
(3, 'teacher', 'Profesor', 'Docente', 3),
(4, 'parent', 'Padre/Tutor', 'Familiar', 1),
(5, 'student', 'Estudiante', 'Alumno', 1);

-- 3. CENTERS
INSERT INTO centers (id, name, address, city, code) VALUES
(1, 'Colegio Demo', 'Calle Principal 123', 'Madrid', 'DEMO-001');

-- 4. USERS
INSERT INTO users (id, username, email, "password_hash", "role_id", "center_id", "first_name", "last_name", "academic_level", "placement_test_taken", "is_active", "created_at", "updated_at") VALUES
(1, 'master', 'master@bestkids.com', '$2b$10$zAU7YaIyUQSruN0ObmQ0lu6Znmv/3hkJ0XP2JFEK1FYFoQjXZxHhy', 1, 1, 'Super', 'Master', 'advanced', true, true, NOW(), NOW()),
(2, 'admin', 'admin@bestkids.com', '$2b$10$zAU7YaIyUQSruN0ObmQ0lu6Znmv/3hkJ0XP2JFEK1FYFoQjXZxHhy', 2, 1, 'Admin', 'Centro', 'advanced', true, true, NOW(), NOW()),
(3, 'teacher1', 'teacher@bestkids.com', '$2b$10$zAU7YaIyUQSruN0ObmQ0lu6Znmv/3hkJ0XP2JFEK1FYFoQjXZxHhy', 3, 1, 'Prof.', 'García', 'advanced', true, true, NOW(), NOW()),
(4, 'parent1', 'parent@bestkids.com', '$2b$10$zAU7YaIyUQSruN0ObmQ0lu6Znmv/3hkJ0XP2JFEK1FYFoQjXZxHhy', 4, 1, 'Juan', 'Pérez', 'beginner', false, true, NOW(), NOW());

-- 5. CLASSES
INSERT INTO classes (id, name, teacher_id, center_id, academic_year, grade, section, is_active) VALUES
(1, '5º Primaria A', 3, 1, '2025-2026', '5º Primaria', 'A', true),
(2, '5º Primaria B', 3, 1, '2025-2026', '5º Primaria', 'B', true);

-- 6. STUDENTS
INSERT INTO users (id, username, email, "password_hash", "role_id", "center_id", "class_id", "parent_id", "first_name", "last_name", "academic_level", "placement_test_taken", "is_active", "created_at", "updated_at") VALUES
(5, 'student1', 'student@bestkids.com', '$2b$10$zAU7YaIyUQSruN0ObmQ0lu6Znmv/3hkJ0XP2JFEK1FYFoQjXZxHhy', 5, 1, 1, 4, 'María', 'López', 'intermediate', false, true, NOW(), NOW()),
(6, 'student2', 'student2@bestkids.com', '$2b$10$zAU7YaIyUQSruN0ObmQ0lu6Znmv/3hkJ0XP2JFEK1FYFoQjXZxHhy', 5, 1, 1, 4, 'Carlos', 'Ruiz', 'beginner', false, true, NOW(), NOW()),
(7, 'student3', 'student3@bestkids.com', '$2b$10$zAU7YaIyUQSruN0ObmQ0lu6Znmv/3hkJ0XP2JFEK1FYFoQjXZxHhy', 5, 1, 1, NULL, 'Ana', 'Torres', 'advanced', true, true, NOW(), NOW()),
(8, 'student4', 'student4@bestkids.com', '$2b$10$zAU7YaIyUQSruN0ObmQ0lu6Znmv/3hkJ0XP2JFEK1FYFoQjXZxHhy', 5, 1, 2, NULL, 'Pedro', 'Sánchez', 'intermediate', false, true, NOW(), NOW());

-- 7. SUBJECT AREAS
INSERT INTO subject_areas (id, name, description, icon, color_hex, order_index, is_active) VALUES
(1, 'Matemáticas', 'Lógica y números', 'calculate', '#FF5722', 1, true),
(2, 'Lenguaje', 'Lectura y escritura', 'menu_book', '#2196F3', 2, true),
(3, 'Ciencia', 'El mundo natural', 'science', '#4CAF50', 3, true);

-- 8. COURSES
INSERT INTO courses (id, name, description, level, subject_area, is_active) VALUES
(1, 'Matemáticas 5º Primaria', 'Curso completo de matemáticas para quinto grado', '5º Primaria', 'math', true),
(2, 'Lenguaje 5º Primaria', 'Lectura, escritura y gramática para quinto grado', '5º Primaria', 'language', true),
(3, 'Ciencias Naturales 5º', 'Exploración del mundo natural y científico', '5º Primaria', 'science', true);

-- 9. UNITS
INSERT INTO units (id, course_id, title, description, order_index, is_active) VALUES
(1, 1, 'Operaciones Básicas', 'Suma, resta, multiplicación y división', 1, true),
(2, 1, 'Números y Secuencias', 'Patrones numéricos y series', 2, true),
(3, 2, 'Vocabulario en Inglés', 'Palabras básicas y colores', 1, true),
(4, 2, 'Gramática Fundamental', 'Estructura de oraciones', 2, true),
(5, 3, 'El Espacio', 'Astronomía y planetas', 1, true),
(6, 3, 'Seres Vivos', 'Animales y ciclos de vida', 2, true);

-- 10. WORLDS
INSERT INTO worlds (id, name, description, icon, background_image, color_theme, order_index, points_to_unlock, subject_area_id) VALUES
(1, 'La Cueva de los Números', 'Explora las profundidades de la lógica matemática.', 'calculate', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop', '#FF5722', 1, 0, 1),
(2, 'El Palacio de las Letras', 'Aprende a comunicarte con elocuencia.', 'menu_book', 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800&auto=format&fit=crop', '#2196F3', 2, 500, 2),
(3, 'Laboratorio Espacial', 'Descubre los secretos del universo.', 'science', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop', '#4CAF50', 3, 1000, 3);

-- 11. WORLD LEVELS
INSERT INTO world_levels (id, world_id, name, description, level_number, points_to_unlock, stars_required) VALUES
(1, 1, 'Nivel 1: El Desafío Inicial', 'Tus primeros pasos.', 1, 0, 0),
(2, 1, 'Nivel 2: Operaciones Avanzadas', 'Dominando lo básico.', 2, 100, 3);

-- 12. EXERCISES (2 per type, total 14) - NOW WITH unit_id
-- Type: multiple_choice
INSERT INTO exercises (id, unit_id, subject_area_id, title, description, exercise_type, difficulty_level, content, correct_answer, points, is_active, created_by) VALUES
(1, 1, 1, 'Suma Básica', 'Resuelve la operación', 'multiple_choice', 'easy', '{"question":"¿Cuánto es 15 + 27?","options":["32","42","52"]}', '{"answer":"42"}', 10, true, 3),
(2, 3, 2, 'Colores en Inglés', 'Elige el color correcto', 'multiple_choice', 'easy', '{"question":"What color is the sky?","options":["Green","Red","Blue"]}', '{"answer":"Blue"}', 10, true, 3);

-- Type: true_false
INSERT INTO exercises (id, unit_id, subject_area_id, title, description, exercise_type, difficulty_level, content, correct_answer, points, is_active, created_by) VALUES
(3, 5, 3, 'Gravedad Lunar', 'Hechos espaciales', 'true_false', 'easy', '{"question":"La luna tiene gravedad"}', '{"answer": true}', 10, true, 3),
(4, 2, 1, 'Números Primos', 'Verifica la propiedad', 'true_false', 'medium', '{"question":"El número 1 es un número primo"}', '{"answer": false}', 15, true, 3);

-- Type: matching
INSERT INTO exercises (id, unit_id, subject_area_id, title, description, exercise_type, difficulty_level, content, correct_answer, points, is_active, created_by) VALUES
(5, 3, 2, 'Parejas de Animales', 'Une el español con el inglés', 'matching', 'easy', '{"question":"Une los animales","leftColumn":[{"id":"L1","text":"Perro"},{"id":"L2","text":"Gato"}],"rightColumn":[{"id":"R1","text":"Dog"},{"id":"R2","text":"Cat"}],"correctPairs":[{"left":"L1","right":"R1"},{"left":"L2","right":"R2"}]}', '[{"left":"L1","right":"R1"},{"left":"L2","right":"R2"}]', 20, true, 3),
(6, 1, 1, 'Resultados Rápidos', 'Une la operación con su resultado', 'matching', 'medium', '{"question":"Une la operación","leftColumn":[{"id":"L1","text":"5 + 5"},{"id":"L2","text":"2 x 2"}],"rightColumn":[{"id":"R1","text":"10"},{"id":"R2","text":"4"}],"correctPairs":[{"left":"L1","right":"R1"},{"left":"L2","right":"R2"}]}', '[{"left":"L1","right":"R1"},{"left":"L2","right":"R2"}]', 20, true, 3);

-- Type: fill_blanks
INSERT INTO exercises (id, unit_id, subject_area_id, title, description, exercise_type, difficulty_level, content, correct_answer, points, is_active, created_by) VALUES
(7, 2, 1, 'Secuencias Numéricas', 'Rellena el hueco', 'fill_blanks', 'easy', '{"question":"Completa la serie","text":"2, 4, {0}, 8","blanks":[{"id":"0","correctAnswers":["6"]}]}', '{"0":"6"}', 15, true, 3),
(8, 4, 2, 'Gramática Básica', 'Completa la frase', 'fill_blanks', 'medium', '{"question":"Completa la frase","text":"I {0} a student.","blanks":[{"id":"0","correctAnswers":["am"]}]}', '{"0":"am"}', 15, true, 3);

-- Type: sequence
INSERT INTO exercises (id, unit_id, subject_area_id, title, description, exercise_type, difficulty_level, content, correct_answer, points, is_active, created_by) VALUES
(9, 2, 1, 'Orden Numérico', 'Ordena de menor a mayor', 'sequence', 'easy', '{"question":"Ordena los números","items":[{"id":"1","text":"15","order":1},{"id":"2","text":"25","order":2},{"id":"3","text":"35","order":3}]}', '["1","2","3"]', 15, true, 3),
(10, 6, 3, 'Ciclo de Vida', 'Ordena las etapas', 'sequence', 'medium', '{"question":"Ciclo de la mariposa","items":[{"id":"1","text":"Huevo","order":1},{"id":"2","text":"Oruga","order":2},{"id":"3","text":"Mariposa","order":3}]}', '["1","2","3"]', 25, true, 3);

-- Type: multi_select
INSERT INTO exercises (id, unit_id, subject_area_id, title, description, exercise_type, difficulty_level, content, correct_answer, points, is_active, created_by) VALUES
(11, 6, 3, 'Mamíferos Marinos', 'Selecciona todos los que sean mamíferos', 'multi_select', 'medium', '{"question":"¿Cuáles son mamíferos?","options":["Ballena","Delfín","Tiburón"]}', '["Ballena","Delfín"]', 20, true, 3),
(12, 1, 1, 'Números Pares', 'Selecciona los números pares', 'multi_select', 'easy', '{"question":"¿Cuáles son pares?","options":["2","7","14"]}', '["2","14"]', 15, true, 3);

-- Type: drag_drop
INSERT INTO exercises (id, unit_id, subject_area_id, title, description, exercise_type, difficulty_level, content, correct_answer, points, is_active, created_by) VALUES
(13, 3, 2, 'Canasta de Frutas', 'Arrastra las frutas a su lugar', 'drag_drop', 'easy', '{"question":"Ordena las frutas","words":[{"id":"1","text":"Manzana"},{"id":"2","text":"Plátano"}],"correctSequence":["1","2"]}', '["1","2"]', 15, true, 3),
(14, 5, 3, 'Anatomía Humana', 'Coloca los órganos en su sitio', 'drag_drop', 'hard', '{"question":"Órganos principales","words":[{"id":"1","text":"Cerebro"},{"id":"2","text":"Corazón"}],"correctSequence":["1","2"]}', '["1","2"]', 30, true, 3);

-- 13. LEVEL EXERCISES (Link to world levels)
INSERT INTO level_exercises (level_id, exercise_id, order_index, is_required) VALUES
(1, 1, 1, true), (1, 3, 2, true), (1, 5, 3, true), (1, 7, 4, true), (1, 9, 5, true), (1, 11, 6, true), (1, 13, 7, true),
(2, 2, 1, true), (2, 4, 2, true), (2, 6, 3, true), (2, 8, 4, true), (2, 10, 5, true), (2, 12, 6, true), (2, 14, 7, true);

-- 14. ASSIGNMENTS
INSERT INTO assignments (teacher_id, student_id, exercise_id, class_id, title, status, is_graded, created_at, due_date)
SELECT 3, s.id, e.id, s.class_id, e.title, 'pending', false, NOW(), NOW() + INTERVAL '15 days'
FROM users s CROSS JOIN exercises e
WHERE s.role_id = 5 AND s.id IN (5, 6, 7);

-- 15. GAMIFICATION PROFILES
INSERT INTO gamification_profiles ("user_id", "total_points", "current_streak_days", "current_level", "monthly_points")
SELECT id, 
       CASE WHEN role_id = 5 THEN 2500 ELSE 100 END,
       CASE WHEN role_id = 5 THEN 5 ELSE 0 END,
       CASE WHEN role_id = 5 THEN 5 ELSE 1 END,
       200
FROM users;

-- 16. STORE ITEMS (10 power-ups with images)
INSERT INTO store_items (name, type, cost, description, "unlock_level", "imageUrl") VALUES
('Poción de Sabiduría', 'powerup', 50, 'Duplica los puntos por 30 min', 1, 'https://images.unsplash.com/photo-1599408162172-fe5bdf5fcbbd?w=600&h=600&fit=crop'),
('Escudo Anti-Error', 'powerup', 100, 'Protege tu racha de una respuesta incorrecta', 1, 'https://images.unsplash.com/photo-1598921821422-487625be2864?w=600&h=600&fit=crop'),
('Reloj del Tiempo', 'powerup', 75, 'Añade 2 minutos extra en ejercicios cronometrados', 1, 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=600&h=600&fit=crop'),
('Estrella Dorada', 'powerup', 150, 'Convierte un error en acierto automáticamente', 2, 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=600&fit=crop'),
('Multiplicador x2', 'powerup', 200, 'Duplica las recompensas del próximo ejercicio', 3, 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=600&h=600&fit=crop'),
('Cofre Misterioso', 'powerup', 500, 'Contiene una recompensa aleatoria especial', 5, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=600&fit=crop'),
('Rayo de Energía', 'powerup', 120, 'Reduce el tiempo de espera entre ejercicios', 2, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=600&fit=crop'),
('Gema de Conocimiento', 'powerup', 300, 'Revela una pista en el próximo ejercicio difícil', 4, 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=600&fit=crop'),
('Bomba de Puntos', 'powerup', 250, 'Triplica los puntos del próximo ejercicio perfecto', 3, 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=600&h=600&fit=crop'),
('Llave Maestra', 'powerup', 1000, 'Desbloquea cualquier nivel inmediatamente', 10, 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=600&h=600&fit=crop');

-- 17. AVATARS
-- 17. AVATARS (8 avatars with images)
INSERT INTO avatars (name, emoji, image_url, price, unlock_points_required, unlock_level_required, is_default, collection, rarity) VALUES
('León Valiente', '🦁', 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=400&h=400&fit=crop', 0, 0, 1, true, 'Animales', 'Común'),
('Robot Héroe', '🤖', 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=400&h=400&fit=crop', 500, 0, 1, false, 'Espacial', 'Raro'),
('Gatito Feliz', '🐱', 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop', 0, 0, 1, false, 'Animales', 'Común'),
('Mago Supremo', '🧙', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=400&fit=crop', 2500, 0, 5, false, 'Fantasía', 'Legendario'),
('Explorador', '🧭', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=400&fit=crop', 250, 0, 1, false, 'Básica', 'Común'),
('Ninja Bot', '🥷', 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=400&h=400&fit=crop', 5000, 5000, 10, false, 'Cyber', 'Épico'),
('Princesa Smart', '👸', 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=400&fit=crop', 0, 0, 1, false, 'Realeza', 'Raro'),
('El Artista', '🎨', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop', 600, 0, 1, false, 'Creativa', 'Nuevo');


-- 18. ACHIEVEMENTS (10 achievements con esquema correcto)
INSERT INTO achievements (name, description, icon, type, category, points_reward, requirement_value, requirement_type, is_active) VALUES
('Primer Paso', 'Completa tu primer ejercicio', 'emoji_events', 'bronze', 'exercises', 10, 1, 'count', true),
('Aprendiz Dedicado', 'Completa 10 ejercicios', 'school', 'silver', 'exercises', 50, 10, 'count', true),
('Maestro del Conocimiento', 'Completa 50 ejercicios', 'workspace_premium', 'gold', 'exercises', 200, 50, 'count', true),
('Racha de Fuego', 'Mantén una racha de 7 días', 'local_fire_department', 'silver', 'streak', 100, 7, 'count', true),
('Perfeccionista', 'Consigue 10 ejercicios perfectos', 'star', 'silver', 'perfect', 150, 10, 'count', true),
('Velocista', 'Completa un ejercicio en menos de 1 minuto', 'speed', 'bronze', 'speed', 75, 60, 'time', true),
('Coleccionista', 'Desbloquea 5 avatares', 'collections', 'silver', 'exercises', 100, 5, 'count', true),
('Millonario', 'Acumula 1000 puntos', 'monetization_on', 'gold', 'points', 500, 1000, 'count', true),
('Explorador', 'Completa ejercicios de 3 mundos diferentes', 'explore', 'silver', 'explorer', 150, 3, 'count', true),
('Leyenda', 'Alcanza el nivel 10', 'military_tech', 'gold', 'level', 1000, 10, 'count', true);

-- 19. USER ACHIEVEMENTS (Unlock some for students)
INSERT INTO user_achievements (user_id, achievement_id, unlocked_at) VALUES
(5, 1, NOW()), -- Estudiante 1: Primer Paso
(5, 2, NOW()), -- Estudiante 1: Aprendiz Dedicado
(6, 1, NOW()), -- Estudiante 2: Primer Paso
(7, 1, NOW()); -- Estudiante 3: Primer Paso

-- 20. STUDENT ITEMS (5 items por estudiante con imágenes)
INSERT INTO user_inventory ("user_id", "item_id", "acquired_at")
SELECT u.id, si.id, NOW()
FROM users u
CROSS JOIN store_items si
WHERE u.role_id = 5 AND si.id IN (1, 2, 3, 4, 5);

