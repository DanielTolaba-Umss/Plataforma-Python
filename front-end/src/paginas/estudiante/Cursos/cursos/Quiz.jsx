import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { quizzesAPI } from "../../../../api/quizzes";
import { questionsAPI } from "../../../../api/question"; 
import styles from "/src/paginas/estudiante/estilos/Quiz.module.css";
//import "./CursosBasico.css";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null);
  const { courseId } = useParams();  

  useEffect(() => {
  const fetchQuizzesAndQuestions = async () => {
    try {
      const response = await quizzesAPI.getAllQuizzes();
      if (response.status !== 200) {
        throw new Error("Error en la respuesta del servidor");
      }

      const quizzesFiltrados = response.data.filter(q => String(q.courseId) === String(courseId));

      const quizzesConPreguntas = await Promise.all(
        quizzesFiltrados.map(async (quiz) => {
          try {
            const resPreguntas = await questionsAPI.getByQuiz(quiz.id);
            return {
              ...quiz,
              preguntas: resPreguntas.data || [],
            };
          } catch (error) {
            console.warn(`No se pudieron cargar preguntas para el quiz ${quiz.id}`);
            return {
              ...quiz,
              preguntas: [],
            };
          }
        })
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
  if (quizzes.length === 0) return <div>Cargando quizzes…</div>;

   return (
    <div className={styles.coursesContainer}>
      <div className={styles.coursesHeader}>
        <h2 className={styles.coursesTitle}>Lista de Quizzes</h2>
      </div>
      <div className={styles.coursesGrid}>
        {quizzes.map((q) => (
          <div key={q.id} className={styles.courseCard}>
            <h3 className={styles.courseTitle}>{q.titulo}</h3>
            <div className={styles.courseDetailsGrid}>
              <p><strong>Descripción:</strong> {q.descripcion}</p>
              <p><strong>Tiempo límite:</strong> {q.duracionMinutos} min</p>
              <p><strong>Intentos:</strong> {q.intentosPermitidos}</p>
            </div>

            {q.preguntas && q.preguntas.length > 0 ? (
              <div className={styles.quizQuestions}>
                <h4 className={styles.courseSubtitle}>Preguntas:</h4>
                <ul className={styles.questionsList}>
                  {q.preguntas.map((p) => (
                    <li key={p.id} className={styles.questionItem}>
                      <strong>{p.textoPregunta}</strong><br />
                      {p.tipoPregunta === "opcionMultiple" && p.opciones ? (
                        <ul className={styles.optionList}>
                          {Object.entries(p.opciones).map(([letra, texto]) => (
                            <li key={letra}>
                              <strong>{letra})</strong> {texto}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <em>Tipo: {p.tipoPregunta}</em>
                      )}
                      <p><strong>Respuesta correcta:</strong> {p.respuestaCorrecta}</p>
                      <p><strong>Explicación:</strong> {p.explicacion}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p><em>No hay preguntas asociadas.</em></p>
            )}
            <button type="submit" className="btn-submit">
          Realizar Quiz
        </button>
          </div>
          
        ))}
        
      </div>
      
    </div>
  );
};

export default QuizList;