import React, { useEffect, useState, useCallback } from "react";  // <-- agregamos useCallback
import { useParams, useNavigate } from "react-router-dom";
import { quizzesAPI } from "../../../../api/quizzes";
import { questionsAPI } from "../../../../api/question";
import styles from "/src/paginas/estudiante/estilos/Quiz.module.css";

const RealizarQuiz = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [tiempoRestante, setTiempoRestante] = useState(null);
  const [finalizado, setFinalizado] = useState(false);
  const [error, setError] = useState(null);
  const nivelId = localStorage.getItem("nivelId");
  const [mostrarModalConfirmarEnvio, setMostrarModalConfirmarEnvio] = useState(false);
  const [resultados, setResultados] = useState(null);
  
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const resTodos = await quizzesAPI.getAllQuizzes();
        if (resTodos.status !== 200)
          throw new Error("Error al obtener quizzes");

        const quizFiltrado = resTodos.data.find(
          (q) => String(q.id) === String(quizId)
        );
        if (!quizFiltrado) throw new Error("Quiz no encontrado");

        setQuiz(quizFiltrado);
        setTiempoRestante((quizFiltrado.duracionMinutos || 5) * 60);

        const resPreguntas = await questionsAPI.obtenerPreguntasPorQuiz(quizId);
        setPreguntas(resPreguntas.data || []);
      } catch (err) {
        console.error("Error al cargar quiz o preguntas:", err);
        setError("Error al cargar datos del quiz");
      }
    };

    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    const bloquearRetroceso = () => {
      window.history.pushState(null, null, window.location.href);
    };
    bloquearRetroceso();
    window.addEventListener("popstate", bloquearRetroceso);
    return () => window.removeEventListener("popstate", bloquearRetroceso);
  }, []);

  const enviarRespuestas = useCallback(() => {
    const detalle = preguntas.map((pregunta) => {
      const respuestaEstudiante = respuestas[pregunta.id];
      const puntajePregunta = pregunta.puntos || 0;

      let respuestaTextoEstudiante = respuestaEstudiante;

      if (pregunta.tipoPregunta === "opcion_multiple" && respuestaEstudiante) {
        const indice = respuestaEstudiante.charCodeAt(0) - 65; 
        const opcionesArray = Object.values(pregunta.opciones || {});
        respuestaTextoEstudiante = opcionesArray[indice];
      }

      const normalizar = (texto) =>
        (texto || "").toString().trim().toLowerCase();

      const correcta =
        normalizar(respuestaTextoEstudiante) ===
        normalizar(pregunta.respuestaCorrecta);

      return {
        pregunta: pregunta.textoPregunta,
        respuestaEstudiante: respuestaTextoEstudiante,
        respuestaCorrecta: pregunta.respuestaCorrecta,
        correcta,
        puntajeOtorgado: correcta ? puntajePregunta : 0,
      };
    });

    const correctas = detalle.filter((d) => d.correcta).length;
    const total = preguntas.length;
    const incorrectas = total - correctas;
    const puntajeTotal = detalle.reduce((acc, d) => acc + d.puntajeOtorgado, 0);

    setResultados({
      correctas,
      incorrectas,
      total,
      detalle,
      puntos: puntajeTotal,
    });
    setFinalizado(true);
  }, [preguntas, respuestas]);  // <--- dependencias de useCallback

  useEffect(() => {
    if (tiempoRestante === null || finalizado) return;
    const intervalo = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(intervalo);
          enviarRespuestas();  // llamar función memoizada
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalo);
  }, [tiempoRestante, finalizado, enviarRespuestas]);  // solo estas deps

  const enviarQuiz = () => {
    setMostrarModalConfirmarEnvio(true);
  };

  const formatoTiempo = (segundos) => {
    const min = Math.floor(segundos / 60);
    const sec = segundos % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  if (error) return <div className="error">⚠️ {error}</div>;
  if (!quiz || tiempoRestante === null) return <div>Cargando quiz...</div>;
  if (finalizado && resultados) {
    return (
      <div className={styles.coursesContainer}>
        <div className={styles.courseCard}>
          <h2 className={styles.courseTitle}>¡Quiz finalizado!</h2>
          <p>
            <strong>Puntaje total:</strong> {resultados.puntos}
          </p>
          <p>
            <strong>Correctas:</strong> {resultados.correctas}
          </p>
          <p>
            <strong>Incorrectas:</strong> {resultados.incorrectas}
          </p>
          <ul className={styles.resultadoLista}>
            {resultados.detalle &&
              resultados.detalle.map((res, idx) => (
                <li key={idx}>
                  <strong>
                    {idx + 1}. {res.pregunta}
                  </strong>
                  <br />
                  Tu respuesta: {res.respuestaEstudiante}
                  <br />
                  Puntos: {res.puntajeOtorgado}
                  <br />
                  {res.correcta ? (
                    <span style={{ color: "green" }}>✔ Correcta</span>
                  ) : (
                    <span style={{ color: "red" }}>
                      ✖ Incorrecta. Respuesta correcta: {res.respuestaCorrecta}
                    </span>
                  )}
                </li>
              ))}
          </ul>

          <button
            onClick={() => navigate(`/cursos/${nivelId}/lecciones/quiz`)}
            className="btn-submit"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }
  if (finalizado) {
    return (
      <div className={styles.coursesContainer}>
        <div className={styles.courseCard}>
          <h2 className={styles.courseTitle}>¡Quiz finalizado!</h2>
          <button onClick={() => navigate(-1)} className="btn-submit">
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.coursesContainer}>
      <div className={styles.courseCard}>
        <div className={styles.cardHeader}>
          <h4 className={styles.courseTitle}>{quiz.titulo}</h4>
          <div className={styles.timer}>⏱ {formatoTiempo(tiempoRestante)}</div>
        </div>
        <p>
          <strong>Descripción:</strong> {quiz.descripcion}
        </p>

        {preguntas.map((pregunta, index) => (
          <div key={pregunta.id} className={styles.pregunta}>
            <p>
              <strong>
                {index + 1}. {pregunta.textoPregunta}
              </strong>
            </p>

            {/* Opción múltiple */}
            {pregunta.tipoPregunta === "opcion_multiple" && (
              <ul className={styles.opciones}>
                {Object.values(pregunta.opciones || {}).map((texto, idx) => {
                  const letra = String.fromCharCode(65 + idx);
                  return (
                    <li key={letra}>
                      <label>
                        <input
                          type="radio"
                          name={`pregunta-${pregunta.id}`}
                          value={letra}
                          checked={respuestas[pregunta.id] === letra}
                          onChange={() =>
                            setRespuestas((prev) => ({
                              ...prev,
                              [pregunta.id]: letra,
                            }))
                          }
                        />
                        <strong>{letra})</strong> {texto}
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Verdadero/Falso */}
            {pregunta.tipoPregunta === "verdadero_falso" && (
              <ul className={styles.opciones}>
                {["Verdadero", "Falso"].map((valor) => (
                  <li key={valor}>
                    <label>
                      <input
                        type="radio"
                        name={`pregunta-${pregunta.id}`}
                        value={valor}
                        checked={respuestas[pregunta.id] === valor}
                        onChange={() =>
                          setRespuestas((prev) => ({
                            ...prev,
                            [pregunta.id]: valor,
                          }))
                        }
                      />
                      {valor}
                    </label>
                  </li>
                ))}
              </ul>
            )}

            {/* Respuesta corta */}
            {pregunta.tipoPregunta === "respuesta_corta" && (
              <input
                type="text"
                value={respuestas[pregunta.id] || ""}
                onChange={(e) =>
                  setRespuestas((prev) => ({
                    ...prev,
                    [pregunta.id]: e.target.value,
                  }))
                }
                placeholder="Escribe tu respuesta aquí"
                className={styles.inputRespuestaCorta}
              />
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={enviarQuiz}
          className="btn-submit"
          disabled={finalizado}
        >
          Enviar Quiz
        </button>
      </div>
      {mostrarModalConfirmarEnvio && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>¿Estás seguro de enviar el quiz?</h3>
            <div className={styles.modalButtons}>
              <button
                onClick={() => {
                  setMostrarModalConfirmarEnvio(false);
                  enviarRespuestas();
                }}
                className={styles.modalConfirm}
              >
                Confirmar
              </button>
              <button
                onClick={() => setMostrarModalConfirmarEnvio(false)}
                className={styles.modalCancel}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default RealizarQuiz;
