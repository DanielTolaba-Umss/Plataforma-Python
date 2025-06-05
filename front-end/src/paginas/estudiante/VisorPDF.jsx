import React from "react";

const VisorPDF = ({ src }) => {
  const handleError = () => {
    console.error("Error al cargar el PDF:", src);
  };

  return (
    <div className="visor-pdf">
      <h4>Visor de PDF</h4>
      <iframe
        src={src}
        width="100%"
        height="600px"
        title="Visor de PDF"
        onError={handleError}
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px"
        }}
      ></iframe>
    </div>
  );
};

export default VisorPDF;
