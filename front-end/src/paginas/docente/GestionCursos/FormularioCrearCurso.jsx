import React from "react";
import { X } from "lucide-react";
import styles from "/src/paginas/docente/estilos/FormularioCrearCurso.module.css";

const FormularioCrearCurso = ({ onClose, onSubmit }) => {
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
          <h3 className={styles.modalTitle}>Crear Nuevo Curso</h3>
          <button onClick={onClose} className={styles.closeButton}>
            <X className={styles.closeIcon} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Título del Curso
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className={styles.input}
              placeholder="Ej: Fundamentos de Python"
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
              placeholder="Breve descripción del curso..."
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lessons" className={styles.label}>
              Número de Lecciones
            </label>
            <input
              type="number"
              id="lessons"
              name="lessons"
              min="1"
              required
              className={styles.input}
              placeholder="Ej: 10"
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Crear Curso
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormularioCrearCurso;
