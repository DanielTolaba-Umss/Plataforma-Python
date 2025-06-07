import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizzesAPI } from "../../../api/quizzes";
import styles from "/src/paginas/docente/estilos/GestionLecciones.module.css";
import { useParams } from 'react-router-dom';

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
    setCurrentQuestion({
      ...currentQuestion,
      [name]: value
    });
  };

  const handleAddOption = () => {
    if (newOption.trim()) {
      setCurrentQuestion({
        ...currentQuestion,
        opciones: [...currentQuestion.opciones, newOption]
      });
      setNewOption('');
    }
  };

  const handleAddQuestion = () => {
    if (currentQuestion.texto_pregunta.trim() && 
        (currentQuestion.tipo_pregunta !== 'opcion_multiple' || 
         currentQuestion.opciones.length > 0)) {
      setQuizData({
        ...quizData,
        preguntas: [...quizData.preguntas, currentQuestion]
      });
      setCurrentQuestion({
        texto_pregunta: '',
        tipo_pregunta: 'opcion_multiple',
        puntos: 1,
        opciones: [],
        respuesta_correcta: '',
        explicacion: ''
      });
    }
  };

  const validateQuiz = () => {
    if (!quizData.titulo.trim()) {
      alert('El título del quiz es requerido');
      return false;
    }
    
    if (quizData.preguntas.length === 0) {
      alert('Debe agregar al menos una pregunta');
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
      console.log("Se presionó Guardar Quizz"); // Este log DEBE aparecer en consola
    e.preventDefault();
    if (!validateQuiz()) return;
    
    setIsSubmitting(true);
    
    try {
      console.log("Preguntas actuales:", quizData.preguntas);
      const quizToSend = {
        titulo: quizData.titulo,
        descripcion: quizData.descripcion,
        duracionMinutos: quizData.duracionMinutos,
        intentosPermitidos: quizData.intentosPermitidos,
        puntuacionAprobacion: quizData.puntuacionAprobacion,
        es_aleatorio: quizData.aleatorio,
        esta_activo: quizData.active,
        courseId: quizData.courseId,
        preguntas: quizData.preguntas.map(pregunta => ({
          texto_pregunta: pregunta.texto_pregunta,
          tipo_pregunta: pregunta.tipo_pregunta,
          puntos: pregunta.puntos,
          opciones: pregunta.opciones,
          respuesta_correcta: pregunta.respuesta_correcta,
          explicacion: pregunta.explicacion
        }))
      };

      const response = await quizzesAPI.crear(quizToSend);
      
      if (response.status === 201) {
        alert('Quiz guardado exitosamente');
        navigate('/docente/examenes-y-quizzes');
      } else {
        throw new Error(response.data?.message || 'Error al guardar el quiz');
      }
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
    <div className={styles.container}>
      <header className={styles.header}>
        <div className="container py-3 d-flex justify-content-between align-items-center">
          <h1 className="fw-bold text-dark mb-4" style={{ fontSize: "1.875rem" }}>
            Crear Nuevo Quiz
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
      <main className={styles.mainContent}>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className={styles.quizForm}>
            <div className={styles.formGroup}>
              <label>Título del Quiz *</label>
              <input
                type="text"
                name="titulo"
                value={quizData.titulo}
                onChange={handleQuizChange}
                required
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Descripción</label>
              <textarea
                name="descripcion"
                value={quizData.descripcion}
                onChange={handleQuizChange}
                rows="4"
                className={styles.formTextarea}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Duración (minutos) *</label>
                <input
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
                <label>Intentos Permitidos *</label>
                <input
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
                <label>Puntuación para Aprobar (%) *</label>
                <input
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

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="aleatorio"
                    checked={quizData.aleatorio}
                    onChange={handleQuizChange}
                    className={styles.formCheckbox}
                  />
                  Preguntas en orden aleatorio
                </label>
              </div>
            </div>

            <h2 className={styles.sectionTitle}>Preguntas del Quiz</h2>

            <div className={styles.questionForm}>
              <div className={styles.formGroup}>
                <label>Texto de la Pregunta *</label>
                <textarea
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
                  <label>Tipo de Pregunta *</label>
                  <select
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
                  <label>Puntos *</label>
                  <input
                    type="number"
                    name="puntos"
                    value={currentQuestion.puntos}
                    onChange={handleQuestionChange}
                    min="1"
                    required
                    className={styles.formInput}
                  />
                </div>
              </div>

              {currentQuestion.tipo_pregunta === 'opcion_multiple' && (
                <div className={styles.formGroup}>
                  <label>Opciones *</label>
                  <div className={styles.optionsContainer}>
                    {currentQuestion.opciones.map((opcion, index) => (
                      <div key={index} className={styles.optionItem}>
                        <input
                          type="radio"
                          name="respuesta_correcta"
                          value={opcion}
                          checked={currentQuestion.respuesta_correcta === opcion}
                          onChange={() => setCurrentQuestion({
                            ...currentQuestion,
                            respuesta_correcta: opcion
                          })}
                          className={styles.optionRadio}
                        />
                        <span>{opcion}</span>
                      </div>
                    ))}
                    <div className={styles.addOptionContainer}>
                      <input
                        type="text"
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        placeholder="Nueva opción"
                        className={styles.optionInput}
                      />
                      <button
                        type="button"
                        onClick={handleAddOption}
                        className={styles.addOptionButton}
                      >
                        Agregar Opción
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className={styles.formGroup}>
                <label>Explicación (Opcional)</label>
                <textarea
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
                className={styles.addQuestionButton}
                disabled={!currentQuestion.texto_pregunta.trim() ||
                          (currentQuestion.tipo_pregunta === 'opcion_multiple' &&
                           currentQuestion.opciones.length === 0)}
              >
                Agregar Pregunta
              </button>
            </div>

            {quizData.preguntas.length > 0 && (
              <div className={styles.questionsList}>
                <h3>Preguntas agregadas ({quizData.preguntas.length})</h3>
                <ul>
                  {quizData.preguntas.map((pregunta, index) => (
                    <li key={index} className={styles.questionItem}>
                      <div className={styles.questionHeader}>
                        <span>{pregunta.texto_pregunta}</span>
                        <span>{pregunta.puntos} punto{pregunta.puntos !== 1 ? 's' : ''}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.formActions}>
              <button
                type="button"
                onClick={() => navigate('/docente/examenes-y-quizzes')}
                className={`${styles.modalButton} ${styles.cancelButton}`}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`${styles.modalButton} ${styles.confirmButton}`}
                //disabled={isSubmitting || !quizData.titulo.trim() || quizData.preguntas.length === 0}
              >
                {isSubmitting ? (
                  <>
                    <span className={styles.loadingSpinner}></span>
                    Guardando...
                  </>
                ) : 'Guardar Quiz'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CrearQuizz;