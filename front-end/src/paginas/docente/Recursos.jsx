import React, { useState, useEffect } from "react";
import "../docente/estilos/Recursos.css";
import { useNavigate, useParams } from "react-router-dom";
import { Edit, Trash, X, Upload, Download, CheckCircle2 } from "lucide-react";

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
  const [recursos, setRecursos] = useState([
    { id: 1, nombre: "Practica 1", tipo: "Práctica" },
    { id: 2, nombre: "PDF 1", tipo: "PDF", descripcion: "Descripción del PDF 1" },
    { id: 3, nombre: "PDF 2", tipo: "PDF", descripcion: "Descripción del PDF 2" },
  ]);

  // Filtrar solo los recursos de tipo PDF
  const pdfRecursos = recursos.filter(recurso => recurso.tipo === "PDF");
  
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
      nombre: recurso.nombre,
      descripcion: recurso.descripcion || '',
      archivo: recurso.archivo
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

  const confirmDelete = () => {
    // Aquí iría la llamada a la API para eliminar el PDF
    setRecursos(recursos.filter(recurso => recurso.id !== resourceToDelete.id));
    showNotification("El PDF ha sido eliminado correctamente");
    setShowDeleteModal(false);
    setResourceToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setResourceToDelete(null);
  };

  // Submit PDF (crear o editar)
  const handleSubmitPdf = (e) => {
    e.preventDefault();
    
    if (modalMode === 'crear') {
      // Crear nuevo PDF
      const nuevoPdf = {
        id: Date.now(), // Generar un ID temporal
        nombre: pdfData.nombre,
        descripcion: pdfData.descripcion,
        tipo: "PDF",
        archivo: pdfData.archivo
      };
      
      // Aquí iría la llamada a la API para guardar el PDF
      setRecursos([...recursos, nuevoPdf]);
      console.log("Creando nuevo PDF:", nuevoPdf);
      showNotification("El PDF ha sido subido correctamente");
    } else {
      // Actualizar PDF existente
      const pdfActualizado = {
        id: editId,
        nombre: pdfData.nombre,
        descripcion: pdfData.descripcion,
        tipo: "PDF",
        archivo: pdfData.archivo
      };
      
      // Aquí iría la llamada a la API para actualizar el PDF
      setRecursos(recursos.map(recurso => 
        recurso.id === editId ? pdfActualizado : recurso
      ));
      console.log("Actualizando PDF:", pdfActualizado);
      showNotification("El PDF ha sido actualizado correctamente");
    }
    
    // Cerrar modal y resetear formulario
    resetPdfForm();
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

      <h2 className="recursos-title">RECURSOS</h2>
      <div className="recursos-content-wrapper">
        <div className="tabla-container">
          <div className="recursos-table">
            <div className="recursos-table-header">
              <div>Nombre</div>
              <div>Descripción</div>
              <div>Tipo</div>
              <div>Acciones</div>
            </div>
            
            {pdfRecursos.length > 0 ? (
              pdfRecursos.map(recurso => (
                <div key={recurso.id} className="recursos-table-row">
                  <div>{recurso.nombre}</div>
                  <div>{recurso.descripcion || '-'}</div>
                  <div>{recurso.tipo}</div>
                  <div className="action-buttons">
                    <button 
                      className="action-button" 
                      title="Editar"
                      onClick={() => handleEditarPdf(recurso)}
                    >
                      <Edit size={18} color="white" />
                    </button>                    <button 
                      className="action-button" 
                      title="Eliminar"
                      onClick={() => openDeleteModal(recurso)}
                    >
                      <Trash size={18} color="#300898" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="recursos-table-row">
                <div style={{ textAlign: "center", gridColumn: "1 / span 4" }}>
                  No hay PDFs disponibles
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="recursos-button-container">
          <button className="recursos-button">Subir Practica</button>
          <button className="recursos-button" onClick={handleNuevoPdf}>Subir PDF</button>
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
                </div>
                  <div className="modal-action-buttons">
                  <button 
                    type="submit" 
                    className="btn-subir"
                    disabled={!pdfData.nombre || !pdfData.archivo}
                  >
                    {modalMode === 'crear' ? 'Subir PDF' : 'Guardar cambios'}
                  </button>
                  <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={resetPdfForm}
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
            <h3>Confirmar eliminación</h3>
            <p>
              ¿Estás seguro de que deseas eliminar el PDF{" "}
              <strong>{resourceToDelete?.nombre}</strong>?
            </p>
            <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "10px" }}>
              Esta acción no se puede deshacer.
            </p>
            <div className="recursos-modal-actions">
              <button className="recursos-confirm-button" onClick={confirmDelete}>
                Eliminar
              </button>
              <button className="recursos-cancel-button" onClick={cancelDelete}>
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
