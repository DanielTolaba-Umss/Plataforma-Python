// Archivo: GestionLecciones.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit, Trash2, PlusCircle, Video, CheckSquare, FileText, File } from "lucide-react";
// import styles from "/src/paginas/docente/estilos/GestionCurso.module.css";
import styles from "/src/paginas/docente/estilos/GestionLecciones.module.css";
import FormularioCrearLeccion from "./FormularioCrearLeccion";
import FormularioEditarLeccion from "./FormularioEditarLeccion";

const GestionLecciones = () => {
  const { nivel } = useParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState({
    basico: [
      { id: 1, title: "Introducción a Python", description: "Fundamentos básicos del lenguaje Python", resources: [] },
      { id: 2, title: "Variables y Tipos de Datos", description: "Aprende sobre variables y tipos en Python", resources: [] },
    ],
    intermedio: [
      { id: 3, title: "Estructuras de Datos Avanzadas", description: "Listas, diccionarios y conjuntos", resources: [] },
      { id: 4, title: "Funciones y Módulos", description: "Creación y uso de funciones en Python", resources: [] },
    ],
    avanzado: [
      { id: 5, title: "Programación Orientada a Objetos", description: "Clases, herencia y polimorfismo", resources: [] },
      { id: 6, title: "Desarrollo Web con Django", description: "Crea aplicaciones web con Django", resources: [] },
    ],
  });

  const [showCourseForm, setShowCourseForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showPracticaModal, setShowPracticaModal] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [practicaTitle, setPracticaTitle] = useState("");
  const [practicaDesc, setPracticaDesc] = useState("");
  const [practicaCode, setPracticaCode] = useState("");

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleCreateCourse = (newCourse) => {
    setCourses((prev) => ({
      ...prev,
      [nivel]: [...prev[nivel], { ...newCourse, id: Date.now(), resources: [] }],
    }));
    setShowCourseForm(false);
    showNotification("Lección creada con éxito", "success");
  };

  const handleEditCourse = (updatedCourse) => {
    setCourses((prev) => ({
      ...prev,
      [nivel]: prev[nivel].map((c) => (c.id === updatedCourse.id ? { ...c, ...updatedCourse } : c)),
    }));
    setShowEditForm(false);
    showNotification("Lección actualizada con éxito", "success");
  };

  const handleDeleteCourse = () => {
    setCourses((prev) => ({
      ...prev,
      [nivel]: prev[nivel].filter((c) => c.id !== courseToDelete.id),
    }));
    setShowDeleteModal(false);
    showNotification("Lección eliminada con éxito", "success");
  };

  const validateInputs = () => {
    let valid = true;
    if (!videoTitle.trim()) {
      showNotification("El título del video es obligatorio", "error");
      valid = false;
    }
    if (!videoUrl.trim()) {
      showNotification("La URL del video es obligatoria", "error");
      valid = false;
    }
    return valid;
  };

  const validatePractica = () => {
    let valid = true;
    if (!practicaTitle.trim()) {
      showNotification("El título de la práctica es obligatorio", "error");
      valid = false;
    }
    if (!practicaDesc.trim()) {
      showNotification("La descripción de la práctica es obligatoria", "error");
      valid = false;
    }
    return valid;
  };

  const handleCrearVideo = () => {
    if (!validateInputs()) return;
    const newResource = { type: "video", title: videoTitle, url: videoUrl, id: Date.now() };
    setCourses(prev => ({
      ...prev,
      [nivel]: prev[nivel].map(course => course.id === selectedCourse.id
        ? { ...course, resources: [...course.resources, newResource] }
        : course)
    }));
    setVideoTitle(""); setVideoUrl(""); setShowVideoModal(false);
    showNotification("Video agregado con éxito", "success");
  };

  const handleCrearPractica = () => {
    if (!validatePractica()) return;
    const newResource = {
      type: "practica", title: practicaTitle, description: practicaDesc, code: practicaCode, id: Date.now()
    };
    setCourses(prev => ({
      ...prev,
      [nivel]: prev[nivel].map(course => course.id === selectedCourse.id
        ? { ...course, resources: [...course.resources, newResource] }
        : course)
    }));
    setPracticaTitle(""); setPracticaDesc(""); setPracticaCode("");
    setShowPracticaModal(false);
    showNotification("Práctica agregada con éxito", "success");
  };

  const handleOptionClick = (actionType) => {
    switch (actionType) {
      case "practicas": setShowPracticaModal(true); break;
      case "videos": setShowVideoModal(true); break;
      case "examenes": navigate("/crear-examen"); break;
      case "pdfs": navigate("/crear-pdf"); break;
      default: break;
    }
  };

  const options = [
    { title: "Crear Prácticas", icon: <CheckSquare size={20} className={styles.optionIcon} />, description: "Ejercicios prácticos.", actionType: "practicas" },
    { title: "Crear Exámenes", icon: <FileText size={20} className={styles.optionIcon} />, description: "Evaluaciones de progreso.", actionType: "examenes" },
    { title: "Subir Videos", icon: <Video size={20} className={styles.optionIcon} />, description: "Contenido multimedia.", actionType: "videos" },
    { title: "Subir PDFs", icon: <File size={20} className={styles.optionIcon} />, description: "Material complementario.", actionType: "pdfs" },
  ];

  return (
    <div className={styles.coursesContainer}>
      {notification.show && <div className={`${styles.notification} ${styles[notification.type]}`}>{notification.message}</div>}

      <div className={styles.coursesHeader}>
        <h2 className={styles.coursesTitle}>
          {nivel === "basico" && "Lecciones Python Básico"}
          {nivel === "intermedio" && "Lecciones Python Intermedio"}
          {nivel === "avanzado" && "Lecciones Python Avanzado"}
        </h2>
        <button onClick={() => navigate("/gestion-curso")} className={styles.backButton}>Volver a niveles</button>
      </div>

      <div className={styles.coursesGrid}>
        {courses[nivel].map((course) => (
          <div key={course.id} className={styles.courseCard}>
            <h3 className={styles.courseTitle}>{course.title}</h3>
            <p className={styles.courseDescription}>{course.description}</p>
            <div className={styles.actionsContainer}>
              <button className={styles.resourcesButton} onClick={() => { setSelectedCourse(course); setShowModal(true); }}>Recursos</button>
              <button className={`${styles.resourcesButton} ${styles.editButton}`} onClick={() => { setCourseToEdit(course); setShowEditForm(true); }}><Edit size={18} /></button>
              <button className={`${styles.resourcesButton} ${styles.deleteButton}`} onClick={() => { setCourseToDelete(course); setShowDeleteModal(true); }}><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {!showCourseForm && <button onClick={() => setShowCourseForm(true)} className={styles.addButton}><PlusCircle className={styles.addIcon} />Crear lección</button>}

      {showCourseForm && <FormularioCrearLeccion onClose={() => setShowCourseForm(false)} onSubmit={handleCreateCourse} />}
      {showEditForm && courseToEdit && <FormularioEditarLeccion course={courseToEdit} onClose={() => setShowEditForm(false)} onSubmit={handleEditCourse} />}

      {showModal && selectedCourse && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={() => setShowModal(false)}>×</button>
            <h2>{selectedCourse.title} - Recursos</h2>
            <div className={styles.resourcesList}>
              {selectedCourse.resources.length > 0 ? (
                <ul>
                  {selectedCourse.resources.map((res) => (
                    <li key={res.id} className={styles.resourceItem}>
                      {res.type === "video" && <Video size={16} />} {res.type === "practica" && <CheckSquare size={16} />} {res.title}
                    </li>
                  ))}
                </ul>
              ) : <p>No hay recursos agregados aún.</p>}
            </div>
            <div className={styles.optionsGrid}>
              {options.map((option) => (
                <div key={option.title} className={styles.optionCard} onClick={() => handleOptionClick(option.actionType)}>
                  <div className={styles.optionIconContainer}>{option.icon}</div>
                  <h4>{option.title}</h4>
                  <p>{option.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showVideoModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={() => setShowVideoModal(false)}>×</button>
            <h2>Subir Video</h2>
            <div className={styles.formGroup}><label>Título del Video</label><input type="text" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder="Ej: Introducción a Python" /></div>
            <div className={styles.formGroup}><label>URL del Video</label><input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..." /></div>
            <div className={styles.modalActions}>
              <button className={`${styles.modalButton} ${styles.cancelButton}`} onClick={() => setShowVideoModal(false)}>Cancelar</button>
              <button className={`${styles.modalButton} ${styles.confirmButton}`} onClick={handleCrearVideo}>Subir Video</button>
            </div>
          </div>
        </div>
      )}

      {showPracticaModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={() => setShowPracticaModal(false)}>×</button>
            <h2>Crear Práctica</h2>
            <div className={styles.formGroup}><label>Nombre de la práctica</label><input type="text" value={practicaTitle} onChange={(e) => setPracticaTitle(e.target.value)} placeholder="Ej: Práctica en Python n.1" /></div>
            <div className={styles.formGroup}><label>Instrucciones</label><textarea value={practicaDesc} onChange={(e) => setPracticaDesc(e.target.value)} placeholder="Ej: Crea una variable llamada 'mensaje'..." /></div>
            <div className={styles.formGroup}><label>Respuesta esperada (opcional)</label><textarea value={practicaCode} onChange={(e) => setPracticaCode(e.target.value)} placeholder="mensaje = 'Hola Python'" /></div>
            <div className={styles.modalActions}>
              <button className={`${styles.modalButton} ${styles.cancelButton}`} onClick={() => setShowPracticaModal(false)}>Cancelar</button>
              <button className={`${styles.modalButton} ${styles.confirmButton}`} onClick={handleCrearPractica}>Crear Práctica</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={() => setShowDeleteModal(false)}>×</button>
            <h2>Confirmar eliminación</h2>
            <p>¿Estás seguro que deseas eliminar la lección "{courseToDelete?.title}"?</p>
            <div className={styles.modalActions}>
              <button className={`${styles.modalButton} ${styles.cancelButton}`} onClick={() => setShowDeleteModal(false)}>Cancelar</button>
              <button className={`${styles.modalButton} ${styles.confirmButton}`} onClick={handleDeleteCourse}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionLecciones;