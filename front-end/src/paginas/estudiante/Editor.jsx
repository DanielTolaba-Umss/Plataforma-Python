import React, { useState, useRef } from "react";
import EditorMonaco from "@monaco-editor/react";
import "/src/paginas/estudiante/estilos/Prueba.css";

const Editor = ({ titulo, descripcion }) => {
  const [resultado, setResultado] = useState(null);
  const [retroalimentacion, setRetroalimentacion] = useState("");
  const editorRef = useRef(null);
  const [inputStdin, setInputStdin] = useState("");

  const ejecutarCodigo = () => {
    if (editorRef.current) {
      const codigo = editorRef.current.getValue();
      console.log("Código ejecutado:", codigo);

      // ✅ Validación simple del código del estudiante
      const usaInput = codigo.includes("input");
      const saludaBien = /print\s*\(.*Hola.*\)/.test(codigo);

      if (usaInput && saludaBien) {
        setRetroalimentacion(
          "¡Excelente! Estás utilizando `input()` y mostrando correctamente el saludo."
        );
      } else if (!usaInput && !saludaBien) {
        setRetroalimentacion(
          " Asegúrate de pedir el nombre usando `input()` y mostrar un saludo con `print()`."
        );
      } else if (!usaInput) {
        setRetroalimentacion(
          " Falta el uso de `input()` para pedir el nombre."
        );
      } else {
        setRetroalimentacion(
          " Falta mostrar el saludo correctamente con `print('Hola nombre')`."
        );
      }

      // Salida simulada (puedes personalizar más si deseas)
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
        {/* <input
          type="text"
          placeholder="Entrada (stdin)"
          value={inputStdin}
          onChange={(e) => setInputStdin(e.target.value)}
        /> */}
        <button className="ejecutar-button" onClick={ejecutarCodigo}>
          Ejecutar Código
        </button>

        {/* Retroalimentación visible */}
        {retroalimentacion && (
          <div
            className="retroalimentacion"
            style={{
              marginTop: "1rem",
              padding: "1rem",
              backgroundColor: "#f0f8ff",
              borderLeft: "5px solid #007bff",
            }}
          >
            <strong>Retroalimentación:</strong>
            <p>{retroalimentacion}</p>
          </div>
        )}

        {/* Resultado de la simulación */}
        {/* Simulación de test cases */}
        {resultado && (
          <div className="resultado-simulacion">
            <p>
              <strong style={{ color: "green" }}>{resultado.status}</strong>{" "}
              #TestCases {resultado.tiempo} {resultado.memoria}
            </p>
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#fffbe6",
                  border: "1px solid #ffe58f",
                  borderRadius: "6px",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <p>
                  <strong>📄 Test Case #{i}</strong>
                </p>
                <p>
                  <strong>📥 Input:</strong> 10 5
                </p>
                <p>
                  <strong>📤 Output Esperado:</strong> 15
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Editor;
