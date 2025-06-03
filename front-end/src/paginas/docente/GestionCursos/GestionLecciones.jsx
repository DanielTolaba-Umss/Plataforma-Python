// Archivo: GestionLecciones.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Plus, Eye, FileText, Video, BookOpen, X } from "lucide-react";
import styles from "/src/paginas/docente/estilos/GestionLecciones.module.css";
import FormularioCrearLeccion from "./FormularioCrearLeccion";
import FormularioEditarLeccion from "./FormularioEditarLeccion";
import { leccionesAPI } from "../../../api/leccionService";

const GestionLecciones = () => {
  const [lecciones, setLecciones] = useState([]);
  const navigate = useNavigate();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [leccionToEdit, setLeccionToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [leccionToDelete, setLeccionToDelete] = useState(null);
  
  // Nuevos estados para el modal de vista previa
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [leccionPreview, setLeccionPreview] = useState(null);
  const [hoveredLeccion, setHoveredLeccion] = useState(null);

  const nivelId = localStorage.getItem("nivelId");
  
  useEffect(() => {
    const fetchLecciones = async () => {
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
            practicas: leccion.practicas || []
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
    };

    fetchLecciones();
  }, [nivelId]);

  const showNotification = (message, type) => {
    alert(`${type.toUpperCase()}: ${message}`);
  };

  // Función para mostrar la vista previa
  const handleShowPreview = (leccion) => {
    setLeccionPreview(leccion);
    setShowPreviewModal(true);
  };

  const handleCreateLeccion = async (leccionData) => {
    try {
      const response = await leccionesAPI.crear(leccionData);
      setLecciones((prev) => [
        ...prev,
        {
          id: response.data.leccion_id,
          title: response.data.title,
          description: response.data.description,
          nivelId: response.data.curso_Id,
        },
      ]);
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
      await leccionesAPI.eliminar(leccionToDelete.id);
      setLecciones((prev) => prev.filter((l) => l.id !== leccionToDelete.id));
      setShowDeleteModal(false);
      showNotification("Lección eliminada con éxito", "success");
    } catch (error) {
      console.error("Error al eliminar lección:", error);
      showNotification(
        error.response?.data?.message || "Error al eliminar lección",
        "error"
      );
    }
  };

  return (
    <div className={styles.coursesContainer}>
      <div className={styles.coursesHeader}>
        <h2 className={styles.coursesTitle}>Lecciones del {nivelId}</h2>
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
            className={`${styles.courseCard} ${hoveredLeccion === leccion.id ? styles.courseCardHovered : ''}`}
            onMouseEnter={() => setHoveredLeccion(leccion.id)}
            onMouseLeave={() => setHoveredLeccion(null)}
            onClick={() => handleShowPreview(leccion)}
          >
            <div className={styles.courseCardContent}>
              <h3 className={styles.courseTitle}>{leccion.title}</h3>
              <p className={styles.courseDescription}>{leccion.description}</p>
              
              {hoveredLeccion === leccion.id && (
                <div className={styles.previewOverlay}>
                </div>
              )}
            </div>
            
            <div className={styles.actionsContainer} onClick={(e) => e.stopPropagation()}>
              <button
                className={styles.resourcesButton}
                onClick={() => {
                  navigate(`/gestion-curso/lecciones/${leccion.id}/recursos`);
                }}
              >
                Recursos
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
                  <button
                  onClick={() => setShowCreateForm(true)}
                  className={styles.floatingButton}
                  >
                  <Plus />
                  </button>
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
                    ¿Estás seguro que deseas eliminar la lección "{leccionToDelete?.title}"?
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

                  {/* Modal de Vista Previa */}
                  {showPreviewModal && leccionPreview && (
                  <div className={styles.modalOverlay}>
                  <div className={`${styles.modalContent} ${styles.previewModal}`}>
                  
                  
                  <div className={styles.previewHeader}>
                    <h2 className={styles.previewTitle}>{leccionPreview.title}</h2>
                    <span className={styles.previewDuration}>{leccionPreview.duracion}</span>
                  </div>
                  

                  <div className={styles.previewContent}>
                    <h3>Contenido de la lección</h3>
                    <p>{leccionPreview.description}</p>
                  </div>

                  <div className={styles.previewResources}>
                    <h3>Recursos disponibles</h3>
                    <div className={styles.resourcesGrid}>
                    {/* Videos */}
                <div className={styles.resourceType}>
                  <div className={styles.resourceTypeHeader}>
                    <Video size={20} />
                    <span>Videos ({leccionPreview.recursos?.videos?.length || 1})</span>
                  </div>
                  <div className={styles.resourceItems}>
                    {leccionPreview.recursos?.videos?.length > 0 
                      ? leccionPreview.recursos.videos.map((video, index) => (
                          <div key={index} className={styles.resourceItem}>
                            <Video size={16} />
                            <span>{video.titulo || `Video ${index + 1}`}</span>
                          </div>
                        ))
                      : <div className={styles.resourceItem}>
                          <Video size={16} />
                          <span>Video explicativo</span>
                        </div>
                    }
                  </div>
                </div>

                {/* PDFs */}
                <div className={styles.resourceType}>
                  <div className={styles.resourceTypeHeader}>
                    <FileText size={20} />
                    <span>Documentos ({leccionPreview.recursos?.pdfs?.length || 1})</span>
                  </div>
                  <div className={styles.resourceItems}>
                    {leccionPreview.recursos?.pdfs?.length > 0 
                      ? leccionPreview.recursos.pdfs.map((pdf, index) => (
                          <div key={index} className={styles.resourceItem}>
                            <FileText size={16} />
                            <span>{pdf.titulo || `Documento ${index + 1}`}</span>
                          </div>
                        ))
                      : <div className={styles.resourceItem}>
                          <FileText size={16} />
                          <span>Material de apoyo.pdf</span>
                        </div>
                    }
                  </div>
                </div>

                {/* Prácticas */}
                <div className={styles.resourceType}>
                  <div className={styles.resourceTypeHeader}>
                    <BookOpen size={20} />
                    <span>Prácticas ({leccionPreview.recursos?.practicas?.length || 1})</span>
                  </div>
                  <div className={styles.resourceItems}>
                    {leccionPreview.recursos?.practicas?.length > 0 
                      ? leccionPreview.recursos.practicas.map((practica, index) => (
                          <div key={index} className={styles.resourceItem}>
                            <BookOpen size={16} />
                            <span>{practica.titulo || `Práctica ${index + 1}`}</span>
                          </div>
                        ))
                      : <div className={styles.resourceItem}>
                          <BookOpen size={16} />
                          <span>Ejercicios prácticos</span>
                        </div>
                    }
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.previewActions}>
              <button
                className={styles.primaryButton}
                onClick={() => {
                  navigate(`/gestion-curso/lecciones/${leccionPreview.id}/recursos`);
                  setShowPreviewModal(false);
                }}
              >
                Ir a recursos
              </button>
              <button
                className={styles.secondaryButton}
                onClick={() => setShowPreviewModal(false)}
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
//
export default GestionLecciones;