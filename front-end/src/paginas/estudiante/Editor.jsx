// src/components/Editor.jsx
import React, { useState, useRef } from "react";
import EditorMonaco from "@monaco-editor/react";
import "/src/paginas/estudiante/estilos/Prueba.css";

const Editor = ({ titulo, descripcion }) => {
  const [resultado, setResultado] = useState(null);
  const editorRef = useRef(null);
  const [inputStdin, setInputStdin] = useState("");

  const ejecutarCodigo = () => {
    if (editorRef.current) {
      const codigo = editorRef.current.getValue();
      console.log("Código ejecutado:", codigo);

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
    <section className="instrucciones">
      <h3 className="problema">{titulo}</h3>
      <p className="prolema">{descripcion}</p>
      <div
        className="editor"
        role="region"
        aria-label="Editor de texto para escribir código Python"
      >
        <h4>EDITOR DE CÓDIGO</h4>
        <EditorMonaco
          height="300px"
          width="100%"
          defaultLanguage="python"
          defaultValue="# Escribe tu código Python aquí"
          theme="vs-white"
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

        {resultado && (
          <div className="resultado-simulacion">
            <p>
              <strong style={{ color: "green" }}>{resultado.status}</strong>{" "}
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
  );
};

export default Editor;
