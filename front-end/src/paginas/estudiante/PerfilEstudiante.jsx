import React from "react";
import "/src/paginas/estudiante/estilos/PerfilEstudiante.css";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Clock,
  BookOpen,
} from "lucide-react";

const PerfilEstudiante = () => {
  return (
    <div className="perfil-container">
      <h2>Perfil de Estudiante</h2>
      <button className="editar-btn">Editar Perfil</button>

      <div className="perfil-grid">
        <div className="perfil-left">
          <div className="perfil-card">
            <div className="avatar"></div>
            <h3>Ana García</h3>
            <p className="rol">Estudiante</p>
            <span className="badge">Python Básico</span>
            <hr />
            <div className="info-item">
              <Mail size={16} /> ana.garcia@ejemplo.com
            </div>
            <div className="info-item">
              <Phone size={16} /> +591 72295337
            </div>
            <div className="info-item">
              <MapPin size={16} /> Cbba, Bolivia
            </div>
            <div className="info-item">
              <Calendar size={16} /> Se unió en Enero 2023
            </div>
          </div>
        </div>

        <div className="perfil-right">
          <div className="resumen-card">
            <h4>Resumen de Aprendizaje</h4>
            <div className="resumen-stats">
              <div className="stat-item">
                <div className="icon bg-light-green">
                  <BookOpen size={24} />
                </div>
                <p className="stat-num">5</p>
                <p className="stat-label">Cursos Totales</p>
              </div>
              <div className="stat-item">
                <div className="icon bg-blue">
                  <Clock size={24} />
                </div>
                <p className="stat-num">48</p>
                <p className="stat-label">Horas de Estudio</p>
              </div>
              <div className="stat-item">
                <div className="icon bg-purple">
                  <Award size={24} />
                </div>
                <p className="stat-num">1</p>
                <p className="stat-label">Certificaciones</p>
              </div>
            </div>
          </div>

          <div className="mis-cursos-card">
            <h4>Mis Cursos</h4>
            <div className="curso-item">
              <div>
                <p>
                  <strong>Introducción a Python</strong>
                </p>
                <p>Progreso: 75%</p>
                <div className="progress-bar">
                  <div className="progress" style={{ width: "75%" }}></div>
                </div>
              </div>
              <button className="btn">Continuar</button>
            </div>
            <div className="curso-item">
              <div>
                <p>
                  <strong>Python Intermedio</strong>
                </p>
                <p>Progreso: 45%</p>
                <div className="progress-bar">
                  <div className="progress" style={{ width: "45%" }}></div>
                </div>
              </div>
              <button className="btn">Continuar</button>
            </div>
            <div className="curso-item">
              <div>
                <p>
                  <strong>Django Framework</strong>
                </p>
                <p>Progreso: 20%</p>
                <div className="progress-bar">
                  <div className="progress" style={{ width: "20%" }}></div>
                </div>
              </div>
              <button className="btn">Continuar</button>
            </div>
          </div>

          <div className="certificaciones-card">
            <h4>Certificaciones</h4>
            <div className="cert-item">
              <div className="cert-info">
                <Award size={20} className="cert-icon" />
                <div>
                  <p>
                    <strong>Python Básico</strong>
                  </p>
                  <p className="cert-date">Obtenido: 15 de Marzo, 2023</p>
                </div>
              </div>
              <button className="btn-secondary">Ver</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilEstudiante;
