import React, { useState, useRef, useEffect } from "react";
import EditorMonaco from "@monaco-editor/react";

import "/src/paginas/estudiante/estilos/Prueba.css";
import { practiceJhService } from "../../api/practiceJh";
import { tryPracticeService } from "../../api/tryPracticeService";


const Editor = ({ titulo, descripcion }) => {
  const [resultado, setResultado] = useState(null);
  const [retroalimentacion, setRetroalimentacion] = useState("");
  const [practica, setPractica] = useState(null);
  const [error, setError] = useState(null);
  const editorRef = useRef(null);

   useEffect(() => {
    const cargarPractica = async () => {
      try {
        const datos = await practiceJhService.getPracticeByLessonId(lessonId);
        setPractica(datos);

      } catch (error) {
        console.error("Error al cargar la práctica:", error);
        setError("No se pudo cargar la información de la práctica");
      }
    };

      cargarPractica();
  }, [lessonId]);
  
  
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

      // Simular resultado con test cases
      const salidaSimulada = {
        status: "Éxito",
        tiempo: "0.07s",
        memoria: "14060KB",
        output: "15", // resultado generado por el código simulado
      };
      setResultado(salidaSimulada);
    }
  };

  const cellHeaderStyle = {
    padding: "10px",
    borderBottom: "2px solid #ffe58f",
    backgroundColor: "#fff2cc",
    textAlign: "left",
  };

  const cellStyle = {
    padding: "10px",
    borderBottom: "1px solid #ffe58f",
  };

  return (
    <section className="instrucciones">
      <h3 className="problema">{titulo}</h3>
      <div className="instrucciones-texto">
        <p className="prolema">{descripcion}</p>
        <h4>Restricciones:</h4>
        <ul>
          <li>El código debe estar escrito en Python.</li>
          <li>Debe utilizar la función `input()` para recibir datos.</li>
          <li>Debe mostrar un saludo personalizado usando `print()`.</li>
          <li>El código debe ser ejecutable sin errores de sintaxis.</li>
        </ul>
        <h4>Casos de Prueba:</h4>
        <ul>
          <li>Entrada: "10 5" | Salida Esperada: "15"</li>
          <li>Entrada: "20 30" | Salida Esperada: "50"</li>
          <li>Entrada: "100 200" | Salida Esperada: "300"</li>
        </ul>
      </div>
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

        {/* Resultados simulados en tabla */}
        {resultado && (
          <div className="resultado-simulacion" style={{ marginTop: "1rem" }}>
            <p>
              <strong style={{ color: "green" }}>{resultado.status}</strong>{" "}
              #TestCases {resultado.tiempo} {resultado.memoria}
            </p>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: "#fffbe6",
                border: "1px solid #ffe58f",
                marginTop: "1rem",
              }}
            >
              <thead>
                <tr>
                  <th style={cellHeaderStyle}>Test Case #</th>
                  <th style={cellHeaderStyle}>Input</th>
                  <th style={cellHeaderStyle}>Output Esperado</th>
                  <th style={cellHeaderStyle}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => {
                  const input = "10 5";
                  const esperado = "15";
                  const generado = resultado.output; // simulado
                  const correcto = generado === esperado;

                  return (
                    <tr key={i}>
                      <td style={cellStyle}>#{i}</td>
                      <td style={cellStyle}>{input}</td>
                      <td style={cellStyle}>{esperado}</td>
                      <td
                        style={{
                          ...cellStyle,
                          color: correcto ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {correcto ? "Aceptado" : "Respuesta Incorrecta"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default Editor;
