import React from "react";
import "/src/paginas/estudiante/estilos/Dashboard.css";
import {
  BookOpen,
  CheckCircle,
  Award,
  LineChart,
  User,
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h2>Mi Progreso</h2>
      <p className="welcome-text">
        ¡Bienvenido de vuelta, Ana! Continúa aprendiendo.
      </p>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon green">
            <BookOpen size={24} />
          </div>
          <div>
            <h3>Básico</h3>
            <p>Nivel Actual</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon light-green">
            <CheckCircle size={24} />
          </div>
          <div>
            <h3>2</h3>
            <p>Lecciones Completadas</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <Award size={24} />
          </div>
          <div>
            <h3>1</h3>
            <p>Certificaciones</p>
          </div>
        </div>
      </div>

      <div className="course-progress">
        <h3>Progreso de lecciones</h3>
        <div className="progress-item">
          <span>Variables</span>
          <div className="progress-bar">
            <div className="filled" style={{ width: "75%" }}></div>
          </div>
          <span className="percentage">75%</span>
        </div>
        <div className="progress-item">
          <span>Tipos de datos</span>
          <div className="progress-bar">
            <div className="filled" style={{ width: "45%" }}></div>
          </div>
          <span className="percentage">45%</span>
        </div>
        <div className="progress-item">
          <span>Operadores</span>
          <div className="progress-bar">
            <div className="filled" style={{ width: "20%" }}></div>
          </div>
          <span className="percentage">20%</span>
        </div>
      </div>

      <div className="dashboard-activity">
        <div className="activity-card">
          <h4>Actividad Reciente</h4>
          <ul>
            <li>
              <CheckCircle size={16} className="icon done" /> Completaste la
              lección "Variables" <span>Hace 2 días</span>
            </li>
            <li>
              <LineChart size={16} className="icon progress" /> Progreso en
              "Tipos de datos" <span>Hace 4 días</span>
            </li>
            <li>
              <User size={16} className="icon badge" /> Obtuviste el certificado
              "Nivel Básico" <span>Hace 1 semana</span>
            </li>
          </ul>
        </div>
        <div className="activity-card">
          <h4>Próximas Lecciones</h4>
          <div className="lesson">
            <div>
              <p className="lesson-title">Estructuras de control</p>
              <p className="lesson-sub">Python Básico</p>
            </div>
            <button className="btn green">Continuar</button>
          </div>
          <div className="lesson">
            <div>
              <p className="lesson-title">Programación orientada a objetos (POO)</p>
              <p className="lesson-sub">Python Intermedio</p>
            </div>
            <button className="btn">Comenzar</button>
          </div>
          <div className="lesson">
            <div>
              <p className="lesson-title">Generadores e Iteradores</p>
              <p className="lesson-sub">Python Intermedio</p>
            </div>
            <button className="btn">Comenzar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
