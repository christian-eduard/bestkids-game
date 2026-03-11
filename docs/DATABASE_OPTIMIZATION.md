# 🗄️ Análisis y Optimización de Base de Datos BestKids

## 📊 Análisis del Esquema MySQL Original

### Problemas Identificados en el Esquema Actual

#### 1. **Duplicación de Tablas**
- ❌ `PRO_courses` vs `PRO_content_courses` - Dos tablas para cursos con propósitos similares
- ❌ `PRO_entitys` y `PRO_entitymetas` - Sistema genérico innecesario
- ❌ Múltiples tablas de configuración que pueden consolidarse

#### 2. **Tablas No Utilizadas o Redundantes**
- ❌ `PRO_entitys` - Sistema genérico que no se usa correctamente
- ❌ `PRO_entitymetas` - Metadata genérica innecesaria
- ❌ `PRO_api_keys` - Puede simplificarse o eliminarse si no se usa
- ❌ `PRO_webhooks` - No implementado en el sistema actual

#### 3. **Relaciones Mal Definidas**
- ⚠️ Algunas foreign keys faltantes
- ⚠️ Uso de MyISAM en lugar de InnoDB (sin transacciones)
- ⚠️ Campos `idrole` como INT en lugar de ENUM o tabla de roles

#### 4. **Nomenclatura Inconsistente**
- ⚠️ Mezcla de `id` y `idaccount`, `idrelation`, etc.
- ⚠️ Campos en inglés y español mezclados
- ⚠️ Prefijo `PRO_` innecesario en PostgreSQL

---

## ✅ Esquema Optimizado Propuesto

### Principios de Optimización

1. **Normalización Correcta**: 3FN sin redundancias
2. **Nomenclatura Consistente**: Todo en inglés, snake_case
3. **Relaciones Claras**: Foreign keys bien definidas
4. **Índices Estratégicos**: Solo donde realmente se necesitan
5. **JSON para Flexibilidad**: Contenido dinámico en JSON
6. **Soft Deletes**: deleted_at para auditoría

---

## 📋 Estructura Optimizada de Tablas

### MÓDULO 1: AUTENTICACIÓN Y USUARIOS (5 tablas)

#### 1. `users` (antes PRO_accounts)
```sql
- id (PK)
- role_id (FK → roles.id)
- center_id (FK → centers.id, nullable)
- username (unique)
- password_hash
- email (unique)
- first_name
- last_name
- phone
- birth_date
- avatar_id (FK → avatars.id, nullable)
- language_code (default: 'es')
- is_active (default: true)
- last_login_at
- last_login_ip
- created_at
- updated_at
- deleted_at (soft delete)
```

#### 2. `roles` (simplificado)
```sql
- id (PK)
- name (unique: 'master', 'center_admin', 'teacher', 'parent', 'student')
- display_name
- description
- level (jerarquía: 1-5)
- permissions (JSON)
- created_at
- updated_at
```

#### 3. `sessions` (nueva - para JWT refresh tokens)
```sql
- id (PK)
- user_id (FK → users.id)
- refresh_token (unique)
- expires_at
- ip_address
- user_agent
- created_at
```

#### 4. `parent_student_relations` (antes PRO_parent_child)
```sql
- id (PK)
- parent_id (FK → users.id)
- student_id (FK → users.id)
- relationship_type ('father', 'mother', 'guardian')
- is_primary (default: false)
- created_at
- updated_at
```

#### 5. `password_resets` (nueva)
```sql
- id (PK)
- user_id (FK → users.id)
- token (unique)
- expires_at
- created_at
```

---

### MÓDULO 2: CENTROS EDUCATIVOS (3 tablas)

#### 6. `centers` (antes PRO_centers)
```sql
- id (PK)
- code (unique)
- name
- address
- city
- postal_code
- phone
- email
- director_name
- logo_url
- is_active (default: true)
- created_at
- updated_at
```

#### 7. `center_users` (antes PRO_center_users - optimizada)
```sql
- id (PK)
- center_id (FK → centers.id)
- user_id (FK → users.id)
- role_in_center ('admin', 'teacher', 'student')
- assigned_at
- is_active (default: true)
```

#### 8. `grade_levels` (antes PRO_grade_levels)
```sql
- id (PK)
- name ('1º Primaria', '2º Primaria', etc.)
- level_order (1, 2, 3, etc.)
- min_age
- max_age
```

---

### MÓDULO 3: ORGANIZACIÓN ACADÉMICA (4 tablas - CONSOLIDADO)

#### 9. `courses` (CONSOLIDADO: PRO_courses + PRO_content_courses)
```sql
- id (PK)
- center_id (FK → centers.id)
- grade_level_id (FK → grade_levels.id)
- subject_area_id (FK → subject_areas.id)
- name
- description
- academic_year ('2024-2025')
- start_date
- end_date
- is_active (default: true)
- created_by (FK → users.id)
- created_at
- updated_at
```

#### 10. `groups` (antes PRO_groups - clases/secciones)
```sql
- id (PK)
- course_id (FK → courses.id)
- name ('A', 'B', 'C')
- teacher_id (FK → users.id)
- max_students (default: 25)
- created_at
- updated_at
```

#### 11. `group_students` (antes PRO_group_students)
```sql
- id (PK)
- group_id (FK → groups.id)
- student_id (FK → users.id)
- enrolled_at
- status ('active', 'inactive', 'completed')
```

#### 12. `subject_areas` (antes PRO_subject_areas)
```sql
- id (PK)
- name ('Matemáticas', 'Lengua', 'Ciencias', 'Historia')
- description
- icon ('calculator', 'book', 'flask', 'landmark')
- color_hex ('#FF6B6B', '#4ECDC4', etc.)
- order_index
- is_active (default: true)
```

---

### MÓDULO 4: EJERCICIOS EDUCATIVOS (3 tablas - OPTIMIZADO)

#### 13. `exercises` (antes PRO_exercises - mejorado)
```sql
- id (PK)
- subject_area_id (FK → subject_areas.id)
- title
- description
- exercise_type ('multiple_choice', 'drag_drop', 'matching', 'fill_blank', 'sequence', 'true_false')
- difficulty_level ('easy', 'medium', 'hard')
- content (JSONB) - contenido específico por tipo
- correct_answer (JSONB)
- points (default: 10)
- estimated_time_minutes
- hints (JSONB array)
- tags (JSONB array)
- is_active (default: true)
- created_by (FK → users.id)
- created_at
- updated_at
```

#### 14. `exercise_attempts` (antes PRO_exercise_attempts)
```sql
- id (PK)
- exercise_id (FK → exercises.id)
- student_id (FK → users.id)
- assignment_id (FK → assignments.id, nullable)
- attempt_number
- student_answer (JSONB)
- is_correct
- score (0-100)
- points_earned
- time_spent_seconds
- hints_used
- completed_at
- created_at
```

#### 15. `exercise_feedback` (nueva - para comentarios del profesor)
```sql
- id (PK)
- attempt_id (FK → exercise_attempts.id)
- teacher_id (FK → users.id)
- feedback_text
- rating (1-5)
- created_at
```

---

### MÓDULO 5: ASIGNACIONES (3 tablas - SIMPLIFICADO)

#### 16. `assignments` (antes PRO_assignments - optimizado)
```sql
- id (PK)
- teacher_id (FK → users.id)
- group_id (FK → groups.id, nullable)
- title
- description
- instructions
- assignment_type ('individual', 'group')
- subject_area_id (FK → subject_areas.id)
- difficulty_level (1-5)
- total_points
- time_limit_minutes (nullable)
- start_date
- due_date
- allow_late_submission (default: false)
- is_active (default: true)
- created_at
- updated_at
```

#### 17. `assignment_exercises` (antes PRO_assignment_exercises)
```sql
- id (PK)
- assignment_id (FK → assignments.id)
- exercise_id (FK → exercises.id)
- order_index
- points
- is_required (default: true)
```

#### 18. `student_assignments` (antes PRO_student_assignments - mejorado)
```sql
- id (PK)
- assignment_id (FK → assignments.id)
- student_id (FK → users.id)
- status ('assigned', 'in_progress', 'completed', 'overdue')
- started_at
- completed_at
- submitted_at
- score
- total_points_earned
- time_spent_seconds
- is_late
- teacher_feedback
- created_at
- updated_at
```

---

### MÓDULO 6: GAMIFICACIÓN (5 tablas - OPTIMIZADO)

#### 19. `gamification_profiles` (antes PRO_gamification - mejorado)
```sql
- id (PK)
- user_id (FK → users.id, unique)
- total_points
- current_level (1-10)
- experience_points
- daily_points
- weekly_points
- monthly_points
- current_streak_days
- longest_streak_days
- last_activity_date
- created_at
- updated_at
```

#### 20. `achievements` (antes PRO_achievements - mejorado)
```sql
- id (PK)
- name
- description
- achievement_type ('medal', 'badge', 'milestone')
- tier ('bronze', 'silver', 'gold', 'diamond')
- icon_url
- points_required
- condition_type ('points', 'streak', 'exercises', 'perfect_score')
- condition_value (JSONB)
- is_active (default: true)
- created_at
```

#### 21. `user_achievements` (antes PRO_user_achievements)
```sql
- id (PK)
- user_id (FK → users.id)
- achievement_id (FK → achievements.id)
- unlocked_at
- progress (0-100)
```

#### 22. `avatars` (nueva - sistema de avatares)
```sql
- id (PK)
- name
- emoji ('🦁', '🐼', '🦊', etc.)
- image_url
- unlock_points_required
- unlock_level_required
- is_default (default: false)
- created_at
```

#### 23. `points_transactions` (nueva - historial de puntos)
```sql
- id (PK)
- user_id (FK → users.id)
- points_change (+/-)
- reason ('exercise_completed', 'achievement_unlocked', 'streak_bonus')
- reference_type ('exercise', 'achievement', 'assignment')
- reference_id
- balance_after
- created_at
```

---

### MÓDULO 7: PROGRESO Y ANALYTICS (3 tablas - OPTIMIZADO)

#### 24. `student_progress` (antes PRO_student_progress + PRO_area_progress - CONSOLIDADO)
```sql
- id (PK)
- student_id (FK → users.id)
- subject_area_id (FK → subject_areas.id)
- current_difficulty_level (1-5)
- total_exercises_attempted
- total_exercises_completed
- correct_exercises
- accuracy_percentage
- average_score
- total_time_spent_seconds
- consecutive_correct
- consecutive_wrong
- last_activity_at
- created_at
- updated_at
```

#### 25. `learning_recommendations` (nueva - sistema adaptativo)
```sql
- id (PK)
- student_id (FK → users.id)
- exercise_id (FK → exercises.id)
- recommendation_type ('review', 'challenge', 'practice')
- priority ('low', 'medium', 'high')
- reasoning (JSONB)
- confidence_score (0-1)
- is_active (default: true)
- generated_at
- expires_at
```

#### 26. `activity_logs` (nueva - para analytics)
```sql
- id (PK)
- user_id (FK → users.id)
- activity_type ('login', 'exercise_start', 'exercise_complete', 'achievement_unlock')
- metadata (JSONB)
- ip_address
- user_agent
- created_at
```

---

### MÓDULO 8: NOTIFICACIONES (2 tablas - SIMPLIFICADO)

#### 27. `notifications` (antes PRO_notifications - optimizado)
```sql
- id (PK)
- user_id (FK → users.id)
- type ('achievement', 'assignment', 'message', 'system')
- title
- message
- data (JSONB)
- priority ('low', 'normal', 'high')
- is_read (default: false)
- read_at
- expires_at
- created_at
```

#### 28. `notification_preferences` (nueva)
```sql
- id (PK)
- user_id (FK → users.id, unique)
- email_enabled (default: true)
- push_enabled (default: true)
- notification_types (JSONB) - tipos habilitados
- quiet_hours_start
- quiet_hours_end
- updated_at
```

---

## 📊 Resumen de Optimización

### Antes (MySQL)
- **Total de tablas**: 50+
- **Tablas duplicadas**: 5-7
- **Tablas no utilizadas**: 10+
- **Engine**: MyISAM (sin transacciones)
- **Nomenclatura**: Inconsistente

### Después (PostgreSQL Optimizado)
- **Total de tablas**: 28 (reducción del 44%)
- **Tablas duplicadas**: 0
- **Tablas no utilizadas**: 0
- **Engine**: PostgreSQL (ACID compliant)
- **Nomenclatura**: Consistente (snake_case)

### Mejoras Clave

1. ✅ **Consolidación**: `courses` unifica PRO_courses + PRO_content_courses
2. ✅ **Eliminación**: Removidas tablas genéricas (entitys, entitymetas)
3. ✅ **Nuevas tablas útiles**: sessions, password_resets, points_transactions
4. ✅ **Mejor normalización**: Relaciones claras y consistentes
5. ✅ **JSON estratégico**: Para contenido dinámico (exercise content, metadata)
6. ✅ **Índices optimizados**: Solo donde realmente mejoran performance
7. ✅ **Soft deletes**: Auditoría sin pérdida de datos

---

## 🎯 Próximos Pasos

1. Crear migraciones TypeORM para todas las tablas
2. Crear seeds con datos iniciales
3. Implementar entidades TypeORM optimizadas
4. Configurar relaciones entre entidades
5. Crear índices estratégicos
