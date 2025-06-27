-- Agregar columnas para el progreso del quiz en student_course_enrollment
ALTER TABLE student_course_enrollment 
ADD COLUMN quiz_completed BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE student_course_enrollment 
ADD COLUMN quiz_score INTEGER;

ALTER TABLE student_course_enrollment 
ADD COLUMN quiz_attempts INTEGER NOT NULL DEFAULT 0;

ALTER TABLE student_course_enrollment 
ADD COLUMN best_quiz_score INTEGER;

-- Actualizar registros existentes para que tengan valores por defecto
UPDATE student_course_enrollment 
SET quiz_completed = FALSE, 
    quiz_attempts = 0 
WHERE quiz_completed IS NULL;
