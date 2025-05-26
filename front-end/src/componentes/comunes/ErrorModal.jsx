// src/components/ui/ErrorModal.jsx
import React from "react";
import "/src/estilos/ErrorModal.css";

const ErrorModal = ({ message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content error">
        <h2>Error</h2>
        <p>{message}</p>
        <button onClick={onClose} className="modal-btn">
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
