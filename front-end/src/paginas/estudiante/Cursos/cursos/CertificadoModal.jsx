// src/componentes/Estudiantes/CertificadoModal.jsx
import React, { useRef } from "react";
import "./CertificadoModal.css";
import Logo from "../../../../assets/logo.png";

const CertificadoModal = ({ isOpen, onClose, nivel, nombreEstudiante }) => {
  const certificadoRef = useRef();

  const fechaActual = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handlePrint = () => {
    const printContent = certificadoRef.current;
    const winPrint = window.open(
      "",
      "",
      "left=0,top=0,width=800,height=600,toolbar=0,scrollbars=0,status=0"
    );

    winPrint.document.write(`
      <html>
        <head>
          <title>Certificado - Python EDU</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Arial', sans-serif;
              background: white;
            }
            .certificado-print {
              width: 800px;
              height: 600px;
              margin: 0 auto;
              background: white;
              position: relative;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              text-align: center;
              color: #0c0461fd;
              border: 2px solid #0c0461fd;
            }
            .certificado-border {
              position: absolute;
              top: 20px;
              left: 20px;
              right: 20px;
              bottom: 20px;
              border: 2px solid #FFD438;
            }
            .logo {
              width: 80px;
              height: 80px;
              background: #0c0461fd;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 20px;
            }
            .certificado-title {
              font-size: 48px;
              font-weight: bold;
              margin-bottom: 10px;
              color: #0c0461fd;
            }
            .certificado-subtitle {
              font-size: 18px;
              margin-bottom: 30px;
              color: #0c0461fd;
            }
            .student-name {
              font-size: 36px;
              font-weight: bold;
              margin: 20px 0;
              color: #0c0461fd;
              border-bottom: 2px solid #FFD438;
              padding-bottom: 10px;
            }
            .completion-text {
              font-size: 18px;
              margin: 20px 0;
              max-width: 600px;
              line-height: 1.6;
              color: #333;
            }
            .course-info {
              font-size: 22px;
              font-weight: bold;
              margin: 20px 0;
              color: #0c0461fd;
            }
            .date-signature {
              display: flex;
              justify-content: space-between;
              width: 100%;
              max-width: 500px;
              margin-top: 40px;
            }
            .date, .signature {
              text-align: center;
            }
            .date h4, .signature h4 {
              font-size: 14px;
              margin-bottom: 5px;
              color: #0c0461fd;
            }
            .date p, .signature p {
              font-size: 16px;
              font-weight: bold;
              border-top: 2px solid #FFD438;
              padding-top: 5px;
              margin-top: 10px;
              color: #0c0461fd;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    winPrint.document.close();
    winPrint.focus();
    setTimeout(() => {
      winPrint.print();
      winPrint.close();
    }, 500);
  };

  const handleDownloadPDF = async () => {
    try {
      const html2canvas = await import("html2canvas");
      const jsPDF = await import("jspdf");

      const canvas = await html2canvas.default(certificadoRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF.default("landscape", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(
        `Certificado_Python_${nivel}_${nombreEstudiante.replace(
          /\s+/g,
          "_"
        )}.pdf`
      );
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Error al generar el PDF. Por favor, intenta de nuevo.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="certificado-modal-overlay">
      <div className="certificado-modal">
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <div className="certificado-container" ref={certificadoRef}>
          <div className="certificado-border"></div>

          <div className="logo">
            <img
              src={Logo}
              alt="Python EDU Logo"
              style={{ width: "100%", height: "100%", borderRadius: "50%" }}
            />
          </div>

          <h1 className="certificado-title">CERTIFICADO</h1>
          <p className="certificado-subtitle">
            de Finalización del Curso Básico
          </p>

          <div className="student-name">{nombreEstudiante}</div>

          <p className="completion-text">
            Ha completado satisfactoriamente el curso de programación en Python
            y ha demostrado competencia en los fundamentos del lenguaje de
            programación.
          </p>

          <div className="course-info">
            Python {nivel} - Fundamentos de Programación
          </div>

          <div className="date-signature">
            <div className="date">
              <h4>FECHA DE EMISIÓN</h4>
              <p>{fechaActual}</p>
            </div>
            <div className="signature">
              <h4>CERTIFICADO POR</h4>
              <p>Python EDU</p>
            </div>
          </div>
        </div>

        <div className="certificado-actions">
          <button className="action-button print-button" onClick={handlePrint}>
            Imprimir
          </button>
          <button
            className="action-button download-button"
            onClick={handleDownloadPDF}
          >
            Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificadoModal;
