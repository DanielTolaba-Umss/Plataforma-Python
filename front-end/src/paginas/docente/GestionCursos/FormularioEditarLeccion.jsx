import React, { useState } from "react";

const FormularioEditarLeccion = ({ course, onClose, onSubmit }) => {
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: course.id,
      title,
      description
    });
  };

  // Estilos en línea
  const styles = {
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      width: '90%',
      maxWidth: '500px',
      position: 'relative',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    closeButton: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: 'none',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      color: '#666',
    },
    formGroup: {
      marginBottom: '16px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '500',
      color: '#333',
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '16px',
      boxSizing: 'border-box',
    },
    textarea: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '16px',
      minHeight: '100px',
      resize: 'vertical',
      boxSizing: 'border-box',
    },
    formActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px',
      marginTop: '20px',
    },
    button: {
      padding: '10px 16px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      border: 'none',
      transition: 'background-color 0.2s',
    },
    cancelButton: {
      backgroundColor: '#e2e8f0',
      color: '#333',
    },
    submitButton: {
      backgroundColor: '#4299e1',
      color: 'white',
    },
    buttonHover: {
      cancelButton: {
        backgroundColor: '#cbd5e0',
      },
      submitButton: {
        backgroundColor: '#3182ce',
      },
    },
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <button 
          style={styles.closeButton} 
          onClick={onClose}
          onMouseOver={(e) => e.currentTarget.style.color = '#333'}
          onMouseOut={(e) => e.currentTarget.style.color = '#666'}
        >
          ×
        </button>
        <h2 style={{ marginBottom: '20px', color: '#2d3748' }}>Editar Lección</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Título:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Descripción:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={styles.textarea}
            />
          </div>
          <div style={styles.formActions}>
            <button 
              type="button" 
              style={{ ...styles.button, ...styles.cancelButton }}
              onClick={onClose}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.cancelButton.backgroundColor}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.cancelButton.backgroundColor}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              style={{ ...styles.button, ...styles.submitButton }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.submitButton.backgroundColor}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.submitButton.backgroundColor}
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioEditarLeccion;