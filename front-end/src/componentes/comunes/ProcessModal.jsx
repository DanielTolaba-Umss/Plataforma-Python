import React from "react";
import "/src/componentes/styles/ProcessModal.css";

const ProcessModal = ({
  isOpen,
  mensaje = "Procesando, por favor espere...",
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-proceso-overlay">
      <div className="modal-proceso">
        <div className="spinner-proceso"></div>
        <p className="mensaje-proceso">{mensaje}</p>
      </div>
    </div>
  );
};

export default ProcessModal;
