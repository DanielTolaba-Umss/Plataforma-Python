import React from "react";
import "/src/estilos/Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard Admin</h2>
        <div className="admin-profile">
          <span>Admin</span>
          <div className="admin-avatar">AD</div>
        </div>
      </div>

      <div className="dashboard-cards">
        <div className="card modulo">
          <div className="icon-container">📘</div>
          <div className="card-info">
            <span className="card-title">Total Módulos</span>
            <span className="card-value">12</span>
          </div>
        </div>

        <div className="card docente">
          <div className="icon-container">👥</div>
          <div className="card-info">
            <span className="card-title">Total Docentes</span>
            <span className="card-value">24</span>
          </div>
        </div>

        <div className="card estudiante">
          <div className="icon-container">🎓</div>
          <div className="card-info">
            <span className="card-title">Total Estudiantes</span>
            <span className="card-value">156</span>
          </div>
        </div>

        <div className="card curso">
          <div className="icon-container">📈</div>
          <div className="card-info">
            <span className="card-title">Cursos Activos</span>
            <span className="card-value">8</span>
          </div>
        </div>
      </div>

      <div className="dashboard-body">
        <div className="recent-activity">
          <h3>Actividad Reciente</h3>
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="activity-item">
              <div>
                <strong>Nuevo estudiante registrado</strong>
                <p>Hace 2 horas</p>
              </div>
              <span className="tag">Estudiantes</span>
            </div>
          ))}
        </div>

        <div className="popular-modules">
          <h3>Módulos Populares</h3>
          <div className="module-item">
            <span className="rank">1</span>
            <span className="name">Python Básico</span>
            <span className="count">50 estudiantes</span>
          </div>
          <div className="module-item">
            <span className="rank">2</span>
            <span className="name">Python Intermedio</span>
            <span className="count">17 estudiantes</span>
          </div>
          <div className="module-item">
            <span className="rank">3</span>
            <span className="name">Django Framework</span>
            <span className="count">36 estudiantes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
