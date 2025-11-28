import React from "react";
import { styles } from "./ReferentesPage";
import type { CSSProperties } from "react";

interface Club {
  id: number;
  nombre: string;
}

interface Referente {
  id: number;
  nombre: string;
  apellido: string;
  categoria: "Masculino" | "Femenino";
  dni: string;
  correo: string;
  telefono: string; // <--- AÑADIDO
  clubId: number;
  club: Club;
}

interface Props {
  referente: Referente;
  onVolver: () => void;
}

const vistaStyles: { [key: string]: CSSProperties } = {
  fila: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  ultimaFila: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "none",
  },
  etiqueta: {
    fontWeight: "600",
    color: "#374151",
  },
  valor: {
    color: "#6b7280",
  },
};

const VistaReferente: React.FC<Props> = ({ referente, onVolver }) => {
  const cardEstiloDetalle: CSSProperties = {
    ...styles.cardFormulario,
    maxWidth: "30rem",
    padding: "30px",
    marginBottom: "0",
  };

  const fields = [
    { label: "Categoría", value: referente.categoria },
    { label: "DNI", value: referente.dni },
    { label: "Correo", value: referente.correo },
    { label: "Teléfono", value: referente.telefono }, // <--- AÑADIDO: Muestra el teléfono
    { label: "Equipo", value: referente.club ? referente.club.nombre : "N/A" },
  ];

  return (
    <div style={cardEstiloDetalle}>
      <h3
        style={{
          ...styles.formTitulo,
          marginBottom: "20px",
          fontSize: "28px",
        }}
      >
        {referente.nombre} {referente.apellido}
      </h3>
      <div style={{ marginBottom: "20px" }}>
        {fields.map((field, index) => (
          <div
            key={field.label}
            style={
              index === fields.length - 1
                ? vistaStyles.ultimaFila
                : vistaStyles.fila
            }
          >
            <span style={vistaStyles.etiqueta}>{field.label}:</span>
            <span style={vistaStyles.valor}>{field.value}</span>
          </div>
        ))}
      </div>
      <button
        onClick={onVolver}
        style={{
          ...styles.botonSecundario,
          width: "100%",
          padding: "12px 24px",
          backgroundColor: "#6b7280",
        }}
      >
        Volver a la Lista
      </button>
    </div>
  );
};

export default VistaReferente;