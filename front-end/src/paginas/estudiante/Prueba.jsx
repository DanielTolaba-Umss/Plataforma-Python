import React, { useState, useEffect } from "react";
import "/src/paginas/estudiante/estilos/Prueba.css";
import Editor from "./Editor"; // 🔥 Editor separado
import VisorPDF from "./VisorPDF"; // 🔥 VisorPDF separado
import { useParams } from "react-router-dom";

import { environment } from "../../environment/environment";

import { getResourceByLesson } from "../../api/videoService";
import { convertToEmbedUrl } from "../../utils/convertYoutubeUrl";

const Prueba = () => {
  const { id } = useParams();
  const [vistaActual, setVistaActual] = useState("pdf");
  const [videoUrl, setVideoUrl] = useState(null);

  const esYoutube = (url) =>
    url.includes("youtube.com") || url.includes("youtu.be");

  useEffect(() => {
    const getVideo = async () => {
      try {
        const leccion = await getResourceByLesson(id);
        console.log("🚀 ~ useEffect ~ leccion:", leccion);
        let embedUrl = leccion[0].url;

        if (esYoutube(embedUrl)) {
          embedUrl = convertToEmbedUrl(leccion[0].url);
        } else {
          embedUrl = `${environment.apiUrl}${leccion[0].url}`;
        }
        console.log("🚀 ~ getVideo ~ embedUrl:", embedUrl);

        if (embedUrl) {
          setVideoUrl(embedUrl);
        }
      } catch (error) {
        console.error("Error al cargar la lección:", error);
      }
    };
    getVideo();
  }, []);

  return (
    <div className="prueba-container">
      <div className="contenedor-titulo-video">
        <header className="prueba-header">
          <a href="/cursos/1/lecciones" className="volver">
            &lt; Volver
          </a>
          <h1>Fundamentos Python</h1>
          <h2>Lección 1: Título</h2>
        </header>

        <section className="video-section">
          <div className="video-card">
            {videoUrl ? (
              esYoutube(videoUrl) ? (
                <iframe
                  width="100%"
                  height="315"
                  src={videoUrl}
                  title="Visualizador de Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video width="100%" height="315" controls>
                  <source src={videoUrl} type="video/mp4" />
                  Tu navegador no soporta el tag de video.
                </video>
              )
            ) : (
              <p>Cargando video...</p>
            )}
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

// import React, { useEffect, useState } from "react";
// import "/src/paginas/estudiante/estilos/Prueba.css";
// import Editor from "./Editor";
// import VisorPDF from "./VisorPDF";
// import { useParams } from "react-router-dom";

// import { getResourceByLesson } from "../../api/videoService";
// import { convertToEmbedUrl } from "../../utils/convertYoutubeUrl";

// const Prueba = () => {
//   const [vistaActual, setVistaActual] = useState("pdf");
//   const [videoUrl, setVideoUrl] = useState(null);
//   const [tituloLeccion, setTituloLeccion] = useState("");
//   const [tituloCurso, setTituloCurso] = useState("");

//   const { id } = useParams();
//   console.log("🚀 ~ Prueba ~ id:", id);

//   // Detectar si es YouTube o archivo local
//   const esYoutube = (url) =>
//     url.includes("youtube.com") || url.includes("youtu.be");

//   // Cargar datos desde el backend
//   useEffect(() => {
//     // axios
//     //   .getResourceByLesson() // Asegúrate de usar el endpoint correcto
//     //   .then((res) => {
//     //     const leccion = res.data;
//     //     setVideoUrl(leccion.videoUrl);
//     //     setTituloLeccion(leccion.title);
//     //     setTituloCurso(leccion.course?.title || "Curso sin título");
//     //   })
//     //   .catch((err) => console.error("Error al cargar la lección:", err));

//     const getVideo = async () => {
//       try {
//         const leccion = await getResourceByLesson(id);
//         console.log("🚀 ~ useEffect ~ leccion:", leccion[0]);
//         const embedUrl = convertToEmbedUrl(leccion[0].url);
//         if (embedUrl) {
//           setVideoUrl(embedUrl);
//         }
//       } catch (error) {
//         console.error("Error al cargar la lección:", error);
//       }
//     };
//     getVideo();
//   }, []);

//   return (
//     <div className="prueba-container">
//       <div className="contenedor-titulo-video">
//         <header className="prueba-header">
//           <a href="/cursos/1/lecciones" className="volver">
//             &lt; Volver
//           </a>
//           <h1>{tituloCurso}</h1>
//           <h2>Lección 1: {tituloLeccion}</h2>
//         </header>

//         <section className="video-section">
//           <div className="video-card">
//             {videoUrl ? (
//               esYoutube(videoUrl) ? (
//                 <iframe
//                   width="100%"
//                   height="315"
//                   src={videoUrl}
//                   title="Visualizador de Video"
//                   frameBorder="0"
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                   allowFullScreen
//                 ></iframe>
//               ) : (
//                 <video width="100%" height="315" controls>
//                   <source src={videoUrl} type="video/mp4" />
//                   Tu navegador no soporta el tag de video.
//                 </video>
//               )
//             ) : (
//               <p>Cargando video...</p>
//             )}
//           </div>

//           <div
//             className="transcriptor"
//             role="region"
//             aria-label="Transcriptor del video"
//           >
//             <h3>TRANSCRIPTOR</h3>
//             <p>
//               El transcriptor aparecerá aquí cuando el video esté
//               reproduciéndose...
//             </p>
//           </div>
//         </section>
//       </div>

//       <div className="acciones">
//         <div className="tabs-central">
//           <span
//             className={`tab ${vistaActual === "pdf" ? "activo" : ""}`}
//             onClick={() => setVistaActual("pdf")}
//           >
//             PDF
//           </span>
//           <span
//             className={`tab ${vistaActual === "practica" ? "activo" : ""}`}
//             onClick={() => setVistaActual("practica")}
//           >
//             Práctica
//           </span>
//         </div>
//       </div>

//       {/* 🔥 Mostrar PDF o Práctica */}
//       {vistaActual === "pdf" && (
//         <VisorPDF src="/src/assets/pythonbookPrueba.pdf" />
//       )}

//       {vistaActual === "practica" && (
//         <Editor
//           titulo="Instrucciones de la práctica:"
//           descripcion="Escribir un programa que pregunte el nombre del usuario en la consola y después de que el usuario lo introduzca muestre por pantalla la cadena ¡Hola nombre!, donde nombre es el nombre que el usuario haya introducido."
//         />
//       )}

//       <footer className="progreso-footer">
//         <div className="progreso-barra">
//           <div className="progreso" style={{ width: "25%" }}></div>
//         </div>
//         <span>25%</span>
//       </footer>
//     </div>
//   );
// };

// export default Prueba;
