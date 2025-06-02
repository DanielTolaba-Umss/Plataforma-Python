import React from "react";

const VisorPDF = ({ src }) => {
  return (
    <div className="visor-pdf">
      <h4>Visor de PDF</h4>
      <iframe
        src={src}
        width="100%"
        height="600px"
        title="Visor de PDF"
      ></iframe>
    </div>
  );
};

export default VisorPDF;
