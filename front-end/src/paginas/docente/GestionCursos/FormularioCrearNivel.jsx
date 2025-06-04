import React from "react";
import { X } from "lucide-react";
import styles from "/src/paginas/docente/estilos/FormularioCrearCurso.module.css";

const FormularioCrearNivel = ({ onClose, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newLevel = {
      name: formData.get("name"),
      description: formData.get("description"),
      level: formData.get("level"),
    };
    onSubmit(newLevel);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Crear Nuevo Nivel</h3>
          <button onClick={onClose} className={styles.closeButton}>
            <X className={styles.closeIcon} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Nombre del nivel
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className={styles.input}
              placeholder="Ej: Principiante en python"
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
              placeholder="Breve descripción del nivel..."
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="level" className={styles.label}>
              Nivel del curso
            </label>
            <select id="level" name="level" required className={styles.input}>
              <option value="">Selecciona un nivel</option>
              <option value="basico">Básico</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </div>

          <button type="submit" className={styles.submitButton}>
            Crear nivel
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormularioCrearNivel;
