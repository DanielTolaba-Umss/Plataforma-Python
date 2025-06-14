import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { quizzesAPI } from "../../../../api/quizzes";
import { questionsAPI } from "../../../../api/question";
import styles from "/src/paginas/estudiante/estilos/Quiz.module.css";

const QuizList = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null);
  const [mostrarModalQuiz, setMostrarModalQuiz] = useState(false);
  const [quizSeleccionado, setQuizSeleccionado] = useState(null);
  const nivelId = localStorage.getItem("nivelId");

  useEffect(() => {
    const fetchQuizzesAndQuestions = async () => {
      try {
        const response = await quizzesAPI.getAllQuizzes();
        if (response.status !== 200) {
          throw new Error("Error en la respuesta del servidor");
        }

        //Solo mostrar el quiz que esté activo
        const quizzesFiltrados = response.data
          .filter((q) => String(q.courseId) === String(courseId))
          .filter((q) => q.active);

        const quizzesConPreguntas = await Promise.all(
          quizzesFiltrados.map(async (quiz) => {
            try {
              const resPreguntas = await questionsAPI.obtenerPreguntasPorQuiz(
                quiz.id,
              );
              return {
                ...quiz,
                preguntas: resPreguntas.data || [],
              };
            } catch (error) {
              console.warn(
                `No se pudieron cargar preguntas para el quiz ${quiz.id}`,
                error,
              );
              return {
                ...quiz,
                preguntas: [],
              };
            }
          }),
        );

        setQuizzes(quizzesConPreguntas);
      } catch (err) {
        console.error("Error al cargar quizzes:", err);
        setError(err.message || "Error desconocido");
      }
    };

    fetchQuizzesAndQuestions();
  }, [courseId]);

  if (error) return <div className="error">⚠️ {error}</div>;

  return (
    <div className={styles.coursesContainer}>
      {mostrarModalQuiz && quizSeleccionado && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>¿Estás listo para comenzar el quiz?</h3>
            <p>
              Al presionar <strong>Comenzar</strong>, el temporizador se
              iniciará y deberás completar el quiz dentro del tiempo límite sin
              salirte de la ventana del quiz, sino la prueba se dará por
              finalizada.
            </p>
            <div className={styles.modalButtons}>
              <button
                className={styles.modalConfirm}
                onClick={async () => {
                  try {
                    // Aquí descontamos un intento en backend
                    await quizzesAPI.descontarIntento(quizSeleccionado.id);
                    setMostrarModalQuiz(false);
                    navigate(
                      `/cursos/${courseId}/lecciones/realizar-quiz/${quizSeleccionado.id}`,
                    );
                  } catch (err) {
                    console.error("Error al descontar intento:", err);
                    setError(
                      "No se pudo descontar un intento. Intenta de nuevo.",
                    );
                    setMostrarModalQuiz(false);
                  }
                }}
              >
                Comenzar
              </button>
              <button
                className={styles.modalCancel}
                onClick={() => setMostrarModalQuiz(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={styles.coursesHeader}>
        <h2 className={styles.coursesTitle}>Quiz final del nivel </h2>
        <button
            onClick={() => navigate(`/cursos/${nivelId}/lecciones`)}
          className={styles.backButton}
        >
          Volver a lecciones
        </button>
      </div>
      <div className={styles.coursesGrid}>
        {quizzes.map((q) => (
          <div key={q.id} className={styles.courseCard}>
            <h3 className={styles.courseTitle}>{q.titulo}</h3>
            <div className={styles.courseDetailsGrid}>
              <p>
                <strong>Descripción:</strong> {q.descripcion}
              </p>
              <p>
                <strong>Tiempo límite:</strong> {q.duracionMinutos} min
              </p>
              <p>
                <strong>Intentos:</strong> {q.intentosPermitidos}
              </p>
            </div>

            {q.preguntas && q.preguntas.length > 0 ? (
              <p>
                <strong>Cantidad de preguntas:</strong> {q.preguntas.length}
              </p>
            ) : (
              <p>
                <em>No hay preguntas asociadas.</em>
              </p>
            )}
            <button
              type="button"
              className="btn-submit"
              disabled={q.intentosUsados >= q.intentosPermitidos}
              onClick={() => {
                setQuizSeleccionado(q);
                setMostrarModalQuiz(true);
              }}
            >
              Realizar Quiz
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizList;