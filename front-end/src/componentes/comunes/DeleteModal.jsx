import React from "react";
import "/src/estilos/DeleteModal.css";

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="delete-modal__overlay">
      <div className="delete-modal__content">
        <div className="delete-modal__header">
          <h3>Confirmar eliminación</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <p>
          ¿Está seguro que desea eliminar este módulo? Esta acción no se puede
          deshacer.
        </p>
        <div className="delete-modal__actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancelar
          </button>
          <button className="delete-btn" onClick={onConfirm}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
