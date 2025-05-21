// src/paginas/estudiante/CrearPdf.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "/src/paginas/docente/estilos/CrearPdf.css";

const CrearPdf = () => {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!archivo) {
      alert("Debes seleccionar un archivo PDF.");
      return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    formData.append("archivo", archivo);

    // Aquí iría el envío al backend
    console.log("Formulario enviado:");
    console.log({ titulo, descripcion, archivo });

    alert("PDF cargado correctamente");
    setTitulo("");
    setDescripcion("");
    setArchivo(null);
  };

  return (
    <div className="crear-pdf-container">
      <button
        className="btn-volver"
        onClick={() => navigate("/Gestion de cursos")}
      >
        ← Volver
      </button>
      <h2>Subir PDF</h2>
      <form className="crear-pdf-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Título</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows="3"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label>Archivo PDF</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setArchivo(e.target.files[0])}
            required
          />
        </div>

        <button type="submit" className="btn-submit">
          Subir
        </button>
      </form>
    </div>
  );
};

export default CrearPdf;
