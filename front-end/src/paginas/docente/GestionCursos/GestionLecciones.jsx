// Archivo: GestionLecciones.jsx
import React, { useState, useEffect, useCallback} from "react";
import { useNavigate, useParams} from "react-router-dom";
import {
  Edit,
  Trash2,
  Plus,
  Eye,
  FileText,
  Video,
  BookOpen,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { practiceJhService, testCasesService } from "../../../api/practiceJh";
import styles from "/src/paginas/docente/estilos/GestionLecciones.module.css";
import FormularioCrearLeccion from "./FormularioCrearLeccion";
import FormularioEditarLeccion from "./FormularioEditarLeccion";
import { leccionesAPI } from "../../../api/leccionService";

import { convertToEmbedUrl } from "../../../utils/convertYoutubeUrl";
import { environment } from "../../../environment/environment";
import { getResourceByLesson } from "../../../api/videoService";
import { pdfApi } from "../../../api/pdfService";
import Practicas from "./FormularioCrearPractica";

const GestionLecciones = () => {
  const [lecciones, setLecciones] = useState([]);
  const navigate = useNavigate();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [leccionToEdit, setLeccionToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [leccionToDelete, setLeccionToDelete] = useState(null);

  const [videoUrl, setVideoUrl] = useState(null);

  const esYoutube = (url) =>
    url.includes("youtube.com") || url.includes("youtu.be");

  // Nuevos estados para el modal de vista previa
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [leccionPreview, setLeccionPreview] = useState(null);
  const [hoveredLeccion, setHoveredLeccion] = useState(null);

  // Estados para controlar las secciones desplegables
  const [expandedSections, setExpandedSections] = useState({
    videos: true,
    documentos: false,
    practica: false,
  });

  // Estado para almacenar URLs blob que necesitan limpieza
  const [blobUrls, setBlobUrls] = useState([]);

  

  const {courseId} = useParams();
  console.log("ID del nivel:", courseId);
  const nivelId = courseId ;

  const showNotification = (message, type) => {
    // Crear una notificación personalizada sin usar alert
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 9999;
      max-width: 400px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      background-color: ${type === 'success' ? '#10b981' : '#ef4444'};
      animation: slideIn 0.3s ease-out;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Agregar estilos de animación si no existen
    if (!document.querySelector('#notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Remover la notificación después de 4 segundos
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 4000);
  };

  // Función para cerrar modal de preview y limpiar recursos
  const closePreviewModal = () => {
    // Limpiar URLs blob para evitar memory leaks
    blobUrls.forEach(url => URL.revokeObjectURL(url));
    setBlobUrls([]);
    setShowPreviewModal(false);
  };

  // Función para cargar lecciones - extraída para reutilizar
  const fetchLecciones = useCallback(async () => {
    const nivelLevel = localStorage.getItem("nivelLevel");

    if (!nivelId || !nivelLevel) {
      console.warn(
        "Faltan datos para obtener lecciones (nivelId o nivelLevel)"
      );
      return;
    }

    try {
      const response = await leccionesAPI.obtenerPorCursoYNivel(
        nivelId,
        nivelLevel
      );
      console.log("🚀 ~ fetchLecciones ~ response:", response);

      if (response.status !== 200) {
        throw new Error("Error en la respuesta del servidor");
      }

      const leccionesFormateadas = response.data.map((leccion) => ({
        id: leccion.id,
        title: leccion.title || "Sin título",
        description: leccion.description || "Sin descripción",
        slug: (leccion.titulo || "").toLowerCase().replace(/\s+/g, "-"),
        // Datos adicionales para la vista previa (simulados - ajusta según tu API)
        recursos: leccion.recursos || {
          videos: leccion.videos || [],
          pdfs: leccion.pdfs || [],
          practicas: leccion.practicas || [],
        },
        contenido: leccion.contenido || "Contenido de la lección...",
      }));

      console.log("Datos recibidos:", response.data);
      setLecciones(leccionesFormateadas);
    } catch (error) {
      console.error("Error al cargar lecciones:", error);
      showNotification(
        "Error al cargar lecciones: " +
          (error.response?.data?.message || error.message),
        "error"
      );
    }
  }, [nivelId]);

  useEffect(() => {
    fetchLecciones();
  }, [fetchLecciones]);

  // Limpiar URLs blob al desmontar el componente
  useEffect(() => {
    return () => {
      blobUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [blobUrls]);

  // Función para toggle de secciones expandibles
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Función para mostrar la vista previa
  const handleShowPreview = async (leccion) => {
    // Limpiar URLs blob anteriores
    blobUrls.forEach(url => URL.revokeObjectURL(url));
    setBlobUrls([]);

    setLeccionPreview(leccion);
    setShowPreviewModal(true);
    setExpandedSections({
      videos: true,
      documentos: false,
      practica: false,
    });

    let videoUrl = null;
    let pdfs = [];
    let practica = null;
    let testCases = [];

    try {
      const recursos = await getResourceByLesson(leccion.id);

      try {
        const video = recursos.find((r) => r.typeId === 3);
        if (video && video.url) {
          const rawUrl = video.url;
          videoUrl = esYoutube(rawUrl)
            ? convertToEmbedUrl(rawUrl)
            : `${environment.apiUrl.replace("/api", "")}${rawUrl}`;
        }
      } catch (err) {
        console.error("Error al obtener el video:", err);
      }

      try {
        const pdfResources = recursos.filter((r) => r.typeId === 2);
        const newBlobUrls = [];
        pdfs = await Promise.all(
          pdfResources.map(async (pdf) => {
            try {
              // Extraer el nombre del archivo de la URL
              const filename = pdf.url.split('/').pop();
              const blobUrl = await pdfApi.downloadPdf(filename);
              newBlobUrls.push(blobUrl); // Almacenar para limpieza posterior
              return {
                titulo: pdf.title,
                url: blobUrl,
                filename: filename
              };
            } catch (err) {
              console.error(`Error al cargar PDF ${pdf.title}:`, err);
              return {
                titulo: pdf.title,
                url: null,
                filename: pdf.url.split('/').pop(),
                error: true
              };
            }
          })
        );
        setBlobUrls(newBlobUrls); // Almacenar las URLs para limpieza
      } catch (err) {
        console.error("Error al procesar PDFs:", err);
      }
    } catch (err) {
      console.error("Error al obtener recursos:", err);
    }

    try {
      practica = await practiceJhService.getPracticeByLessonId(leccion.id);
    } catch (err) {
      console.error("Error al obtener la práctica:", err);
    }

    try {
      if (practica?.id) {
        testCases = await testCasesService.getTestCasesByPracticeId(
          practica.id
        );
      }
    } catch (err) {
      console.error("Error al obtener los casos de prueba:", err);
    }

    setVideoUrl(videoUrl);

    setLeccionPreview((prev) => ({
      ...prev,
      recursos: {
        pdfs: pdfs,
        practicas: practica
          ? [
              {
                titulo: leccion.title,
                instrucciones: practica.instrucciones,
                codigoInicial: practica.codigoInicial,
                solucionReferencia: practica.solucionReferencia,
                restricciones: practica.restricciones,
                intentosMax: practica.intentosMax,
                casosPrueba: testCases,
              },
            ]
          : [],
      },
    }));
  };
  const handleCreateLeccion = async (leccionData) => {
    try {
      const response = await leccionesAPI.crear(leccionData);
      console.log("✅ Lección creada:", response.data);
      
      // En lugar de actualizar manualmente el estado, refrescamos la lista completa
      // para asegurar consistencia de datos
      await fetchLecciones();
      
      showNotification("Lección creada con éxito", "success");
      setShowCreateForm(false);
      localStorage.removeItem("nivelId");
    } catch (error) {
      console.error("Error al crear lección:", error);
      showNotification(
        error.response?.data?.message || "Error al crear la lección",
        "error"
      );
    }
  };

  const handleEditLeccion = async (leccionData) => {
    try {
      const datosActualizados = {
        title: leccionData.title,
        description: leccionData.description,
      };

      const response = await leccionesAPI.actualizar(
        leccionData.id,
        datosActualizados
      );

      setLecciones((prev) =>
        prev.map((l) =>
          l.id === leccionData.id
            ? {
                ...l,
                title: response.data.title,
                description: response.data.description,
                slug: response.data.title.toLowerCase().replace(/\s+/g, "-"),
              }
            : l
        )
      );

      setShowEditForm(false);
      setLeccionToEdit(null);
      showNotification("Lección actualizada con éxito", "success");
    } catch (error) {
      console.error("Error al actualizar lección:", error);
      showNotification(
        error.response?.data?.message || "Error al actualizar lección",
        "error"
      );
    }
  };

  const handleDeleteLeccion = async () => {
    try {
      console.log("🔥 Eliminando lección:", leccionToDelete.id);
      console.log("🔥 URL que se llamará:", `/lessons/${leccionToDelete.id}`);
      
      const response = await leccionesAPI.eliminar(leccionToDelete.id);
      console.log("✅ Respuesta del servidor:", response);
      
      setLecciones((prev) => prev.filter((l) => l.id !== leccionToDelete.id));
      setShowDeleteModal(false);
      showNotification("Lección eliminada con éxito", "success");
    } catch (error) {
      console.error("❌ Error completo:", error);
      console.error("❌ Status:", error.response?.status);
      console.error("❌ Data:", error.response?.data);
      console.error("❌ Headers:", error.response?.headers);
      
      let errorMessage = "Error desconocido";
      
      if (error.response?.status === 404) {
        errorMessage = "Lección no encontrada";
      } else if (error.response?.status === 403) {
        errorMessage = "No tienes permisos para eliminar esta lección";
      } else if (error.response?.status === 409) {
        errorMessage = "No se puede eliminar: la lección tiene dependencias";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      showNotification(`Error al eliminar lección: ${errorMessage}`, "error");
    }
  };

  return (
    <div className={styles.coursesContainer}>
      <div className={styles.coursesHeader}>
        <h2 className={styles.coursesTitle}>Lecciones del Nivel {nivelId}</h2>
        <button
          onClick={() => navigate("/gestion-curso")}
          className={styles.backButton}
        >
          Volver a niveles
        </button>
      </div>

      <div className={styles.coursesGrid}>
        {lecciones.map((leccion) => (
          <div
            key={leccion.id}
            className={`${styles.courseCard} ${
              hoveredLeccion === leccion.id ? styles.courseCardHovered : ""
            }`}
            onMouseEnter={() => setHoveredLeccion(leccion.id)}
            onMouseLeave={() => setHoveredLeccion(null)}
            onClick={() => handleShowPreview(leccion)}
          >
            <div className={styles.courseCardContent}>
              <h3 className={styles.courseTitle}>{leccion.title}</h3>
              <p className={styles.courseDescription}>{leccion.description}</p>

              {hoveredLeccion === leccion.id && (
                <div className={styles.previewOverlay}></div>
              )}
            </div>

            <div
              className={styles.actionsContainer}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.resourcesButton}
                onClick={() => {
                  navigate(`/gestion-curso/${nivelId}/lecciones/${leccion.id}/recursos`);
                }}
              >
                Recursos
              </button>
              <button
                className={styles.resourcesButton}
                onClick={() => {
                  navigate(`/gestion-curso/${nivelId}/lecciones/${leccion.id}/practica`);
                }}
              >
                Prácticas
              </button>
              <button
                className={`${styles.resourcesButton} ${styles.editButton}`}
                onClick={() => {
                  setLeccionToEdit(leccion);
                  setShowEditForm(true);
                }}
              >
                <Edit size={18} />
              </button>
              <button
                className={`${styles.resourcesButton} ${styles.deleteButton}`}
                onClick={() => {
                  setLeccionToDelete(leccion);
                  setShowDeleteModal(true);
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {!showCreateForm && (
        <div className={styles.floatingButtonsContainer}>
          <button
            onClick={() =>
              navigate(
                `/gestion-curso/lecciones/${nivelId}/examenes-y-quizzes/`
              )
            }
            className={styles.quizzButton}
          >
            Quizzes
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className={styles.floatingButton}
          >
            <Plus />
          </button>
        </div>
      )}

      {showCreateForm && (
        <FormularioCrearLeccion
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateLeccion}
          cursoId={nivelId}
        />
      )}

      {showEditForm && leccionToEdit && (
        <FormularioEditarLeccion
          leccion={leccionToEdit}
          onClose={() => setShowEditForm(false)}
          onSubmit={handleEditLeccion}
        />
      )}

      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Confirmar eliminación</h2>
            <p>
              ¿Estás seguro que deseas eliminar la lección "
              {leccionToDelete?.title}"?
            </p>
            <div className={styles.modalActions}>
              <button
                className={`${styles.modalButton} ${styles.confirmButton}`}
                onClick={handleDeleteLeccion}
              >
                Eliminar
              </button>
              <button
                className={`${styles.modalButton} ${styles.cancelButton}`}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Vista Previa Reestructurado */}
      {showPreviewModal && leccionPreview && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} ${styles.previewModal}`}>
            <div className={styles.previewHeader}>
              <div className={styles.previewTitleSection}>
                <h1 className={styles.previewMainTitle}>Fundamentos Python</h1>
                <h2 className={styles.previewLessonTitle}>
                  {leccionPreview.title}
                </h2>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className={styles.previewBody}>
              {/* Sección de Videos */}
              <div className={styles.expandableSection}>
                <div
                  className={styles.sectionHeader}
                  onClick={() => toggleSection("videos")}
                >
                  <div className={styles.sectionTitleContainer}>
                    <Video size={20} className={styles.sectionIcon} />
                    <span className={styles.sectionTitle}>
                      Videos ({leccionPreview.recursos?.videos?.length || 1})
                    </span>
                  </div>
                  {expandedSections.videos ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>

                {expandedSections.videos && (
                  <div className={styles.sectionContent}>
                    {videoUrl && (
                      <div className={styles.videoContainer}>
                        {esYoutube(videoUrl) ? (
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
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sección de Documentos */}
              <div className={styles.expandableSection}>
                <div
                  className={styles.sectionHeader}
                  onClick={() => toggleSection("documentos")}
                >
                  <div className={styles.sectionTitleContainer}>
                    <FileText size={20} className={styles.sectionIcon} />
                    <span className={styles.sectionTitle}>
                      Material PDF ({leccionPreview.recursos?.pdfs?.length || 0}
                      )
                    </span>
                  </div>
                  {expandedSections.documentos ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>

                {expandedSections.documentos && (
                  <div className={styles.sectionContent}>
                    <div className={styles.documentList}>
                      {leccionPreview.recursos?.pdfs?.length > 0 ? (
                        leccionPreview.recursos.pdfs.map((pdf, index) => (
                          <div key={index} className={styles.documentItem}>
                            <h5 style={{ marginBottom: '8px', color: '#333' }}>
                              {pdf.titulo || `Documento ${index + 1}`}
                            </h5>
                            {pdf.error ? (
                              <div style={{ 
                                padding: '20px', 
                                textAlign: 'center', 
                                border: '1px solid #ff6b6b',
                                borderRadius: '8px',
                                backgroundColor: '#ffe0e0'
                              }}>
                                <FileText size={24} style={{ color: '#ff6b6b', marginBottom: '8px' }} />
                                <p style={{ color: '#d63031', margin: 0 }}>
                                  Error al cargar el PDF: {pdf.filename}
                                </p>
                              </div>
                            ) : pdf.url ? (
                              <iframe
                                src={pdf.url}
                                title={`PDF Preview ${index + 1}`}
                                width="100%"
                                height="500px"
                                style={{
                                  border: "1px solid #ccc",
                                  borderRadius: "8px",
                                }}
                              />
                            ) : (
                              <div style={{ 
                                padding: '20px', 
                                textAlign: 'center', 
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                backgroundColor: '#f8f9fa'
                              }}>
                                <FileText size={24} style={{ color: '#6c757d', marginBottom: '8px' }} />
                                <p style={{ color: '#6c757d', margin: 0 }}>
                                  Cargando PDF...
                                </p>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className={styles.documentItem}>
                          <FileText size={16} />
                          <span>No hay documentos PDF disponibles</span>
                        </div>
                      )}
                    </div>
                    {/* <div className={styles.sectionNote}>
                      <span>Material PDF</span>
                      <ChevronDown size={16} />
                    </div> */}
                  </div>
                )}
              </div>

              {/* Sección de Práctica */}
              <div className={styles.expandableSection}>
                <div
                  className={styles.sectionHeader}
                  onClick={() => toggleSection("practica")}
                >
                  <div className={styles.sectionTitleContainer}>
                    <BookOpen size={20} className={styles.sectionIcon} />
                    <span className={styles.sectionTitle}>
                      Práctica (
                      {leccionPreview.recursos?.practicas?.length || 0})
                    </span>
                  </div>
                  {expandedSections.practica ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>

                {expandedSections.practica && (
                  <div className={styles.sectionContent}>
                    <div className={styles.practiceList}>
                      {leccionPreview.recursos?.practicas?.length > 0 ? (
                        leccionPreview.recursos.practicas.map(
                          (practica, index) => (
                            <div key={index} className={styles.practiceItem}>
                              {/* <h4>
                                {practica.titulo || `Práctica ${index + 1}`}
                              </h4> */}
                              <p>
                                <strong>Instrucciones:</strong>
                              </p>
                              <pre className={styles.codeBlock}>
                                {practica.instrucciones}
                              </pre>

                              <p>
                                <strong>Código inicial:</strong>
                              </p>
                              <pre className={styles.codeBlock}>
                                {practica.codigoInicial}
                              </pre>

                              <p>
                                <strong>Solución de referencia:</strong>
                              </p>
                              <pre className={styles.codeBlock}>
                                {practica.solucionReferencia}
                              </pre>

                              <p>
                                <strong>Restricciones:</strong>{" "}
                                {practica.restricciones}
                              </p>
                              <p>
                                <strong>Intentos máximos:</strong>{" "}
                                {practica.intentosMax}
                              </p>

                              <p>
                                <strong>Casos de prueba:</strong>
                              </p>
                              <ul className={styles.testCaseList}>
                                {practica.casosPrueba.map((caso, i) => (
                                  <li key={i}>
                                    <p>
                                      <strong>Entrada:</strong> {caso.entrada}
                                    </p>
                                    <p>
                                      <strong>Salida esperada:</strong>{" "}
                                      {caso.salida}
                                    </p>
                                    <p>
                                      <strong>Invocación:</strong>{" "}
                                      <code>{caso.entradaTestCase}</code>
                                    </p>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )
                        )
                      ) : (
                        <div className={styles.practiceItem}>
                          <BookOpen size={16} />
                          <span>No hay ejercicios prácticos disponibles</span>
                        </div>
                      )}
                    </div>
                    {/* <div className={styles.sectionNote}>
                      <span>Práctica</span>
                      <ChevronDown size={16} />
                    </div> */}
                  </div>
                )}
              </div>
            </div>

            {/* Footer con botones de acción */}
            <div className={styles.previewActions}>
              <button
                className={styles.primaryButton}
                onClick={() => {
                  navigate(
                    `/gestion-curso/${nivelId}/lecciones/${leccionPreview.id}/recursos`
                  );
                  closePreviewModal();
                }}
              >
                Ir a recursos
              </button>
              <button
                className={styles.secondaryButton}
                onClick={closePreviewModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionLecciones;
