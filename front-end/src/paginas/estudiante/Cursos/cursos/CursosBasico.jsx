import React, { useState } from "react";
import "./CursosBasico.css"; // Asegúrate de tener este archivo CSS para estilos
import { useNavigate } from "react-router-dom";

const lecciones = [
  { id: 1, titulo: "Lección 1" },
  { id: 2, titulo: "Lección 2" },
  { id: 3, titulo: "Lección 3" },
  { id: 4, titulo: "Lección 4" },
];

const CursosBasico = () => {
  const [estadoLecciones, setEstadoLecciones] = useState(
    lecciones.map(() => ({ estado: "incompleto", boton: "Iniciar" }))
  );
    const navigate = useNavigate();

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
      <header className="curso-header">Curso Básico</header>

      <main className="curso-lecciones">
        {lecciones.map((leccion, index) => (
          <div className="leccion-card" key={leccion.id}>
            <h3>{leccion.titulo}</h3>
            <p>Estado: {estadoLecciones[index].estado}</p>
            <button onClick={() => manejarClick(index)}>
              {estadoLecciones[index].boton}
            </button>
          </div>
        ))}
      </main>

      <footer className="curso-footer">
        <span>Estado: ✅</span>
        <div className="curso-footer-buttons">
          <button onClick={() => navigate("/cursos/basico/quiz")}>
            Quiz
          </button>
          <button>Prueba</button>
        </div>
      </footer>
    </div>
  );
};

export default CursosBasico;
