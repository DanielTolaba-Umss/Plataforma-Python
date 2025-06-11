import React, { useState, useRef, useEffect } from "react";
import EditorMonaco from "@monaco-editor/react";

import "/src/paginas/estudiante/estilos/Prueba.css";
import { practiceJhService, testCasesService  } from "../../api/practiceJh";
import { tryPracticeService } from "../../api/tryPracticeService";


const Editor = ({ titulo, lessonId }) => {
  const [resultado, setResultado] = useState(null);
  const [retroalimentacion, setRetroalimentacion] = useState("");
  const [practica, setPractica] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [ejecutando, setEjecutando] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    const cargarPractica = async () => {
      try {
        setCargando(true);
        const datos = await practiceJhService.getPracticeByLessonId(lessonId);
        console.log("Datos de la práctica:", datos);
        setPractica(datos);
        setCargando(false);
      } catch (error) {
        console.error("Error al cargar la práctica:", error);
        setError("No se pudo cargar la información de la práctica");
        setCargando(false);
      }
    };

      cargarPractica();
  }, [lessonId]);

  useEffect(() => {
    const cargarTestCases = async () => { 
      if (practica) {
        try {
          const testCasesData = await testCasesService.getTestCasesByPracticeId(practica.id);
          console.log("Test cases cargados:", testCasesData);
          setTestCases(testCasesData);
        } catch (error) {
          console.error("Error al cargar los test cases:", error);
          setError("No se pudieron cargar los casos de prueba");
        }
      }
    };
    cargarTestCases();
  }, [practica]);
  
  const obtenerRestricciones = () => {
    if (!practica || !practica.restricciones) {
      return ["El código debe estar escrito en Python."];
    }

    const lineasRestricciones = practica.restricciones.split('\n');

    return lineasRestricciones
      .filter(linea => linea.trim() !== '')
      .map(linea => {
        if (linea.trim().startsWith('-') || linea.trim().startsWith('*')) {
          return linea.trim().substring(1).trim();
        }
        return linea.trim();
      });
  };

  const ejecutarCodigo = async () => {
    if (editorRef.current && practica) {
      const codigo = editorRef.current.getValue();
      console.log("Código ejecutado:", codigo);
      setRetroalimentacion("Ejecutando código...");
      setEjecutando(true);
      
      try {
        const respuesta = await tryPracticeService.createTryPractice({
          code: codigo,
          studentId: 1, 
          practiceId: practica.id
        });
        
        setRetroalimentacion(respuesta.feedback || "");
        
        let resultadosTests = [];
        if (respuesta.testResults) {
          try {
            resultadosTests = JSON.parse(respuesta.testResults.replace(/^"|"$/g, ''));
          } catch (error) {
            console.error("Error al parsear resultados de tests:", error);
          }
        }
        
        setResultado({
          status: respuesta.approved ? "Éxito" : "Fallido",
          output: respuesta.testResults,
          resultados: resultadosTests,
          approved: respuesta.approved
        });
      } catch (error) {
        console.error("Error al ejecutar el código:", error);
        setRetroalimentacion("Ocurrió un error al procesar tu código: " + error.message);
      } finally {
        setEjecutando(false);
      }
    } else {
      setRetroalimentacion("No se puede ejecutar el código. Asegúrate de que la práctica esté cargada.");
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

  const restriccionesFormateadas = obtenerRestricciones();


  if (cargando) {
    return (
      <div className="estado-cargando">
        <div className="spinner-carga"></div>
        <p>Cargando la práctica...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="estado-error">
        <div className="icono-error">❌</div>
        <p>{error}</p>
        <button 
          className="reintentar-button"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <section className="instrucciones">
      <h3 className="problema">{titulo}</h3>
      { !cargando && !error && practica &&  (
        <>
          <div className="instrucciones-texto">
            <p className="prolema">{practica.instrucciones}</p>
            <h4>Restricciones:</h4>
            <ul>
              {restriccionesFormateadas.map((restriccion, index) => (
                <li key={index}>{restriccion}</li>
              ))}
            </ul>
            <h4>Casos de Prueba:</h4>
            <ul>
              {testCases.map((testCase, index) => (
                <li key={index}>
                  Entrada: "{testCase.entrada}" | Salida Esperada: "{testCase.salida}"
                </li>
              ))}
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
              defaultValue={practica?.codigoInicial || "# Escribe tu código Python aquí"}
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

            <button 
              className="ejecutar-button" 
              onClick={ejecutarCodigo}
              disabled={ejecutando}
              style={{ 
                opacity: ejecutando ? 0.7 : 1,
                cursor: ejecutando ? 'wait' : 'pointer'
              }}
            >
                {ejecutando ? "Ejecutando..." : "Ejecutar Código"}
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
                  <strong style={{ color: resultado.approved ? "green" : "red" }}>
                    {resultado.status}
                  </strong>{" "}
                  {testCases.length} Test Cases
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
                    {testCases.map((testCase, index) => {
                      // Verificar si tenemos resultados para este test case
                      const correcto = resultado.resultados && 
                                      index < resultado.resultados.length ? 
                                      resultado.resultados[index] : false;

                      return (
                        <tr key={index}>
                          <td style={cellStyle}>#{index + 1}</td>
                          <td style={cellStyle}>{testCase.entrada}</td>
                          <td style={cellStyle}>{testCase.salida}</td>
                          <td
                            style={{
                              ...cellStyle,
                              color: correcto ? "green" : "red",
                              fontWeight: "bold",
                            }}
                          >
                            {correcto ? "✓ Aceptado" : "✗ Fallido"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

export default Editor;
