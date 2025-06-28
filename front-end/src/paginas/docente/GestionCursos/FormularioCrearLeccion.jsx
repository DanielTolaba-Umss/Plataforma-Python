import React, { useState } from "react";
import { X } from "lucide-react";
// import { useParams } from "react-router-dom";
import styles from "/src/paginas/docente/estilos/FormularioCrearCurso.module.css";

const FormularioCrearLeccion = ({ onClose, onSubmit, cursoId}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  //   const courseId  = useParams();

  // ✅ Obtener el ID del nivel guardado
  const nivelId = cursoId
  console.log("ID del curso:", nivelId);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nivelId || isNaN(parseInt(nivelId))) {
      console.error("ID del curso no válido:", nivelId);
      showNotification(
        "Error: ID del curso no válido. Intenta ingresar desde la pantalla anterior.",
        "error"
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
