import React, { useState } from "react";

const FormularioEditarLeccion = ({ leccion, onClose, onSubmit }) => {
  const [title, setTitle] = useState(leccion.title);
  const [description, setDescription] = useState(leccion.description);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: leccion.id,
      title,
      description,
    });
  };

  const styles = {
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "8px",
      width: "90%",
      maxWidth: "500px",
      position: "relative",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      borderTop: "4px solid #ffd438",
    },
    closeButton: {
      position: "absolute",
      top: "10px",
      right: "10px",
      background: "none",
      border: "none",
      fontSize: "20px",
      cursor: "pointer",
      color: "#666",
    },
    formGroup: {
      marginBottom: "16px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "500",
      color: "#333",
    },
    input: {
      width: "100%",
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: "16px",
      boxSizing: "border-box",
    },
    textarea: {
      width: "100%",
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: "16px",
      minHeight: "100px",
      resize: "vertical",
      boxSizing: "border-box",
    },
    formActions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "10px",
      marginTop: "20px",
    },
    button: {
      padding: "10px 16px",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      border: "none",
      transition: "background-color 0.2s",
    },
    cancelButton: {
      backgroundColor: "#ffd438",
      color: "#300898",
      fontWeight: 600,
      padding: "0.6rem 1.2rem",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },

    submitButton: {
      backgroundColor: "#306998",
      color: "white",
      fontWeight: 600,
      padding: "0.6rem 1.2rem",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    buttonHover: {
      cancelButton: {
        backgroundColor: "#e6c231",
      },
      submitButton: {
        backgroundColor: "#300898",
      },
    },
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2 style={{ marginBottom: "20px", color: "#2d3748" }}>
          Editar Lección
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Título:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Descripción:</label>
            <textarea
              id="description"
              value={description}
              row={3}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={styles.textarea}
            />
          </div>
          <div style={styles.formActions}>
            <button
              type="submit"
              style={{ ...styles.button, ...styles.submitButton }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor =
                  styles.buttonHover.submitButton.backgroundColor)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor =
                  styles.submitButton.backgroundColor)
              }
            >
              Guardar
            </button>
            <button
              type="button"
              style={{ ...styles.button, ...styles.cancelButton }}
              onClick={onClose}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor =
                  styles.buttonHover.cancelButton.backgroundColor)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor =
                  styles.cancelButton.backgroundColor)
              }
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioEditarLeccion;
