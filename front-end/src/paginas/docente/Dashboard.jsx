import { useState } from "react";
import './estilos/Dashboard.module.css';
// Datos de resumen
const summaryData = [
  { label: "Estudiantes", value: 120 },
  { label: "Cursos", value: 8 },
  { label: "Certificados", value: 25 },
  { label: "Reporte de Actividades", value: "Ver" },
];

// Datos de prácticas
const practices = [
  { module: "Introducción a Python", progress: 75 },
  { module: "Estructuras de Datos", progress: 50 },
  { module: "Funciones", progress: 30 },
];

// Datos detallados de prácticas (simulados)
const practiceDetails = {
  "Introducción a Python": [
    { student: "Ana García", status: "Completado", score: 95 },
    { student: "Carlos Mendez", status: "En progreso", score: 70 },
    { student: "Laura Torres", status: "Completado", score: 88 },
    { student: "Mario Ruiz", status: "No iniciado", score: 0 },
  ],
  "Estructuras de Datos": [
    { student: "Ana García", status: "En progreso", score: 60 },
    { student: "Carlos Mendez", status: "Completado", score: 82 },
    { student: "Laura Torres", status: "En progreso", score: 45 },
    { student: "Mario Ruiz", status: "No iniciado", score: 0 },
  ],
  "Funciones": [
    { student: "Ana García", status: "No iniciado", score: 0 },
    { student: "Carlos Mendez", status: "En progreso", score: 30 },
    { student: "Laura Torres", status: "No iniciado", score: 0 },
    { student: "Mario Ruiz", status: "No iniciado", score: 0 },
  ],
};

// Datos de exámenes
const exams = [
  { module: "Introducción a Python", completed: 20 },
  { module: "Estructuras de Datos", completed: 15 },
  { module: "Funciones", completed: 10 },
];

// Datos detallados de exámenes (simulados)
const examResults = {
  "Introducción a Python": [
    { student: "Ana García", score: 95, date: "15/04/2025" },
    { student: "Carlos Mendez", score: 88, date: "15/04/2025" },
    { student: "Laura Torres", score: 92, date: "16/04/2025" },
    { student: "Mario Ruiz", score: 75, date: "16/04/2025" },
  ],
  "Estructuras de Datos": [
    { student: "Ana García", score: 85, date: "20/04/2025" },
    { student: "Carlos Mendez", score: 90, date: "20/04/2025" },
    { student: "Laura Torres", score: 82, date: "21/04/2025" },
  ],
  "Funciones": [
    { student: "Carlos Mendez", score: 78, date: "25/04/2025" },
    { student: "Laura Torres", score: 80, date: "25/04/2025" },
  ],
};

// Componente Modal
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button 
            onClick={onClose}
            className="modal-close-button"
          >
            <svg className="modal-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          <button 
            onClick={onClose}
            className="modal-close-btn"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('summary');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);
  
  // Función para abrir modal de detalles de práctica
  const openPracticeDetails = (module) => {
    const details = practiceDetails[module];
    setModalTitle(`Detalles de Práctica: ${module}`);
    setModalContent(
      <div>
        <div className="modal-section">
          <h4 className="module-title">Progreso del módulo: {practices.find(p => p.module === module)?.progress}%</h4>
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill"
              style={{ width: `${practices.find(p => p.module === module)?.progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="table-container">
          <table className="data-table">
            <thead className="table-header">
              <tr>
                <th className="table-cell-header">Estudiante</th>
                <th className="table-cell-header">Estado</th>
                <th className="table-cell-header">Calificación</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {details.map((detail, index) => (
                <tr key={index}>
                  <td className="table-cell">{detail.student}</td>
                  <td className="table-cell">
                    <span className={`status-badge ${
                      detail.status === "Completado" 
                        ? "status-completed" 
                        : detail.status === "En progreso" 
                          ? "status-in-progress" 
                          : "status-not-started"
                    }`}>
                      {detail.status}
                    </span>
                  </td>
                  <td className="table-cell">{detail.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
    setModalOpen(true);
  };
  
  // Función para abrir modal de resultados de examen
  const openExamResults = (module) => {
    const results = examResults[module];
    setModalTitle(`Resultados de Examen: ${module}`);
    setModalContent(
      <div>
        <div className="modal-section">
          <h4 className="module-title">Total de estudiantes que completaron: {exams.find(e => e.module === module)?.completed}</h4>
        </div>
        
        <div className="table-container">
          <table className="data-table">
            <thead className="table-header">
              <tr>
                <th className="table-cell-header">Estudiante</th>
                <th className="table-cell-header">Calificación</th>
                <th className="table-cell-header">Fecha</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {results.map((result, index) => (
                <tr key={index}>
                  <td className="table-cell">{result.student}</td>
                  <td className="table-cell">
                    <span className={`score ${
                      result.score >= 90 
                        ? "score-high" 
                        : result.score >= 70 
                          ? "score-medium" 
                          : "score-low"
                    }`}>
                      {result.score}
                    </span>
                  </td>
                  <td className="table-cell-date">{result.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
    setModalOpen(true);
  };
  
  // Función para abrir modal de reporte de actividades
  const openActivityReport = () => {
    setModalTitle("Reporte de Actividades");
    setModalContent(
      <div>
        <div className="activity-summary">
          <h4 className="activity-title">Resumen de actividad por módulo</h4>
          
          {practices.map((practice, index) => (
            <div key={index} className="activity-item">
              <div className="activity-header">
                <p className="activity-module">{practice.module}</p>
                <span className="activity-progress">{practice.progress}% completado</span>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill"
                  style={{ width: `${practice.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="recent-activity">
          <h4 className="activity-title">Últimas actividades</h4>
          <ul className="activity-list">
            <li className="activity-list-item">
              <div>
                <p className="student-name">Laura Torres</p>
                <p className="activity-description">Completó el examen de Introducción a Python</p>
              </div>
              <span className="activity-time">Hace 2 días</span>
            </li>
            <li className="activity-list-item">
              <div>
                <p className="student-name">Carlos Mendez</p>
                <p className="activity-description">Inició la práctica de Funciones</p>
              </div>
              <span className="activity-time">Hace 3 días</span>
            </li>
            <li className="activity-list-item">
              <div>
                <p className="student-name">Ana García</p>
                <p className="activity-description">Completó la práctica de Estructuras de Datos</p>
              </div>
              <span className="activity-time">Hace 5 días</span>
            </li>
          </ul>
        </div>
      </div>
    );
    setModalOpen(true);
  };
  
  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard Docente</h1>
      
      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'summary' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          Resumen
        </button>
        <button 
          className={`tab ${activeTab === 'practices' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('practices')}
        >
          Prácticas
        </button>
        <button 
          className={`tab ${activeTab === 'exams' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('exams')}
        >
          Exámenes
        </button>
      </div>

      {/* Contenido de la pestaña de Resumen */}
      {activeTab === 'summary' && (
        <>
          <div className="summary-cards">
            {summaryData.map((item, index) => (
              <div key={index} className="summary-card">
                <p className="summary-label">{item.label}</p>
                <p className="summary-value">
                  {typeof item.value === "string" ? (
                    <button 
                      className="action-button"
                      onClick={() => item.label === "Reporte de Actividades" && openActivityReport()}
                    >
                      {item.value}
                    </button>
                  ) : (
                    item.value
                  )}
                </p>
              </div>
            ))}
          </div>

          <div className="summary-grid">
            <div className="summary-panel">
              <h2 className="panel-title">Prácticas y Actividades</h2>
              <div className="progress-items">
                {practices.map((item, index) => (
                  <div key={index} className="progress-item">
                    <div className="progress-header">
                      <p className="progress-module">{item.module}</p>
                      <span className="progress-percentage">{item.progress}%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div 
                        className="progress-bar-fill"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="summary-panel">
              <h2 className="panel-title">Exámenes del Módulo</h2>
              <div className="exam-items">
                {exams.map((item, index) => (
                  <div key={index} className="exam-item">
                    <p className="exam-module">{item.module}</p>
                    <span className="exam-completed">{item.completed} Completados</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Contenido de la pestaña de Prácticas */}
      {activeTab === 'practices' && (
        <div className="content-panel">
          <h2 className="panel-title-large">Todas las Prácticas y Actividades</h2>
          <div className="practices-list">
            {practices.map((item, index) => (
              <div key={index} className="practice-item">
                <div className="practice-header">
                  <div>
                    <h3 className="practice-title">{item.module}</h3>
                    <p className="practice-subtitle">Progreso total del módulo</p>
                  </div>
                  <span className="practice-percentage">{item.progress}%</span>
                </div>
                <div className="progress-bar-bg-large">
                  <div 
                    className="progress-bar-fill"
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
                <div className="practice-actions">
                  <button 
                    className="details-button"
                    onClick={() => openPracticeDetails(item.module)}
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contenido de la pestaña de Exámenes */}
      {activeTab === 'exams' && (
        <div className="content-panel">
          <h2 className="panel-title-large">Todos los Exámenes</h2>
          <div className="exams-list">
            {exams.map((item, index) => (
              <div key={index} className="exam-card">
                <div className="exam-card-content">
                  <div>
                    <h3 className="exam-card-title">{item.module}</h3>
                    <p className="exam-card-subtitle">{item.completed} estudiantes han completado</p>
                  </div>
                  <button 
                    className="results-button"
                    onClick={() => openExamResults(item.module)}
                  >
                    Ver resultados
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Modal para detalles o resultados */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
      >
        {modalContent}
      </Modal>
    </div>
  );
}