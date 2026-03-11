-- BASE SEED (Roles & Users)

-- 1. Roles (Corrected columns: display_name, level)
INSERT INTO roles (name, "display_name", description, level) VALUES
('student', 'Estudiante', 'Rol para estudiantes', 1),
('parent', 'Padre/Tutor', 'Rol para padres y tutores', 1),
('teacher', 'Profesor', 'Rol para profesores', 3),
('admin', 'Administrador', 'Rol para administradores del sistema', 4),
('master', 'Master', 'Rol super admin', 5)
ON CONFLICT (name) DO NOTHING;

-- 2. Users (Password: admin123)
-- Hash: $2b$10$zAU7YaIyUQSruN0ObmQ0lu6Znmv/3hkJ0XP2JFEK1FYFoQjXZxHhy

INSERT INTO users (username, email, "password_hash", "role_id", "first_name", "last_name", "academic_level", "placement_test_taken", "is_active", "created_at", "updated_at") VALUES
('admin', 'admin@bestkids.com', '$2b$10$zAU7YaIyUQSruN0ObmQ0lu6Znmv/3hkJ0XP2JFEK1FYFoQjXZxHhy', (SELECT id FROM roles WHERE name = 'admin'), 'Admin', 'Master', 'advanced', true, true, NOW(), NOW()),
('teacher1', 'teacher@bestkids.com', '$2b$10$zAU7YaIyUQSruN0ObmQ0lu6Znmv/3hkJ0XP2JFEK1FYFoQjXZxHhy', (SELECT id FROM roles WHERE name = 'teacher'), 'Prof.', 'García', 'advanced', true, true, NOW(), NOW()),
('parent1', 'parent@bestkids.com', '$2b$10$zAU7YaIyUQSruN0ObmQ0lu6Znmv/3hkJ0XP2JFEK1FYFoQjXZxHhy', (SELECT id FROM roles WHERE name = 'parent'), 'Juan', 'Pérez', 'beginner', false, true, NOW(), NOW()),
('student1', 'student@bestkids.com', '$2b$10$zAU7YaIyUQSruN0ObmQ0lu6Znmv/3hkJ0XP2JFEK1FYFoQjXZxHhy', (SELECT id FROM roles WHERE name = 'student'), 'María', 'López', 'intermediate', false, true, NOW(), NOW())
ON CONFLICT (username) DO NOTHING;

-- 3. Init Gamification Profiles
INSERT INTO gamification_profiles ("user_id", "total_points", "current_streak_days", "current_level")
SELECT id, 0, 0, 1 FROM users WHERE username IN ('admin', 'teacher1', 'parent1', 'student1')
ON CONFLICT ("user_id") DO NOTHING;

-- 4. Centers (Corrected: added 'code', removed 'country')
INSERT INTO centers (name, address, city, code) VALUES
('Colegio Demo', 'Calle Principal 123', 'Madrid', 'DEMO-001')
ON CONFLICT (code) DO NOTHING;
