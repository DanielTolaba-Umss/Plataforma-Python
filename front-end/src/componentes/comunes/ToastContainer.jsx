import React from 'react';
import Toast from './Toast';
import './Toast.css';

const ToastContainer = ({ toasts, onClose }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      top: '20px', 
      right: '20px', 
      zIndex: 10001,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      pointerEvents: 'none'
    }}>
      {toasts.map((toast) => (
        <div key={toast.id} style={{ pointerEvents: 'auto' }}>
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => onClose(toast.id)}
            style={{ 
              position: 'relative',
              top: 'auto',
              right: 'auto'
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
