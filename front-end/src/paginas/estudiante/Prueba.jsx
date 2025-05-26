import React, { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import "/src/paginas/estudiante/estilos/Prueba.css";

const Prueba = () => {
  const [resultado, setResultado] = useState(null);
  const editorRef = useRef(null);
  const [inputStdin, setInputStdin] = useState("");

  const ejecutarCodigo = () => {
    if (editorRef.current) {
      const codigo = editorRef.current.getValue();
      console.log("Código ejecutado:", codigo);

      // 🔥 Simulación de resultado
      const salidaSimulada = {
        status: "Éxito",
        tiempo: "0.07s",
        memoria: "14060KB",
        stdin:
          inputStdin.trim() === "" ? "Standard input is empty" : inputStdin,
        stdout: "La suma de 10 y 5 es: 15",
      };
      setResultado(salidaSimulada);
    }
  };

  return (
    <div className="prueba-container">
      <div className="contenedor-titulo-video">
        <header className="prueba-header">
          <a href="#" className="volver">
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
          <span className="tab activo">PDF</span>
          <span className="tab">Práctica</span>
        </div>
      </div>

      <section className="instrucciones">
        <h3 className="problema">Instrucciones de la práctica:</h3>
        <p className="prolema">
          Escribir un programa que pregunte el nombre del usuario en la consola
          y después de que el usuario lo introduzca muestre por pantalla la
          cadena ¡Hola nombre!, donde nombre es el nombre que el usuario haya
          introducido.
        </p>
        <div
          className="editor"
          role="region"
          aria-label="Editor de texto para escribir código Python"
        >
          <h4>EDITOR DE CÓDIGO</h4>
          <Editor
            height="300px" // 🔥 Reduce el alto del editor
            width="100%" // 🔥 Se ajusta al contenedor
            defaultLanguage="python"
            defaultValue="# Escribe tu código Python aquí"
            theme="vs-dark"
            onMount={(editor) => {
              editorRef.current = editor;
            }}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              automaticLayout: true,
            }}
          />
          <input
            type="text"
            placeholder="Entrada (stdin)"
            value={inputStdin}
            onChange={(e) => setInputStdin(e.target.value)}
          />
          <button className="ejecutar-button" onClick={ejecutarCodigo}>
            Ejecutar Código
          </button>

          {/* 🔥 Simulamos la respuesta estilo consola */}
          {resultado && (
            <div className="resultado-simulacion">
              <p>
                <strong style={{ color: "green" }}>
                  ✅ {resultado.status}
                </strong>{" "}
                #stdin #stdout {resultado.tiempo} {resultado.memoria}
              </p>
              <p>
                <strong>📥 stdin</strong>
                <br />
                {resultado.stdin}
              </p>
              <p>
                <strong>📤 stdout</strong>
                <br />
                {resultado.stdout}
              </p>
            </div>
          )}
        </div>
      </section>

      <footer
        className="progreso-footer"
        role="contentinfo"
        aria-label="Progreso de la lección"
      >
        <div className="progreso-barra">
          <div className="progreso"></div>
        </div>
        <span>25%</span>
      </footer>
    </div>
  );
};

export default Prueba;
