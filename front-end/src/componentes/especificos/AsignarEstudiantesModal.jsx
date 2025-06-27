import React, { useState, useEffect, useCallback } from "react";
import { X, Users } from "lucide-react";
import { cursosAPI } from "../../api/cursos";
import styles from "./AsignarEstudiantesModal.module.css";

const AsignarEstudiantesModal = ({ isOpen, onClose, cursoId, cursoNombre }) => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudiantesSeleccionados, setEstudiantesSeleccionados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [asignando, setAsignando] = useState(false);
  const [error, setError] = useState(null);

  const cargarEstudiantesNoAsignados = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await cursosAPI.obtenerEstudiantesNoAsignados(cursoId);
      setEstudiantes(response.data);
    } catch (error) {
      console.error("Error al cargar estudiantes no asignados:", error);
      setError("Error al cargar la lista de estudiantes");
    } finally {
      setLoading(false);
    }
  }, [cursoId]);

  useEffect(() => {
    if (isOpen && cursoId) {
      cargarEstudiantesNoAsignados();
    }
  }, [isOpen, cursoId, cargarEstudiantesNoAsignados]);

  const handleEstudianteChange = (estudianteId) => {
    setEstudiantesSeleccionados(prev => {
      if (prev.includes(estudianteId)) {
        return prev.filter(id => id !== estudianteId);
      } else {
        return [...prev, estudianteId];
      }
    });
  };

  const handleAsignarEstudiantes = async () => {
    if (estudiantesSeleccionados.length === 0) {
      setError("Debes seleccionar al menos un estudiante");
      return;
    }

    setAsignando(true);
    setError(null);
    try {
      await cursosAPI.asignarEstudiantes(cursoId, estudiantesSeleccionados);
      // Recargar la lista para mostrar solo los no asignados
      await cargarEstudiantesNoAsignados();
      setEstudiantesSeleccionados([]);
      // Mostrar mensaje de éxito
      alert(`Se asignaron ${estudiantesSeleccionados.length} estudiantes al curso exitosamente`);
    } catch (error) {
      console.error("Error al asignar estudiantes:", error);
      if (error.response?.status === 403) {
        setError("No tienes permisos para asignar estudiantes a este curso");
      } else {
        setError("Error al asignar estudiantes al curso");
      }
    } finally {
      setAsignando(false);
    }
  };

  const handleClose = () => {
    setEstudiantesSeleccionados([]);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <Users size={24} />
            Asignar Estudiantes
          </h2>
          <button 
            className={styles.closeButton}
            onClick={handleClose}
          >
            <X size={24} />
          </button>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.cursoInfo}>
            <p><strong>Curso:</strong> {cursoNombre}</p>
            <p className={styles.subtitle}>
              Selecciona los estudiantes que deseas asignar a este curso
            </p>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          {loading ? (
            <div className={styles.loading}>
              Cargando estudiantes...
            </div>
          ) : (
            <>
              {estudiantes.length === 0 ? (
                <div className={styles.noStudents}>
                  <p>No hay estudiantes disponibles para asignar a este curso.</p>
                  <p className={styles.subtitle}>Todos los estudiantes ya están asignados.</p>
                </div>
              ) : (
                <div className={styles.estudiantesList}>
                  {estudiantes.map((estudiante) => (
                    <div key={estudiante.id} className={styles.estudianteItem}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={estudiantesSeleccionados.includes(estudiante.id)}
                          onChange={() => handleEstudianteChange(estudiante.id)}
                          className={styles.checkbox}
                        />
                        <div className={styles.estudianteInfo}>
                          <span className={styles.estudianteNombre}>
                            {estudiante.nombres} {estudiante.apellidos}
                          </span>
                          <span className={styles.estudianteEmail}>
                            {estudiante.email}
                          </span>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className={styles.modalActions}>
          <button 
            className={styles.cancelButton}
            onClick={handleClose}
            disabled={asignando}
          >
            Cancelar
          </button>
          <button 
            className={styles.assignButton}
            onClick={handleAsignarEstudiantes}
            disabled={asignando || estudiantesSeleccionados.length === 0 || estudiantes.length === 0}
          >
            {asignando ? 'Asignando...' : `Asignar ${estudiantesSeleccionados.length} estudiante${estudiantesSeleccionados.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AsignarEstudiantesModal;
