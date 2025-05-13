import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "./CrearPractica.css";

const CrearPractica = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { selectedCourse, selectedModule } = state || {};

  const [showPlaceholders, setShowPlaceholders] = useState({
    titulo: true,
    instrucciones: true,
    respuesta: true
  });

  const [formData, setFormData] = useState({
    titulo: '',
    instrucciones: '',
    respuesta: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
        if (value && showPlaceholders[name]) {
      setShowPlaceholders({
        ...showPlaceholders,
        [name]: false
      });
    }
  };

  const handleFocus = (fieldName) => {
    if (showPlaceholders[fieldName]) {
      setShowPlaceholders({
        ...showPlaceholders,
        [fieldName]: false
      });
      setFormData({
        ...formData,
        [fieldName]: ''
      });
    }
  };

  const handleBlur = (fieldName) => {
    if (!formData[fieldName]) {
      setShowPlaceholders({
        ...showPlaceholders,
        [fieldName]: true
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
        const realValues = {
      titulo: showPlaceholders.titulo ? '' : formData.titulo,
      instrucciones: showPlaceholders.instrucciones ? '' : formData.instrucciones,
      respuesta: showPlaceholders.respuesta ? '' : formData.respuesta
    };

    if (!realValues.titulo || !realValues.instrucciones) {
      alert('Título e instrucciones son obligatorios');
      return;
    }

    const practicaData = {
      curso_id: selectedCourse?.id || '',
      modulo: selectedModule || '',
      ...realValues
    };

    console.log('Datos de la práctica:', practicaData);
    alert('Práctica guardada correctamente');
    navigate(-1);
  };

  const placeholders = {
    titulo: 'Ej: Práctica 1: Usando print por primera vez',
    instrucciones: 'Ej: Escribe un programa que muestre en pantalla el mensaje: Hola Python',
    respuesta: 'print("Hola Python")'
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Crear Nueva Práctica</h1>
      </div>
      
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Información Básica</h2>
            
            <div className="form-group">
              <label htmlFor="titulo">Título de la Práctica</label>
              <input 
                type="text" 
                id="titulo" 
                name="titulo" 
                value={formData.titulo}
                onChange={handleInputChange}
                placeholder={placeholders.titulo}
                required
              />
              {showPlaceholders.titulo && (
                <div className="placeholder-example">
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="instrucciones">Instrucciones</label>
              <div className="textarea-wrapper">
                <textarea 
                    id="instrucciones" 
                    name="instrucciones" 
                    rows="5"
                    value={formData.instrucciones}
                    onChange={handleInputChange}
                    placeholder={placeholders.instrucciones}
                    required
                ></textarea>
                {showPlaceholders.instrucciones && (
                  <div className="placeholder-example">
                  </div>
                )}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="respuesta">Respuesta Esperada (Opcional)</label>
              <div className="textarea-wrapper">
                <textarea 
                    id="respuesta" 
                    name="respuesta" 
                    rows="3"
                    value={formData.respuesta}
                    onChange={handleInputChange}
                    placeholder={placeholders.respuesta}
                    className="code-response"
                ></textarea>
                {showPlaceholders.respuesta && (
                  <div className="placeholder-example code-placeholder">
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="form-footer">
            <button 
              type="button" 
              className="btn btn-danger" 
              onClick={() => navigate('')}
              style={{ marginRight: '10px' }}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-success submit-btn"
            >
              Guardar Práctica
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearPractica;