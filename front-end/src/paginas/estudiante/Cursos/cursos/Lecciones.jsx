// src/componentes/Estudiantes/LeccionesNivel.jsx
import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { leccionesAPI } from "../../../../api/leccionService";
import "./Lecciones.css"; // Asegúrate de importar el CSS

const LeccionesNivel = () => {
  const { id } = useParams();
  const location = useLocation();
  const [lecciones, setLecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const nivel =
    location.state?.nivel || JSON.parse(localStorage.getItem("nivel"));

  useEffect(() => {
    const fetchLecciones = async () => {
      try {
        setLoading(true);
        const response = await leccionesAPI.obtenerPorCursoYNivel(
          id,
          nivel.level
        );
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

  if (loading) return <div>Cargando lecciones...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="lecciones-container">
      <h1 className="lecciones-title">Lecciones del nivel: {nivel.level}</h1>

      <div className="lecciones-grid">
        {lecciones.map((leccion) => (
          <div key={leccion.id} className="leccion-card">
            <h3 className="leccion-title">{leccion.title}</h3>
            <p className="leccion-description">{leccion.description}</p>
          </div>
        ))}
      </div>
      <div className="curso-footer-buttons">
        <button className="footer-button">Quiz</button>
      </div>
    </div>
  );
};

export default LeccionesNivel;
