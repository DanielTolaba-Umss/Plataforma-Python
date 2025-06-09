import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizzesAPI } from "../../../api/quizzes";
import { questionsAPI } from '../../../api/question';
import styles from "/src/paginas/docente/estilos/CrearQuiz.module.css";

const CrearQuizz = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nivelId = localStorage.getItem("nivelId");
  const [quizData, setQuizData] = useState({
    titulo: '',
    descripcion: '',
    duracionMinutos: 30,
    intentosPermitidos: 1,
    puntuacionAprobacion: 70,
    aleatorio: false,
    active: true,
    courseId: nivelId, 
    preguntas: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    texto_pregunta: '',
    tipo_pregunta: 'opcion_multiple',
    puntos: 1,
    opciones: [],
    respuesta_correcta: '',
    explicacion: ''
  });

  const [newOption, setNewOption] = useState('');

  const handleQuizChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuizData({
      ...quizData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleQuestionChange = (e) => {
  const { name, value } = e.target;

  setCurrentQuestion(prev => ({
    ...prev,
    [name]: name === 'puntos' ? parseInt(value) || 0 : value
  }));
};

  const handleAddOption = () => {
    if (newOption.trim()) {
      setCurrentQuestion(prev => ({
        ...prev,
        opciones: [...prev.opciones, newOption]
      }));
      setNewOption('');
    }
  };

  const handleAddQuestion = () => {
  const { texto_pregunta, tipo_pregunta, puntos, opciones, respuesta_correcta } = currentQuestion;

  if (!texto_pregunta.trim()) {
    alert("La pregunta no puede estar vacía.");
    return;
  }

  if (puntos <= 0) {
    alert("Los puntos deben ser mayores a 0.");
    return;
  }

  if (tipo_pregunta === 'opcion_multiple') {
    if (opciones.length < 2) {
      alert("Debe haber al menos dos opciones para preguntas de opción múltiple.");
      return;
    }

    if (!respuesta_correcta.trim()) {
      alert("Debe seleccionar una respuesta correcta.");
      return;
    }

    if (!opciones.includes(respuesta_correcta)) {
      alert("La respuesta correcta no está entre las opciones.");
      return;
    }
  }

  if (tipo_pregunta === 'verdadero_falso' && !['Verdadero', 'Falso'].includes(respuesta_correcta)) {
    alert("Seleccione 'Verdadero' o 'Falso' como respuesta.");
    return;
  }
   const preguntaValida = {
    ...currentQuestion,
    texto_pregunta: texto_pregunta.trim(),
    puntos: parseInt(puntos),
    opciones: currentQuestion.opciones,
    respuesta_correcta: respuesta_correcta.trim()
  };

  setQuizData(prev => {
  const updated = {
    ...prev,
    preguntas: [...prev.preguntas, preguntaValida]
  };
  console.log("Preguntas actualizadas:", updated.preguntas);
  return updated;
});


  setCurrentQuestion({
    texto_pregunta: '',
    tipo_pregunta: 'opcion_multiple',
    puntos: 1,
    opciones: [],
    respuesta_correcta: '',
    explicacion: ''
  });
};

  const validateQuiz = () => {
    if (!quizData.titulo.trim()) {
      alert('El título del quiz es requerido');
      console.log("Validación falló: título vacío");
      return false;
    }
    
    if (quizData.preguntas.length === 0) {
      alert('Debe agregar al menos una pregunta');
      console.log("Validación falló: sin preguntas");
      return false;
    }
    
    const hasInvalidQuestions = quizData.preguntas.some(pregunta => 
      pregunta.tipo_pregunta === 'opcion_multiple' && !pregunta.respuesta_correcta
    );
    
    if (hasInvalidQuestions) {
      alert('Todas las preguntas de opción múltiple deben tener una respuesta correcta seleccionada');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Submit presionado");
  if (!validateQuiz()) return;

  setIsSubmitting(true);

  try {
    const quizToSend = {
      titulo: quizData.titulo,
      descripcion: quizData.descripcion,
      duracionMinutos: quizData.duracionMinutos,
      intentosPermitidos: quizData.intentosPermitidos,
      puntuacionAprobacion: quizData.puntuacionAprobacion,
      aleatorio: quizData.aleatorio,
      esta_activo: quizData.active,
      courseId: quizData.courseId,
    };

    const quizResponse = await quizzesAPI.crear(quizToSend);

    if (quizResponse.status !== 201) {
      throw new Error(quizResponse.data?.message || 'Error al crear el quiz');
    }

    const quizId = quizResponse.data.id;
    
 await Promise.all(
  quizData.preguntas.map((pregunta) => {
    let opcionesArray = [];

    if (Array.isArray(pregunta.opciones)) {
      opcionesArray = pregunta.opciones;
    } else if (typeof pregunta.opciones === 'string') {
      try {
        opcionesArray = JSON.parse(pregunta.opciones);
      } catch (e) {
        opcionesArray = [];
      }
    } else if (typeof pregunta.opciones === 'object' && pregunta.opciones !== null) {
      opcionesArray = Object.values(pregunta.opciones);
    }

    return questionsAPI.crearPregunta({
      ...pregunta,
      opciones: opcionesArray, // ✅ enviar como array JSON válido
      quizId,
    });
  })
);


    alert('Quiz y preguntas guardados exitosamente');
    navigate(`/gestion-curso/lecciones/${nivelId}/examenes-y-quizzes/`);

  } catch (error) {
    let errorMessage = 'Error al guardar el quiz';

    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = 'Datos inválidos: ' + (error.response.data?.errors?.join(', ') || 'verifique los campos');
      } else if (error.response.status === 401) {
        errorMessage = 'No autorizado - por favor inicie sesión nuevamente';
      } else if (error.response.status === 500) {
        errorMessage = 'Error en el servidor - por favor intente más tarde';
      }
    }

    alert(errorMessage);
    console.error('Error detallado:', error);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className={styles.coursesContainer}>
      <header className={styles.coursesHeader}>
        <div className="container py-3 d-flex justify-content-between align-items-center">
          <h1 className="fw-bold text-dark mb-4" style={{ fontSize: "1.875rem" }}>
            Crear Nuevo Quiz
          </h1>
          <div className="admin-profile d-flex align-items-center gap-2">
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.courseCard}>
          <form onSubmit={handleSubmit} className={styles.quizForm} noValidate>
            <div className={styles.formGroup}>
              <label htmlFor="titulo">Título del Quiz *</label>
              <input
                id="titulo"
                type="text"
                name="titulo"
                value={quizData.titulo}
                onChange={handleQuizChange}
                required
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={quizData.descripcion}
                onChange={handleQuizChange}
                rows="4"
                className={styles.formTextarea}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="duracionMinutos">Duración (minutos) *</label>
                <input
                  id="duracionMinutos"
                  type="number"
                  name="duracionMinutos"
                  value={quizData.duracionMinutos}
                  onChange={handleQuizChange}
                  min="5"
                  required
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="intentosPermitidos">Intentos Permitidos *</label>
                <input
                  id="intentosPermitidos"
                  type="number"
                  name="intentosPermitidos"
                  value={quizData.intentosPermitidos}
                  onChange={handleQuizChange}
                  min="1"
                  required
                  className={styles.formInput}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="puntuacionAprobacion">Puntuación para Aprobar (%) *</label>
                <input
                  id="puntuacionAprobacion"
                  type="number"
                  name="puntuacionAprobacion"
                  value={quizData.puntuacionAprobacion}
                  onChange={handleQuizChange}
                  min="0"
                  max="100"
                  required
                  className={styles.formInput}
                />
              </div>
            </div>

            <h2 className={styles.sectionTitle}>Preguntas del Quiz</h2>
            
            <div className={styles.questionForm}>
              <div className={styles.formGroup}>
                <label htmlFor="texto_pregunta">Texto de la Pregunta *</label>
                <textarea
                  id="texto_pregunta"
                  name="texto_pregunta"
                  value={currentQuestion.texto_pregunta}
                  onChange={handleQuestionChange}
                  rows="3"
                  required
                  className={styles.formTextarea}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="tipo_pregunta">Tipo de Pregunta *</label>
                  <select
                    id="tipo_pregunta"
                    name="tipo_pregunta"
                    value={currentQuestion.tipo_pregunta}
                    onChange={handleQuestionChange}
                    className={styles.formSelect}
                  >
                    <option value="opcion_multiple">Opción múltiple</option>
                    <option value="verdadero_falso">Verdadero/Falso</option>
                    <option value="respuesta_corta">Respuesta corta</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="puntos">Puntos *</label>
                  <input
                    id="puntos"
                    type="number"
                    name="puntos"
                    value={currentQuestion.puntos}
                    onChange={handleQuestionChange}
                    min="1"
                    className={styles.formInput}
                  />
                </div>
              </div>

              {currentQuestion.tipo_pregunta === 'opcion_multiple' && (
                <>
                  <div className={styles.formGroup}>
                    <label>Opciones</label>
                    <ul className={styles.optionsList}>
                      {currentQuestion.opciones.map((opcion, idx) => (
                        <li key={idx} className={styles.optionItem}>
                          {opcion}
                        </li>
                      ))}
                    </ul>
                    <div className={styles.addOption}>
                      <input
                        type="text"
                        value={newOption}
                        onChange={e => setNewOption(e.target.value)}
                        placeholder="Agregar nueva opción"
                        className={styles.formInput}
                      />
                      <button type="button" onClick={handleAddOption} className={styles.submitButton}>
                        +
                      </button>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="respuesta_correcta">Respuesta Correcta *</label>
                    <select
                      id="respuesta_correcta"
                      name="respuesta_correcta"
                      value={currentQuestion.respuesta_correcta}
                      onChange={handleQuestionChange}
                      className={styles.formSelect}
                      required
                    >
                      <option value="">-- Seleccione la respuesta correcta --</option>
                      {currentQuestion.opciones.map((opcion, idx) => (
                        <option key={idx} value={opcion}>
                          {opcion}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="explicacion">Explicación (opcional)</label>
                <textarea
                  id="explicacion"
                  name="explicacion"
                  value={currentQuestion.explicacion}
                  onChange={handleQuestionChange}
                  rows="2"
                  className={styles.formTextarea}
                />
              </div>

              <button
                type="button"
                onClick={handleAddQuestion}
                className={styles.submitButton}
                disabled={!currentQuestion.texto_pregunta.trim()}
              >
                Guardar Pregunta
              </button>
              <div className={styles.formGroup}>
  <label>
    <input
      type="checkbox"
      name="aleatorio"
      checked={quizData.aleatorio}
      onChange={handleQuizChange}
      className={styles.formCheckbox}
    />
    Preguntas aleatorias
  </label>
</div>

            </div>

            <hr className={styles.separator} />

            <div className={styles.quizSummary}>
              <h3>Preguntas agregadas:</h3>
              <ul className={styles.questionList}>
                {quizData.preguntas.map((preg, index) => (
                  <li key={index} className={styles.questionListItem}>
                    {index + 1}. {preg.texto_pregunta} ({preg.tipo_pregunta}, {preg.puntos} pts)
                  </li>
                ))}
              </ul>
            </div>

             <div className={styles.formGroup} style={{ textAlign: 'center', marginTop: '2rem' }}>
  <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
    {isSubmitting ? 'Guardando...' : 'Guardar Quiz'}
  </button>
</div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CrearQuizz;
