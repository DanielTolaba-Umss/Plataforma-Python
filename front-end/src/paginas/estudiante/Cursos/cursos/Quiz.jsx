import React, { useState, useEffect } from "react";
import { quizzesAPI } from "../../../../api/quizzes";
import { questionsAPI } from "../../../../api/question"; 
//import "./CursosBasico.css";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizzesAndQuestions = async () => {
      try {
        const response = await quizzesAPI.getAllQuizzes();
        if (response.status !== 200) {
          throw new Error("Error en la respuesta del servidor");
        }

        const quizzesConPreguntas = await Promise.all(
          response.data.map(async (quiz) => {
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
  }, []);

  if (error) return <div className="error">⚠️ {error}</div>;
  if (quizzes.length === 0) return <div>Cargando quizzes…</div>;

  return (
    <div className="curso-container">
      <header className="curso-header">Lista de Quizzes</header>
      <main className="curso-lecciones">
        {quizzes.map((q) => (
          <div key={q.id} className="leccion-card">
            <h3>{q.titulo}</h3>
            <p>{q.descripcion}</p>
            <p><strong>Tiempo limite:</strong> {q.duracionMinutos} min</p>
            <p><strong>Intentos:</strong> {q.intentosPermitidos}</p>

            {/* Preguntas asociadas */}
            {q.preguntas && q.preguntas.length > 0 ? (
              <div className="preguntas-lista">
                <h4>Preguntas:</h4>
                <ul>
                  {q.preguntas.map((p) => (
                    <li key={p.id}>
                      <strong>{p.textoPregunta}</strong> <br />
                      {p.tipoPregunta === "opcionMultiple" && p.opciones ? (
                        <ul>
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
          </div>
        ))}
      </main>
    </div>
  );
};

export default QuizList;
