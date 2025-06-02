import React, { useState, useEffect } from "react";
import "../docente/estilos/Recursos.css";
import { useParams } from "react-router-dom";
import { Edit, Trash, X, Upload, CheckCircle2 } from "lucide-react";
import { pdfApi } from "../../api/pdfService";
import ErrorModal from "../../componentes/comunes/ErrorModal";

import { practiceAPI } from "../../api/practice"; 
import {
  createResource,
  uploadResourceFile,
  getAllResources,
  deleteResource,
} from "../../api/videoService";

const Recursos = () => {
  const { courseId } = useParams();
  console.log("🚀 ~ Recursos ~ courseId:", courseId);
  // Modal states
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const [modalMode, setModalMode] = useState("crear"); // 'crear' o 'editar'
  const [editId, setEditId] = useState(null);
  const { leccionId } = useParams();
  const [showPracticeModal, setShowPracticeModal] = useState(false);  
  const [practiceData, setPracticeData] = useState({  instrucciones: "",  codigoInicial: "",solucionReferencia: "",  casosPrueba: "",  restricciones: "",  intentosMax: 3,  leccionId: leccionId || null});  
  

  // Error state
  const [error, setError] = useState(null);

  // PDF form data
  const [pdfData, setPdfData] = useState({
    nombre: "",
    descripcion: "",
    archivo: null,
    derechosAutor: false,
  });

  // Video form data
  const [videoData, setVideoData] = useState({
    tipoSubida: "archivo", // o "url"
    archivo: null,
    url: "",
    title: "",
    typeId: 3, // ID del tipo de recurso (ej: video)
    contentId: courseId, // ID del contenido al que pertenece
  });

  // Estado para notificaciones
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  }); // Estado para manejar los recursos
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState([]);

  // Error modal state
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Filtrar solo los recursos de tipo PDF
  const pdfRecursos = recursos.filter(
    (recurso) => recurso.name || recurso.nombre
  );

  // Cargar PDFs al montar el componente
  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        setLoading(true);
        setError(null);
        const pdfsData = await pdfApi.getAll();
        console.log("PDFs cargados:", pdfsData);
        setRecursos(pdfsData);
      } catch (error) {
        setError("Error al cargar los PDFs: " + error.message);
        console.error("Error al cargar PDFs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPdfs();
  }, []);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await getAllResources();
        setResources(data);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);
  // Mostrar notificación
  const showNotification = (message, type = "success") => {
    setNotification({
      show: true,
      message,
      type,
    });

    // Ocultar la notificación después de 3 segundos
    setTimeout(() => {
      setNotification({
        show: false,
        message: "",
        type: "success",
      });
    }, 3000);
  };

  // Show error modal
  const showError = (message) => {
    setErrorMessage(message);
    setShowErrorModal(true);
    setError(null); // Clear banner error when showing modal
  };

  // Close error modal
  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  }; // Handle PDF form change
  const handlePdfChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (name === "archivo") {
      const file = files[0];
      if (file) {
        // Validate PDF file type
        if (file.type !== "application/pdf") {
          showError("Por favor selecciona solo archivos PDF válidos (.pdf)");
          e.target.value = ""; // Clear the input
          return;
        }
        // Validate file size (optional - 10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          showError(
            "El archivo PDF es demasiado grande. El tamaño máximo permitido es 10MB."
          );
          e.target.value = ""; // Clear the input
          return;
        }
      }
      setPdfData({
        ...pdfData,
        archivo: file,
      });
    } else if (type === "checkbox") {
      setPdfData({
        ...pdfData,
        [name]: checked,
      });
    } else {
      setPdfData({
        ...pdfData,
        [name]: value,
      });
    }
  };
  // Handle Video form change
  const handleVideoChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "archivo") {
      const file = files[0];
      if (file) {
        // Validate video file type
        if (!file.type.startsWith("video/")) {
          showError(
            "Por favor selecciona solo archivos de video válidos (.mp4, .avi, .mov, etc.)"
          );
          e.target.value = ""; // Clear the input
          return;
        }
        // Validate file size (optional - 100MB limit)
        if (file.size > 100 * 1024 * 1024) {
          showError(
            "El archivo de video es demasiado grande. El tamaño máximo permitido es 100MB."
          );
          e.target.value = ""; // Clear the input
          return;
        }
      }
      setVideoData({
        ...videoData,
        archivo: file,
      });
    } else {
      setVideoData({
        ...videoData,
        [name]: value,
      });
    }
  };
  // Handle file drop for PDF
  const handlePdfDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        showError("Por favor selecciona solo archivos PDF válidos (.pdf)");
        return;
      }
      // Validate file size (optional - 10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        showError(
          "El archivo PDF es demasiado grande. El tamaño máximo permitido es 10MB."
        );
        return;
      }
      setPdfData({
        ...pdfData,
        archivo: file,
      });
    }
  };

  // Handle file drop for Video
  const handleVideoDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        showError(
          "Por favor selecciona solo archivos de video válidos (.mp4, .avi, .mov, etc.)"
        );
        return;
      }
      // Validate file size (optional - 100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        showError(
          "El archivo de video es demasiado grande. El tamaño máximo permitido es 100MB."
        );
        return;
      }
      setVideoData({
        ...videoData,
        archivo: file,
      });
    }
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  // Reset PDF form
  const resetPdfForm = () => {
    setPdfData({
      nombre: "",
      descripcion: "",
      archivo: null,
      derechosAutor: false,
    });
    setShowPdfModal(false);
    setModalMode("crear");
    setEditId(null);
  };

  // Reset Video form
  const resetVideoForm = () => {
    setVideoData({
      titulo: "",
      tipoSubida: "url",
      url: "",
      archivo: null,
    });
    setShowVideoModal(false);
    setModalMode("crear");
    setEditId(null);
  };

  // Abrir modal para crear un nuevo PDF
  const handleNuevoPdf = () => {
    resetPdfForm();
    setModalMode("crear");
    setShowPdfModal(true);
  };

  // Abrir modal para crear un nuevo Video
  const handleNuevoVideo = () => {
    resetVideoForm();
    setModalMode("crear");
    setShowVideoModal(true);
  };
  // Abrir modal para editar un PDF existente
  const handleEditarPdf = (recurso) => {
    setPdfData({
      nombre: recurso.name || recurso.nombre,
      descripcion: recurso.description || recurso.descripcion || "",
      archivo: null, // No mostramos el archivo existente
      derechosAutor: false, // Reset checkbox for security
    });
    setEditId(recurso.id);
    setModalMode("editar");
    setShowPdfModal(true);
  };

  // Eliminar un PDF
  const openDeleteModal = (recurso) => {
    setResourceToDelete(recurso);
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    if (!resourceToDelete) {
      console.error("No hay recurso para eliminar");
      return;
    }

    console.log("Recurso a eliminar:", resourceToDelete);

    // Determinar el tipo de recurso basándose en si tiene las propiedades de PDF o Video
    const isPdf = resourceToDelete.name || resourceToDelete.nombre;
    const isVideo = resourceToDelete.url || resourceToDelete.resourceId;

    console.log("Es PDF:", isPdf, "Es Video:", isVideo);

    if (isPdf && !isVideo) {
      // Es un PDF
      try {
        setLoading(true);
        console.log("Eliminando PDF con ID:", resourceToDelete.id);
        await pdfApi.delete(resourceToDelete.id);
        setRecursos(
          recursos.filter((recurso) => recurso.id !== resourceToDelete.id)
        );
        showNotification("El PDF ha sido eliminado correctamente");
        setShowDeleteModal(false);
        setResourceToDelete(null);
      } catch (error) {
        console.error("Error completo al eliminar PDF:", error);
        showError(
          "Error al eliminar el PDF: " + (error.message || error.toString())
        );
      } finally {
        setLoading(false);
      }
    } else {
      // Es un video
      try {
        setLoading(true);
        const videoId = resourceToDelete.resourceId || resourceToDelete.id;
        console.log("Eliminando video con ID:", videoId);
        await deleteResource(videoId);
        setResources(
          resources.filter((resource) => resource.id !== resourceToDelete.id)
        );
        showNotification("El video ha sido eliminado correctamente");
        setShowDeleteModal(false);
        setResourceToDelete(null);
      } catch (error) {
        console.error("Error completo al eliminar video:", error);
        showError(
          "Error al eliminar el video: " + (error.message || error.toString())
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setResourceToDelete(null);
  };
  // Submit PDF (crear o editar)
  const handleSubmitPdf = async (e) => {
    e.preventDefault(); // Validar que los derechos de autor estén aceptados
    if (!pdfData.derechosAutor) {
      showError(
        "Debe confirmar que tiene los derechos de autor para distribuir este documento."
      );
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Crear FormData para enviar el archivo
      const formData = new FormData();
      formData.append("name", pdfData.nombre);
      formData.append("description", pdfData.descripcion);
      formData.append("file", pdfData.archivo);

      let result;
      if (modalMode === "crear") {
        // Crear nuevo PDF
        result = await pdfApi.upload(formData);
        setRecursos([...recursos, result]);
        console.log("Recurso creado:", result);
        showNotification("El recurso ha sido subido correctamente");
      } else {
        // Actualizar PDF existente
        result = await pdfApi.update(editId, formData);
        setRecursos(
          recursos.map((recurso) => (recurso.id === editId ? result : recurso))
        );
        console.log("recurso actualizado:", result);
        showNotification("El recurso ha sido actualizado correctamente");
      }

      // Cerrar modal y resetear formulario
      resetPdfForm();
    } catch (error) {
      showError("Error al procesar el PDF: " + error.message);
      console.error("Error al procesar PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  // Submit Video (crear o editar)
  const handleSubmitVideo = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const { titulo, tipoSubida, url, archivo } = videoData;

      if (tipoSubida === "url") {
        // Crear recurso con URL
        const nuevoRecurso = {
          url,
          title: titulo,
          typeId: 3,
          contentId: courseId,
        };

        const response = await createResource(nuevoRecurso);
        console.log("Video por URL guardado:", response);
        showNotification("El video por URL ha sido guardado correctamente");
      } else {
        // Subir archivo .mp4
        if (!archivo) {
          showError("No se seleccionó un archivo de video.");
          return;
        }

        const title = titulo;
        const typeId = 3;
        const contentId = courseId;

        const response = await uploadResourceFile(
          archivo,
          title,
          typeId,
          contentId
        );
        console.log("Video por archivo subido:", response);
        showNotification("El video ha sido subido correctamente");
      }

      // Cerrar modal y resetear formulario
      resetVideoForm();
    } catch (error) {
      showError("Error al procesar el video: " + error.message);
      console.error("Error al procesar video:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Practice form change
const handlePracticeChange = (e) => {
  const { name, value } = e.target;
  setPracticeData({
    ...practiceData,
    [name]: value,
  });
};


// Handle file drop for Practice
const handlePracticeDrop = (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file && (file.type === "application/pdf" || file.type === "application/zip" || file.type === "application/msword")) {
    setPracticeData({
      ...practiceData,
      archivo: file,
    });
  }
};

// Reset Practice form
const resetPracticeForm = () => {
  console.log("Reseteando práctica con courseId:", courseId);

  setPracticeData({
    instrucciones: "",
    codigoInicial: "",
    solucionReferencia: "",
    casosPrueba: "",
    restricciones: "",
    intentosMax: 3,
    leccionId: courseId,
  });
  setShowPracticeModal(false);
  setModalMode("crear");
  setEditId(null);
};

  // Abrir modal para crear una nueva Práctica
const handleNuevaPractica = () => {
  resetPracticeForm();
  setModalMode("crear");
  setShowPracticeModal(true);
};

// Submit Practice (crear o editar)
const handleSubmitPractice = async (e) => {
  console.log("Valor de leccionId en practiceData:", practiceData.leccionId);
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    const nuevaPractica = {
      instrucciones: practiceData.instrucciones,
      codigoInicial: practiceData.codigoInicial,
      solucionReferencia: practiceData.solucionReferencia,
      casosPrueba: practiceData.casosPrueba,
      restricciones: practiceData.restricciones,
      intentosMax: parseInt(practiceData.intentosMax),
      leccionId: Number(practiceData.leccionId) || null,
    };
      if (!nuevaPractica.leccionId) {
     setError("El ID de la lección no es válido.");
       setLoading(false);
      return;
}
console.log("Datos enviados al backend:", nuevaPractica);

    await practiceAPI.crear(nuevaPractica);
    showNotification("Práctica creada correctamente");
    resetPracticeForm();
  } catch (error) {
    console.error("Error al crear la práctica:", error);
    setError("Error al crear la práctica.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="recursos">
      {/* Error Banner */}
      {error && (
        <div className="notification error">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            style={{
              background: "none",
              border: "none",
              color: "white",
              marginLeft: "10px",
              cursor: "pointer",
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Notificación */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <CheckCircle2 size={20} />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <ErrorModal message={errorMessage} onClose={closeErrorModal} />
      )}

      <h2 className="recursos-title">RECURSOS</h2>
      <div className="recursos-content-wrapper">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando recursos...</p>
          </div>
        ) : (
          <>
            <div className="tabla-container">
              <div className="recursos-table">
                <div className="recursos-table-header">
                  <div>Nombre</div>
                  <div>Descripción</div>
                  <div>Tipo</div>
                  <div>Acciones</div>
                </div>

                {pdfRecursos.length > 0 ? (
                  pdfRecursos.map((recurso) => (
                    <div key={recurso.id} className="recursos-table-row">
                      <div>{recurso.name || recurso.nombre}</div>
                      <div>
                        {recurso.description || recurso.descripcion || "-"}
                      </div>
                      <div>PDF</div>
                      <div className="action-buttons">
                        <button
                          className="action-button"
                          title="Editar"
                          onClick={() => handleEditarPdf(recurso)}
                          disabled={loading}
                        >
                          <Edit size={18} color="white" />
                        </button>
                        <button
                          className="action-button"
                          title="Eliminar"
                          onClick={() => openDeleteModal(recurso)}
                          disabled={loading}
                        >
                          <Trash size={18} color="#300898" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="recursos-table-row">
                    <div
                      style={{ textAlign: "center", gridColumn: "1 / span 4" }}
                    >
                      {loading ? "Cargando..." : "No hay PDFs disponibles"}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="tabla-container">
              <div className="recursos-table">
                <div className="recursos-table-header">
                  <div>Titulo</div>
                  <div>Vista previa/enlace</div>
                  <div>Tipo</div>
                  <div>Acciones</div>
                </div>

                {resources.length > 0 ? (
                  resources.map((resource) => (
                    <div
                      key={resource.resourceId}
                      className="recursos-table-row"
                    >
                      {/* Título */}
                      <div>{resource.title}</div>

                      {/* Vista previa */}
                      <div>
                        {resource.url.endsWith(".mp4") ? (
                          <video width="160" controls>
                            <source src={resource.url} type="video/mp4" />
                            Tu navegador no soporta el video.
                          </video>
                        ) : (
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            Abrir el enlace
                          </a>
                        )}
                      </div>

                      {/* Tipo */}
                      <div>{resource.url.endsWith(".mp4") ? "MP4" : "URL"}</div>

                      {/* Acciones */}
                      <div className="action-buttons">
                        {/* <button
                          className="action-button"
                          title="Edit"
                          onClick={() => handleEditarVideo(resource)}
                          disabled={loading}
                        >
                          <Edit size={18} color="white" />
                        </button> */}
                        <button
                          className="action-button"
                          title="Delete"
                          onClick={() => openDeleteModal(resource)}
                          disabled={loading}
                        >
                          <Trash size={18} color="#300898" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="recursos-table-row">
                    <div
                      style={{ textAlign: "center", gridColumn: "1 / span 4" }}
                    >
                      {loading ? "Cargando..." : "No hay videos disponibles"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        <div className="recursos-button-container">
          <button className="recursos-button"onClick={handleNuevaPractica}disabled={loading}>Subir Practica</button>
          <button
            className={`recursos-button ${
              pdfRecursos.length > 0 ? "disabled" : ""
            }`}
            onClick={handleNuevoPdf}
            disabled={loading || pdfRecursos.length > 0}
            title={
              pdfRecursos.length > 0
                ? "Ya hay un PDF asignado a esta lección"
                : "Subir nuevo PDF"
            }
          >
            {pdfRecursos.length > 0 ? "PDF Ya Asignado" : "Subir PDF"}
          </button>
          <button
            className="recursos-button"
            onClick={handleNuevoVideo}
            disabled={loading}
          >
            Subir Video
          </button>
        </div>
      </div>

      {/* Modal para subir o editar PDF */}
      {showPdfModal && (
        <div className="recursos-modal-overlay">
          <div className="recursos-modal">
            <div className="recursos-modal-header">
              <h3 className="recursos-modal-title">
                {modalMode === "crear" ? "Subir PDF" : "Editar PDF"}
              </h3>
            </div>
            <form onSubmit={handleSubmitPdf}>
              <div className="recursos-modal-form">
                <div className="modal-form-full">
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre del PDF"
                    value={pdfData.nombre}
                    onChange={handlePdfChange}
                    className="input-field"
                    required
                  />
                </div>

                <div className="modal-form-full">
                  <textarea
                    name="descripcion"
                    placeholder="Descripción del PDF"
                    value={pdfData.descripcion}
                    onChange={handlePdfChange}
                    className="input-field textarea"
                    rows="3"
                  ></textarea>
                </div>

                <div
                  className={`file-drop-area ${
                    pdfData.archivo ? "has-file" : ""
                  }`}
                  onDrop={handlePdfDrop}
                  onDragOver={handleDragOver}
                >
                  {!pdfData.archivo ? (
                    <>
                      <Upload size={32} className="upload-icon" />
                      <p>
                        Arrastra un archivo PDF aquí
                        <br />o
                      </p>
                      <input
                        type="file"
                        name="archivo"
                        id="archivo"
                        accept=".pdf"
                        onChange={handlePdfChange}
                        className="file-input"
                      />
                      <label htmlFor="archivo" className="file-input-label">
                        Seleccionar archivo
                      </label>
                    </>
                  ) : (
                    <div className="file-info">
                      <p className="file-name">{pdfData.archivo.name}</p>
                      <button
                        type="button"
                        className="remove-file"
                        onClick={() =>
                          setPdfData({ ...pdfData, archivo: null })
                        }
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="modal-form-full">
                  <div className="checkbox-container">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="derechosAutor"
                        checked={pdfData.derechosAutor}
                        onChange={handlePdfChange}
                        className="checkbox-input"
                      />
                      <span className="checkbox-custom"></span>
                      <span className="checkbox-text">
                        Confirmo que tengo los derechos de autor necesarios para
                        distribuir este documento y/o que el contenido no
                        infringe derechos de terceros.
                      </span>
                    </label>
                  </div>
                </div>

                <div className="modal-action-buttons">
                  <button
                    type="submit"
                    className="btn-subir"
                    disabled={
                      !pdfData.nombre ||
                      !pdfData.archivo ||
                      !pdfData.derechosAutor ||
                      loading
                    }
                  >
                    {loading
                      ? "Procesando..."
                      : modalMode === "crear"
                      ? "Subir PDF"
                      : "Guardar cambios"}
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={resetPdfForm}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para subir Video */}
      {showVideoModal && (
        <div className="recursos-modal-overlay">
          <div className="recursos-modal">
            <div className="recursos-modal-header">
              <h3 className="recursos-modal-title">
                {modalMode === "crear" ? "Subir Video" : "Editar Video"}
              </h3>
            </div>
            <form onSubmit={handleSubmitVideo}>
              <div className="recursos-modal-form">
                <div className="modal-form-full">
                  <input
                    type="text"
                    name="titulo"
                    placeholder="Título del Video"
                    value={videoData.titulo}
                    onChange={handleVideoChange}
                    className="input-field"
                    required
                  />
                </div>

                <div className="modal-form-full">
                  <div className="radio-group">
                    <p className="radio-group-title">Tipo de subida:</p>
                    <div className="radio-options">
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="tipoSubida"
                          value="url"
                          checked={videoData.tipoSubida === "url"}
                          onChange={handleVideoChange}
                        />
                        <span className="radio-custom"></span>
                        URL
                      </label>
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="tipoSubida"
                          value="archivo"
                          checked={videoData.tipoSubida === "archivo"}
                          onChange={handleVideoChange}
                        />
                        <span className="radio-custom"></span>
                        Subir Video
                      </label>
                    </div>
                  </div>
                </div>

                {videoData.tipoSubida === "url" ? (
                  <div className="modal-form-full">
                    <input
                      type="url"
                      name="url"
                      placeholder="https://ejemplo.com/video"
                      value={videoData.url}
                      onChange={handleVideoChange}
                      className="input-field"
                      required
                    />
                  </div>
                ) : (
                  <div
                    className={`file-drop-area ${
                      videoData.archivo ? "has-file" : ""
                    }`}
                    onDrop={handleVideoDrop}
                    onDragOver={handleDragOver}
                  >
                    {!videoData.archivo ? (
                      <>
                        <Upload size={32} className="upload-icon" />
                        <p>
                          Arrastra un archivo de video aquí
                          <br />o
                        </p>
                        <input
                          type="file"
                          name="archivo"
                          id="video-archivo"
                          accept="video/*"
                          onChange={handleVideoChange}
                          className="file-input"
                        />
                        <label
                          htmlFor="video-archivo"
                          className="file-input-label"
                        >
                          Seleccionar archivo
                        </label>
                      </>
                    ) : (
                      <div className="file-info">
                        <p className="file-name">{videoData.archivo.name}</p>
                        <button
                          type="button"
                          className="remove-file"
                          onClick={() =>
                            setVideoData({ ...videoData, archivo: null })
                          }
                        >
                          <X size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="modal-action-buttons">
                  <button
                    type="submit"
                    className="btn-subir"
                    disabled={
                      !videoData.titulo ||
                      (videoData.tipoSubida === "url" && !videoData.url) ||
                      (videoData.tipoSubida === "archivo" &&
                        !videoData.archivo) ||
                      loading
                    }
                  >
                    {loading ? "Procesando..." : "Subir Video"}
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={resetVideoForm}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="recursos-modal-overlay">
          <div className="recursos-modal-content">
            <h3>Confirmar eliminación</h3>
            <p>
              ¿Estás seguro de que deseas eliminar el Recurso?{" "}
              <strong>
                {resourceToDelete?.name || resourceToDelete?.nombre}
              </strong>
              ?
            </p>
            <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "10px" }}>
              Esta acción no se puede deshacer.
            </p>
            <div className="recursos-modal-actions">
              <button
                className="recursos-confirm-button"
                onClick={confirmDelete}
                disabled={loading}
              >
                {loading ? "Eliminando..." : "Eliminar"}
              </button>
              <button
                className="recursos-cancel-button"
                onClick={cancelDelete}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
        {showPracticeModal && (
            console.log("🟣 Modal mostrado"),
  <div className="recursos-modal-overlay">
    <div className="recursos-modal" style={{ maxWidth: '800px' }}>
      <div className="recursos-modal-header">
        <h3 className="recursos-modal-title">
          {modalMode === "crear" ? "Crear Nueva Práctica" : "Editar Práctica"}
        </h3>
      </div>
      <form onSubmit={handleSubmitPractice}>
        <div className="recursos-modal-form">
          
          <div className="modal-form-row">
            <div className="modal-form-half">
              <label>Intentos Máximos</label>
              <input
                type="number"
                name="intentosMax"
                value={practiceData.intentosMax}
                onChange={handlePracticeChange}
                className="input-field"
                min="1"
                required
              />
            </div>
            
          </div>

          <div className="modal-form-full">
            <label>Instrucciones</label>
            <textarea
              name="instrucciones"
              value={practiceData.instrucciones}
              onChange={handlePracticeChange}
              className="input-field textarea"
              rows="3"
              required
            />
          </div>

          <div className="modal-form-full">
            <label>Código Inicial</label>
            <textarea
              name="codigoInicial"
              value={practiceData.codigoInicial}
              onChange={handlePracticeChange}
              className="input-field textarea code-area"
              rows="5"
              required
            />
          </div>

          <div className="modal-form-full">
            <label>Solución de Referencia</label>
            <textarea
              name="solucionReferencia"
              value={practiceData.solucionReferencia}
              onChange={handlePracticeChange}
              className="input-field textarea code-area"
              rows="5"
              required
            />
          </div>

          <div className="modal-form-full">
            <label>Casos de Prueba (JSON)</label>
            <textarea
              name="casosPrueba"
              value={practiceData.casosPrueba}
              onChange={handlePracticeChange}
              className="input-field textarea"
              rows="3"
              placeholder='[{"input": "entrada", "output": "salida esperada"}]'
              required
            />
          </div>

          <div className="modal-form-full">
            <label>Restricciones</label>
            <textarea
              name="restricciones"
              value={practiceData.restricciones}
              onChange={handlePracticeChange}
              className="input-field textarea"
              rows="2"
              required
            />
          </div>
          <div className="modal-action-buttons">
            <button
              type="submit"
              className="btn-subir"
                onClick={() => console.log("🟡 Botón presionado")}

              disabled={loading || 
                !practiceData.instrucciones || 
                !practiceData.codigoInicial ||
                !practiceData.solucionReferencia ||
                !practiceData.casosPrueba ||
                !practiceData.restricciones}
            >
              {loading ? "Procesando..." : "Guardar Práctica"}
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={resetPracticeForm}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default Recursos;
