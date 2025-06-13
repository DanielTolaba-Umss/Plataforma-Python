import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quizzesAPI } from "../../../../api/quizzes";
import { questionsAPI } from "../../../../api/question";
// import styles from "/src/paginas/estudiante/estilos/RealizarQuiz.module.css";

const RealizarQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [respuestas, setRespuestas] = useState({});
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [error, setError] = useState(null);

  // Cargar quiz + preguntas
 const fetchQuiz = async () => {
  try {
    const resTodos = await quizzesAPI.getAllQuizzes();
    if (resTodos.status !== 200) throw new Error("Error al obtener quizzes");

    const quizFiltrado = resTodos.data.find(q => String(q.id) === String(quizId));
    if (!quizFiltrado) throw new Error("Quiz no encontrado");

    // Traer todas las preguntas y filtrar por quizId
    const resPreguntas = await questionsAPI.getAll();
    const preguntasDelQuiz = resPreguntas.data.filter(p => String(p.quizId) === String(quizId));

    const quizConPreguntas = {
      ...quizFiltrado,
      preguntas: preguntasDelQuiz,
    };

    setQuiz(quizConPreguntas);
    setTiempoRestante((quizFiltrado.duracionMinutos || 5) * 60); // en segundos
  } catch (err) {
    console.error("Error al cargar el quiz:", err);
    setError("Error al cargar quiz");
  }
};



  // Temporizador
  useEffect(() => {
    if (tiempoRestante <= 0) {
      setFinalizado(true);
      return;
    }
    const intervalo = setInterval(() => {
      setTiempoRestante((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(intervalo);
  }, [tiempoRestante]);

  const handleRespuesta = (preguntaId, opcion) => {
    setRespuestas((prev) => ({
      ...prev,
      [preguntaId]: opcion,
    }));
  };

  const enviarQuiz = () => {
    setFinalizado(true);
    console.log("Respuestas enviadas:", respuestas);
    // Puedes hacer un POST a un endpoint si quieres guardar
    // navigate("/resultado-quiz");
  };

  const formatoTiempo = (segundos) => {
    const min = Math.floor(segundos / 60);
    const sec = segundos % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  if (error) return <div>Error: {error}</div>;
  if (!quiz) return <div>Cargando quiz...</div>;
  if (finalizado) return <div /* className={styles.finalizado} */>¡Quiz finalizado!</div>;

  return (
    <div /* className={styles.quizContainer} */>
      <div /* className={styles.header} */>
        <h2>{quiz.titulo}</h2>
        <p>{quiz.descripcion}</p>
        <p>
          <strong>Duración:</strong> {quiz.duracionMinutos} min
        </p>
        <p>
          <strong>Intentos permitidos:</strong> {quiz.intentosPermitidos}
        </p>
        <div /* className={styles.timer} */>
          ⏱ Tiempo restante: <strong>{formatoTiempo(tiempoRestante)}</strong>
        </div>
      </div>

      <div /* className={styles.preguntas} */>
        {quiz.preguntas.map((p, index) => (
          <div key={p.id} /* className={styles.pregunta} */>
            <p>
              <strong>
                {index + 1}. {p.textoPregunta}
              </strong>
            </p>
            {p.tipoPregunta === "opcionMultiple" && (
              <ul /* className={styles.opciones} */>
                {Object.entries(p.opciones).map(([letra, texto]) => (
                  <li key={letra}>
                    <label>
                      <input
                        type="radio"
                        name={`pregunta-${p.id}`}
                        value={letra}
                        checked={respuestas[p.id] === letra}
                        onChange={() => handleRespuesta(p.id, letra)}
                        disabled={finalizado}
                      />
                      <strong>{letra})</strong> {texto}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <button onClick={enviarQuiz} /* className={styles.botonEnviar} */ disabled={finalizado}>
        Enviar Quiz
      </button>
    </div>
  );
};

export default RealizarQuiz;
