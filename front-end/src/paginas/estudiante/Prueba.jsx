import React, { useState } from "react";
import "/src/paginas/estudiante/estilos/Prueba.css";
import Editor from "./Editor"; // 🔥 Editor separado
import VisorPDF from "./VisorPDF"; // 🔥 VisorPDF separado

const Prueba = () => {
  const [vistaActual, setVistaActual] = useState("pdf");

  return (
    <div className="prueba-container">
      <div className="contenedor-titulo-video">
        <header className="prueba-header">
          <a href="/cursos/basico" className="volver">
            &lt; Volver
          </a>
          <h1>Fundamentos Python</h1>
          <h2>Lección 1: Título</h2>
        </header>

        <section className="video-section">
          <div className="video-card">
            <iframe
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/4f3GpJZtvns?start=6"
              title="Visualizador de Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div
            className="transcriptor"
            role="region"
            aria-label="Transcriptor del video"
          >
            <h3>TRANSCRIPTOR</h3>
            <p>
              El transcriptor aparecerá aquí cuando el video esté
              reproduciéndose...
            </p>
          </div>
        </section>
      </div>

      <div className="acciones">
        <div className="tabs-central">
          <span
            className={`tab ${vistaActual === "pdf" ? "activo" : ""}`}
            onClick={() => setVistaActual("pdf")}
          >
            PDF
          </span>
          <span
            className={`tab ${vistaActual === "practica" ? "activo" : ""}`}
            onClick={() => setVistaActual("practica")}
          >
            Práctica
          </span>
        </div>
      </div>

      {/* 🔥 Mostrar solo uno según la vista */}
      {vistaActual === "pdf" && (
        <VisorPDF src="/src/assets/pythonbookPrueba.pdf" /> // Cambiar ruta del PDF
      )}

      {vistaActual === "practica" && (
        <Editor
          titulo="Instrucciones de la práctica:"
          descripcion="Escribir un programa que pregunte el nombre del usuario en la consola y después de que el usuario lo introduzca muestre por pantalla la cadena ¡Hola nombre!, donde nombre es el nombre que el usuario haya introducido."
        />
      )}

      <footer className="progreso-footer">
        <div className="progreso-barra">
          <div className="progreso"></div>
        </div>
        <span>25%</span>
      </footer>
    </div>
  );
};

export default Prueba;
