import React, { useState, useEffect } from "react";
import "../docente/estilos/Recursos.css";
import { useNavigate, useParams } from "react-router-dom";
import { Edit, Trash, X, Upload, Download, CheckCircle2 } from "lucide-react";
import { pdfApi } from "../../api/pdfService";

const Recursos = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
    // Modal states
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const [modalMode, setModalMode] = useState('crear'); // 'crear' o 'editar'
  const [editId, setEditId] = useState(null);
  const [pdfData, setPdfData] = useState({
    nombre: "",
    descripcion: "",
    archivo: null
  });
  
  // Estado para notificaciones
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });
  // Estado para manejar los recursos
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Filtrar solo los recursos de tipo PDF
  const pdfRecursos = recursos.filter(recurso => recurso.name || recurso.nombre);

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
  
  // Mostrar notif  icación
  const showNotification = (message, type = 'success') => {
    setNotification({
      show: true,
      message,
      type
    });
    
    // Ocultar la notificación después de 3 segundos
    setTimeout(() => {
      setNotification({
        show: false,
        message: '',
        type: 'success'
      });
    }, 3000);
  };

  // Handle form change
  const handlePdfChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "archivo") {
      setPdfData({
        ...pdfData,
        archivo: files[0]
      });
    } else {
      setPdfData({
        ...pdfData,
        [name]: value
      });
    }
  };

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setPdfData({
        ...pdfData,
        archivo: file
      });
    }
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Reset form
  const resetPdfForm = () => {
    setPdfData({
      nombre: "",
      descripcion: "",
      archivo: null
    });
    setShowPdfModal(false);
    setModalMode('crear');
    setEditId(null);
  };

  // Abrir modal para crear un nuevo PDF
  const handleNuevoPdf = () => {
    resetPdfForm();
    setModalMode('crear');
    setShowPdfModal(true);
  };
  // Abrir modal para editar un PDF existente
  const handleEditarPdf = (recurso) => {
    setPdfData({
      nombre: recurso.name || recurso.nombre,
      descripcion: recurso.description || recurso.descripcion || '',
      archivo: null // No mostramos el archivo existente
    });
    setEditId(recurso.id);
    setModalMode('editar');
    setShowPdfModal(true);
  };

  // Eliminar un PDF
  const openDeleteModal = (recurso) => {
    setResourceToDelete(recurso);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await pdfApi.delete(resourceToDelete.id);
      setRecursos(recursos.filter(recurso => recurso.id !== resourceToDelete.id));
      showNotification("El PDF ha sido eliminado correctamente");
      setShowDeleteModal(false);
      setResourceToDelete(null);
    } catch (error) {
      setError("Error al eliminar el PDF: " + error.message);
      console.error("Error al eliminar PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setResourceToDelete(null);
  };
  // Submit PDF (crear o editar)
  const handleSubmitPdf = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Crear FormData para enviar el archivo
      const formData = new FormData();
      formData.append('name', pdfData.nombre);
      formData.append('description', pdfData.descripcion);
      formData.append('file', pdfData.archivo);

      let result;
      if (modalMode === 'crear') {
        // Crear nuevo PDF
        result = await pdfApi.upload(formData);
        setRecursos([...recursos, result]);
        console.log("PDF creado:", result);
        showNotification("El PDF ha sido subido correctamente");
      } else {
        // Actualizar PDF existente
        result = await pdfApi.update(editId, formData);
        setRecursos(recursos.map(recurso => 
          recurso.id === editId ? result : recurso
        ));
        console.log("PDF actualizado:", result);
        showNotification("El PDF ha sido actualizado correctamente");
      }
      
      // Cerrar modal y resetear formulario
      resetPdfForm();
    } catch (error) {
      setError("Error al procesar el PDF: " + error.message);
      console.error("Error al procesar PDF:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="recursos">
      {/* Notificación */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <CheckCircle2 size={20} />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="error-banner">
          <span className="error-message">{error}</span>
          <button className="error-close" onClick={() => setError(null)}>
            ×
          </button>
        </div>
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
              <div className="recursos-table">                <div className="recursos-table-header">
                  <div>Nombre</div>
                  <div>Descripción</div>
                  <div>Tipo</div>
                  <div>Acciones</div>
                </div>
                
                {pdfRecursos.length > 0 ? (
                  pdfRecursos.map(recurso => (
                    <div key={recurso.id} className="recursos-table-row">                      <div>{recurso.name || recurso.nombre}</div>
                      <div>{recurso.description || recurso.descripcion || '-'}</div>
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
                    <div style={{ textAlign: "center", gridColumn: "1 / span 4" }}>
                      {loading ? "Cargando..." : "No hay PDFs disponibles"}
                    </div>
                  </div>                )}
              </div>
            </div>
          </>
        )}
        
        <div className="recursos-button-container">
          <button className="recursos-button">Subir Practica</button>
          <button className="recursos-button" onClick={handleNuevoPdf} disabled={loading}>
            Subir PDF
          </button>
          <button className="recursos-button">Subir Video</button>
        </div>
      </div>

      {/* Modal para subir o editar PDF */}
      {showPdfModal && (
        <div className="recursos-modal-overlay">
          <div className="recursos-modal">            <div className="recursos-modal-header">
              <h3 className="recursos-modal-title">
                {modalMode === 'crear' ? 'Subir PDF' : 'Editar PDF'}
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
                  className={`file-drop-area ${pdfData.archivo ? 'has-file' : ''}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  {!pdfData.archivo ? (
                    <>
                      <Upload size={32} className="upload-icon" />
                      <p>Arrastra un archivo PDF aquí<br />o</p>
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
                        onClick={() => setPdfData({...pdfData, archivo: null})}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </div>                <div className="modal-action-buttons">
                  <button 
                    type="submit" 
                    className="btn-subir"
                    disabled={!pdfData.nombre || !pdfData.archivo || loading}
                  >
                    {loading ? 'Procesando...' : (modalMode === 'crear' ? 'Subir PDF' : 'Guardar cambios')}
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
            </form>          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="recursos-modal-overlay">
          <div className="recursos-modal-content">
            <h3>Confirmar eliminación</h3>            <p>
              ¿Estás seguro de que deseas eliminar el PDF{" "}
              <strong>{resourceToDelete?.name || resourceToDelete?.nombre}</strong>?
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
                {loading ? 'Eliminando...' : 'Eliminar'}
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
    </div>
  );
};

export default Recursos;
