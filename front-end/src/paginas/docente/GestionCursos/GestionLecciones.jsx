// Archivo: GestionLecciones.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Plus } from "lucide-react";
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
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const nivelId = localStorage.getItem("nivelId");
  useEffect(() => {
    const fetchLecciones = async () => {
      try {
        const response = await leccionesAPI.obtenerTodas();
        if (response.status !== 200)
          throw new Error("Error en la respuesta del servidor");

        const leccionesFiltradas = response.data.filter((leccion) => ({
          id: leccion.id,
          nombre: leccion.titulo || "Sin titulo",
          descripcion: leccion.description || "Sin description",
          color: styles.blueIcon,
          slug: (leccion.title || "").toLowerCase().replace(/\s+/g, "-"),
        }));

        setLecciones(leccionesFiltradas);
      } catch (error) {
        onsole.error("Error al cargar lecciones:", error);
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
  const handleCreateLeccion = async (leccionData) => {
    try {
      const response = await leccionesAPI.crear(leccionData);
      setLecciones((prev) => [
        ...prev,
        {
          id: response.data.leccion_id,
          title: response.data.titulo,
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
    console.log("Datos recibidos en crear lección:", leccionData);
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

      // Actualiza el estado de las lecciones con los nuevos datos
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

  // Resto de tus funciones auxiliares (validateInputs, validatePractica, etc.)

  return (
    <div className={styles.coursesContainer}>
      {notification.show && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}

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
          <div key={leccion.id} className={styles.courseCard}>
            <h3 className={styles.courseTitle}>{leccion.title}</h3>
            <p className={styles.courseDescription}>{leccion.description}</p>
            <div className={styles.actionsContainer}>
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
              ¿Estás seguro que deseas eliminar la lección
              {handleDeleteLeccion?.title}"?
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
    </div>
  );
};

export default GestionLecciones;
