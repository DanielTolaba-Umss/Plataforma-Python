import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2 } from "lucide-react";
import styles from "/src/paginas/docente/estilos/GestionLecciones.module.css";
//import { examenesAPI } from "../../../api/examenesService";

const ExamenesyQuizzes = () => {
  const [examenes, setExamenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExamenes = async () => {
      try {
        const response = await examenesAPI.obtenerTodos(); // Debes tener este método
        if (response.status === 200) {
          setExamenes(response.data);
        } else {
          throw new Error("Error al cargar exámenes");
        }
      } catch (error) {
        console.error("Error al obtener exámenes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExamenes();
  }, []);

  return (
    <div className={styles.coursesContainer}>
      <div className={styles.coursesHeader}>
        <h2 className={styles.coursesTitle}>Exámenes y Quizzes</h2>
        <button
          onClick={() => navigate("/gestion-curso")}
          className={styles.backButton}
        >
          Volver a niveles
        </button>
      </div>

      {loading ? (
        <p className={styles.coursesDescription}>Cargando exámenes...</p>
      ) : examenes.length === 0 ? (
       <div className={styles.emptyState}>
  <p className={styles.coursesDescription}>
    Aún no se han creado exámenes o quizzes para este nivel.
  </p>
  <div className={styles.dualButtons}>
    <button
      onClick={() => navigate("/crear-examen")}
      className={styles.floatingButton}
    >
      <Plus /> Crear examen
    </button>
    <button
      onClick={() => navigate("/crear-quizz")}
      className={styles.floatingButton}
    >
      <Plus /> Crear quiz
    </button>
  </div>
</div>

      ) : (
        <>
          <div className={styles.coursesGrid}>
            {examenes.map((examen) => (
              <div key={examen.id} className={styles.courseCard}>
                <h3 className={styles.courseTitle}>{examen.titulo}</h3>
                <p className={styles.courseDescription}>{examen.descripcion}</p>
                <div className={styles.actionsContainer}>
                  <button className={styles.resourcesButton}>
                    Ver preguntas
                  </button>
                  <button className={`${styles.resourcesButton} ${styles.editButton}`}>
                    <Edit size={18} />
                  </button>
                  <button className={`${styles.resourcesButton} ${styles.deleteButton}`}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.floatingButtonsContainer}>
            <button
              onClick={() => navigate("/crear-examen")}
              className={styles.floatingButton}
            >
              <Plus />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ExamenesyQuizzes;
