import { useCallback } from "react"; // Asegúrate de importar useCallback
import React, { useState, useEffect } from "react";
import "./CrearExamen.css";

// Componente para una fila de opción de respuesta
const OptionRow = ({ option, questionId, onUpdate, onRemove }) => {
  return (
    <div className="option-row">
      <input
        type="radio"
        name={`correct-option-${questionId}`}
        className="option-correct"
        checked={option.isCorrect}
        onChange={() => onUpdate({ isCorrect: true })}
      />
      <input
        type="text"
        className="option-text"
        placeholder="Texto de la opción"
        value={option.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        required
      />
      <input
        type="number"
        className="option-order"
        placeholder="Orden"
        min="1"
        value={option.order}
        onChange={(e) => onUpdate({ order: e.target.value })}
        style={{ width: "80px" }}
      />
      <button type="button" className="remove-option" onClick={onRemove}>
        ×
      </button>
    </div>
  );
};

// Componente para una tarjeta de pregunta
const QuestionCard = ({ question, onUpdate, onRemove }) => {
  // Agregar una nueva opción
  const addOption = () => {
    const newOptions = [
      ...question.options,
      {
        id: Date.now(),
        text: "",
        isCorrect: false,
        order: question.options.length + 1,
      },
    ];

    onUpdate({ options: newOptions });
  };

  // Eliminar una opción
  const removeOption = (optionId) => {
    const filteredOptions = question.options.filter(
      (option) => option.id !== optionId
    );

    // Renumerar las opciones
    const updatedOptions = filteredOptions.map((option, index) => ({
      ...option,
      order: index + 1,
    }));

    onUpdate({ options: updatedOptions });
  };

  // Actualizar una opción
  const updateOption = (optionId, updates) => {
    const updatedOptions = question.options.map((option) =>
      option.id === optionId ? { ...option, ...updates } : option
    );

    // Si estamos actualizando isCorrect y es multiple choice, desmarcar las otras opciones
    if (updates.isCorrect && question.type === "multiple") {
      updatedOptions.forEach((option) => {
        if (option.id !== optionId) {
          option.isCorrect = false;
        }
      });
    }

    onUpdate({ options: updatedOptions });
  };

  // Manejar cambio del tipo de pregunta
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    onUpdate({ type: newType });

    // Si cambiamos a verdadero/falso, crear opciones específicas
    if (newType === "boolean") {
      onUpdate({
        options: [
          { id: Date.now(), text: "Verdadero", isCorrect: false, order: 1 },
          { id: Date.now() + 1, text: "Falso", isCorrect: false, order: 2 },
        ],
      });
    }
  };

  return (
    <div className="question-card">
      <div className="question-header">
        <h3>
          Pregunta <span className="question-number">{question.number}</span>
        </h3>
        <div>
          <label htmlFor={`question-points-${question.id}`}>Puntos:</label>
          <input
            type="number"
            id={`question-points-${question.id}`}
            className="question-points"
            min="0"
            step="0.01"
            value={question.points}
            onChange={(e) => onUpdate({ points: e.target.value })}
            style={{ width: "80px" }}
          />
        </div>
      </div>

      <button type="button" className="remove-btn" onClick={onRemove}>
        ×
      </button>

      <div className="form-group">
        <label>Texto de la pregunta</label>
        <textarea
          className="question-text"
          rows="2"
          value={question.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          required
        ></textarea>
      </div>

      <div className="form-group">
        <label>Tipo de pregunta</label>
        <select
          className="question-type"
          value={question.type}
          onChange={handleTypeChange}
        >
          <option value="multiple">Opción múltiple</option>
          <option value="boolean">Verdadero/Falso</option>
        </select>
      </div>

      <div className="form-group">
        <label>Explicación (opcional)</label>
        <textarea
          className="question-explanation"
          rows="2"
          value={question.explanation}
          onChange={(e) => onUpdate({ explanation: e.target.value })}
        ></textarea>
      </div>

      <div className="form-group">
        <label>Orden</label>
        <input
          type="number"
          className="question-order"
          min="1"
          value={question.order}
          onChange={(e) => onUpdate({ order: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            className="question-active"
            checked={question.active}
            onChange={(e) => onUpdate({ active: e.target.checked })}
          />
          Pregunta activa
        </label>
      </div>

      <h4>Opciones de respuesta:</h4>
      <div className="options-container">
        {question.options.map((option) => (
          <OptionRow
            key={option.id}
            option={option}
            questionId={question.id}
            questionType={question.type}
            onUpdate={(updates) => updateOption(option.id, updates)}
            onRemove={() => removeOption(option.id)}
          />
        ))}
      </div>

      <button type="button" className="btn add-option-btn" onClick={addOption}>
        + Agregar Opción
      </button>
    </div>
  );
};

// Componente principal del formulario de examen
const ExamenForm = () => {
  const [formData, setFormData] = useState({
    curso_id: "",
    titulo: "",
    descripcion: "",
    duracion_minutos: "",
    intentos_permitidos: 1,
    puntaje_aprobacion: "",
    aleatorio: false,
    activo: true,
  });

  const [questions, setQuestions] = useState([]);
  const [questionCount, setQuestionCount] = useState(0);

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Agregar una nueva pregunta
  const addQuestion = useCallback(() => {
    setQuestionCount((prevCount) => {
      const newCount = prevCount + 1;

      setQuestions((prevQuestions) => [
        ...prevQuestions,
        {
          id: Date.now(),
          number: newCount,
          text: "",
          type: "multiple",
          points: 1,
          explanation: "",
          order: newCount,
          active: true,
          options: [
            { id: Date.now(), text: "", isCorrect: false, order: 1 },
            { id: Date.now() + 1, text: "", isCorrect: false, order: 2 },
          ],
        },
      ]);

      return newCount;
    });
  }, []);

  // Eliminar una pregunta
  const removeQuestion = (questionId) => {
    const updatedQuestions = questions
      .filter((question) => question.id !== questionId)
      .map((question, index) => ({
        ...question,
        number: index + 1,
        order: question.order === index + 2 ? index + 1 : question.order,
      }));

    setQuestions(updatedQuestions);
    setQuestionCount(updatedQuestions.length);
  };

  // Actualizar una pregunta
  const updateQuestion = (questionId, updates) => {
    setQuestions(
      questions.map((question) =>
        question.id === questionId ? { ...question, ...updates } : question
      )
    );
  };

  // Guardar el examen
  const saveQuiz = (e) => {
    e.preventDefault();

    const quizData = {
      ...formData,
      curso_id: parseInt(formData.curso_id),
      duracion_minutos: parseInt(formData.duracion_minutos),
      intentos_permitidos: parseInt(formData.intentos_permitidos),
      puntaje_aprobacion: parseFloat(formData.puntaje_aprobacion),
      preguntas: questions.map((question) => ({
        texto: question.text,
        tipo: question.type,
        puntos: parseFloat(question.points),
        explicacion: question.explanation,
        orden: parseInt(question.order),
        activo: question.active,
        opciones: question.options.map((option) => ({
          texto: option.text,
          es_correcta: option.isCorrect,
          orden: parseInt(option.order),
        })),
      })),
    };

    console.log("Datos del examen:", quizData);
    alert("Examen guardado correctamente (datos en consola)");
    // Aquí se enviarían los datos al backend en una aplicación real
  };

  // Agregar la primera pregunta al cargar el componente

  useEffect(() => {
    addQuestion();
  }, [addQuestion]);

  return (
    <div className="container">
      <div className="header">
        <h1>Crear Nuevo Examen</h1>
      </div>

      <div className="form-container">
        <form id="quiz-form" onSubmit={saveQuiz}>
          {/* Información General del Examen */}
          <div className="form-section">
            <h2>Información General</h2>

            <div className="form-group">
              <label htmlFor="curso_id">ID del Curso</label>
              <input
                type="number"
                id="curso_id"
                name="curso_id"
                value={formData.curso_id}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="titulo">Título del Examen</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows="3"
                value={formData.descripcion}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="duracion_minutos">Duración (minutos)</label>
              <input
                type="number"
                id="duracion_minutos"
                name="duracion_minutos"
                min="1"
                value={formData.duracion_minutos}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="intentos_permitidos">Intentos Permitidos</label>
              <input
                type="number"
                id="intentos_permitidos"
                name="intentos_permitidos"
                min="1"
                value={formData.intentos_permitidos}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="puntaje_aprobacion">Puntaje para Aprobar</label>
              <input
                type="number"
                id="puntaje_aprobacion"
                name="puntaje_aprobacion"
                step="0.01"
                min="0"
                value={formData.puntaje_aprobacion}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  id="aleatorio"
                  name="aleatorio"
                  checked={formData.aleatorio}
                  onChange={handleInputChange}
                />
                Mostrar preguntas en orden aleatorio
              </label>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  id="activo"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleInputChange}
                />
                Examen activo
              </label>
            </div>
          </div>

          {/* Sección de Preguntas */}
          <div className="form-section">
            <h2>Preguntas</h2>
            <p>Total de preguntas: {questionCount}</p>
            <p>Agrega las preguntas para este examen:</p>

            <div id="questions-container">
              {questions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onUpdate={(updates) => updateQuestion(question.id, updates)}
                  onRemove={() => removeQuestion(question.id)}
                />
              ))}
            </div>

            <button type="button" className="btn" onClick={addQuestion}>
              + Agregar Pregunta
            </button>
          </div>

          {/* Botón de Guardar */}
          <div className="form-footer">
            <button type="submit" className="btn btn-success submit-btn">
              Guardar Examen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExamenForm;
