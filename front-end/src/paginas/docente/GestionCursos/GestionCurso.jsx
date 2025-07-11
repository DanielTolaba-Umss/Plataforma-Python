import React, { useState, useEffect } from "react";
import { BookOpen, Pencil, Trash2, Plus, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cursosAPI } from "../../../api/courseService";
import AsignarEstudiantesModal from "../../../componentes/especificos/AsignarEstudiantesModal";
import styles from "/src/paginas/docente/estilos/GestionCurso.module.css";

const GestionCurso = () => {
  const teacher = JSON.parse(localStorage.getItem("user"));
  console.log("Docente actual:", teacher);
  const teacherId = teacher?.id; 
  const navigate = useNavigate();

  const [niveles, setNiveles] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoNivel, setNuevoNivel] = useState({
    title: "",
    description: "",
    level: "",
  });
  const [nivelToEdit, setNivelToEdit] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [nivelToDelete, setNivelToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [cursoParaAsignar, setCursoParaAsignar] = useState(null);

  useEffect(() => {
    const fetchNiveles = async () => {
      try {
        const response = await cursosAPI.obtenerPorDocenteId(teacherId);
        if (response.status !== 200)
          throw new Error("Error en la respuesta del servidor");

        const nivelesMapeados = response.data.map((nivel) => ({
          id: nivel.id,
          nombre: nivel.title || "Sin título",
          descripcion: nivel.description || "Sin descripción",
          level: nivel.level || "Sin nivel", // Agregado el level
          color: styles.blueIcon,
          slug: (nivel.title || "").toLowerCase().replace(/\s+/g, "-"),
        }));

        setNiveles(nivelesMapeados);
      } catch (error) {
        console.error("Error al cargar niveles:", error);
        showNotification(
          "Error al cargar niveles: " +
            (error.response?.data?.message || error.message),
          "error"
        );
      }
    };
    
    if (teacherId) {
      fetchNiveles();
    }
  }, [teacherId]);

  const handleModuleSelect = (nivelId) => {
    const nivelSeleccionado = niveles.find((n) => n.id === nivelId);
    if (nivelSeleccionado) {
      localStorage.setItem("nivelId", nivelId);
      localStorage.setItem("nivelLevel", nivelSeleccionado.level);
      console.log("Nivel seleccionado:", nivelId);
      navigate(`/gestion-curso/lecciones/${nivelId}`);
    }
  };

  const handleCreateNivel = async () => {
    try {
      if (!nuevoNivel.title.trim()) {
        showNotification("El título es obligatorio", "error");
        return;
      }
      if (!nuevoNivel.level.trim()) {
        showNotification("El nivel es obligatorio", "error");
        return;
      }

      const response = await cursosAPI.crearPorDocente(teacherId,nuevoNivel);

      const createdNivel = {
        id: response.data.id,
        nombre: response.data.title,
        descripcion: response.data.description,
        level: response.data.level, // Agregado el level
        color: styles.blueIcon,
        slug: response.data.title.toLowerCase().replace(/\s+/g, "-"),
      };

      setNiveles((prev) => [...prev, createdNivel]);
      setNuevoNivel({ title: "", description: "", level: "" });
      setMostrarModal(false);
      showNotification("Nivel creado con éxito", "success");
    } catch (error) {
      console.error("Error al crear nivel:", error);
      showNotification(
        error.response?.data?.message || "Error al crear nivel",
        "error"
      );
    }
  };

  const handleEditarNivel = (nivelId) => {
    const nivel = niveles.find((n) => n.id === nivelId);
    setNivelToEdit({
      ...nivel,
      title: nivel.nombre,
      description: nivel.descripcion,
      level: nivel.level, // Agregado el level
    });
    setShowEditForm(true);
  };

  const handleGuardarEdicionNivel = async () => {
    try {
      const datosActualizados = {
        title: nivelToEdit.title,
        description: nivelToEdit.description,
        level: nivelToEdit.level, // Agregado el level
      };

      const response = await cursosAPI.actualizar(
        nivelToEdit.id,
        datosActualizados
      );

      setNiveles((prev) =>
        prev.map((n) =>
          n.id === nivelToEdit.id
            ? {
                ...n,
                nombre: response.data.title,
                descripcion: response.data.description,
                level: response.data.level, // Agregado el level
                slug: response.data.title.toLowerCase().replace(/\s+/g, "-"),
              }
            : n
        )
      );

      setShowEditForm(false);
      setNivelToEdit(null);
      showNotification("Nivel actualizado con éxito", "success");
    } catch (error) {
      console.error("Error al actualizar nivel:", error);
      showNotification(
        error.response?.data?.message || "Error al actualizar nivel",
        "error"
      );
    }
  };

  const handleEliminarNivel = (nivelId) => {
    setNivelToDelete(niveles.find((n) => n.id === nivelId));
    setShowDeleteModal(true);
  };

  const handleDeleteNivel = async () => {
    try {
      await cursosAPI.eliminar(nivelToDelete.id);
      setNiveles((prev) => prev.filter((n) => n.id !== nivelToDelete.id));
      setShowDeleteModal(false);
      setNivelToDelete(null);
      showNotification("Nivel eliminado con éxito", "success");
    } catch (error) {
      console.error("Error al eliminar nivel:", error);
      showNotification("Error al eliminar nivel", "error");
    }
  };

  const handleAsignarEstudiantes = (curso) => {
    setCursoParaAsignar(curso);
    setShowAssignModal(true);
  };

  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    setCursoParaAsignar(null);
  };

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

  const getInitials = (name, lastName) => {
    const getFirstLetter = (str) => {
      return str && str.trim() ? str.trim().split(' ')[0].charAt(0).toUpperCase() : '';
    };
    
    const firstInitial = getFirstLetter(name);
    const lastInitial = getFirstLetter(lastName);
    return firstInitial + lastInitial;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className="container py-3 d-flex justify-content-between align-items-center">
          <h1
            className="fw-bold text-dark mb-4"
            style={{ fontSize: "1.875rem" }}
          >
            Niveles{" "}
          </h1>
          <div className="admin-profile d-flex align-items-center gap-2">
            <span className="fw-semibold">Docente: {teacher.name} {teacher.lastName}</span>
            <div
              className="admin-avatar bg-success text-white rounded-circle d-flex justify-content-center align-items-center"
              style={{ width: "40px", height: "40px" }}
            >
              {getInitials(teacher.name, teacher.lastName)}
            </div>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.subtitleWithButton}>
          <h2 className={styles.subtitle}>Selecciona un nivel</h2>
        </div>

        <div className={styles.modulesGrid}>
          {niveles.map((nivel) => (
            <div key={nivel.id} className={styles.moduleCard}>
              <div
                className={styles.moduleClickable}
                onClick={() => handleModuleSelect(nivel.id)}
              >
                <div className={styles.moduleIconContainer}>
                  <BookOpen className={`${styles.moduleIcon} ${nivel.color}`} />
                </div>
                <h3 className={styles.moduleTitle}>{nivel.nombre}</h3>
                <p className={styles.moduleDescription}>{nivel.descripcion}</p>
                <div className={styles.moduleLevel}>
                  <span className={styles.levelBadge}>{nivel.level}</span>
                </div>
              </div>
              <div className={styles.moduleActions}>
                <button
                  className={styles.editButton}
                  onClick={() => handleEditarNivel(nivel.id)}
                >
                  <Pencil size={18} />
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleEliminarNivel(nivel.id)}
                >
                  <Trash2 size={18} />
                </button>
                <button
                  className={styles.assignButton}
                  onClick={() => handleAsignarEstudiantes(nivel)}
                >
                  <Users size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <button
        className={styles.floatingButton}
        onClick={() => setMostrarModal(true)}
      >
        <Plus />
      </button>

      {/* Modal de creación */}
      {mostrarModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Crear nuevo nivel</h3>
            <input
              type="text"
              placeholder="Título"
              className={styles.modalInput}
              value={nuevoNivel.title}
              onChange={(e) =>
                setNuevoNivel({ ...nuevoNivel, title: e.target.value })
              }
            />
            <textarea
              placeholder="Descripción"
              className={styles.modalTextarea}
              value={nuevoNivel.description}
              onChange={(e) =>
                setNuevoNivel({ ...nuevoNivel, description: e.target.value })
              }
            ></textarea>
            {/* Campo Level agregado */}
            <select
              className={styles.modalInput}
              value={nuevoNivel.level}
              onChange={(e) =>
                setNuevoNivel({ ...nuevoNivel, level: e.target.value })
              }
            >
              <option value="">Selecciona un nivel</option>
              <option value="basico">Básico</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
            <div className={styles.modalButtons}>
              <button
                className={styles.modalConfirm}
                onClick={handleCreateNivel}
              >
                Crear
              </button>
              <button
                className={styles.modalCancel}
                onClick={() => setMostrarModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {showEditForm && nivelToEdit && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Editar Nivel</h3>
            <input
              type="text"
              placeholder="Título"
              className={styles.modalInput}
              value={nivelToEdit.title}
              onChange={(e) =>
                setNivelToEdit({ ...nivelToEdit, title: e.target.value })
              }
            />
            <textarea
              placeholder="Descripción"
              className={styles.modalTextarea}
              value={nivelToEdit.description}
              onChange={(e) =>
                setNivelToEdit({ ...nivelToEdit, description: e.target.value })
              }
            ></textarea>
            {/* Campo Level agregado */}
            <select
              className={styles.modalInput}
              value={nivelToEdit.level}
              onChange={(e) =>
                setNivelToEdit({ ...nivelToEdit, level: e.target.value })
              }
            >
              <option value="">Selecciona un nivel</option>
              <option value="basico">Básico</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
            <div className={styles.modalButtons}>
              <button
                className={styles.modalConfirm}
                onClick={handleGuardarEdicionNivel}
              >
                Guardar
              </button>
              <button
                className={styles.modalCancel}
                onClick={() => setShowEditForm(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Confirmar eliminación</h2>
            <p>¿Estás seguro que deseas eliminar este nivel?</p>
            <div className={styles.modalButtons}>
              <button
                className={styles.modalConfirm}
                onClick={handleDeleteNivel}
              >
                Eliminar
              </button>
              <button
                className={styles.modalCancel}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de asignación de estudiantes */}
      {showAssignModal && cursoParaAsignar && (
        <AsignarEstudiantesModal
          isOpen={showAssignModal}
          cursoId={cursoParaAsignar.id}
          cursoNombre={cursoParaAsignar.nombre}
          onClose={handleCloseAssignModal}
        />
      )}
    </div>
  );
};

export default GestionCurso;
