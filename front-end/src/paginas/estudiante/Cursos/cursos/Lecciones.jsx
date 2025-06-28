// src/componentes/Estudiantes/LeccionesNivel.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import studentProfileService from "../../../../api/studentProfileService";
import CertificadoModal from "./CertificadoModal";
import "./Lecciones.css";

const LeccionesNivel = () => {
  const { id } = useParams();
  const location = useLocation();
  const [lecciones, setLecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCertificado, setShowCertificado] = useState(false);
  const [startingLesson, setStartingLesson] = useState(null);
  const navigate = useNavigate();

  const nivel = useMemo(() => {
    return location.state?.nivel || JSON.parse(localStorage.getItem("nivel"));
  }, [location.state]);

  const fetchLecciones = useCallback(async () => {
    try {
      setLoading(true);
      // Usar el servicio del estudiante para obtener las lecciones con progreso
      const lecciones = await studentProfileService.getCourseLessons(id);
      setLecciones(lecciones);
    } catch (err) {
      setError("Error al cargar las lecciones");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchLecciones();
    }
  }, [id, fetchLecciones]); 

  // Escuchar cambios en localStorage para refrescar cuando se complete una lección
  useEffect(() => {
    const handleStorageChange = () => {
      const flag = localStorage.getItem('lessonCompletedFlag');
      if (flag) {
        // Remover la flag y refrescar las lecciones
        localStorage.removeItem('lessonCompletedFlag');
        fetchLecciones();
      }
    };

    // Escuchar cambios en el storage
    window.addEventListener('storage', handleStorageChange);
    
    // También verificar periódicamente (para cambios en la misma pestaña)
    const interval = setInterval(() => {
      handleStorageChange();
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [fetchLecciones]);

  const handleIniciarLeccion = async (lessonId, event) => {
    event.stopPropagation(); // Evitar que se dispare el click del card
    try {
      setStartingLesson(lessonId);
      await studentProfileService.startLesson(lessonId);
      // Refrescar las lecciones para mostrar el nuevo estado
      await fetchLecciones();
    } catch (error) {
      console.error("Error al iniciar la lección:", error);
      setError("Error al iniciar la lección");
    } finally {
      setStartingLesson(null);
    }
  };

  const handleLeccionClick = (leccion) => {
    // Solo permitir navegación si la lección está iniciada o completada
    if (leccion.status === 'NOT_STARTED') {
      return; // No hacer nada si no está iniciada
    }
    
    navigate(`/cursos/${id}/lecciones/${leccion.lessonId}/practica`, {
      state: { tituloLeccion: leccion.title },
    });
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'COMPLETED':
        return '✓ Completada';
      case 'IN_PROGRESS':
        return '⏳ En progreso';
      case 'NOT_STARTED':
      default:
        return '⭕ No iniciada';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'completed';
      case 'IN_PROGRESS':
        return 'in_progress';
      case 'NOT_STARTED':
      default:
        return 'not_started';
    }
  };

  const handleObtenerCertificado = () => {
    setShowCertificado(true);
  };

  const closeCertificadoModal = () => {
    setShowCertificado(false);
  };

  if (loading) return <div>Cargando lecciones...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="lecciones-container">
      <h1 className="lecciones-title">Lecciones del nivel: {nivel?.level || 'Desconocido'}</h1>
      
      <div className="lecciones-grid">
        {lecciones.map((leccion) => (
          <div
            key={leccion.lessonId}
            className={`leccion-card ${leccion.status === 'NOT_STARTED' ? 'disabled' : ''}`}
            onClick={() => handleLeccionClick(leccion)}
            style={{ 
              cursor: leccion.status === 'NOT_STARTED' ? 'default' : 'pointer',
              opacity: leccion.status === 'NOT_STARTED' ? 0.7 : 1
            }}
          >
            <h3 className="leccion-title">{leccion.title}</h3>
            <p className="leccion-description">{leccion.description}</p>
            
            {/* Mostrar información del progreso */}
            <div className="leccion-progress">
              <div className={`status-badge ${getStatusClass(leccion.status)}`}>
                {getStatusText(leccion.status)}
              </div>
              
              {leccion.practiceCompleted && (
                <div className="practice-badge">
                  Práctica: {leccion.bestPracticeScore}%
                </div>
              )}
            </div>

            {/* Botón de iniciar para lecciones no iniciadas */}
            {leccion.status === 'NOT_STARTED' && (
              <button
                className="start-lesson-btn"
                onClick={(e) => handleIniciarLeccion(leccion.lessonId, e)}
                disabled={startingLesson === leccion.lessonId}
              >
                {startingLesson === leccion.lessonId ? 'Iniciando...' : 'Iniciar Lección'}
              </button>
            )}

            {/* Indicador visual para lecciones en progreso o completadas */}
            {leccion.status === 'IN_PROGRESS' && (
              <div className="action-hint">
                Haz click para continuar con la práctica
              </div>
            )}

            {leccion.status === 'COMPLETED' && (
              <div className="action-hint">
                Haz click para revisar la práctica
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        className="curso-footer-buttons"
        style={{ display: "flex", gap: "10px" }}
      >
        <button
          className="footer-button"
          onClick={() => navigate(`/cursos/${id}/lecciones/quiz`)}
        >
          Quiz
        </button>
        <button className="footer-button" onClick={handleObtenerCertificado}>
          Obtener Certificado
        </button>
      </div>

      {showCertificado && (
        <CertificadoModal
          isOpen={showCertificado}
          onClose={closeCertificadoModal}
          nivel={nivel.level}
          nombreEstudiante="Juan Pérez" // Aquí deberías obtener el nombre del usuario logueado
        />
      )}
    </div>
  );
};

export default LeccionesNivel;
