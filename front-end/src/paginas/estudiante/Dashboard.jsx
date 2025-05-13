import React, { useEffect, useState } from "react";
import "/src/paginas/estudiante/estilos/Dashboard.css";
import {
  BookOpen,
  CheckCircle,
  Award,
  LineChart,
  User,
} from "lucide-react";

const Dashboard = () => {
  // Estados simulados desde backend
  const [actividadReciente, setActividadReciente] = useState([]);
  const [proximasLecciones, setProximasLecciones] = useState([]);

  useEffect(() => {
    // Simulación de respuesta desde backend
    const datosSimulados = {
      actividadReciente: [
        { tipo: "completado", descripcion: "Variables", fecha: "Hace 2 días" },
        { tipo: "progreso", descripcion: "Tipos de datos", fecha: "Hace 4 días" },
        { tipo: "certificado", descripcion: "Nivel Básico", fecha: "Hace 1 semana" },
      ],
      proximasLecciones: [
        { titulo: "Estructuras de control", subtitulo: "Python Básico", estado: "Continuar" },
        { titulo: "Programación orientada a objetos (POO)", subtitulo: "Python Intermedio", estado: "Comenzar" },
        { titulo: "Generadores e Iteradores", subtitulo: "Python Intermedio", estado: "Comenzar" },
      ]
    };

    setTimeout(() => {
      setActividadReciente(datosSimulados.actividadReciente);
      setProximasLecciones(datosSimulados.proximasLecciones);
    }, 500); // simula retraso de red
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Mi Progreso</h2>
      <p className="welcome-text">¡Bienvenido de vuelta, Ana! Continúa aprendiendo.</p>

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
            {actividadReciente.map((item, index) => (
              <li key={index}>
                {item.tipo === "completado" && <CheckCircle size={16} className="icon done" />}
                {item.tipo === "progreso" && <LineChart size={16} className="icon progress" />}
                {item.tipo === "certificado" && <User size={16} className="icon badge" />}
                {item.tipo === "completado" && <> Completaste la lección "{item.descripcion}" </>}
                {item.tipo === "progreso" && <> Progreso en "{item.descripcion}" </>}
                {item.tipo === "certificado" && <> Obtuviste el certificado "{item.descripcion}" </>}
                <span>{item.fecha}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="activity-card">
          <h4>Próximas Lecciones</h4>
          {proximasLecciones.map((leccion, index) => (
            <div className="lesson" key={index}>
              <div>
                <p className="lesson-title">{leccion.titulo}</p>
                <p className="lesson-sub">{leccion.subtitulo}</p>
              </div>
              <button className={`btn ${leccion.estado === "Continuar" ? "green" : ""}`}>
                {leccion.estado}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
