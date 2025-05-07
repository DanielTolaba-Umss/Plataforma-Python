// src/components/ui/SuccessModal.jsx
import React from "react";
import "/src/estilos/SuccessModal.css";

const SuccessModal = ({ message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content success">
        <h2>¡Éxito!</h2>
        <p>{message}</p>
        <button onClick={onClose} className="modal-btn">
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
