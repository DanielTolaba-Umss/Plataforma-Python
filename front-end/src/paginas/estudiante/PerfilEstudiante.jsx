import "/src/paginas/estudiante/estilos/PerfilEstudiante.css";
import ConfiguracionEstudiante from './ConfiguracionEstudiante.jsx';
import React, { useState, useEffect } from "react";
import { X } from 'lucide-react';
import studentProfileService from '../../api/studentProfileService';

import {
  Mail,
  Phone,
  Calendar,
  Award,
  Clock,
  BookOpen,
  CheckCircle,
} from "lucide-react";

const PerfilEstudiante = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [studentProfile, setStudentProfile] = useState(null);
  const [studentCourses, setStudentCourses] = useState([]);
  const [studentProgress, setStudentProgress] = useState(null);
  const [courseLessons, setCourseLessons] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [showLessons, setShowLessons] = useState(false);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const abrirModal = () => setMostrarModal(true);
  const cerrarModal = () => setMostrarModal(false);

  // Cargar datos del estudiante
  useEffect(() => {
    const loadStudentData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Cargar perfil, cursos y progreso en paralelo
        const [profile, courses, progress] = await Promise.all([
          studentProfileService.getProfile(),
          studentProfileService.getCourses(),
          studentProfileService.getProgress()
        ]);

        setStudentProfile(profile);
        setStudentCourses(Array.isArray(courses) ? courses : [courses]);
        setStudentProgress(progress);
      } catch (err) {
        console.error('Error cargando datos del estudiante:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, []);
  // Función para actualizar el perfil desde el modal
  const handleProfileUpdate = (updatedProfile) => {
    setStudentProfile(updatedProfile);
    cerrarModal();
  };

  // Función para cargar las lecciones de un curso
  const loadCourseLessons = async (courseId) => {
    try {
      setLoadingLessons(true);
      const lessons = await studentProfileService.getCourseLessons(courseId);
      setCourseLessons(lessons);
      setSelectedCourseId(courseId);
      setShowLessons(true);
    } catch (err) {
      console.error('Error cargando lecciones del curso:', err);
      setError('Error al cargar las lecciones del curso');
    } finally {
      setLoadingLessons(false);
    }
  };

  // Función para cerrar la vista de lecciones
  const closeLessonsView = () => {
    setShowLessons(false);
    setCourseLessons([]);
    setSelectedCourseId(null);
  };

  if (loading) {
    return (
      <div className="perfil-container">
        <div className="loading-container">
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="perfil-container">
        <div className="error-container">
          <p>Error al cargar el perfil: {error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      </div>
    );
  }
  return (
    <div className="perfil-container">
      <h2>Perfil de Estudiante</h2>
      <button className="editar-btn" onClick={abrirModal}>
        Editar Perfil
      </button>      {/* MODAL */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={cerrarModal}>
              <X size={20} />
            </button>
            <ConfiguracionEstudiante 
              studentProfile={studentProfile}
              onProfileUpdate={handleProfileUpdate}
            />
          </div>
        </div>
      )}

      <div className="perfil-grid">        <div className="perfil-left">
          <div className="perfil-card">
            <h3>{studentProfile?.nombres} {studentProfile?.apellidos}</h3>
            <p className="rol">Estudiante</p>
            <span className="badge">{studentProgress?.nivelActual || 'N/A'}</span>
            <hr />            <div className="info-item">
              <Mail size={16} /> {studentProfile?.email}
            </div>
            <div className="info-item">
              <Phone size={16} /> {studentProfile?.telefono || 'No especificado'}
            </div>
            <div className="info-item">
              <Calendar size={16} /> Se unió el {new Date(studentProfile?.fechaRegistro).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>        <div className="perfil-right">
          <div className="resumen-card">
            <h4>Resumen de Aprendizaje</h4>
            <div className="resumen-stats">
              <div className="stat-item">
                <div className="icon bg-light-green">
                  <BookOpen size={24} />
                </div>
                <p className="stat-num">{studentProgress?.nivelActual || 'N/A'}</p>
                <p className="stat-label">Nivel Actual</p>
              </div>
              <div className="stat-item">
                <div className="icon bg-blue">
                <CheckCircle size={24} />
                </div>
                <p className="stat-num">{studentProgress?.leccionesCompletadas || 0}</p>
                <p className="stat-label">Lecciones Completadas</p>
              </div>
              <div className="stat-item">
                <div className="icon bg-purple">
                  <Award size={24} />
                </div>
                <p className="stat-num">{studentProgress?.certificacionesObtenidas || 0}</p>
                <p className="stat-label">Certificaciones</p>
              </div>
            </div>
          </div>          <div className="mis-cursos-card">
            <h4>Mis Cursos</h4>
            {studentCourses.length > 0 ? (
              studentCourses.map((curso) => (
                <div key={curso.courseId} className="curso-item">
                  <div>
                    <p>
                      <strong>{curso.title}</strong>
                    </p>
                    <p>Nivel: {curso.level}</p>
                    <p>Progreso: {curso.progreso}%</p>
                    <div className="progress-bar">
                      <div className="progress" style={{ width: `${curso.progreso}%` }}></div>
                    </div>
                    <p className="fecha-inscripcion">
                      Inscrito: {new Date(curso.fechaInscripcion).toLocaleDateString('es-ES')}
                    </p>
                    <button 
                      className="btn-lecciones"
                      onClick={() => loadCourseLessons(curso.courseId)}
                      disabled={loadingLessons}
                    >
                      {loadingLessons && selectedCourseId === curso.courseId ? 'Cargando...' : 'Ver Lecciones'}
                    </button>
                  </div>
                  <div className="course-status">
                    {curso.completado ? (
                      <span className="status-completed">✓ Completado</span>
                    ) : (
                      <span className="status-in-progress">En progreso</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-courses">
                <p>No tienes cursos inscritos aún.</p>
              </div>
            )}
          </div><div className="certificaciones-card">
            <h4>Certificaciones</h4>
            {studentProgress?.cursosCompletados > 0 ? (
              studentCourses
                .filter(curso => curso.completado)
                .map((curso) => (
                  <div key={`cert-${curso.courseId}`} className="cert-item">
                    <div className="cert-info">
                      <Award size={20} className="cert-icon" />
                      <div>
                        <p>
                          <strong>{curso.title}</strong>
                        </p>
                        <p className="cert-date">
                          Completado: {new Date(curso.fechaInscripcion).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                    <button className="btn-secondary">Ver</button>
                  </div>
                ))
            ) : (
              <div className="no-certificates">
                <p>Aún no tienes certificaciones. ¡Completa un curso para obtener tu primera certificación!</p>
              </div>
            )}
          </div>        </div>
      </div>

      {/* Modal de Lecciones */}
      {showLessons && (
        <div className="modal-overlay">
          <div className="modal-content lessons-modal">
            <div className="modal-header">
              <h3>Lecciones del Curso</h3>
              <button className="modal-close" onClick={closeLessonsView}>
                <X size={20} />
              </button>
            </div>
            <div className="lessons-content">
              {loadingLessons ? (
                <div className="loading-container">
                  <p>Cargando lecciones...</p>
                </div>
              ) : courseLessons.length > 0 ? (
                <div className="lessons-list">
                  {courseLessons.map((lesson, index) => (
                    <div key={lesson.lessonId} className="lesson-item">
                      <div className="lesson-number">
                        {index + 1}
                      </div>
                      <div className="lesson-info">
                        <h4>{lesson.title}</h4>
                        <p className="lesson-description">{lesson.description}</p>
                        <div className="lesson-progress">
                          <span className={`lesson-status ${lesson.completed ? 'completed' : 'incomplete'}`}>
                            {lesson.completed ? (
                              <>
                                <CheckCircle size={16} />
                                Completada
                              </>
                            ) : (
                              <>
                                <Clock size={16} />
                                Pendiente
                              </>
                            )}
                          </span>
                          {lesson.practiceCompleted !== null && (
                            <span className={`practice-status ${lesson.practiceCompleted ? 'completed' : 'incomplete'}`}>
                              {lesson.practiceCompleted ? (
                                <>
                                  <Award size={16} />
                                  Práctica Completada
                                </>
                              ) : (
                                <>
                                  <BookOpen size={16} />
                                  Práctica Pendiente
                                </>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-lessons">
                  <p>No se encontraron lecciones para este curso.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerfilEstudiante;
