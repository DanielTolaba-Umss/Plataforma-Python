import React, { useState } from "react";
import {
  GraduationCap,
  ChevronDown,
  ChevronUp,
  FileText,
  PlayCircle,
  Code,
  CheckCircle,
} from "lucide-react";
import "/src/paginas/estudiante/estilos/Cursos.css";

const data = {
  basico: {
    nombre: "Python Básico",
    cursos: [
      {
        titulo: "Introducción a Python",
        subtemas: ["Contenido", "Práctica", "Examen"],
        contenido: {
          Contenido: {
            titulo: "Variables y Tipos de Datos",
            texto:
              "En Python, las variables son contenedores para almacenar valores de datos. Python es un lenguaje de tipado dinámico, lo que significa que no necesitas declarar el tipo de variable al crearla.",
            codigo: `# Variables en Python
x = 5          # Integer
y = 3.14       # Float
name = "Python" # String

# Mostrando los tipos de datos
print(type(x))    # <class 'int'>
print(type(y))    # <class 'float'>
print(type(name)) # <class 'str'>`,
          },
          Examen: {
            titulo: "Fundamentos de Python",
            preguntas: [
              {
                pregunta: "¿Cuál es el resultado de type(42)?",
                opciones: [
                  "<class 'int'>",
                  "<class 'float'>",
                  "<class 'str'>",
                  "<class 'number'>",
                ],
              },
              {
                pregunta:
                  "¿Qué tipo de dato es el resultado de 5 / 2 en Python 3?",
                opciones: ["int", "float", "decimal", "double"],
              },
              {
                pregunta:
                  "¿Cuál es la forma correcta de crear una variable con el texto 'Python'?",
                opciones: [
                  "variable = Python",
                  "variable = 'Python'",
                  "variable = (Python)",
                  "variable = %Python%",
                ],
              },
            ],
          },
        },
      },
      {
        titulo: "Estructuras de Datos",
        subtemas: ["Contenido", "Práctica", "Examen"],
        contenido: {
          Contenido: {
            titulo: "Listas y Diccionarios",
            texto:
              "Las listas y los diccionarios son estructuras de datos clave en Python. Las listas almacenan elementos ordenados, los diccionarios almacenan pares clave-valor.",
            codigo: `# Listas
mi_lista = [1, 2, 3]

# Diccionario
mi_dict = {"nombre": "Ana", "edad": 25}`,
          },
        },
      },
    ],
  },
  intermedio: {
    nombre: "Python Intermedio",
    cursos: [],
  },
  avanzado: {
    nombre: "Python Avanzado",
    cursos: [],
  },
};

const Cursos = () => {
  const [nivelExpandido, setNivelExpandido] = useState("");
  const [cursoExpandido, setCursoExpandido] = useState("");
  const [subtemaActivo, setSubtemaActivo] = useState("Contenido");
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);

  const toggleNivel = (nivel) => {
    setNivelExpandido(nivelExpandido === nivel ? "" : nivel);
    setCursoExpandido("");
    setCursoSeleccionado(null);
  };

  const toggleCurso = (titulo, curso) => {
    setCursoExpandido(cursoExpandido === titulo ? "" : titulo);
    setCursoSeleccionado(curso);
    setSubtemaActivo("Contenido");
  };

  return (
    <div className="contenedor-principal">
      <aside className="sidebar-cursos">
        <h3>Contenido del Curso</h3>
        {Object.entries(data).map(([key, nivel]) => (
          <div key={key}>
            <div
              className={`nivel-header ${
                nivelExpandido === key ? "activo" : ""
              }`}
              onClick={() => toggleNivel(key)}
            >
              <GraduationCap className="icono" />
              <span>{nivel.nombre}</span>
              {nivelExpandido === key ? <ChevronUp /> : <ChevronDown />}
            </div>

            {nivelExpandido === key &&
              nivel.cursos.map((curso, idx) => (
                <div key={idx}>
                  <div
                    className="curso-item"
                    onClick={() => toggleCurso(curso.titulo, curso)}
                  >
                    <FileText className="icono" />
                    <span>{curso.titulo}</span>
                    {cursoExpandido === curso.titulo ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    )}
                  </div>

                  {cursoExpandido === curso.titulo &&
                    curso.subtemas.map((sub) => (
                      <div
                        key={sub}
                        className={`subtema-item ${
                          subtemaActivo === sub ? "activo-sub" : ""
                        }`}
                        onClick={() => setSubtemaActivo(sub)}
                      >
                        {sub === "Contenido" && <PlayCircle size={16} />}
                        {sub === "Práctica" && <Code size={16} />}
                        {sub === "Examen" && <CheckCircle size={16} />}
                        <span>{sub}</span>
                      </div>
                    ))}
                </div>
              ))}
          </div>
        ))}
      </aside>

      <main className="contenido-derecha">
        {cursoSeleccionado && (
          <div>
            {subtemaActivo === "Examen" ? (
              <>
                <h2>Examen: {cursoSeleccionado.contenido?.Examen?.titulo}</h2>
                <p className="tiempo-limite">🕒 Tiempo límite: 30 minutos</p>

                {cursoSeleccionado.contenido?.Examen?.preguntas?.map(
                  (q, idx) => (
                    <div className="pregunta-bloque" key={idx}>
                      <p className="pregunta-texto">
                        {idx + 1}. {q.pregunta}
                      </p>
                      {q.opciones.map((op, i) => (
                        <label key={i} className="opcion-label">
                          <input type="radio" name={`pregunta-${idx}`} />
                          {op}
                        </label>
                      ))}
                    </div>
                  )
                )}

                <div className="boton-enviar">
                  <button className="btn-enviar-examen">
                    Enviar Examen ✅
                  </button>
                </div>
              </>
            ) : subtemaActivo === "Práctica" ? (
              <>
                <h2>
                  Práctica:{" "}
                  {cursoSeleccionado.contenido?.[subtemaActivo]?.titulo}
                </h2>
                <p className="subtitulo">Instrucciones</p>
                <p>
                  Crea una variable llamada <code>'mensaje'</code> y asígnale el
                  texto
                  <code> 'Hola, Python!'</code>
                </p>
                <p className="subtitulo">Editor de Código</p>
                <div className="editor-codigo">
                  <textarea
                    defaultValue={"# Escribe tu código aquí"}
                    className="editor-textarea"
                    rows={10}
                  />
                  <div className="editor-opciones">
                    <button className="btn-reset">Reiniciar</button>
                  </div>
                </div>
                <div className="btn-practica">
                  <button className="btn-anterior">▶ Ejercicio Anterior</button>
                  <button className="btn-verificar">Verificar ✔</button>
                </div>
              </>
            ) : (
              <>
                <h2>{cursoSeleccionado.titulo}</h2>
                <p className="subtitulo">
                  {cursoSeleccionado.contenido?.[subtemaActivo]?.titulo || ""}
                </p>
                <hr />
                <div className="leccion">
                  <PlayCircle className="icono-leccion" />
                  <span>Lección</span>
                </div>
                <p>
                  {cursoSeleccionado.contenido?.[subtemaActivo]?.texto || ""}
                </p>
                <pre className="codigo">
                  {cursoSeleccionado.contenido?.[subtemaActivo]?.codigo || ""}
                </pre>
                <div className="btn-leccion">
                  <button className="btn-anterior">Lección Anterior</button>
                  <button className="btn-verificar">Siguiente Lección ✔</button>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Cursos;
