import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2 } from "lucide-react";
import styles from "/src/paginas/docente/estilos/CrearQuiz.module.css";
import { quizzesAPI } from "../../../api/quizzes";
import { useParams } from "react-router-dom";
//import { examenesAPI } from "../../../api/examenesService";

const ExamenesyQuizzes = () => {
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState([]);
  const navigate = useNavigate();
  const { courseId } = useParams();
console.log("courseId:", courseId);


 // useEffect(() => {
   // const fetchExamenes = async () => {
     // try {
       // const response = await examenesAPI.obtenerTodos(); // Debes tener este método
       // if (response.status === 200) {
         // setExamenes(response.data);
       // } else {
       //   throw new Error("Error al cargar exámenes");
       // }
      //} catch (error) {
       // console.error("Error al obtener exámenes:", error);
     // } finally {
       // setLoading(false);
      //}
   // };

    //fetchExamenes();
 // }, []);
 useEffect(() => {
  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await quizzesAPI.getAllQuizzes();
      setQuiz(response.data); // Asegúrate que `response.data` sea un array de quizzes
    } catch (error) {
      console.error("Error al obtener quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchQuizzes();
}, []);
const filteredQuizzes = quiz.filter(q => String(q.courseId) === String(courseId));
 const toggleActive = async (quizId, currentActivo) => {
  try {
    // Encontrar el quiz actual en el estado
    const quizActual = quiz.find(q => q.id === quizId);
    if (!quizActual) return;

    const updateDto = {
      titulo: quizActual.titulo,
      descripcion: quizActual.descripcion,
      duracionMinutos: quizActual.duracionMinutos,
      intentosPermitidos: quizActual.intentosPermitidos,
      puntuacionAprobacion: quizActual.puntuacionAprobacion,
      aleatorio: quizActual.aleatorio,
      active: !currentActivo,  
      courseId: quizActual.courseId,
    };

    await quizzesAPI.actualizar(quizId, updateDto);

    setQuiz(prev =>
      prev.map(q =>
        q.id === quizId ? { ...q, active: !currentActivo } : q
      )
    );
  } catch (error) {
    console.error("Error al actualizar estado activo:", error);
  }
};
const deleteQuiz = async (quizId) => {
    try {
      await quizzesAPI.eliminar(quizId);  
      setQuiz(prev => prev.filter(q => q.id !== quizId));
    } catch (error) {
      console.error("Error al eliminar quiz:", error);
    }
  };


  return (
    <div className={styles.coursesContainer}>
      <div className={styles.coursesHeader}>
        <h2 className={styles.coursesTitle}>Quizzes</h2>
        <button
          onClick={() => navigate("/gestion-curso/lecciones/:courseId")}
          className={styles.backButton}
        >
          Volver a lecciones
        </button>
      </div>

      {loading ? (
        <p className={styles.coursesDescription}>Cargando quizzes...</p>
      ) : filteredQuizzes.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.coursesDescription}>
            Aún no se han creado exámenes o quizzes para este nivel.
          </p>
        </div>
      ) : (
        <div className={styles.coursesGrid}>
          {filteredQuizzes.map((quiz) => (
  <div className={styles.courseCard} key={quiz.id} style={{ position: "relative" }}>
    <label
      className={`${styles.toggleCircle} ${quiz.active ? styles.active : ""}`}
      title="Activar / Desactivar quiz"
    >
      <input type="checkbox"
  checked={quiz.active}
  onChange={() => toggleActive(quiz.id, quiz.active)}
    style={{ display: "none" }} 
/>

      {quiz.active && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="white"
          viewBox="0 0 24 24"
          style={{ pointerEvents: "none" }}
        >
          <path d="M20.285 6.708l-11.396 11.397-5.293-5.293 1.415-1.414 3.878 3.879 9.98-9.98z" />
        </svg>
  )}
</label>


              <h3 className={styles.courseTitle}>{quiz.titulo}</h3>
              <div className={styles.courseDetailsGrid}>
                <div>
                <strong>Activo:</strong> {quiz.active ? "Sí" : "No"}
                </div>
              </div>

              <div className={styles.actionsContainer}>
                <button
                  className={`${styles.resourcesButton} ${styles.editButton}`}
                  onClick={() => {
                    navigate(
                      `/gestion-curso/examenes-y-quizzes/editar/${quiz.id}`
                    );
                  }}
                >
                  <Edit size={18} />
                </button>

                <button
                  className={`${styles.resourcesButton} ${styles.deleteButton}`}
                  onClick={() => {
                deleteQuiz(quiz.id);
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.dualButtons}>
<div className={styles.dualButtons}>
      <button
        onClick={() =>
          navigate(
            `/gestion-curso/lecciones/${courseId}/examenes-y-quizzes/crear-quizz`
          )
        }
        className={styles.floatingButton}
      >
        <Plus />
        Crear quiz
      </button>
    </div>        
      </div>
    </div>
  );
};

export default ExamenesyQuizzes;