// src/componentes/Estudiantes/LeccionesNivel.jsx
import React, { useState, useEffect, useMemo } from "react";
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
  const navigate = useNavigate();

  const nivel = useMemo(() => {
    return location.state?.nivel || JSON.parse(localStorage.getItem("nivel"));
  }, [location.state]);
  useEffect(() => {
    const fetchLecciones = async () => {
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
    };

    if (id) {
      fetchLecciones();
    }
  }, [id]);

  const handleObtenerCertificado = () => {
    setShowCertificado(true);
  };

  const closeCertificadoModal = () => {
    setShowCertificado(false);
  };

  if (loading) return <div>Cargando lecciones...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="lecciones-container">
      <h1 className="lecciones-title">Lecciones del nivel: {nivel.level}</h1>      <div className="lecciones-grid">
        {lecciones.map((leccion) => (
          <div
            key={leccion.lessonId}
            className="leccion-card"
            onClick={() =>
              navigate(`/cursos/${id}/lecciones/${leccion.lessonId}/practica`, {
                state: { tituloLeccion: leccion.title },
              })
            }
            style={{ cursor: "pointer" }}
          >
            <h3 className="leccion-title">{leccion.title}</h3>
            <p className="leccion-description">{leccion.description}</p>
            {/* Mostrar información del progreso */}
            <div className="leccion-progress">
              <div className={`status-badge ${leccion.status?.toLowerCase()}`}>
                {leccion.status === 'COMPLETED' ? '✓ Completada' : 
                 leccion.status === 'IN_PROGRESS' ? '⏳ En progreso' : 
                 '⭕ No iniciada'}
              </div>
              {leccion.practiceCompleted && (
                <div className="practice-badge">
                  Práctica: {leccion.bestPracticeScore}%
                </div>
              )}
            </div>
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
