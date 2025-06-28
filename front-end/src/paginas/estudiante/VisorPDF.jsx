import React, { useState, useEffect, useRef } from "react";
import { pdfApi } from "../../api/pdfService";

const VisorPDF = ({ filename }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentBlobUrl = useRef(null);

  useEffect(() => {
    const loadPdf = async () => {
      if (!filename) {
        setError("No se especificó el archivo PDF");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Limpiar URL blob anterior si existe
        if (currentBlobUrl.current) {
          URL.revokeObjectURL(currentBlobUrl.current);
          currentBlobUrl.current = null;
        }
        
        console.log("🔄 Descargando PDF:", filename);
        const blobUrl = await pdfApi.downloadPdf(filename);
        currentBlobUrl.current = blobUrl;
        setPdfUrl(blobUrl);
        console.log("✅ PDF cargado exitosamente");
      } catch (error) {
        console.error("❌ Error al cargar el PDF:", error);
        setError("Error al cargar el PDF. Por favor, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    loadPdf();
  }, [filename]); // Solo depende del filename

  // Cleanup cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (currentBlobUrl.current) {
        URL.revokeObjectURL(currentBlobUrl.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="visor-pdf">
        <h4>Visor de PDF</h4>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>Cargando PDF...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="visor-pdf">
        <h4>Visor de PDF</h4>
        <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="visor-pdf">
      <h4>Visor de PDF</h4>
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          width="100%"
          height="600px"
          title="Visor de PDF"
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px"
          }}
        />
      )}
    </div>
  );
};

export default VisorPDF;
