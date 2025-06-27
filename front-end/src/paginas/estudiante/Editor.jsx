import React, { useState, useRef, useEffect } from "react";
import EditorMonaco from "@monaco-editor/react";

import "/src/paginas/estudiante/estilos/Prueba.css";
import { practiceJhService, testCasesService  } from "../../api/practiceJh";
import { tryPracticeService } from "../../api/tryPracticeService";
import ReactMarkdown from 'react-markdown';
import { autoFeedbackService } from "../../api/feedback";


const Editor = ({ titulo, lessonId, studentId }) => {
  const [resultado, setResultado] = useState(null);
  const [retroalimentacion, setRetroalimentacion] = useState("");
  const [practica, setPractica] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [ejecutando, setEjecutando] = useState(false);
  const [generandoFeedback, setGenerandoFeedback] = useState(false);
  const [intentosAnteriores, setIntentosAnteriores] = useState([]);
  const [practiceApproved, setPracticeApproved] = useState(false);
  const [, setCargandoIntentos] = useState(false);
  const editorRef = useRef(null);
  const [codigoInicial, setCodigoInicial] = useState("# Escribe tu código Python aquí");

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

  useEffect(() => {
    const cargarIntentosPrevios = async () => {
      if (!practica || !practica.id) return;
      
      setCargandoIntentos(true);
      try {
        console.log(`Cargando intentos previos para práctica ${practica.id}`);
        const intentos = await tryPracticeService.getStudentPracticeAttempts(
          studentId,
          practica.id
        );

        console.log("Intentos previos cargados:", intentos);
        
        setIntentosAnteriores(intentos);


        
        const aprobada = intentos.some(intento => intento.approved === true);
        setPracticeApproved(aprobada);

        if (intentos && intentos.length > 0) {

          const ultimoIntento = intentos[intentos.length - 1];

          if (ultimoIntento && ultimoIntento.code && editorRef.current) {
            editorRef.current.setValue(ultimoIntento.code);
            console.log("Código cargado en editor:", ultimoIntento.code);
          }

          if (ultimoIntento.feedback) {
            try {
              const feedbackObj = JSON.parse(ultimoIntento.feedback);
              if (feedbackObj && typeof feedbackObj === 'object' && feedbackObj.feedback) {
                setRetroalimentacion(feedbackObj.feedback);
              } else {
                setRetroalimentacion(ultimoIntento.feedback);
              }
            } catch (e) {
              console.error("Error al parsear feedback del último intento:", e);
              setRetroalimentacion(ultimoIntento.feedback);
            }
          }

          if (ultimoIntento.testResults) {
            try {
              let resultadosTests = [];
              resultadosTests = JSON.parse(ultimoIntento.testResults.replace(/^"|"$/g, ''));
              
              setResultado({
                status: ultimoIntento.approved ? "Éxito" : "Fallido",
                output: ultimoIntento.testResults,
                resultados: resultadosTests,
                approved: ultimoIntento.approved
              });
            } catch (error) {
              console.error("Error al parsear resultados de tests del último intento:", error);
            }
          }
        } else if (aprobada) {
          setRetroalimentacion("¡Esta práctica ya ha sido aprobada anteriormente!");
        }

      } catch (error) {
        console.error("Error al cargar intentos previos:", error);
      } finally {
        setCargandoIntentos(false);
      }
    };
    
    cargarIntentosPrevios();
  }, [practica, studentId]);

  useEffect(() => {
    if (intentosAnteriores && intentosAnteriores.length > 0) {
      const ultimoIntento = intentosAnteriores[intentosAnteriores.length - 1];
      if (ultimoIntento && ultimoIntento.code) {
        setCodigoInicial(ultimoIntento.code);
      }
    } else if (practica?.codigoInicial) {
      setCodigoInicial(practica.codigoInicial);
    }
  }, [intentosAnteriores, practica]);
  
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
      if (!practica.id) {
        setRetroalimentacion("No se puede ejecutar el código. ID de práctica no válido.");
        return;
      }

      if (practiceApproved) {
        setRetroalimentacion("¡Esta práctica ya ha sido aprobada anteriormente! No es necesario volver a ejecutar el código.");
        return;
      }
 
      
      setRetroalimentacion("Ejecutando código...");
      setEjecutando(true);

      try {

        const codigo = editorRef.current.getValue();
        console.log("Código ejecutado:", codigo);
        setRetroalimentacion("Ejecutando código...");
        setEjecutando(true);

        const respuesta = await tryPracticeService.createTryPractice({
          code: codigo,
          studentId: studentId, 
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

        if (respuesta.approved) {
          setPracticeApproved(true);
        }

        const feedbackGenerado = await generarFeedbackAutomatico(
          codigo, 
          resultadosTests, 
          respuesta.approved
        );

        if (feedbackGenerado && respuesta.id) {
          try {
            await tryPracticeService.updatePracticeFeedback(respuesta.id, feedbackGenerado);
            setRetroalimentacion(feedbackGenerado);
          } catch (feedbackError) {
            console.error("Error al actualizar feedback:", feedbackError);
          }
        }
        
      } catch (error) {
        console.error("Error al ejecutar el código:", error);
        setRetroalimentacion("Ocurrió un error al procesar tu código: " + error.message);
      } finally {
        setEjecutando(false);
      }


      const nuevosIntentos = await tryPracticeService.getStudentPracticeAttempts(
        studentId,
        practica.id
      );
      setIntentosAnteriores(nuevosIntentos);
    } else {
      setRetroalimentacion("No se puede ejecutar el código. Asegúrate de que la práctica esté cargada.");
    }
  };

  const generarFeedbackAutomatico = async (codigo, resultados, approved) => {
    if (!practica || !codigo || !testCases.length) {
      return;
    }

    setGenerandoFeedback(true);
    setRetroalimentacion("Generando retroalimentación personalizada...");

    try {

      const restriccionesTexto = obtenerRestricciones().join("\n- ");

      const feedbackPersonalizado = await autoFeedbackService.getFeedback(
        practica.instrucciones,
        "- " + restriccionesTexto,
        codigo,
        JSON.stringify(resultados, null, 2),
        testCases,
        approved
      );

      return feedbackPersonalizado;
    } catch (error) {
      console.error("Error al generar feedback automático:", error);
      return "Ocurrió un error al generar la retroalimentación automática. Por favor, intenta nuevamente más tarde.";
    } finally {
      setGenerandoFeedback(false);
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
    <section className="instrucciones layout-horizontal">
      { !cargando && !error && practica &&  (
        <>
          <div className="instrucciones-container">
            <div className="instrucciones-header">
              <h3 className="instrucciones-titulo">{titulo}</h3>
            </div>
            
            <div className="instrucciones-detalles">
              <div className="instrucciones-descripcion">
                <div className="seccion-header">
                  <span className="seccion-icono">📝</span>
                  <h4>Descripción:</h4>
                </div>
                <p>{practica.instrucciones}</p>
              </div>
              
              <div className="instrucciones-seccion restricciones-seccion">
                <div className="seccion-header">
                  <span className="seccion-icono">📋</span>
                  <h4>Restricciones:</h4>
                </div>
                <ul className="restricciones-lista">
                  {restriccionesFormateadas.map((restriccion, index) => (
                    <li key={index} className="restriccion-item">
                      <span className="bullet"></span>
                      {restriccion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
              defaultValue={codigoInicial}
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
                  overflowY: "auto",
                  maxHeight: "600px",
                  marginTop: "1rem",
                  padding: "1rem",
                  backgroundColor: "#f0f8ff",
                  borderLeft: "5px solid #007bff",
                }}
              >
                {generandoFeedback ? (
                  <>
                    <strong>Generando retroalimentación...</strong>
                    <div className="spinner-carga" style={{ margin: "10px auto" }}></div>
                  </>
                ) : (
                  <>
                    <ReactMarkdown>{retroalimentacion}</ReactMarkdown>
                  </>
                )}
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
