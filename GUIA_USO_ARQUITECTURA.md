# 🚀 Guía Práctica de Uso - Arquitectura de Entidades

## 📋 Ejemplos de Uso de tu Arquitectura

### 🎯 **Escenario 1: Crear un Curso Completo de Python Básico**

#### **Paso 1: Crear el Curso**
```http
POST /api/courses
Content-Type: application/json

{
  "title": "Python para Principiantes",
  "description": "Curso introductorio de Python con ejercicios prácticos",
  "level": "Básico",
  "orden": 1
}
```

#### **Paso 2: Crear Lecciones del Curso**
```http
POST /api/lessons
Content-Type: application/json

{
  "title": "Variables y Tipos de Datos",
  "description": "Aprende sobre variables, strings, números y booleanos",
  "courseId": 1
}
```

#### **Paso 3: Agregar Contenido a la Lección**
```http
POST /api/contenido
Content-Type: application/json

{
  "leccionId": 1,
  "active": true
}
```

#### **Paso 4: Agregar Recursos (Video explicativo)**
```http
POST /api/resources
Content-Type: application/json

{
  "contentId": 1,
  "typeId": 1, // Video type
  "url": "https://storage.example.com/videos/python-variables.mp4",
  "title": "Introducción a Variables en Python"
}
```

#### **Paso 5: Agregar Quiz de Evaluación**
```http
POST /api/quizzes
Content-Type: application/json

{
  "titulo": "Quiz: Variables en Python",
  "descripcion": "Evalúa tu conocimiento sobre variables",
  "duracionMinutos": 15,
  "intentosPermitidos": 3,
  "puntuacionAprobacion": 70,
  "aleatorio": true,
  "active": true,
  "contenidoId": 1
}
```

#### **Paso 6: Agregar Preguntas al Quiz**
```http
POST /api/questions
Content-Type: application/json

{
  "quizId": 1,
  "textoPregunta": "¿Cuál es la forma correcta de declarar una variable en Python?",
  "tipoPregunta": "multiple_choice",
  "puntos": 10,
  "opciones": {
    "a": "var x = 5",
    "b": "x = 5",
    "c": "int x = 5",
    "d": "declare x = 5"
  },
  "respuestaCorrecta": "b",
  "explicacion": "En Python no necesitas declarar el tipo de variable explícitamente"
}
```

#### **Paso 7: Agregar Práctica de Código**
```http
POST /api/practices
Content-Type: application/json

{
  "leccionId": 1,
  "instrucciones": "Crea una variable llamada 'nombre' con tu nombre y otra llamada 'edad' con tu edad. Luego imprime ambas.",
  "codigoInicial": "# Escribe tu código aquí\n\n",
  "solucionReferencia": "nombre = \"Juan\"\nedad = 25\nprint(f\"Mi nombre es {nombre} y tengo {edad} años\")",
  "casosPrueba": "[{\"input\":\"\",\"expected_output\":\"Mi nombre es.*y tengo.*años\"}]",
  "restricciones": "Debes usar variables y la función print()",
  "intentosMax": 5
}
```

---

### 🔍 **Escenario 2: Estudiante Filtrando Lecciones por Nivel**

#### **Obtener Cursos de Nivel Intermedio**
```http
GET /api/lessons/course/2/level/Intermedio
```

**Respuesta:**
```json
[
  {
    "id": 5,
    "title": "Programación Orientada a Objetos",
    "description": "Clases, objetos y herencia en Python",
    "active": true,
    "createdAt": "2025-05-27",
    "updatedAt": "2025-05-27",
    "course": {
      "id": 2,
      "title": "Python Intermedio",
      "level": "Intermedio"
    },
    "quizId": 3,
    "practiceId": 5
  }
]
```

#### **Obtener Solo Lecciones Activas de un Nivel**
```http
GET /api/lessons?courseId=1&level=Básico&active=true
```

---

### 📊 **Escenario 3: Seguimiento de Progreso de Estudiante**

#### **Estudiante Intenta Resolver una Práctica**
```http
POST /api/try-practices
Content-Type: application/json

{
  "estudianteProgresoId": 123,
  "practiceId": 1,
  "codigoEnviado": "nombre = \"Maria\"\nedad = 22\nprint(f\"Mi nombre es {nombre} y tengo {edad} años\")",
  "resultadosPruebas": "✅ Test 1 pasado\n✅ Test 2 pasado",
  "aprobado": true,
  "retroalimentacion": "¡Excelente! Has usado correctamente las variables y f-strings."
}
```

---

### 🎮 **Escenario 4: Gestión de Tipos de Recursos**

#### **Agregar Nuevo Tipo de Recurso (PDF)**
```http
POST /api/resource-types
Content-Type: application/json

{
  "extension": ".pdf",
  "name": "Documento PDF",
  "active": true
}
```

#### **Agregar Recurso PDF a una Lección**
```http
POST /api/resources
Content-Type: application/json

{
  "contentId": 1,
  "typeId": 2, // PDF type
  "url": "https://storage.example.com/docs/python-cheatsheet.pdf",
  "title": "Guía de Referencia Rápida de Python"
}
```

---

## 📈 **Casos de Uso Avanzados Soportados**

### **1. Quiz Adaptativo**
```json
{
  "aleatorio": true,
  "duracionMinutos": 30,
  "intentosPermitidos": 2,
  "puntuacionAprobacion": 80
}
```

### **2. Práctica con Múltiples Casos de Prueba**
```json
{
  "casosPrueba": "[
    {\"input\":\"5,3\",\"expected_output\":\"8\"},
    {\"input\":\"10,7\",\"expected_output\":\"17\"},
    {\"input\":\"-2,4\",\"expected_output\":\"2\"}
  ]"
}
```

### **3. Recursos Multimedia Diversos**
```json
[
  {
    "type": "Video (.mp4)",
    "url": "videos/lesson1.mp4"
  },
  {
    "type": "PDF (.pdf)", 
    "url": "docs/lesson1-notes.pdf"
  },
  {
    "type": "Audio (.mp3)",
    "url": "audio/lesson1-pronunciation.mp3"
  }
]
```

### **4. Gestión de Usuarios por Rol**
```java
// Estudiante accede a su progreso
StudentEntity student = studentRepository.findById(studentId);
List<TryPracticeEntity> attempts = tryPracticeRepository.findByEstudianteProgresoId(student.getId());

// Profesor asigna curso
TeacherEntity teacher = teacherRepository.findById(teacherId);
CourseEntity course = courseRepository.findById(courseId);
teacher.getCourses().add(course);

// Admin gestiona usuarios
AdminEntity admin = adminRepository.findById(adminId);
// Admin puede acceder a todas las entidades
```

---

## 🎯 **Flujos de Trabajo Típicos**

### **👨‍🏫 Flujo del Profesor:**
1. Crear curso con nivel específico
2. Agregar lecciones ordenadas
3. Subir contenido multimedia
4. Diseñar quizzes y prácticas
5. Monitorear progreso de estudiantes

### **👨‍🎓 Flujo del Estudiante:**
1. Filtrar cursos por nivel de dificultad
2. Acceder a lecciones en orden
3. Consumir recursos (videos, PDFs)
4. Completar quizzes
5. Resolver prácticas de código
6. Revisar retroalimentación

### **👨‍💼 Flujo del Administrador:**
1. Gestionar usuarios y roles
2. Configurar tipos de recursos
3. Supervisar actividad de la plataforma
4. Mantener contenido activo

---

## 🚀 **Ventajas de tu Arquitectura**

### ✅ **Flexibilidad Total:**
- Soporte para cualquier tipo de contenido multimedia
- Quizzes configurables con preguntas JSON
- Prácticas de código con evaluación automática

### ✅ **Escalabilidad:**
- Herencia de usuarios permite nuevos roles
- ResourceTypeModel permite nuevos formatos
- Filtrado eficiente por nivel

### ✅ **Mantenibilidad:**
- Separación clara de responsabilidades
- Relaciones JPA bien definidas
- Código limpio y documentado

**¡Tu arquitectura está lista para soportar una plataforma de aprendizaje de nivel enterprise!** 🎉

---

*Guía actualizada: 27 de mayo de 2025*
