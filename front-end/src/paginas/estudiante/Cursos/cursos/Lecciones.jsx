import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./Lecciones.css";

const lecciones = [
  {
    id: 1,
    titulo: "Introducción a Python",
    descripcion: "Conceptos básicos y sintaxis inicial",
  },
  {
    id: 2,
    titulo: "Variables y Tipos",
    descripcion: "Uso de variables y tipos de datos",
  },
  {
    id: 3,
    titulo: "Estructuras de Control",
    descripcion: "Condicionales y bucles",
  },
  {
    id: 4,
    titulo: "Funciones",
    descripcion: "Creación y uso de funciones",
  },
];

const Lecciones = () => {
  const { nivelId } = useParams();
  const location = useLocation();
  const nivel = location.state?.nivel;

  useEffect(() => {
    console.log("Nivel recibido:", nivel);
    // Aquí podrías hacer una petición para obtener las lecciones reales usando nivelId
  }, [nivelId, nivel]);

  const [estadoLecciones, setEstadoLecciones] = React.useState(
    lecciones.map(() => ({ estado: "incompleto", boton: "Iniciar" }))
  );

  const manejarClick = (index) => {
    const nuevosEstados = [...estadoLecciones];
    nuevosEstados[index] = {
      estado: "completo",
      boton: "Continuar",
    };
    setEstadoLecciones(nuevosEstados);
  };

  return (
    <div className="curso-container">
      <header className="curso-header">
        <h2>{nivel ? nivel.title : "Lecciones del Curso"}</h2>
      </header>

      <main className="curso-lecciones">
        {lecciones.map((leccion) => (
          <div className="leccion-card" key={leccion.id}>
            <div className="leccion-content">
              <h3>{leccion.titulo}</h3>
              <p className="leccion-descripcion">{leccion.descripcion}</p>
            </div>
            <div className="leccion-actions"></div>
          </div>
        ))}
      </main>

      <footer className="curso-footer">
        <div className="curso-footer-buttons">
          <button className="footer-button">Quiz</button>
          <button className="footer-button">Prueba</button>
        </div>
      </footer>
    </div>
  );
};

export default Lecciones;
