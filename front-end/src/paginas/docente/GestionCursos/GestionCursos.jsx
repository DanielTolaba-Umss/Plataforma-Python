import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCapIcon,
  FileTextIcon,
  VideoIcon,
  FileIcon,
  CheckSquareIcon,
  Layers3Icon,
} from "lucide-react";

const GestionCursos = () => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [errors, setErrors] = useState({ title: "", url: "" });
  const navigate = useNavigate();

  const handleModuleClick = (module) => {
    setSelectedModule(module);
    setShowOptions(true);
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

  const handleOptionClick = (actionType) => {
    switch (actionType) {
      case "practicas":
        alert("Crear Prácticas");
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
                        Gestión del modulo {modulo.toLowerCase()}.
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
                  Cancelar
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (validateInputs()) {
                      console.log("Video guardado:", { videoTitle, videoUrl });
                      alert(
                        `Video guardado:\nTítulo: ${videoTitle}\nURL: ${videoUrl}`
                      );
                      setShowVideoModal(false);
                      setVideoTitle("");
                      setVideoUrl("");
                      setErrors({ title: "", url: "" });
                    }
                  }}
                >
                  Guardar
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
