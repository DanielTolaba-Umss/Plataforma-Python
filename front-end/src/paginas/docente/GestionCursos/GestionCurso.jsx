import React, { useState } from "react";
import { BookOpen, PlusCircle, Edit, Trash2, CheckSquare, FileText, Video, File, Layers3 } from "lucide-react";
import FormularioCrearLeccion from "./FormularioCrearLeccion";
import FormularioEditarLeccion from "./FormularioEditarLeccion";
import styles from "/src/paginas/docente/estilos/GestionCurso.module.css";
import { useNavigate } from "react-router-dom";

const GestionCurso = () => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showPracticaModal, setShowPracticaModal] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [practicaTitle, setPracticaTitle] = useState("");
  const [practicaDesc, setPracticaDesc] = useState("");
  const [practicaCode, setPracticaCode] = useState("");
  const navigate = useNavigate();
  
  // Mock data for courses
  const [courses, setCourses] = useState({
    basico: [
      {
        id: 1,
        title: "Introducción a Python",
        description: "Fundamentos básicos del lenguaje Python",
        resources: []
      },
      {
        id: 2,
        title: "Variables y Tipos de Datos",
        description: "Aprende sobre variables y tipos en Python",
        resources: []
      },
    ],
    intermedio: [
      {
        id: 3,
        title: "Estructuras de Datos Avanzadas",
        description: "Listas, diccionarios y conjuntos",
        resources: []
      },
      {
        id: 4,
        title: "Funciones y Módulos",
        description: "Creación y uso de funciones en Python",
        resources: []
      },
    ],
    avanzado: [
      {
        id: 5,
        title: "Programación Orientada a Objetos",
        description: "Clases, herencia y polimorfismo",
        resources: []
      },
      {
        id: 6,
        title: "Desarrollo Web con Django",
        description: "Crea aplicaciones web con Django",
        resources: []
      },
    ],
  });

  const handleModuleSelect = (module) => {
    setSelectedModule(module);
    setShowCourseForm(false);
  };

  const handleCreateCourse = (newCourse) => {
    if (selectedModule) {
      setCourses((prev) => ({
        ...prev,
        [selectedModule]: [...prev[selectedModule], {
          ...newCourse,
          id: Math.max(...prev[selectedModule].map(c => c.id), 0) + 1,
          resources: []
        }],
      }));
      setShowCourseForm(false);
      showNotification("Lección creada con éxito", "success");
    }
  };

  const handleEditCourse = (updatedCourse) => {
    if (selectedModule) {
      setCourses(prev => ({
        ...prev,
        [selectedModule]: prev[selectedModule].map(course =>
          course.id === updatedCourse.id ? { ...course, ...updatedCourse } : course
        )
      }));
      setShowEditForm(false);
      showNotification("Lección actualizada con éxito", "success");
    }
  };

  const handleDeleteCourse = () => {
    if (selectedModule && courseToDelete) {
      setCourses(prev => ({
        ...prev,
        [selectedModule]: prev[selectedModule].filter(
          course => course.id !== courseToDelete.id
        )
      }));
      setShowDeleteModal(false);
      showNotification("Lección eliminada con éxito", "success");
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
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

    const newResource = {
      type: "video",
      title: videoTitle,
      url: videoUrl,
      id: Date.now()
    };

    setCourses(prev => ({
      ...prev,
      [selectedModule]: prev[selectedModule].map(course =>
        course.id === selectedCourse.id 
          ? { ...course, resources: [...course.resources, newResource] }
          : course
      )
    }));

    setVideoTitle("");
    setVideoUrl("");
    setShowVideoModal(false);
    showNotification("Video agregado con éxito", "success");
  };

  const handleCrearPractica = () => {
    if (!validatePractica()) return;

    const newResource = {
      type: "practica",
      title: practicaTitle,
      description: practicaDesc,
      code: practicaCode,
      id: Date.now()
    };

    setCourses(prev => ({
      ...prev,
      [selectedModule]: prev[selectedModule].map(course =>
        course.id === selectedCourse.id 
          ? { ...course, resources: [...course.resources, newResource] }
          : course
      )
    }));

    setPracticaTitle("");
    setPracticaDesc("");
    setPracticaCode("");
    setShowPracticaModal(false);
    showNotification("Práctica agregada con éxito", "success");
  };

  const handleOptionClick = (actionType) => {
    switch (actionType) {
      case "practicas":
        setShowPracticaModal(true);
        break;
      case "examenes":
        navigate("/crear-examen");
        break;
      case "videos":
        setShowVideoModal(true);
        break;
      case "pdfs":
        navigate("/crear-pdf");
        break;
      default:
        console.log("Acción no definida");
    }
  };

  const options = [
    {
      title: "Crear Prácticas",
      icon: <CheckSquare size={20} className={styles.optionIcon} />,
      description: "Ejercicios prácticos para reforzar el aprendizaje.",
      actionType: "practicas",
    },
    {
      title: "Crear Exámenes",
      icon: <FileText size={20} className={styles.optionIcon} />,
      description: "Evaluaciones para medir el progreso.",
      actionType: "examenes",
    },
    {
      title: "Subir Videos",
      icon: <Video size={20} className={styles.optionIcon} />,
      description: "Contenido multimedia educativo.",
      actionType: "videos",
    },
    {
      title: "Subir PDFs",
      icon: <File size={20} className={styles.optionIcon} />,
      description: "Material complementario en formato PDF.",
      actionType: "pdfs",
    },
  ];

  return (
    <div className={styles.container}>
      {/* Notificación */}
      {notification.show && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}

      <header className={styles.header}>
        <div className="container py-3 d-flex justify-content-between align-items-center">
          <h1 className="fw-bold text-dark mb-4" style={{ fontSize: "1.875rem" }}>
            Niveles
          </h1>
          <div className="admin-profile d-flex align-items-center gap-2">
            <span className="fw-semibold">Docente</span>
            <div
              className="admin-avatar bg-success text-white rounded-circle d-flex justify-content-center align-items-center"
              style={{ width: "40px", height: "40px" }}
            >
              GC
            </div>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        {!selectedModule ? (
          <>
            <div className={styles.subtitleWithButton}>
              <h2 className={styles.subtitle}>Selecciona un nivel</h2>
            </div>

            <div className={styles.modulesGrid}>
              {/* Module Cards */}
              <div
                className={styles.moduleCard}
                onClick={() => handleModuleSelect("basico")}
              >
                <div className={styles.moduleIconContainer}>
                  <BookOpen
                    className={`${styles.moduleIcon} ${styles.blueIcon}`}
                  />
                </div>
                <h3 className={styles.moduleTitle}>Nivel Básico</h3>
                <p className={styles.moduleDescription}>
                  Gestiona el contenido y las actividades del nivel básico del
                  curso.
                </p>
              </div>

              <div
                className={styles.moduleCard}
                onClick={() => handleModuleSelect("intermedio")}
              >
                <div className={styles.moduleIconContainer}>
                  <BookOpen
                    className={`${styles.moduleIcon} ${styles.greenIcon}`}
                  />
                </div>
                <h3 className={styles.moduleTitle}>Nivel Intermedio</h3>
                <p className={styles.moduleDescription}>
                  Gestiona el contenido y las actividades del nivel intermedio
                  del curso.
                </p>
              </div>

              <div
                className={styles.moduleCard}
                onClick={() => handleModuleSelect("avanzado")}
              >
                <div className={styles.moduleIconContainer}>
                  <BookOpen
                    className={`${styles.moduleIcon} ${styles.purpleIcon}`}
                  />
                </div>
                <h3 className={styles.moduleTitle}>Nivel Avanzado</h3>
                <p className={styles.moduleDescription}>
                  Gestiona el contenido y las actividades del nivel avanzado
                  del curso.
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.coursesContainer}>
            <div className={styles.coursesHeader}>
              <h2 className={styles.coursesTitle}>
                {selectedModule === "basico" && "Lecciones Python Básico"}
                {selectedModule === "intermedio" && "Lecciones Python Intermedio"}
                {selectedModule === "avanzado" && "Lecciones Python Avanzado"}
              </h2>
              <button
                onClick={() => setSelectedModule(null)}
                className={styles.backButton}
              >
                Volver a niveles
              </button>
            </div>

            <div className={styles.coursesGrid}>
              {courses[selectedModule].map((course) => (
                <div key={course.id} className={styles.courseCard}>
                  <h3 className={styles.courseTitle}>{course.title}</h3>
                  <p className={styles.courseDescription}>{course.description}</p>
                  <div className={styles.actionsContainer}>
                    <button
                      className={styles.resourcesButton}
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowModal(true);
                      }}
                    >
                      Recursos
                    </button>
                    <button
                      className={`${styles.resourcesButton} ${styles.editButton}`}
                      onClick={() => {
                        setCourseToEdit(course);
                        setShowEditForm(true);
                      }}
                      title="Editar lección"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className={`${styles.resourcesButton} ${styles.deleteButton}`}
                      onClick={() => {
                        setCourseToDelete(course);
                        setShowDeleteModal(true);
                      }}
                      title="Eliminar lección"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {!showCourseForm && (
              <button
                onClick={() => setShowCourseForm(true)}
                className={styles.addButton}
              >
                <PlusCircle className={styles.addIcon} />
                Crear lección
              </button>
            )}
          </div>
        )}
      </main>

      {showCourseForm && (
        <FormularioCrearLeccion
          onClose={() => setShowCourseForm(false)}
          onSubmit={handleCreateCourse}
        />
      )}

      {showEditForm && courseToEdit && (
        <FormularioEditarLeccion
          course={courseToEdit}
          onClose={() => setShowEditForm(false)}
          onSubmit={handleEditCourse}
        />
      )}

      {/* Modal de Recursos con Opciones */}
      {showModal && selectedCourse && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={() => setShowModal(false)}>×</button>
            <h2>{selectedCourse.title} - Recursos</h2>
            
            {/* Lista de recursos existentes */}
            <div className={styles.resourcesList}>
              {selectedCourse.resources?.length > 0 ? (
                <ul>
                  {selectedCourse.resources.map((resource, index) => (
                    <li key={index} className={styles.resourceItem}>
                      {resource.type === "video" && <Video size={16} />}
                      {resource.type === "practica" && <CheckSquare size={16} />}
                      <span>{resource.title}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay recursos agregados aún.</p>
              )}
            </div>

            {/* Opciones para agregar nuevos recursos */}
            <div className={styles.optionsGrid}>
              {options.map((option, index) => (
                <div 
                  key={index} 
                  className={styles.optionCard}
                  onClick={() => handleOptionClick(option.actionType)}
                >
                  <div className={styles.optionIconContainer}>
                    {option.icon}
                  </div>
                  <h4>{option.title}</h4>
                  <p>{option.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal para Subir Video */}
      {showVideoModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={() => setShowVideoModal(false)}>×</button>
            <h2>Subir Video</h2>
            <div className={styles.formGroup}>
              <label>Título del Video</label>
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Ej: Introducción a Python"
              />
            </div>
            <div className={styles.formGroup}>
              <label>URL del Video</label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className={styles.modalActions}>
              <button 
                className={`${styles.modalButton} ${styles.cancelButton}`}
                onClick={() => setShowVideoModal(false)}
              >
                Cancelar
              </button>
              <button 
                className={`${styles.modalButton} ${styles.confirmButton}`}
                onClick={handleCrearVideo}
              >
                Subir Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Crear Práctica */}
      {showPracticaModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={() => setShowPracticaModal(false)}>×</button>
            <h2>Crear Práctica</h2>
            <div className={styles.formGroup}>
              <label>Nombre de la práctica</label>
              <input
                type="text"
                value={practicaTitle}
                onChange={(e) => setPracticaTitle(e.target.value)}
                placeholder="Ej: Práctica en Python n.1"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Instrucciones</label>
              <textarea
                value={practicaDesc}
                onChange={(e) => setPracticaDesc(e.target.value)}
                placeholder="Ej: Crea una variable llamada 'mensaje'..."
              />
            </div>
            <div className={styles.formGroup}>
              <label>Respuesta esperada (opcional)</label>
              <textarea
                value={practicaCode}
                onChange={(e) => setPracticaCode(e.target.value)}
                placeholder="mensaje = 'Hola Python'"
              />
            </div>
            <div className={styles.modalActions}>
              <button 
                className={`${styles.modalButton} ${styles.cancelButton}`}
                onClick={() => setShowPracticaModal(false)}
              >
                Cancelar
              </button>
              <button 
                className={`${styles.modalButton} ${styles.confirmButton}`}
                onClick={handleCrearPractica}
              >
                Crear Práctica
              </button>
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
              <button 
                className={`${styles.modalButton} ${styles.cancelButton}`}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button 
                className={`${styles.modalButton} ${styles.confirmButton}`}
                onClick={handleDeleteCourse}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionCurso;