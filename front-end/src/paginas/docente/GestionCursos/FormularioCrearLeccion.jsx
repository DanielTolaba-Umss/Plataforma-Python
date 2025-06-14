import React, { useState } from "react";
import { X } from "lucide-react";
// import { useParams } from "react-router-dom";
import styles from "/src/paginas/docente/estilos/FormularioCrearCurso.module.css";

const FormularioCrearLeccion = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  //   const courseId  = useParams();

  // ✅ Obtener el ID del nivel guardado
  const nivelId = localStorage.getItem("nivelId");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nivelId || isNaN(parseInt(nivelId))) {
      alert(
        "Error: ID del curso no válido. Intenta ingresar desde la pantalla anterior.",
      );
      return;
    }

    const leccionData = {
      title,
      description,
      courseId: parseInt(nivelId), // ✅ Este es el campo que espera el backend
      quizId: null,
      practiceId: null,
    };

    onSubmit(leccionData);
    onClose();
  };
  //   const handleSubmit = (e) => {
  //     e.preventDefault();
  //     const leccionData = {
  //       title,
  //       description,
  //       curso_Id: parseInt(courseId),
  //       quizId: null,
  //       practiceId: null,
  //     };
  //     onSubmit(leccionData);
  //     onClose();
  //   };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Crear Nueva Lección</h3>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
          >
            <X className={styles.closeIcon} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="titulo" className={styles.label}>
              Título de la lección
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
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
