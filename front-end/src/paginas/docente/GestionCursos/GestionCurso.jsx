import React, { useState, useEffect } from "react";
import { BookOpen, Pencil, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cursosAPI } from "../../../api/courseService";
import styles from "/src/paginas/docente/estilos/GestionCurso.module.css";

const GestionCurso = () => {
  const navigate = useNavigate();

  const [niveles, setNiveles] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoNivel, setNuevoNivel] = useState({ title: "", description: "" });
  const [nivelToEdit, setNivelToEdit] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [nivelToDelete, setNivelToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchNiveles = async () => {
      try {
        const response = await cursosAPI.obtenerTodos();
        if (response.status !== 200)
          throw new Error("Error en la respuesta del servidor");

        const nivelesMapeados = response.data.map((nivel) => ({
          id: nivel.id,
          nombre: nivel.title || "Sin título",
          descripcion: nivel.description || "Sin descripción",
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
    fetchNiveles();
  }, []);

  const showNotification = (message, type) => {
    alert(`${type.toUpperCase()}: ${message}`);
  };

  const handleModuleSelect = (nivelId) => {
    localStorage.setItem("nivelId", nivelId); // ✅ Guardar nivelId
    navigate(`/gestion-curso/lecciones/${nivelId}`); // Navega igual
  };

  const handleCreateNivel = async () => {
    try {
      if (!nuevoNivel.title.trim()) {
        showNotification("El título es obligatorio", "error");
        return;
      }

      const response = await cursosAPI.crear(nuevoNivel);

      const createdNivel = {
        id: response.data.id,
        nombre: response.data.title,
        descripcion: response.data.description,
        color: styles.blueIcon,
        slug: response.data.title.toLowerCase().replace(/\s+/g, "-"),
      };

      setNiveles((prev) => [...prev, createdNivel]);
      setNuevoNivel({ title: "", description: "" });
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
    });
    setShowEditForm(true);
  };

  const handleGuardarEdicionNivel = async () => {
    try {
      const datosActualizados = {
        title: nivelToEdit.title,
        description: nivelToEdit.description,
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
    </div>
  );
};

export default GestionCurso;
