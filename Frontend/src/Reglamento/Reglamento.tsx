import React from "react";

export default function Reglamento() {
  return (
    <div className="reglamento-timeline-container">
      <style>{`
        .reglamento-timeline-container {
          background: #f7f9fc;
          padding: 3rem;
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #1f3c88;
          font-family: 'Segoe UI', Arial, sans-serif;
          width: 100%;
        }

        .reglamento-header {
          text-align: center;
          margin-bottom: 3rem;
          /* Aseguramos que el contenedor no tenga estilos que afecten el nuevo h2 */
          width: 100%;
        }

        /* Eliminamos el estilo anterior para .reglamento-header h2 */
        /* .reglamento-header h2 {
          margin: 0;
          color: #1f3c88;
        } */

        .reglamento-main-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          flex-grow: 1;
        }

        .reglamento-pdf-container {
          width: 100%;
          max-width: 900px;
          min-height: 600px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.07);
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 1.5rem;
          padding: 1rem;
        }

        .reglamento-pdf-iframe {
          width: 95%;
          height: 90vh;
          border: none;
          border-radius: 8px;
          overflow-x: auto;
        }

        .reglamento-footer {
          text-align: center;
          margin-top: auto;
          color: #888;
          font-size: 0.95rem;
        }

        /* Modificación del estilo global <a> para solo dejar el hover y las propiedades necesarias */
        a {
          font-weight: 800;
          text-decoration: none;
          margin-top: 8px;
          display: inline-block;
          transition: background 0.2s;
        }

        a:hover {
          background: #2746a6 !important; /* !important para asegurar que el hover funcione sobre los estilos inline */
        }

        @media (max-width: 800px) {
          .reglamento-timeline-container {
            padding: 1rem;
          }
          .reglamento-pdf-container {
            min-height: 800px;
            width: 100%;
          }
        }
      `}</style>

      {/* Header Actualizado con el nuevo estilo de título */}
      <div className="reglamento-header">
        <h2
          style={{
            color: "#1f3c88", 
            marginBottom: "10px", // Reducido el margen para que el subtítulo quede cerca
            textAlign: "center",
            fontSize: "2.5em",
            fontWeight: 600,
            borderBottom: "3px solid #1f3c88", 
            paddingBottom: "5px",
            margin: "0 auto 10px auto", // Ajustado margen inferior
            display: "block",
            width: "fit-content",
          }}
        >
          Reglamento Disciplinario
        </h2>
        {/* Subtítulo reincorporado bajo el h2 estilizado */}
        <p style={{ color: "#2746a6", marginTop: 0, fontSize: "1.1rem", marginBottom: "3rem" }}>
          Liga Recreativa de Handball Punilla
        </p>
      </div>

      {/* PDF y botón de descarga */}
      <div className="reglamento-main-content">
        <div className="reglamento-pdf-container">
          <iframe
            src="/REGLAMENTO.pdf"
            className="reglamento-pdf-iframe"
            title="Reglamento PDF"
          />
        </div>
        
        {/* 📥 Botón de descarga con estilos inline aplicados 📥 */}
        <a 
          href="/REGLAMENTO.pdf" 
          download
          style={{
            padding: "0.5rem 1rem",
            borderRadius: 5, 
            background: "#1f3c88", 
            color: "white", 
            border: "none", 
            cursor: "pointer", 
            marginRight: "0.5rem", 
          }}
        >
          Descargar PDF
        </a>
      </div>

      {/* Footer */}
      <div className="reglamento-footer">
        Liga Recreativa de Handball Punilla - Agosto 2025
      </div>
    </div>
  );
}
