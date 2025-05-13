import React from "react";
import { X } from "lucide-react";
import styles from "/src/paginas/docente/estilos/FormularioCrearCurso.module.css";

const FormularioCrearLeccion = ({ onClose, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newCourse = {
      id: Date.now(),
      title: formData.get("title"),
      description: formData.get("description"),
      lessons: parseInt(formData.get("lessons")),
    };
    onSubmit(newCourse);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Crear Nueva Leccion</h3>
          <button onClick={onClose} className={styles.closeButton}>
            <X className={styles.closeIcon} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Título de la lección
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className={styles.input}
              placeholder="Ej: Estructuras de control"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              required
              className={styles.textarea}
              placeholder="Breve descripción de la lección..."
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Crear lección
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormularioCrearLeccion;
