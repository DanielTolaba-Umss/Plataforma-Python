# Plataforma Inclusiva de Enseñanza de Introducción a la Programación con Python

## 📑 Índice

- [Introducción y Metas](#-introducción-y-metas)
- [Vista de Requerimientos](#-vista-de-requerimientos)
  - [Requerimientos Funcionales Principales](#requerimientos-funcionales-principales)
  - [Requerimientos No Funcionales Principales](#requerimientos-no-funcionales-principales)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Configuración del Entorno de Desarrollo](#-configuración-del-entorno-de-desarrollo)

---

## 📚 Introducción y Metas

Esta plataforma busca **democratizar el acceso a la educación en programación**, eliminando barreras institucionales, lingüísticas y de accesibilidad que dificultan el aprendizaje en distintas unidades educativas.

Los objetivos principales son:

- Acceso a contenido educativo de alta calidad basado en **Recursos Educativos Abiertos (OER)**.
- Asistencia personalizada a través de un **agente de inteligencia artificial**.
- Evaluaciones adaptativas según el **nivel de competencia** del estudiante.
- **Persistencia del progreso** educativo, incluso si el estudiante cambia de institución.

---

## 🛠️ Vista de Requerimientos

### Requerimientos Funcionales Principales

#### Gestor de Cursos y Contenidos

- Creación y organización de módulos por niveles (básico, intermedio, avanzado).
- Soporte para múltiples formatos (textos, videos, quizzes, ejercicios prácticos).
- Ejecución y corrección automática de código Python en un entorno seguro.

#### Movilidad Estudiantil

- Registro persistente del progreso de aprendizaje de los estudiantes.
- Transferencia segura de datos de progreso entre instituciones educativas.
- Implementación de estándares de interoperabilidad: **xAPI**, **LOM**, **SCORM**.

#### Evaluación y Certificación

- Evaluaciones adaptativas basadas en el nivel de competencia.
- Retroalimentación personalizada y múltiples intentos en ejercicios.
- Emisión automática de certificados al completar módulos o niveles.

#### Autenticación y Roles

- Autenticación segura mediante **OAuth2**.
- Gestión de roles: **estudiante**, **docente** y **administrador**.
- Administración de usuarios por cada institución.

---

### Requerimientos No Funcionales Principales

#### Accesibilidad

- Cumplimiento con **WCAG 2.1 nivel AA**.
- Compatibilidad con tecnologías asistivas (lectores de pantalla, navegación por teclado).
- Interfaz adaptable para diferentes necesidades visuales y motoras.

#### Multilingüismo

- Soporte completo para **español**, **quechua**, **aymara** y **guaraní**.
- Estructura preparada para agregar nuevos idiomas en el futuro.

#### Seguridad

- Protección contra ejecución de código malicioso en el entorno de programación.
- **Cifrado de datos de usuario** de extremo a extremo.
- Auditoría de accesos a datos entre instituciones.

#### Interoperabilidad

- Integración con repositorios de OER (MIT OpenCourseWare, OpenStax).
- Compatibilidad con LMS existentes mediante estándares como **xAPI**, **SCORM** y **LOM**.
- APIs documentadas para facilitar la integración con sistemas de terceros.

---

## Notion

https://www.notion.so/Generaci-n-de-Software-Code-Bakers-1df9f28680c780f1a249cfde0ec02d04?pvs=4

---

## 🧩 Tecnologías

- **Frontend:** React.js
- **Backend:** Spring Boot
- **Contenedores:** Docker
- **Integración Continua:** GitHub Actions

---

## 🖥️ Instalación

### Requisitos Previos

- Node.js (versión recomendada: 18.x o superior)
- Docker y Docker Compose
- Java 17 o superior (para el backend Spring Boot)
- Git

### Clonar el repositorio

```bash
git clone https://github.com/DanielTolaba-Umss/Plataforma-Python.git
cd Plataforma-Python
```

## Levantar el proyecto en desarrollo

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

### Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

### Alternativamente, usando Docker

```bash
docker-compose up --build
```

Esto levantará tanto el frontend como el backend usando contenedores.

---

## 🛠️ Configuración del Entorno de Desarrollo

### Backend (Spring Boot)

1. Asegúrate de tener Java 17 o superior instalado
2. Navega al directorio del backend:
```bash
cd backend
```
3. Ejecuta el servidor de desarrollo:
```bash
./mvnw spring-boot:run
```
El backend estará disponible en http://localhost:8080

### Frontend (React)

1. Asegúrate de tener Node.js 18 o superior instalado
2. Navega al directorio del frontend:
```bash
cd front-end
```
3. Instala las dependencias:
```bash
npm install
```
4. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```
El frontend estará disponible en http://localhost:5173

### Verificación de la Integración

Para verificar que la integración entre frontend y backend funciona correctamente:

1. Asegúrate de que tanto el backend como el frontend estén ejecutándose
2. Abre el navegador y accede a http://localhost:5173
3. Intenta iniciar sesión o registrar un nuevo usuario
4. Navega a la sección de Gestión de Cursos
5. Intenta crear un nuevo curso o práctica

Si encuentras algún error, verifica:
- Que los servicios de backend y frontend estén ejecutándose
- Los logs del backend en la terminal correspondiente
- La consola del navegador para errores de frontend
- La configuración CORS en el backend
- La configuración de las URLs en el frontend (environment.js)
