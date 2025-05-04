import React, { useState } from 'react';
import {
  GraduationCapIcon,
  FileTextIcon,
  VideoIcon,
  FileIcon,
  CheckSquareIcon,
  Layers3Icon
} from 'lucide-react';

const GestionCursos = () => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  const handleModuleClick = (module) => {
    setSelectedModule(module);
    setShowOptions(true);
  };

  const handleBackClick = () => setShowOptions(false);

  const handleOptionClick = (actionType) => {
    switch (actionType) {
      case 'actividades':
        alert("Crear Actividades");
        break;
      case 'practicas':
        alert("Crear Prácticas");
        break;
      case 'examenes':
        alert("Crear Exámenes");
        break;
      case 'videos':
        alert("Subir Videos");
        break;
      case 'pdfs':
        alert("Subir PDFs");
        break;
      case 'textos':
        alert("Subir Archivos de Texto");
        break;
      default:
        console.log("Acción no definida");
    }
  };

  const options = [
    {
      title: 'Crear Actividades',
      icon: <CheckSquareIcon className="h-6 w-6 text-primary" />,
      description: 'Crea nuevas actividades para los estudiantes.',
      actionType: 'actividades'
    },
    {
      title: 'Crear Prácticas',
      icon: <CheckSquareIcon className="h-6 w-6 text-success" />,
      description: 'Ejercicios prácticos para reforzar el aprendizaje.',
      actionType: 'practicas'
    },
    {
      title: 'Crear Exámenes',
      icon: <FileTextIcon className="h-6 w-6 text-danger" />,
      description: 'Evaluaciones para medir el progreso.',
      actionType: 'examenes'
    },
    {
      title: 'Subir Videos',
      icon: <VideoIcon className="h-6 w-6 text-info" />,
      description: 'Contenido multimedia educativo.',
      actionType: 'videos'
    },
    {
      title: 'Subir PDFs',
      icon: <FileIcon className="h-6 w-6 text-warning" />,
      description: 'Material complementario en formato PDF.',
      actionType: 'pdfs'
    },
    {
      title: 'Subir Archivos de Texto',
      icon: <FileTextIcon className="h-6 w-6 text-secondary" />,
      description: 'Instrucciones o guías adicionales.',
      actionType: 'textos'
    }
  ];

  return (
    <div className="min-vh-100 bg-light w-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-bottom">
        <div className="container py-3 d-flex justify-content-between align-items-center">
          <h1 className="text-success fw-bold fs-4">Gestión de Cursos</h1>
          <GraduationCapIcon className="h-6 w-6 text-success" />
        </div>
      </header>

      {/* Main */}
      <main className="container py-4">
        {!showOptions ? (
          <>
            <h2 className="fs-5 fw-semibold mb-4">Selecciona un módulo para gestionar</h2>
            <div className="row g-4">
              {['Básico', 'Intermedio', 'Avanzado'].map((modulo, idx) => (
                <div className="col-md-4" key={idx}>
                  <div
                    className="card text-center shadow-sm h-100"
                    onClick={() => handleModuleClick(modulo)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="card-body d-flex flex-column align-items-center">
                      <Layers3Icon className="h-8 w-8 text-primary mb-3" />
                      <h5 className="card-title">{modulo}</h5>
                      <p className="card-text">Gestión del módulo {modulo.toLowerCase()}.</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded shadow p-4 mt-4">
            <div className="position-relative mb-4">
              <button
                className="btn btn-outline-secondary position-absolute start-0 top-50 translate-middle-y"
                onClick={handleBackClick}
              >
                &lt;
              </button>
              <h2 className="text-center text-dark fw-bold">
                Gestionar Módulo "{selectedModule}"
              </h2>
            </div>

            {/* Opciones */}
            <div className="container mt-4">
              <div className="row">
                {options.map((item, index) => (
                  <div className="col-md-4 mb-4 d-flex" key={index}>
                    <div
                      className="card shadow-sm w-100 h-100 text-center"
                      onClick={() => handleOptionClick(item.actionType)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="card-body d-flex flex-column align-items-center justify-content-center">
                        {item.icon}
                        <h5 className="card-title mt-3">{item.title}</h5>
                        <p className="card-text">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default GestionCursos;
