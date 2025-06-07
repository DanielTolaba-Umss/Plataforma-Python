import React, { useState, useEffect } from "react";
import "/src/paginas/estudiante/estilos/Prueba.css";
import Editor from "./Editor"; // 🔥 Editor separado
import VisorPDF from "./VisorPDF"; // 🔥 VisorPDF separado
import LiveTranscription from "../../componentes/LiveTranscription"; // 🔥 Componente de transcripción en vivo
import { useParams } from "react-router-dom";

import { environment } from "../../environment/environment";

import { getResourceByLesson } from "../../api/videoService";
import { convertToEmbedUrl } from "../../utils/convertYoutubeUrl";

const Prueba = () => {
  const { id } = useParams();  const [vistaActual, setVistaActual] = useState("pdf");
  const [videoUrl, setVideoUrl] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  const esYoutube = (url) =>
    url.includes("youtube.com") || url.includes("youtu.be");

  useEffect(() => {
    const getResources = async () => {
      try {        const leccion = await getResourceByLesson(id);
        console.log("🚀 ~ useEffect ~ recursos de lección:", leccion);
        
        // Buscar video (typeId = 3)
        const video = leccion.find((recurso) => recurso.typeId === 3);
        if (video && video.url) {
          let embedUrl = video.url;
          if (esYoutube(embedUrl)) {
            embedUrl = convertToEmbedUrl(video.url);
          } else {
            // Para videos locales, usar la URL base de archivos estáticos
            embedUrl = `${environment.staticUrl}${video.url}`;
          }
          console.log("🚀 ~ getResources ~ Video URL:", embedUrl);
          setVideoUrl(embedUrl);
        }        // Buscar PDF (typeId = 2)
        const pdf = leccion.find((recurso) => recurso.typeId === 2);
        if (pdf && pdf.url) {
          // Extraer el nombre del archivo del URL
          const filename = pdf.url.split('/').pop();
          // Usar el endpoint específico para PDFs
          const pdfUrlComplete = `${environment.apiUrl}/resources/pdf/${filename}`;
          console.log("🚀 ~ getResources ~ PDF URL:", pdfUrlComplete);
          setPdfUrl(pdfUrlComplete);
        }
      } catch (error) {
        console.error("Error al cargar los recursos de la lección:", error);
      }
    };
    getResources();
  }, [id]);

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
          </div>          <div
            className="transcriptor"
            role="region"
            aria-label="Transcriptor del video"
          >
            <LiveTranscription />
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
      </div>      {/* 🔥 Mostrar solo uno según la vista */}
      {vistaActual === "pdf" && (
        <div>
          {pdfUrl ? (
            <VisorPDF src={pdfUrl} />
          ) : (
            <div className="visor-pdf">
              <h4>Visor de PDF</h4>
              <div style={{ 
                padding: "2rem", 
                textAlign: "center", 
                backgroundColor: "#f8f9fa", 
                borderRadius: "8px",
                margin: "1rem 0"
              }}>
                <p>No hay PDF disponible para esta lección.</p>
                <small>El docente aún no ha subido material de apoyo en PDF.</small>
              </div>
            </div>
          )}
        </div>
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
