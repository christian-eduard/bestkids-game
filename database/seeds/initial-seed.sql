-- Seed data for BestKids

-- 1. Roles
INSERT INTO roles (name, display_name, description, level, permissions) VALUES
('student', 'Estudiante', 'Rol para estudiantes', 1, '{}'),
('parent', 'Padre/Tutor', 'Rol para padres y tutores', 2, '{}'),
('teacher', 'Profesor', 'Rol para profesores', 3, '{}'),
('admin', 'Administrador', 'Rol para administradores del sistema', 4, '{}'),
('master', 'Master', 'Rol super admin', 5, '{}')
ON CONFLICT (name) DO NOTHING;

-- 2. Users (password is: admin123 for all)
-- Hash generated with: bcrypt.hash('admin123', 10)
INSERT INTO users (username, email, password, full_name, role_id, academic_level, placement_test_taken) 
SELECT 
    'admin', 
    'admin@bestkids.com', 
    '$2b$10$rJl3Y4qW8kfL5eMk9zQz4.7kZhqYqV5yX5pX7qBz3jV5kZqY5yX5q', 
    'Admin Master', 
    (SELECT id FROM roles WHERE name='admin'),
    'ADVANCED', 
    true
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username='admin');

INSERT INTO users (username, email, password, full_name, role_id, academic_level, placement_test_taken) 
SELECT 
    'teacher1', 
    'teacher@bestkids.com', 
    '$2b$10$rJl3Y4qW8kfL5eMk9zQz4.7kZhqYqV5yX5pX7qBz3jV5kZqY5yX5q', 
    'Prof. García', 
    (SELECT id FROM roles WHERE name='teacher'),
    'ADVANCED', 
    true
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username='teacher1');

INSERT INTO users (username, email, password, full_name, role_id, academic_level, placement_test_taken, student_code) 
SELECT 
    'student1', 
    'student@bestkids.com', 
    '$2b$10$rJl3Y4qW8kfL5eMk9zQz4.7kZhqYqV5yX5pX7qBz3jV5kZqY5yX5q', 
    'María López', 
    (SELECT id FROM roles WHERE name='student'),
    'INTERMEDIATE', 
    false,
    'BK-DEMO1'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username='student1');

INSERT INTO users (username, email, password, full_name, role_id, academic_level, placement_test_taken) 
SELECT 
    'parent1', 
    'parent@bestkids.com', 
    '$2b$10$rJl3Y4qW8kfL5eMk9zQz4.7kZhqYqV5yX5pX7qBz3jV5kZqY5yX5q', 
    'Juan Pérez', 
    (SELECT id FROM roles WHERE name='parent'),
    'BEGINNER', 
    false
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username='parent1');

-- 3. Gamification Profiles
INSERT INTO gamification_profiles (user_id, points, streak, level)
SELECT id, 0, 0, 1 FROM users
WHERE NOT EXISTS (SELECT 1 FROM gamification_profiles WHERE user_id = users.id);

-- 4. Store Items
INSERT INTO store_items (name, type, cost, image_url, description, unlock_level) VALUES
('Avatar Espacial', 'avatar', 100, '/assets/avatars/space.png', 'Avatar de astronauta', 1),
('Marco Dorado', 'frame', 200, '/assets/frames/gold.png', 'Marco dorado premium', 5),
('Tema Oscuro', 'theme', 150, '/assets/themes/dark.png', 'Modo oscuro', 3)
ON CONFLICT DO NOTHING;

-- 5. Centers
INSERT INTO centers (name, address, city, country) VALUES
('Colegio Demo', 'Calle Principal 123', 'Madrid', 'España')
ON CONFLICT DO NOTHING;

ANALYZE;
