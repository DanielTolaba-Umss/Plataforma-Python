import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCapIcon,
  FileTextIcon,
  VideoIcon,
  FileIcon,
  CheckSquareIcon,
  Layers3Icon,
} from "lucide-react";
import { useCursos } from "../../../hooks/useCursos";
import { useLoadingError } from "../../../hooks/useLoadingError";
import { cursosAPI } from "../../../api";

const GestionCursos = () => {
  const { cursos, obtenerCursos, obtenerCursosPorModulo } = useCursos();
  const { loading, error, withLoading, handleError } = useLoadingError();
  const [selectedModule, setSelectedModule] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showPracticaModal, setShowPracticaModal] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [practicaTitle, setPracticaTitle] = useState("");
  const [practicaDesc, setPracticaDesc] = useState("");
  const [practicaCode, setPracticaCode] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [errors, setErrors] = useState({ title: "", url: "" });
  const [practicaErrors, setPracticaErrors] = useState({ title: "", desc: "" });
  const navigate = useNavigate();

  useEffect(() => {
    withLoading(obtenerCursos);
  }, []);

  const handleModuleClick = async (module) => {
    setSelectedModule(module);
    setShowOptions(true);
    try {
      await withLoading(() => obtenerCursosPorModulo(module.toLowerCase()));
    } catch (err) {
      handleError(err);
    }
  };

  const handleBackClick = () => setShowOptions(false);

  const validateInputs = () => {
    let valid = true;
    const newErrors = { title: "", url: "" };

    if (!videoTitle.trim()) {
      newErrors.title = "El título es obligatorio.";
      valid = false;
    }

    const urlPattern =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com|drive\.google\.com|.*\.(mp4|webm|ogg))\/?.+/i;
    if (!videoUrl.trim()) {
      newErrors.url = "La URL es obligatoria.";
      valid = false;
    } else if (!urlPattern.test(videoUrl)) {
      newErrors.url = "La URL no parece válida. Ej: YouTube, Vimeo o .mp4";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const validatePractica = () => {
    let valid = true;
    const newErrors = { title: "", desc: "" };

    if (!practicaTitle.trim()) {
      newErrors.title = "El nombre es obligatorio.";
      valid = false;
    }

    if (!practicaDesc.trim()) {
      newErrors.desc = "La descripción es obligatoria.";
      valid = false;
    }

    setPracticaErrors(newErrors);
    return valid;
  };

  const handleOptionClick = (actionType) => {
    switch (actionType) {
      case "practicas":
        setShowPracticaModal(true);
        break;
      case "examenes":
        navigate("/crear-examen");
        break;
      case "videos":
        setShowVideoModal(true);
        break;
      case "pdfs":
        navigate("/crear-pdf");
        break;
      default:
        console.log("Acción no definida");
    }
  };

  const handleCrearVideo = async () => {
    if (!validateInputs()) return;

    try {
      await withLoading(async () => {
        let module = 1;

        if (selectedModule == "Intermedio") {
          module = 2;
        }
        if (selectedModule == "Avanzado") {
          module = 3;
        }

        const resource = {
          title: videoTitle,
          url: videoUrl,
          typeId: 3,
          contentId: module,
        };
        await cursosAPI.crearVideo(resource);
        setVideoTitle("");
        setVideoUrl("");
        setShowVideoModal(false);
      });
    } catch (err) {
      handleError(err);
    }
  };

  const handleCrearPractica = async () => {
    if (!validatePractica()) return;

    try {
      await withLoading(async () => {
        await cursosAPI.crearPractica({
          titulo: practicaTitle,
          descripcion: practicaDesc,
          codigoEsperado: practicaCode,
          modulo: selectedModule.toLowerCase(),
        });
        setPracticaTitle("");
        setPracticaDesc("");
        setPracticaCode("");
        setShowPracticaModal(false);
      });
    } catch (err) {
      handleError(err);
    }
  };

  const options = [
    {
      title: "Crear Prácticas",
      icon: <CheckSquareIcon className="h-6 w-6 text-success" />,
      description: "Ejercicios prácticos para reforzar el aprendizaje.",
      actionType: "practicas",
    },
    {
      title: "Crear Exámenes",
      icon: <FileTextIcon className="h-6 w-6 text-danger" />,
      description: "Evaluaciones para medir el progreso.",
      actionType: "examenes",
    },
    {
      title: "Subir Videos",
      icon: <VideoIcon className="h-6 w-6 text-info" />,
      description: "Contenido multimedia educativo.",
      actionType: "videos",
    },
    {
      title: "Subir PDFs",
      icon: <FileIcon className="h-6 w-6 text-warning" />,
      description: "Material complementario en formato PDF.",
      actionType: "pdfs",
    },
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        <h4 className="alert-heading">Error</h4>
        <p>{error}</p>
        <hr />
        <button
          className="btn btn-outline-danger"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light w-100">
      {/* Header */}
      <header>
        <div className="container py-3 d-flex justify-content-between align-items-center">
          <h1
            className="fw-bold text-dark mb-4"
            style={{ fontSize: "1.875rem" }}
          >
            Gestión de Modulos
          </h1>
          <div className="admin-profile d-flex align-items-center gap-2">
            <span className="fw-semibold">Docente</span>
            <div
              className="admin-avatar bg-success text-white rounded-circle d-flex justify-content-center align-items-center"
              style={{ width: "40px", height: "40px" }}
            >
              GC
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container py-4">
        {!showOptions ? (
          <>
            <h2 className="fs-5 fw-semibold mb-4">
              Selecciona un módulo para gestionar
            </h2>
            <div className="row g-4">
              {["Básico", "Intermedio", "Avanzado"].map((modulo, idx) => (
                <div className="col-md-4" key={idx}>
                  <div
                    className="card text-center shadow-sm h-100"
                    onClick={() => handleModuleClick(modulo)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card-body d-flex flex-column align-items-center">
                      <Layers3Icon className="h-8 w-8 text-primary mb-3" />
                      <h5 className="card-title">{modulo}</h5>
                      <p className="card-text">
                        Gestión del módulo {modulo.toLowerCase()}.
                      </p>
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
                      style={{ cursor: "pointer" }}
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

      {/* Modal para Subir Video */}
      {showVideoModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Subir Video</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowVideoModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Título del Video</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.title ? "is-invalid" : ""
                    }`}
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="Ej: Introducción a React"
                  />
                  {errors.title && (
                    <div className="invalid-feedback">{errors.title}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">URL del Video</label>
                  <input
                    type="url"
                    className={`form-control ${errors.url ? "is-invalid" : ""}`}
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://..."
                  />
                  {errors.url && (
                    <div className="invalid-feedback">{errors.url}</div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowVideoModal(false)}
                >
                  Cerrar
                </button>
                <button className="btn btn-primary" onClick={handleCrearVideo}>
                  Subir Video
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Crear Práctica */}
      {showPracticaModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Crear Práctica</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPracticaModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Nombre de la Práctica */}
                <div className="mb-3">
                  <label className="form-label">Nombre de la práctica</label>
                  <input
                    type="text"
                    className={`form-control ${
                      practicaErrors.title ? "is-invalid" : ""
                    }`}
                    value={practicaTitle}
                    onChange={(e) => setPracticaTitle(e.target.value)}
                    placeholder="Ej: Práctica en Python n.1"
                  />

                  {practicaErrors.title && (
                    <div className="invalid-feedback">
                      {practicaErrors.title}
                    </div>
                  )}
                </div>

                {/* Instrucciones */}
                <div className="mb-3">
                  <label className="form-label">Instrucciones</label>
                  <textarea
                    className={`form-control ${
                      practicaErrors.desc ? "is-invalid" : ""
                    }`}
                    value={practicaDesc}
                    onChange={(e) => setPracticaDesc(e.target.value)}
                    rows="4"
                    placeholder="Ej: Crea una variable llamada 'mensaje' y asígnale el texto 'Hola, Python!'"
                  />

                  {practicaErrors.desc && (
                    <div className="invalid-feedback">
                      {practicaErrors.desc}
                    </div>
                  )}
                </div>

                {/* Código de la práctica */}
                <div className="mb-3">
                  <label className="form-label">Respuesta esperada</label>
                  <textarea
                    className="form-control"
                    value={practicaCode}
                    onChange={(e) => setPracticaCode(e.target.value)}
                    rows="6"
                    placeholder="mensaje = 'Hola Python'"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowPracticaModal(false)}
                >
                  Cerrar
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleCrearPractica}
                >
                  Crear Práctica
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionCursos;
