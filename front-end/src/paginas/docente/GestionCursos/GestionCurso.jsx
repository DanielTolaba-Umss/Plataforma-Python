// Archivo: GestionCurso.jsx
import React from "react";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "/src/paginas/docente/estilos/GestionCurso.module.css";

const GestionCurso = () => {
  const navigate = useNavigate();

  const handleModuleSelect = (module) => {
    navigate(`/gestion-curso/lecciones/${module}`);
  };

  return (
    <div className={styles.container}>
      {/* Encabezado */}
      <header className={styles.header}>
        <div className="container py-3 d-flex justify-content-between align-items-center">
          <h1 className="fw-bold text-dark mb-4" style={{ fontSize: "1.875rem" }}>
            Niveles
          </h1>
          <div className="admin-profile d-flex align-items-center gap-2">
            <span className="fw-semibold">Docente</span>
            <div
              className="admin-avatar bg-success text-white rounded-circle d-flex justify-content-center align-items-center"
              style={{ width: "40px", height: "40px" }}
            >
              GC
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className={styles.mainContent}>
        <div className={styles.subtitleWithButton}>
          <h2 className={styles.subtitle}>Selecciona un nivel</h2>
        </div>

        <div className={styles.modulesGrid}>
          {/* Nivel Básico */}
          <div className={styles.moduleCard} onClick={() => handleModuleSelect("basico")}>
            <div className={styles.moduleIconContainer}>
              <BookOpen className={`${styles.moduleIcon} ${styles.blueIcon}`} />
            </div>
            <h3 className={styles.moduleTitle}>Nivel Básico</h3>
            <p className={styles.moduleDescription}>
              Gestiona el contenido y las actividades del nivel básico del curso.
            </p>
          </div>

          {/* Nivel Intermedio */}
          <div className={styles.moduleCard} onClick={() => handleModuleSelect("intermedio")}>
            <div className={styles.moduleIconContainer}>
              <BookOpen className={`${styles.moduleIcon} ${styles.greenIcon}`} />
            </div>
            <h3 className={styles.moduleTitle}>Nivel Intermedio</h3>
            <p className={styles.moduleDescription}>
              Gestiona el contenido y las actividades del nivel intermedio del curso.
            </p>
          </div>

          {/* Nivel Avanzado */}
          <div className={styles.moduleCard} onClick={() => handleModuleSelect("avanzado")}>
            <div className={styles.moduleIconContainer}>
              <BookOpen className={`${styles.moduleIcon} ${styles.purpleIcon}`} />
            </div>
            <h3 className={styles.moduleTitle}>Nivel Avanzado</h3>
            <p className={styles.moduleDescription}>
              Gestiona el contenido y las actividades del nivel avanzado del curso.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GestionCurso;
