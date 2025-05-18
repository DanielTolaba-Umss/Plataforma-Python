import React, { useState } from "react";
import { BookOpen, PlusCircle } from "lucide-react";
import FormularioCrearCurso from "./FormularioCrearCurso";

import styles from "/src/paginas/docente/estilos/GestionCurso.module.css";

const GestionCurso = () => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [showCourseForm, setShowCourseForm] = useState(false);

  // Mock data for courses
  const [courses, setCourses] = useState({
    basico: [
      {
        id: 1,
        title: "Introducción a Python",
        description: "Fundamentos básicos del lenguaje Python",
        lessons: 10,
      },
      {
        id: 2,
        title: "Variables y Tipos de Datos",
        description: "Aprende sobre variables y tipos en Python",
        lessons: 8,
      },
    ],
    intermedio: [
      {
        id: 3,
        title: "Estructuras de Datos Avanzadas",
        description: "Listas, diccionarios y conjuntos",
        lessons: 12,
      },
      {
        id: 4,
        title: "Funciones y Módulos",
        description: "Creación y uso de funciones en Python",
        lessons: 9,
      },
    ],
    avanzado: [
      {
        id: 5,
        title: "Programación Orientada a Objetos",
        description: "Clases, herencia y polimorfismo",
        lessons: 15,
      },
      {
        id: 6,
        title: "Desarrollo Web con Django",
        description: "Crea aplicaciones web con Django",
        lessons: 20,
      },
    ],
  });

  const handleModuleSelect = (module) => {
    setSelectedModule(module);
    setShowCourseForm(false);
  };

  const handleCreateCourse = (newCourse) => {
    if (selectedModule) {
      setCourses((prev) => ({
        ...prev,
        [selectedModule]: [...prev[selectedModule], newCourse],
      }));
      setShowCourseForm(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Gestión de Cursos</h1>
      </header>

      <main className={styles.mainContent}>
        {!selectedModule ? (
          <>
            <div className={styles.subtitleWithButton}>
              <h2 className={styles.subtitle}>
                Selecciona un módulo para gestionar
              </h2>
            </div>

            <div className={styles.modulesGrid}>
              {/* Module Cards */}
              <div
                className={styles.moduleCard}
                onClick={() => handleModuleSelect("basico")}
              >
                <div className={styles.moduleIconContainer}>
                  <BookOpen
                    className={`${styles.moduleIcon} ${styles.blueIcon}`}
                  />
                </div>
                <h3 className={styles.moduleTitle}>Módulo Básico</h3>
                <p className={styles.moduleDescription}>
                  Gestiona el contenido y las actividades del módulo básico del
                  curso.
                </p>
              </div>

              <div
                className={styles.moduleCard}
                onClick={() => handleModuleSelect("intermedio")}
              >
                <div className={styles.moduleIconContainer}>
                  <BookOpen
                    className={`${styles.moduleIcon} ${styles.greenIcon}`}
                  />
                </div>
                <h3 className={styles.moduleTitle}>Módulo Intermedio</h3>
                <p className={styles.moduleDescription}>
                  Gestiona el contenido y las actividades del módulo intermedio
                  del curso.
                </p>
              </div>

              <div
                className={styles.moduleCard}
                onClick={() => handleModuleSelect("avanzado")}
              >
                <div className={styles.moduleIconContainer}>
                  <BookOpen
                    className={`${styles.moduleIcon} ${styles.purpleIcon}`}
                  />
                </div>
                <h3 className={styles.moduleTitle}>Módulo Avanzado</h3>
                <p className={styles.moduleDescription}>
                  Gestiona el contenido y las actividades del módulo avanzado
                  del curso.
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.coursesContainer}>
            <div className={styles.coursesHeader}>
              <h2 className={styles.coursesTitle}>
                {selectedModule === "basico" && "Cursos del Módulo Básico"}
                {selectedModule === "intermedio" &&
                  "Cursos del Módulo Intermedio"}
                {selectedModule === "avanzado" && "Cursos del Módulo Avanzado"}
              </h2>
              <button
                onClick={() => setSelectedModule(null)}
                className={styles.backButton}
              >
                Volver a módulos
              </button>
            </div>

            <div className={styles.coursesGrid}>
              {courses[selectedModule].map((course) => (
                <div key={course.id} className={styles.courseCard}>
                  <h3 className={styles.courseTitle}>{course.title}</h3>
                  <p className={styles.courseDescription}>
                    {course.description}
                  </p>
                  <div className={styles.lessonsCount}>
                    {course.lessons} lecciones
                  </div>
                </div>
              ))}
            </div>

            {!showCourseForm && (
              <button
                onClick={() => setShowCourseForm(true)}
                className={styles.addButton}
              >
                <PlusCircle className={styles.addIcon} />
                Crear Curso
              </button>
            )}
          </div>
        )}
      </main>

      {showCourseForm && (
        <FormularioCrearCurso
          onClose={() => setShowCourseForm(false)}
          onSubmit={handleCreateCourse}
        />
      )}
    </div>
  );
};

export default GestionCurso;
