// src/componentes/Estudiantes/LeccionesNivel.jsx
import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { leccionesAPI } from "../../../../api/leccionService";
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

  const nivel = location.state?.nivel || JSON.parse(localStorage.getItem("nivel"));

  useEffect(() => {
    const fetchLecciones = async () => {
      try {
        setLoading(true);
        const response = await leccionesAPI.obtenerPorCursoYNivel(id, nivel.level);
        setLecciones(response.data);
      } catch (err) {
        setError("Error al cargar las lecciones");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id && nivel?.level) {
      fetchLecciones();
    }
  }, [id, nivel]);

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
      <h1 className="lecciones-title">Lecciones del nivel: {nivel.level}</h1>
      <div className="lecciones-grid">
        {lecciones.map((leccion) => (
          <div
            key={leccion.id}
            className="leccion-card"
            onClick={() => navigate(`/cursos/${leccion.id}/lecciones/Practica`)}
            style={{ cursor: "pointer" }}
          >
            <h3 className="leccion-title">{leccion.title}</h3>
            <p className="leccion-description">{leccion.description}</p>
          </div>
        ))}
      </div>
      
      <div className="curso-footer-buttons" style={{ display: "flex", gap: "10px" }}>
        <button
          className="footer-button"
          onClick={() => navigate(`/cursos/${id}/lecciones/quiz`)}
        >
          Quiz
        </button>
        <button
          className="footer-button"
          onClick={handleObtenerCertificado}
        >
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