import React from "react";
import "/src/componentes/styles/LoadingModal.css";

const LoadingModal = ({
  isOpen,
  mensaje = "Cargando datos, por favor espere...",
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-cargando-overlay">
      <div className="modal-cargando">
        <div className="spinner"></div>
        <p className="mensaje-cargando">{mensaje}</p>
      </div>
    </div>
  );
};

export default LoadingModal;
