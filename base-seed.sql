-- BASE SEED (Roles & Users)

-- 1. Roles (Explicit IDs to match code: 1=Master, 2=Admin, 3=Teacher, 4=Parent, 5=Student)
INSERT INTO roles (id, name, "display_name", description, level) VALUES
(1, 'master', 'Master', 'Rol super admin', 5),
(2, 'admin', 'Administrador', 'Rol para administradores del sistema', 4),
(3, 'teacher', 'Profesor', 'Rol para profesores', 3),
(4, 'parent', 'Padre/Tutor', 'Rol para padres y tutores', 2),
(5, 'student', 'Estudiante', 'Rol para estudiantes', 1)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 2. Users (Password: admin123)
-- Hash: $2b$10$zAU7YaIyUQSruN0ObmQ0lu6Znmv/3hkJ0XP2JFEK1FYFoQjXZxHhy

INSERT INTO users (username, email, "password_hash", "role_id", "first_name", "last_name", "academic_level", "placement_test_taken", "is_active", "created_at", "updated_at") VALUES
('admin', 'admin@bestkids.com', '$2b$10$zAU7YaIyUQSruN0ObmQ0lu6Znmv/3hkJ0XP2JFEK1FYFoQjXZxHhy', (SELECT id FROM roles WHERE name = 'admin'), 'Admin', 'Master', 'advanced', true, true, NOW(), NOW()),
('teacher1', 'teacher@bestkids.com', '$2b$10$zAU7YaIyUQSruN0ObmQ0lu6Znmv/3hkJ0XP2JFEK1FYFoQjXZxHhy', (SELECT id FROM roles WHERE name = 'teacher'), 'Prof.', 'García', 'advanced', true, true, NOW(), NOW()),
('parent1', 'parent@bestkids.com', '$2b$10$zAU7YaIyUQSruN0ObmQ0lu6Znmv/3hkJ0XP2JFEK1FYFoQjXZxHhy', (SELECT id FROM roles WHERE name = 'parent'), 'Juan', 'Pérez', 'beginner', false, true, NOW(), NOW()),
('student1', 'student@bestkids.com', '$2b$10$zAU7YaIyUQSruN0ObmQ0lu6Znmv/3hkJ0XP2JFEK1FYFoQjXZxHhy', (SELECT id FROM roles WHERE name = 'student'), 'María', 'López', 'intermediate', false, true, NOW(), NOW())
ON CONFLICT (username) DO NOTHING;

-- 3. Init Gamification Profiles
INSERT INTO gamification_profiles ("user_id", "total_points", "experience_points", "coins", "current_streak_days", "current_level")
SELECT id, 0, 0, 0, 0, 1 FROM users WHERE username IN ('admin', 'teacher1', 'parent1', 'student1')
ON CONFLICT ("user_id") DO NOTHING;

-- 4. Centers (Corrected: added 'code', removed 'country')
INSERT INTO centers (name, address, city, code) VALUES
('Colegio Demo', 'Calle Principal 123', 'Madrid', 'DEMO-001')
ON CONFLICT (code) DO NOTHING;
