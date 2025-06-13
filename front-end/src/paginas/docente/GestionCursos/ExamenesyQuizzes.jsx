import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash, X, Upload, CheckCircle2, Plus } from "lucide-react";
import styles from "/src/paginas/docente/estilos/CrearQuiz.module.css";
import { quizzesAPI } from "../../../api/quizzes";
import { useParams } from "react-router-dom";
import ErrorModal from "../../../componentes/comunes/ErrorModal";

const ExamenesyQuizzes = () => {
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState([]);
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({show: false,message: "",type: "success",  });
    // Error modal state
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");  
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);


 useEffect(() => {
  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await quizzesAPI.getAllQuizzes();
      setQuiz(response.data); 
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
    if (currentActivo) {
      await quizzesAPI.actualizar(quizId, { active: false });
      setQuiz(prev =>
        prev.map(q =>
          q.id === quizId ? { ...q, active: false } : q
        )
      );
      return;
    }
    const quizzesToUpdate = [];

    for (const q of quiz) {
      if (q.id === quizId) {
        quizzesToUpdate.push({
          id: q.id,
          data: { ...q, active: true }
        });
      } else if (q.active) {
        quizzesToUpdate.push({
          id: q.id,
          data: { ...q, active: false }
        });
      }
    }
    // Actualizar en backend todos los quizzes afectados
    await Promise.all(
      quizzesToUpdate.map(({ id, data }) =>
        quizzesAPI.actualizar(id, {
          titulo: data.titulo,
          descripcion: data.descripcion,
          duracionMinutos: data.duracionMinutos,
          intentosPermitidos: data.intentosPermitidos,
          puntuacionAprobacion: data.puntuacionAprobacion,
          aleatorio: data.aleatorio,
          active: data.active,
          courseId: data.courseId
        })
      )
    );
    setQuiz(prev =>
      prev.map(q => {
        if (q.id === quizId) return { ...q, active: true };
        if (q.active) return { ...q, active: false };
        return q;
      })
    );
  } catch (error) {
    console.error("Error al actualizar estado activo:", error);
  }
};

  const openDeleteModal = (quiz) => {
  setQuizToDelete(quiz);
  setShowDeleteModal(true);
};

const cancelDelete = () => {
  setQuizToDelete(null);
  setShowDeleteModal(false);
};

const confirmDelete = async () => {
  if (!quizToDelete) {
    console.error("No hay quiz para eliminar");
    return;
  }

  try {
    setLoading(true);
    console.log("Eliminando quiz con ID:", quizToDelete.id);  
    
    await quizzesAPI.eliminar(quizToDelete.id);
    
    setQuiz(prev => prev.filter(q => q.id !== quizToDelete.id));
    
    showNotification("El quiz ha sido eliminado correctamente");
    
    setShowDeleteModal(false);
    setQuizToDelete(null);
    setError(null); 

  } catch (error) {
    console.error("Error completo al eliminar quiz:", error);
    setError("Error al eliminar el quiz: " + (error.message || "Por favor intente nuevamente"));
    
  } finally {
    setLoading(false);
  }
};
const showNotification = (message, type = "success") => {
    setNotification({
      show: true,
      message,
      type,
    });
    setTimeout(() => {
      setNotification({
        show: false,
        message: "",
        type: "success",
      });
    }, 3000);
  };
  // Show error modal
  const showError = (message) => {
    setErrorMessage(message);
    setShowErrorModal(true);
    setError(null); 
  };

  // Close error modal
  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };
 // Función para abrir modal con quiz seleccionado
  const openQuizModal = (quiz) => {
    setSelectedQuiz(quiz);
    setShowQuizModal(true);
  };

  // Cerrar modal
  const closeQuizModal = () => {
    setShowQuizModal(false);
    setSelectedQuiz(null);
  };
  return (
    <div className={styles.coursesContainer}>
      <div className={styles.coursesHeader}>
        <h2 className={styles.coursesTitle}>Quizzes</h2>
        <button
          onClick={() => navigate(`/gestion-curso/lecciones/${courseId}`)}
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
            <div
              key={quiz.id}
              className={styles.courseCard}
              style={{ position: "relative", cursor: "pointer" }}
              onClick={() => openQuizModal(quiz)}
            >
              <label
                className={`${styles.toggleCircle} ${quiz.active ? styles.active : ""}`}
                title="Activar / Desactivar quiz"
                onClick={(e) => e.stopPropagation()} 
              >
                <input
                  type="checkbox"
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
              <h3 className={styles.courseTitle}>Título: {quiz.titulo}</h3>
              <div className={styles.courseDetailsGrid}>
                <div>
                  <strong>Activo:</strong> {quiz.active ? "Sí" : "No"}
                </div>
                <div>
                  <strong>Puntaje de Aprobación:</strong> {quiz.puntuacionAprobacion}
                </div>
              </div>
              <div className={styles.actionsContainer}>
                <button
                  className={`${styles.resourcesButton} ${styles.deleteButton}`}
                  onClick={(e) => {
                    e.stopPropagation(); 
                    openDeleteModal(quiz);
                  }}
                >
                  <Trash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para mostrar info del quiz en modo solo lectura */}
      {showQuizModal && selectedQuiz && (
        <div className="recursos-modal-overlay" onClick={closeQuizModal}>
          <div className="recursos-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Detalles del Quiz</h2>
            <form>
              <label>
                Título:
                <input type="text" value={selectedQuiz.titulo} readOnly />
              </label>
              <label>
                Activo:
                <input
                  type="checkbox"
                  checked={selectedQuiz.active}
                  readOnly
                  disabled
                />
              </label>
              <label>
                Puntaje de Aprobación:
                <input
                  type="number"
                  value={selectedQuiz.puntuacionAprobacion || ""}
                  readOnly
                />
              </label>
              <label>
                Descripción:
                <textarea value={selectedQuiz.descripcion || ""} readOnly />
              </label>
              <label>
                Duración (minutos):
                <input
                  type="number"
                  value={selectedQuiz.duracionMinutos || ""}
                  readOnly
                />
              </label>
              <label>
                Intentos Permitidos:
                <input
                  type="number"
                  value={selectedQuiz.intentosPermitidos || ""}
                  readOnly
                />
              </label>
              <button
  className={styles.secondaryButton}
  onClick={(e) => {
    e.preventDefault();
    closeQuizModal();
  }}
>
  Cerrar
</button>

            </form>
          </div>
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
      {/* Modal de confirmación de eliminación */}
      
      {showDeleteModal && (
  <div className="recursos-modal-overlay">
          <div className="recursos-modal-content">
            <h3>Confirmar eliminación</h3>            <p>
              ¿Estás seguro de que deseas eliminar el quiz?{" "}
              <strong>
                {quizToDelete?.titulo || quizToDelete?.titulo || quizToDelete?.titulo}
              </strong>
              ?
            </p>
            <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "10px" }}>
              Esta acción no se puede deshacer.
            </p>
            <div className="recursos-modal-actions">
              <button
                className="recursos-confirm-button"
                onClick={confirmDelete}
                disabled={loading}
              >
                {loading ? "Eliminando..." : "Eliminar"}
              </button>
              <button
                className="recursos-cancel-button"
                onClick={cancelDelete}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
)}


      {/* Notificación */}
            {notification.show && (
              <div className={`notification ${notification.type}`}>
                <CheckCircle2 size={20} />
                <span>{notification.message}</span>
              </div>
            )}     
    </div>
  );
};

export default ExamenesyQuizzes;