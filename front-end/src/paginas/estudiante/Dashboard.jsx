import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Award 
} from 'lucide-react';
import styles from './estilos/Dashboard.module.css';

export function Dashboard() {
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Resumen del Estudiante</h1>
        <Link
          to="/editar-perfil"
          className={styles.editButton}
        >
          Editar Perfil
        </Link>
      </div>

      {/* Progress and Stats */}
      <div className={styles.statsContainer}>
        <div className={styles.statsCard}>
          <h2 className={styles.statsTitle}>Resumen de Aprendizaje</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={`${styles.statIcon} ${styles.tealBg}`}>
                <BookOpen className={styles.icon} />
              </div>
              <h3 className={styles.statNumber}>5</h3>
              <p className={styles.statLabel}>Cursos Totales</p>
            </div>
            <div className={styles.statItem}>
              <div className={`${styles.statIcon} ${styles.blueBg}`}>
                <Clock className={styles.icon} />
              </div>
              <h3 className={styles.statNumber}>48</h3>
              <p className={styles.statLabel}>Horas de Estudio</p>
            </div>
            <div className={styles.statItem}>
              <div className={`${styles.statIcon} ${styles.purpleBg}`}>
                <Award className={styles.icon} />
              </div>
              <h3 className={styles.statNumber}>1</h3>
              <p className={styles.statLabel}>Certificaciones</p>
            </div>
          </div>
        </div>

        <div className={styles.coursesCard}>
          <h2 className={styles.coursesTitle}>Mis Cursos</h2>
          <div className={styles.coursesList}>
            <div className={styles.courseItem}>
              <div className={styles.courseInfo}>
                <h3 className={styles.courseName}>Introducción a Python</h3>
                <p className={styles.courseProgress}>Progreso: 75%</p>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: '75%' }}
                ></div>
              </div>
              <button className={styles.continueButton}>
                Continuar
              </button>
            </div>
            <div className={styles.courseItem}>
              <div className={styles.courseInfo}>
                <h3 className={styles.courseName}>Python Intermedio</h3>
                <p className={styles.courseProgress}>Progreso: 45%</p>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: '45%' }}
                ></div>
              </div>
              <button className={styles.continueButton}>
                Continuar
              </button>
            </div>
            <div className={styles.courseItem}>
              <div className={styles.courseInfo}>
                <h3 className={styles.courseName}>Django Framework</h3>
                <p className={styles.courseProgress}>Progreso: 20%</p>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: '20%' }}
                ></div>
              </div>
              <button className={styles.continueButton}>
                Continuar
              </button>
            </div>
          </div>
        </div>

        <div className={styles.certificationsCard}>
          <h2 className={styles.certificationsTitle}>Certificaciones</h2>
          <div className={styles.certificationItem}>
            <div className={`${styles.certIcon} ${styles.purpleBg}`}>
              <Award className={styles.icon} />
            </div>
            <div className={styles.certInfo}>
              <h3 className={styles.certName}>Python Básico</h3>
              <p className={styles.certDate}>Obtenido: 15 de Marzo, 2023</p>
            </div>
            <button className={styles.viewButton}>
              Ver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}